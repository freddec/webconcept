/* © 2009 ROBO Design
* http://www.robodesign.ro
*/

// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
window.addEventListener('load', function () {
	var canvas, context;
	
	// The active tool instance.
	var tool;
	var tool_default = 'rect';
	
	function init () {
		// Find the canvas element.
		canvas = document.getElementById('imageView');
		if (!canvas) {
			alert('Error: I cannot find the canvas element!');
			return;
		}
	
		if (!canvas.getContext) {
			alert('Error: no canvas.getContext!');
			return;
		}
	
		// Get the 2D canvas context.
		context = canvas.getContext('2d');
		if (!context) {
			alert('Error: failed to getContext!');
			return;
		}
	
		// Get the tool select input.
		var tool_select = document.getElementById('dtool');
		if (!tool_select) {
			alert('Error: failed to get the dtool element!');
			return;
		}
		tool_select.addEventListener('change', ev_tool_change, false);
		
		// Activate the default tool.
		if (tools[tool_default]) {
			tool = new tools[tool_default]();
			tool_select.value = tool_default;
		}
		
		// Attach the mousedown, mousemove and mouseup event listeners.
		canvas.addEventListener('mousedown', ev_canvas, false);
		canvas.addEventListener('mousemove', ev_canvas, false);
		canvas.addEventListener('mouseup',   ev_canvas, false);
		
		var iWidth = canvas.width;
		var iHeight = canvas.height;
	
	
		document.getElementById("savepngbtn").onclick = function() {
			saveCanvas(canvas, "PNG");
		}
		document.getElementById("savebmpbtn").onclick = function() {
			saveCanvas(canvas, "BMP");
		}
		document.getElementById("savejpegbtn").onclick = function() {
			saveCanvas(canvas, "JPEG");
		}
	
		document.getElementById("convertpngbtn").onclick = function() {
			convertCanvas("PNG");
		}
		document.getElementById("convertbmpbtn").onclick = function() {
			convertCanvas("BMP");
		}
		document.getElementById("convertjpegbtn").onclick = function() {
			convertCanvas("JPEG");
		}

	}
	
	// The general-purpose event handler. This function just determines the mouse 
	// position relative to the canvas element.
	function ev_canvas (ev) {
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
	
	// The event handler for any changes made to the tool selector.
	function ev_tool_change (ev) {
		if (tools[this.value]) {
			tool = new tools[this.value]();
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
			
			var x = Math.min(ev._x,  tool.x0),
			y = Math.min(ev._y,  tool.y0),
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
	
	function convertCanvas(strType) {
		if (strType == "PNG")
			var oImg = Canvas2Image.saveAsPNG(canvas, true);
		if (strType == "BMP")
			var oImg = Canvas2Image.saveAsBMP(canvas, true);
		if (strType == "JPEG")
			var oImg = Canvas2Image.saveAsJPEG(canvas, true);

		if (!oImg) {
			alert("Sorry, this browser is not capable of saving " + strType + " files!");
			return false;
		}

		oImg.id = "canvasimage";

		oImg.style.border = oCanvas.style.border;
		oCanvas.parentNode.replaceChild(oImg, oCanvas);

		showDownloadText();
	}

	function saveCanvas(pCanvas, strType) {
		var bRes = false;
		if (strType == "PNG")
			bRes = Canvas2Image.saveAsPNG(canvas);
		if (strType == "BMP")
			bRes = Canvas2Image.saveAsBMP(canvas);
		if (strType == "JPEG")
			bRes = Canvas2Image.saveAsJPEG(canvas);

		if (!bRes) {
			alert("Sorry, this browser is not capable of saving " + strType + " files!");
			return false;
		}
	}
	
	init();

}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:

