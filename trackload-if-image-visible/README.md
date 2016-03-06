Send a track load event if the image remains visible on the screen
==============
In these examples, if the image remains more than a specific seconds visible into display,
the tracking load event will be sent.

To create these examples, we have implemented a small javascript, **js/visibleController.js** which can be embedded inside your pages.

The purpose of this library is very simple, given as input:

- image
- xcontentId
- seconds
- callback

Library will  call the <callback> function only if the <image> will be loaded and will be visible on the screen for more than <seconds> seconds.



**Example**

```javascript
<script>
	var onVisible = function (domElement, xcontentId) {
		domElement.style.opacity = 1;
		var params = {
			clientId: "hub",
			xcontentId: xcontentId,
			contentType: "IMAGE"
		};
		var tracker = _ta.initContentTracker(params);
		tracker.loadEvent();
	};
	//Get HTMLImageElement
	var img = document.getElementsByTagName("img")[0];
	//Call onVisible callback only if img remains visible for at least three seconds 
	new VisibleController(img, "c7d17045-b7ef-43a1-904d-a6819c178ffa", 3, onVisible);
</script>
```

To see in action **js/visibleController.js** with [THRON tracking library](https://support.thron.com/hc/en-us/articles/203817252-How-to-integrate-tracking-library) 
try our examples:

- *wall.html* Show a list of images. 
For each image will be sent the tracking only if it remains visible for at least three seconds.
- *single-image.html* Show a single image and track if remains visible for at least three seconds
- *text-image* As the example above, but was added in the text before the image

###DEMO

- [View Wall demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/wall.html) 
- [View Single Image demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/single-image.html)
- [View Text and Image demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/text-image.html) 