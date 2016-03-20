Track image visit only when it has been visible on the screen for some time
==============
Images , from an intelligence tracking perspective, are an interesting content type: there is no explicit action that identifies when an user “watches” an image and there is usually no real difference between an image (source) and a thumbnail (usually a resize/crop of the same image). 


When you are embeedding Image content with no explicit view-action: you can assume that user “watches” image when the image has been visible on screen for more than 3 seconds. 


In the following examples, if the image remains visible on display for a defined amount of seconds, the "load" event is fired to track content view.


To create these examples, we developed  **js/visibleController.js** library which can be embedded in your web pages. 
The library creates a global function called **VisibleController**. It receives as input params:

- image, an HTMLImageElement
- xcontentId, a Thron content Identifier
- seconds, time threshold to use for tracking
- callback, a function to be called after threshold has been reached

VisibleController will call the *callback* function only if the *image* will be loaded and will be visible on the screen for more than *seconds* seconds. 
You can simply connect your tracking code as callback function to trigger execution only after few seconds of image being visible on screen.


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

- **wall.html** Show a list of images. 
For each image will be sent the tracking only if it remains visible for at least three seconds.
- **single-image.html** Show a single image and track if remains visible for at least three seconds
- **text-image** As the example above, but was added in the text before the image

###DEMO

- [View Wall demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/wall.html) 
- [View Single Image demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/single-image.html)
- [View Text and Image demo](http://webtest.services.thron.com/demo/tracking-example/trackload-if-image-visible/text-image.html) 