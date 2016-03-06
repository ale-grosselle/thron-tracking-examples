/**
 * @description
 * docReady is a single plain javascript function that provides a method of
 *  scheduling one or more javascript functions to run at some later
 *  point when the DOM has finished loading.
 */
(function(funcName, baseObj) {
	"use strict";
	// The public function name defaults to window.docReady
	// but you can modify the last line of this function to pass in a different object or method name
	// if you want to put them in a different namespace and those will be used instead of
	// window.docReady(...)
	funcName = funcName || "docReady";
	baseObj = baseObj || window;
	var readyList = [];
	var readyFired = false;
	var readyEventHandlersInstalled = false;

	// call this when the document is ready
	// this function protects itself against being called more than once
	function ready() {
		if (!readyFired) {
			// this must be set to true before we start calling callbacks
			readyFired = true;
			for (var i = 0; i < readyList.length; i++) {
				// if a callback here happens to add new ready handlers,
				// the docReady() function will see that it already fired
				// and will schedule the callback to run right after
				// this event loop finishes so all handlers will still execute
				// in order and no new ones will be added to the readyList
				// while we are processing the list
				readyList[i].fn.call(window, readyList[i].ctx);
			}
			// allow any closures held by these functions to free
			readyList = [];
		}
	}

	function readyStateChange() {
		if ( document.readyState === "complete" ) {
			ready();
		}
	}

	// This is the one public interface
	// docReady(fn, context);
	// the context argument is optional - if present, it will be passed
	// as an argument to the callback
	baseObj[funcName] = function(callback, context) {
		// if ready has already fired, then just schedule the callback
		// to fire asynchronously, but right away
		if (readyFired) {
			setTimeout(function() {callback(context);}, 1);
			return;
		} else {
			// add the function and context to the list
			readyList.push({fn: callback, ctx: context});
		}
		// if document already ready to go, schedule the ready function to run
		// IE only safe when readyState is "complete", others safe when readyState is "interactive"
		if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
			setTimeout(ready, 1);
		} else if (!readyEventHandlersInstalled) {
			// otherwise if we don't have event handlers installed, install them
			if (document.addEventListener) {
				// first choice is DOMContentLoaded event
				document.addEventListener("DOMContentLoaded", ready, false);
				// backup is window load event
				window.addEventListener("load", ready, false);
			} else {
				// must be IE
				document.attachEvent("onreadystatechange", readyStateChange);
				window.attachEvent("onload", ready);
			}
			readyEventHandlersInstalled = true;
		}
	}
})("docReady", window);
// modify this previous line to pass in your own method name
// and object for the method to be attached to


/**
 * @description
 * Checks if a DOM element is truly visible.
 * Package URL: https://github.com/UseAllFive/true-visibility
 */
window.elementInViewport = function(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
	);
};

/**
 * @description
 * Save all registered item.
 * When item is visible, item will be removed
 */
var listElements = (
	function () {
		var listItm = function () {};

		listItm.elementsToCheck = [];
		listItm.addToList = function (element) {
			if (!element) {
				return;
			}
			listItm.elementsToCheck.push(element);
		};

		listItm.removeToList = function (element) {
			var index = listItm.elementsToCheck.indexOf(element);
			if (!element) {
				return;
			}
			if (index > -1) {
				listItm.elementsToCheck.splice(index, 1);
			}
		};

		return listItm;
	}
)();



/**
 * @description
 * Scroll and resize Handler
 */
var scrollHandler = (function () {
	var scrollTimer = -1,
		TIMEOUT = 200,
		resizeTimer = null;

	var onStop = function () {
		for (var i = 0; i < listElements.elementsToCheck.length; i++) {
			listElements.elementsToCheck[i].startCheck();
		}
	};

	var onScrollBody = function () {
		if (scrollTimer != -1) {
			window.clearTimeout(scrollTimer);
		}
		scrollTimer = window.setTimeout(onStop, TIMEOUT);
	};


	window.addEventListener('resize', function () {
		if (resizeTimer != -1) {
			window.clearTimeout(resizeTimer);
		}

		resizeTimer = window.setTimeout(onStop, TIMEOUT);
	});

	window.docReady(
		function () {
			document.getElementsByTagName("body")[0].onscroll = onScrollBody;
		}
	);
})();


/**
 *
 * @param {HTMLElement} domElement Element to control
 * @param {String} THRON contentId
 * @param {Number} timeout how many seconds Element must be visible
 * @param {Function} callback call when element will visible
 * @constructor
 */
window.VisibleController = function (domElement, contentId, timeout, callback) {
	this.domElement = domElement;
	this.timeout = timeout * 1000;
	this.callback = callback;
	this.timeoutId = -1;
	this.contentId = contentId;
	//Is Image?
	if(this.domElement instanceof HTMLImageElement){
		this.domElement.onload = this.onImageLoaded.bind(this);
	}else{
		this.registerElement();
	}
};

window.VisibleController.prototype.registerElement = function(){
	listElements.addToList(this);
	this.startCheck();
};

window.VisibleController.prototype.onImageLoaded = function(){
	//Is Already visible, ok start timeout?
	this.registerElement();
};

window.VisibleController.prototype.startCheck = function(){
	var self = this;
	var isAlreadyVisible = function(){
		if(window.elementInViewport(self.domElement)){
			self.callback(self.domElement, self.contentId);
			listElements.removeToList(self);
		}
	};
	var isVisible = window.elementInViewport(this.domElement);
	if(!isVisible && this.timeoutId !== -1){
		window.clearTimeout(this.timeoutId);
		this.timeoutId = -1;
	}else if(isVisible && this.timeoutId == -1){
		this.timeoutId = window.setTimeout(isAlreadyVisible, this.timeout);
	}
};