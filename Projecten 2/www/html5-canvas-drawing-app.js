var canvas;
var context;
var canvasWidth = 823;
var canvasHeight = 446;
var padding = 0;
var lineWidth = 8;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorBlack = "#000000";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = colorBlack;
var curTool = "marker";
var curSize = "small";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 0;
var drawingAreaY = 0;
var drawingAreaWidth = 823;
var drawingAreaHeight = 446;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = new Object();
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8
var curLoadResNum = 0;
var tool;
var tool_default = 'rect';
/**
 * Calls the redraw function after all neccessary resources are loaded.
 */

function resourceLoaded() {
	if (++curLoadResNum >= totalLoadResources) {
		redraw();
	}
}

function displaySmall() {
	curSize = "small";
}

function displayNormal() {
	curSize = "normal";
}

function displayLarge() {
	curSize = "large";
}

function displayHuge() {
	curSize = "huge";
}

function displayMarker() {
	curTool = "marker";
}

function displayRectangle() {
	curTool = "rect";
}

function displayErase() {
	curTool = "eraser";
}

function displayGreen() {
	curColor = colorGreen;
}

function displayPurple() {
	curColor = colorPurple;
}

function displayBrown() {
	curColor = colorBrown;
}

function displayYellow() {
	curColor = colorYellow;
}

function displayBlack() {
	curColor = colorBlack;
}

function displayText(text) {
	context.lineWidth = 1;
	context.fillStyle = curColor;
	if (curSize == "small") {
		context.font = "12px Arial";
	} else if (curSize == "normal") {
		context.font = "20px Arial";
	} else if (curSize == "large") {
		context.font = "36px Arial";
	} else if (curSize == "huge") {
		context.font = "56px Arial";
	}
	context.fillText(text, 250, 250);
	context.save();
	context.restore();
}


















// The general-purpose event handler. This function just determines the mouse 
// position relative to the canvas element.


function ev_canvas(ev) {
	if (ev.layerX || ev.layerX == 0) { // Firefox
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}

	// Call the event handler of the tool.
	var func = tool[ev.type];
	if (func) {
		func(ev);
	}
}



// This object holds the implementation of each drawing tool.
var tools = {};

// The drawing pencil.
tools.pencil = function () {
	var tool = this;
	this.started = false;

	// This is called when you start holding down the mouse button.
	// This starts the pencil drawing.
	this.mousedown = function (ev) {
		context.beginPath();
		context.moveTo(ev._x, ev._y);
		tool.started = true;
	};

	// This function is called every time you move the mouse. Obviously, it only 
	// draws if the tool.started state is set to true (when you are holding down 
	// the mouse button).
	this.mousemove = function (ev) {
		if (tool.started) {
			context.lineTo(ev._x, ev._y);
			context.stroke();
		}
	};

	// This is called when you release the mouse button.
	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};
};

// The rectangle tool.
tools.rect = function () {
	var tool = this;
	this.started = false;

	this.mousedown = function (ev) {
		tool.started = true;
		tool.x0 = ev._x;
		tool.y0 = ev._y;
	};

	this.mousemove = function (ev) {
		if (!tool.started) {
			return;
		}

		var x = Math.min(ev._x, tool.x0),
			y = Math.min(ev._y, tool.y0),
			w = Math.abs(ev._x - tool.x0),
			h = Math.abs(ev._y - tool.y0);

		context.clearRect(0, 0, canvas.width, canvas.height);

		if (!w || !h) {
			return;
		}

		context.strokeRect(x, y, w, h);
	};

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};
};












// The event handler for any changes made to the tool selector.
/**
 * Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
 */

function prepareCanvas() {
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('imageView');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if (typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	context = document.getElementById('canvas').getContext("2d");
	// Attach the mousedown, mousemove and mouseup event listeners.


	tool = new tools[tool_default]();



	// Attach the mousedown, mousemove and mouseup event listeners.
	canvas.addEventListener('mousedown', ev_canvas, false);
	canvas.addEventListener('mousemove', ev_canvas, false);
	canvas.addEventListener('mouseup', ev_canvas, false);

	var iWidth = canvas.width;
	var iHeight = canvas.height;







	document.getElementById("btnSavePage").onclick = function () {
		saveToLocalStorage(document.getElementById("txtSaveAs").value);
	}
	document.getElementById("btnClearLS").onclick = function () {
		localStorage.clear();
		loadNavigation();
	}
	document.getElementById("btnText").onclick = function () {
		displayText(document.getElementById("txtText").value);
	}
	loadNavigation();
	// Load images
	// -----------
	crayonImage.onload = function () {
		resourceLoaded();
	}
	crayonImage.src = "images/crayon-outline.png";
	//context.drawImage(crayonImage, 0, 0, 100, 100);
	markerImage.onload = function () {
		resourceLoaded();
	}
	markerImage.src = "images/marker-outline.png";
	eraserImage.onload = function () {
		resourceLoaded();
	}
	eraserImage.src = "images/eraser-outline.png";
	crayonBackgroundImage.onload = function () {
		resourceLoaded();
	}
	crayonBackgroundImage.src = "images/crayon-background.png";
	markerBackgroundImage.onload = function () {
		resourceLoaded();
	}
	markerBackgroundImage.src = "images/marker-background.png";
	eraserBackgroundImage.onload = function () {
		resourceLoaded();
	}
	eraserBackgroundImage.src = "images/eraser-background.png";
	crayonTextureImage.onload = function () {
		resourceLoaded();
	}
	crayonTextureImage.src = "images/crayon-texture.png";
	outlineImage.onload = function () {
		resourceLoaded();
	}
	outlineImage.src = "images/watermelon-duck-outline.png";
	// Add mouse events
	// ----------------
	if (curTool == "eraser" || curTool == "marker") {
		$('#canvas').mousedown(function (e) {
			// Mouse down location
			var mouseX = e.pageX - this.offsetLeft;
			var mouseY = e.pageY - this.offsetTop;
			paint = true;
			addClick(mouseX, mouseY, false);
			redraw();
		});
		$('#canvas').mousemove(function (e) {
			if (paint == true) {
				addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
				redraw();
			}
		});
		$('#canvas').mouseup(function (e) {
			paint = false;
			redraw();
		});
		$('#canvas').mouseleave(function (e) {
			paint = false;
		});
	} else {

	}
}
/**
 * Adds a point to the drawing array.
 * @param x
 * @param y
 * @param dragging
 */

function addClick(x, y, dragging) {
	if (curTool == "eraser" || curTool == "marker") {
		clickX.push(x);
		clickY.push(y);
		clickTool.push(curTool);
		clickColor.push(curColor);
		clickSize.push(curSize);
		clickDrag.push(dragging);
	}
}
/**
 * Clears the canvas.
 */

function clearCanvas() {
	context.fillStyle = '#ffffff'; // Work around for Chrome
	context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill in the canvas with white
	canvas.width = canvas.width; // clears the canvas 
}
/**
 * Redraws the canvas.
 */

function redraw() {
	// Make sure required resources are loaded before redrawing
	if (curLoadResNum < totalLoadResources) {
		return;
	}
	clearCanvas();
	var locX;
	var locY;
	if (curTool == "marker") {} else if (curTool == "eraser") {} else if (curTool == "rect") {} else {
		alert("Error: Current Tool is undefined");
	}
	if (curSize == "small") {
		locX = 467;
	} else if (curSize == "normal") {
		locX = 450;
	} else if (curSize == "large") {
		locX = 428;
	} else if (curSize == "huge") {
		locX = 399;
	}
	// Keep the drawing in the drawing area
	context.save();
	context.beginPath();
	context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	context.clip();
	var radius;
	var i = 0;
	for (; i < clickX.length; i++) {
		if (clickSize[i] == "small") {
			radius = 2;
		} else if (clickSize[i] == "normal") {
			radius = 5;
		} else if (clickSize[i] == "large") {
			radius = 10;
		} else if (clickSize[i] == "huge") {
			radius = 20;
		} else {
			alert("Error: Radius is zero for click " + i);
			radius = 0;
		}
		context.beginPath();
		if (clickDrag[i] && i) {
			context.moveTo(clickX[i - 1], clickY[i - 1]);
		} else {
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		if (clickTool[i] == "eraser") {
			context.globalCompositeOperation = "destination-out"; // To erase instead of draw over with white
			context.strokeStyle = 'white';
		} else {
			context.globalCompositeOperation = "source-over"; // To erase instead of draw over with white
			context.strokeStyle = clickColor[i];
		}
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
	}
	context.globalCompositeOperation = "source-over"; // To erase instead of draw over with white
	context.restore();
	// Draw the outline image
	//context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
}

function convertCanvas(strType) {
	if (strType == "PNG") var oImg = Canvas2Image.saveAsPNG(canvas, true, canvas.width, canvas.height);
	if (strType == "BMP") var oImg = Canvas2Image.saveAsBMP(canvas, true, canvas.width, canvas.height);
	if (strType == "JPEG") var oImg = Canvas2Image.saveAsJPEG(canvas, true, canvas.width, canvas.height);
	if (!oImg) {
		alert("Sorry, this browser is not capable of saving " + strType + " files!");
		return false;
	}
	oImg.id = "canvasimage";
	oImg.style.border = oCanvas.style.border;
	oCanvas.parentNode.replaceChild(oImg, oCanvas);
	showDownloadText();
}
//functie fred

function loadNavigation() {
	//clear navigation
	//loops over all childs and deletes them
	var images = document.getElementById("testImg");
	if (images.hasChildNodes()) {
		while (images.childNodes.length >= 1) {
			images.removeChild(images.firstChild);
		}
	}

	var links = document.getElementById("navigationList");
	if (links.hasChildNodes()) {
		while (links.childNodes.length >= 1) {
			links.removeChild(links.firstChild);
		}
	}

	//load thumbnails of saved pages
	//first load array of all filenames
	var files = JSON.parse(localStorage.getItem('array'));
	//alert(files.join('\n'));
	//document.writeln("<img src='" + localStorage.getItem('test') + "' />");
	var linkList = document.getElementById('navigationList');

	if (files != null && files.length != 0) {
		for (var file in files) {
			//first build a list of all pages
			var new_element = document.createElement('li');
			new_element.innerHTML = "<a href='#'>" + files[file] + "</a>";
			linkList.insertBefore(new_element, linkList.firstChild);

			//then show them images
			var image = localStorage.getItem(files[file]);
			//document.writeln(image);
			localStorageImage = document.createElement('img');
			localStorageImage.src = image;
			localStorageImage.className = "thumbnail";
			document.getElementById("testImg").appendChild(localStorageImage);
		}
	}
}

function saveToLocalStorage(path) {
	localStorage.setItem(path, canvas.toDataURL("image/png"));
	//localStorage.setItem('test', canvas.toDataURL("image/png"));
	var files = [];

	//get array and add Item
	if (localStorage.getItem('array') != null) {

		files = JSON.parse(localStorage['array']);
		files[files.length] = path;
		localStorage.setItem('array', JSON.stringify(files));
	} else {
		files[0] = path;
		localStorage.setItem('array', JSON.stringify(files));
	}

	alert('your page was saved + ' + path);
	loadNavigation();
}