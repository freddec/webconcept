		var counter = 0;
		var blockCounter = 0;
		var textfieldCounter = 0;
		var buttonCounter = 0;
		var imageCounter = 0;
        var videoCounter = 0;
        var chartCounter = 0;
        var gmapCounter = 0;
        var checkboxCounter = 0;
        var radiobuttonCounter = 0;
        var dropdownCounter = 0;
        var localstorage = false;
        var savedFile = "";
        var fsys;
		var root;
		//an array that holds all the id's of every element
		var elementsArray = new Array();
		var idArray = new Array();
		var textArray = new Array();
		var ownItemCounter = new Array()
		var myJSON = {"items" : []};
		var jsonLoaded = null;
		var jsonCustomElements;
		var labelCounter = 0;
		
		
		//web filesystem
		//http://www.thecssninja.com/javascript/filesystem
		//write files - http://www.html5rocks.com/en/tutorials/file/filesystem/
	
		
		//function gets executed on startup
		$(function(){		
			$('#dropZone').hide();
			$('#colordiv').hide();
			checkFileApi();	
			//initiate the diff subdivisions of tools
			document.getElementById("standardMenu").style.backgroundImage = 'url(images/elements/standardmin.png)';						
			document.getElementById("mediaMenu").style.backgroundImage = 'url(images/elements/media.png)';
			document.getElementById("customTools").style.backgroundImage = 'url(images/elements/custommin.png)';
			document.getElementById("blockTool").style.display = "block";
			document.getElementById("textfieldTool").style.display = "block";
			document.getElementById("buttonTool").style.display = "block";
			document.getElementById("labelH1").style.display = "block";			
			document.getElementById("imageTool").style.display = "none";
			document.getElementById("videoTool").style.display = "none";
			document.getElementById("chartTool").style.display = "none";
			document.getElementById("gmapTool").style.display = "none";
			document.getElementById("dropdownTool").style.display = "none";
			document.getElementById("checkboxTool").style.display = "none";
			document.getElementById("radiobuttonTool").style.display = "none";
						
			//build the json array
	        if (localStorage.getItem("ownElements") == null) {
				jsonCustomElements = {"customElements" : []};
				document.getElementById("customTools").display = "none";
			} else {
				jsonCustomElements = JSON.parse(localStorage.getItem("ownElements"));
				document.getElementById("customTools").display = "block";
	        	initOwnTools();
	        }
		});
		
		//initiate the filesystem
		function checkFileApi() {
			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
		  		// Great success! All the File APIs are supported. Continue				
				window.webkitRequestFileSystem(TEMPORARY, 5242880 /* ~5MB */, function(fs) {
				    fsys = fs;
				    root = fsys.root;
				}, errorHandler);
				
			} else {
		  		alert('The File APIs are not fully supported in this browser.');
		  		localstorage = true;
		  		console.log("using localstorage because file API isn't supported");
			}	
		}
		
		//write the file
		function writeFile() {  
			var filename = document.getElementById('inputFileName').value;
			if (filename == null || filename == "") 
			{
				alert("you need to enter a name for the file!");
			} else {	
				if (localstorage) {	
		  			//localstorage method
		  			localStorage.json = "";
		  			
		  			//store to localstorage
		  			localStorage.json = JSON.stringify(myJSON);
	  			} else {
		  			//first delete previous saved file
		  			debugDelete();
		  			
		  			//create a file
		  			fsys.root.getFile(filename, {create: true}, function(fileEntry) {
		  				
		  			
		  			
				    	// Create a FileWriter object for our FileEntry 
				    	fileEntry.createWriter(function(fileWriter) {
				
				    		fileWriter.onwriteend = function(e) {
				        		console.log('Write completed.');
				      		};
				
				      		fileWriter.onerror = function(e) {
				        		console.log('Write failed: ' + e.toString());
				      		};
				
				      		// Create a new Blob and write it to log.txt.
				      		var bb = new window.WebKitBlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
				      		bb.append(JSON.stringify(myJSON));
				      		fileWriter.seek(fileWriter.length); 
				      		fileWriter.write(bb.getBlob('text/plain'));
				      	}, errorHandler);
				    }, errorHandler); 	
				    console.log("the file has been written!");
				}
			}
		}
		
		//function for debugging, erase written file
		function debugDelete() {
			var filename = document.getElementById('inputFileName').value;
			fsys.root.getFile(filename, {create: false}, function(fileEntry) {
  							  			
		    	// Create a FileWriter object for our FileEntry 
		    	fileEntry.createWriter(function(fileWriter) {
				
					fileEntry.remove();
					console.log("entry removed");
					
		      	}, errorHandler);
		    }, errorHandler); 		
		}
		
		//write the dimensions to a file
		function writeDimensions()
		{		
			console.log(elementsArray);
				
			for (i = 0; i < elementsArray.length; i++) {
				//if textfield - get the text inside!
				if (elementsArray[i] == 'textArea') {
					var textContent = document.getElementById(elementsArray[i]+idArray[i]).value;	
					var xy = findPos(document.getElementById(elementsArray[i]+idArray[i]));
					myJSON["items"].push({element: elementsArray[i], id: idArray[i], x: xy[0], y: xy[1], width: xy[2], height: xy[3], extra: { text: textContent }});
				} else if (elementsArray[i] === "h1" || elementsArray[i] === "h2" || elementsArray[i] ==="h3" || elementsArray[i] === "h4" || elementsArray[i] === "h5") {
					console.log('labelDiv'+idArray[i]);
					var textContent = document.getElementById('label'+idArray[i]).innerHTML;
					var xy = findPosH(document.getElementById('labeldiv'+idArray[i]));
					myJSON["items"].push({element: elementsArray[i], id: idArray[i], x: xy[0], y: xy[1], width: xy[2], height: xy[3], extra: { text: textContent }});
				} else if (elementsArray[i] == 'inputButton') {
					//if it's a button, save the font size, text & color
					var xy = findPos(document.getElementById(elementsArray[i]+idArray[i]));
					var buttonValue = document.getElementById('button'+idArray[i]).innerHTML;
					var buttonColor = document.getElementById('button'+idArray[i]).style.color;
					var fontSize = document.getElementById('button'+idArray[i]).style.fontSize;
					var widthBtn = document.getElementById('button'+idArray[i]).offsetWidth;
					var heightBtn = document.getElementById('button'+idArray[i]).offsetHeight;
					
					
					myJSON["items"].push({element: elementsArray[i], id: idArray[i], x: xy[0], y: xy[1], width: widthBtn, height: heightBtn, extra: { 
						value: buttonValue,
						color: buttonColor,
						fontsize: fontSize 
					}});
				} else {
					var xy = findPos(document.getElementById(elementsArray[i]+idArray[i]));
					myJSON["items"].push({element: elementsArray[i], id: idArray[i], x: xy[0], y: xy[1], width: xy[2], height: xy[3]});	
				}
	
			}
			
			writeFile();
			
		}
		
		
		//if clicked get the info from the file (restore)
		function getFile() {
			var filename = document.getElementById('inputFileName').value;			
			//check if filename isn't empty!
			if (filename == null || filename == "") 
			{
				alert("you need to enter a name for the file!");
			} else {
				if (localstorage) {
					jsonLoaded = JSON.parse(localStorage.json);
				} else {
					fsys.root.getFile(filename, {}, function(fileEntry) {
										
					    // Get a File object representing the file,
					    // then use FileReader to read its contents.
					    fileEntry.file(function(file) {
					    	var reader = new FileReader();
					
					       	reader.onloadend = function(e) {
					         	console.log(this.result);
					         	jsonLoaded = JSON.parse(this.result);
					         	console.log('jsonloaded:' + jsonLoaded);
					         	loadElements();
					       	};
							
					       	reader.readAsText(file);
						}, errorHandler);
					}, errorHandler);	
				}
			}
		}
		
		//load my elements back to the canvas - yeah!
		function loadElements() {
			for (i = 0; i < jsonLoaded["items"].length; i++) {
				console.log(jsonLoaded["items"][i]);
				if (jsonLoaded["items"][i]["element"] == 'h1' || jsonLoaded["items"][i]["element"] == 'h2' || jsonLoaded["items"][i]["element"] == 'h3' || jsonLoaded["items"][i]["element"] == 'h4' || jsonLoaded["items"][i]["element"] == 'h5') {
					addLabel(jsonLoaded["items"][i]["element"], jsonLoaded["items"][i]);
				} else {
					addItemXY(jsonLoaded["items"][i]);
				}
					
			}
		}
		
        function Delete(id) {
            var toBeRemoved = document.getElementById(id);
            toBeRemoved.parentNode.removeChild(toBeRemoved);   
		}
		
		//error handler for the filesystem
		function errorHandler(e) {
		  var msg = '';
		
		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };
		
		  console.log('Error: ' + msg);
		}
						
		//show & hide div's and other elements
		//http://www.plus2net.com/javascript_tutorial/hide-layer.php
		function setVisibility(id, visibility) {
			document.getElementById(id).style.display = visibility;
		}
		
		//change color & size of button
		function changeButton(id, visibility, buttonid, input, size) {
			document.getElementById(buttonid).innerHTML = document.getElementById(input).value;
			document.getElementById(buttonid).style.fontSize = document.getElementById(size).value + "px";
			document.getElementById(buttonid).style.color = "#" + document.getElementById("colorselect").value;
			$('#colordiv').hide();
			document.getElementById(id).style.display = visibility;
		}
		
		function changeLabel(id, visibility, toolid, input) {
			document.getElementById(toolid).innerHTML = document.getElementById(input).value;
			document.getElementById(toolid).style.color = "#" + document.getElementById("colorselect").value;
			$('#colordiv').hide();
			document.getElementById(id).style.display = visibility;
		}
		
		function changemenu(tool1, tool2, tool3, button, h1, h2, h3, h4, h5) {
		
			//a little difference when we hide/unhide custom elements
			if (tool1 == 'custom') {				
				if (document.getElementById('userImageSpan0').style.display == "block") {
					document.getElementById("customTools").style.backgroundImage = 'url(images/elements/custom.png)';
					for(i = 0; i < jsonCustomElements["customElements"].length; i++) {
						document.getElementById('userImageSpan'+i).style.display = "none";
					}	
				} else {
					document.getElementById("customTools").style.backgroundImage = 'url(images/elements/custommin.png)';
					for(i = 0; i < jsonCustomElements["customElements"].length; i++) {
						document.getElementById('userImageSpan'+i).style.display = "block";
					}	
				}	
			} else {
				if (document.getElementById(tool1).style.display == "block") {
				
					if (button == 'standardMenu') document.getElementById("standardMenu").style.backgroundImage = 'url(images/elements/standard.png)';
					else document.getElementById("mediaMenu").style.backgroundImage = 'url(images/elements/media.png)';
					
					document.getElementById(tool1).style.display = "none";
					document.getElementById(tool2).style.display = "none";
					document.getElementById(tool3).style.display = "none";
					document.getElementById(h1).style.display = "none";
					document.getElementById(h2).style.display = "none";
					document.getElementById(h3).style.display = "none";
					document.getElementById(h4).style.display = "none";
					document.getElementById(h5).style.display = "none";
				}
				
				else {
					if (button == 'standardMenu') document.getElementById("standardMenu").style.backgroundImage = 'url(images/elements/standardmin.png)';
					else document.getElementById("mediaMenu").style.backgroundImage = 'url(images/elements/mediamin.png)';
	
					document.getElementById(tool1).style.display = "block";
					document.getElementById(tool2).style.display = "block";
					document.getElementById(tool3).style.display = "block";
					document.getElementById(h1).style.display = "block";
					document.getElementById(h2).style.display = "block";
					document.getElementById(h3).style.display = "block";
					document.getElementById(h4).style.display = "block";
					document.getElementById(h5).style.display = "block";
	
				}
			}
		}
		
		//function to drop own user images in the page
		//https://www.ibm.com/developerworks/mydeveloperworks/blogs/bobleah/entry/html5_code_example_of_file_api_drag_drop_hard_drive_files_to_a_webpage28?lang=en
		function imagesSelected(myFiles) {
		  for (var i = 0, f; f = myFiles[i]; i++) {
		    var imageReader = new FileReader();
		    imageReader.onload = (function(aFile) {
		      return function(e) {		      	
		      	console.log("before adding" + jsonCustomElements);
		      	
		        jsonCustomElements["customElements"].push({customElement: 'image'+counter, src: e.target.result});
		        
		        //add an element to the toolspage with it's thumbnail
		       	var span = document.createElement('span');
		        span.innerHTML = ['<img class="userImages" onClick="addCustomElement(\'image', counter,'\');" id="userImage', counter ,'" src="', e.target.result,'" title="', aFile.name, '"/>'].join('');
		        span.setAttribute('id', 'userImageSpan'+counter);
		        document.getElementById('ownTools').insertBefore(span, null);
		        
		        ownItemCounter['image'+counter] = 0;
		        
		        
		        console.log("after adding" + jsonCustomElements);
		        
		        localStorage.ownElements = JSON.stringify(jsonCustomElements);
		        
		        counter++;
		      };
		    })(f);
		    imageReader.readAsDataURL(f);
		  }
		}
		
		//get the own tools that were added from the localstorage
		function initOwnTools() {
			counter = 0;
						
			for (i = 0; i < jsonCustomElements["customElements"].length; i++) {
				var object = jsonCustomElements["customElements"][i];
				var source = object["src"];
				var span = document.createElement('span');
		        span.innerHTML = ['<img class="userImages" onClick="addCustomElement(\'image', counter,'\');" id="userImage', counter ,'" src="', source,'" title="customImage"/>'].join('');
		        span.setAttribute('id', 'userImageSpan'+counter);
		        document.getElementById('ownTools').insertBefore(span, null);
		        
		        //the div of custom tools is usually not unfolded - hide when added
		        document.getElementById('userImageSpan'+counter).style.display = "block";
		        
		        ownItemCounter['image'+counter] = 0;	
		        //how many items did we already load from localstorage?
		        counter++;
			}	
		}
		
		//gets the images dat are dropped in the dropzone
		//protected that only .JPG & .PNG files are allowed
		function dropIt(e) {  
			/*
		   imagesSelected(e.dataTransfer.files); 
		   e.stopPropagation();  
		   e.preventDefault(); 
			*/ 
			var files = e.dataTransfer.files; // FileList object.

            // files is a FileList of File objects. List some properties.
            var output = [];
            for (var i = 0, f; f = files[i]; i++) {
              output.push(f.type);
              
               if(f.type != "image/png" && f.type != "image/jpeg") {
                    alert('Only image types .PNG and .JPEG are allowed!');
               } else {
                    imagesSelected(e.dataTransfer.files); 
                    e.stopPropagation();  
                    e.preventDefault();          
               }
            }
		}  
		
		//add custom elements back to the canvas
		function addCustomElement(id) {
			//get the object to add 
			for (i = 0; i < jsonCustomElements["customElements"].length; i++) {
				var object = jsonCustomElements["customElements"][i];
		        if (object["customElement"]== id) {
					addOwnItem(object);	
		        } else {
		            continue;
		        }
		    }	
		}
		
		//testphase - function to determine position
		//http://www.quirksmode.org/js/findpos.html
		function findPos(obj) {		
			var curleft = curtop = 0;
			var width = obj.offsetWidth;
			var height = obj.offsetHeight;

			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);

				return [curleft,curtop,width,height];
			}
		}
		
		function findPosH(obj) {
			var curleft = curtop = 0;
			var width = 0;
			var height = 0;

			if (obj.offsetParent) {
				do {
					curleft += obj.offsetLeft;
					curtop += obj.offsetTop;
				} while (obj = obj.offsetParent);

				return [curleft,curtop,width,height];
			}	
		}
		
		//function to add H1, H2, … to the workspace
		function addLabel(headerId, setPos) {
			if (setPos !== null) {
				var item = setPos["element"];
				var itemX = setPos["x"];
				var itemY = setPos["y"];
				var text = 	setPos["extra"]["text"];
			}
		
			var workspace = document.getElementById('workspace');
			var deleteHandle = document.createElement('p');
			
			var labeldiv = document.createElement('div');
			var label = document.createElement('label');
			
			var editTool = document.createElement('p');
			var popupLabel= document.createElement('div');
			var input = document.createElement('input');
			var btnPopupButton = document.createElement('button');
			var input2 = document.createElement('select');
							
			
			if (headerId === 'h1') {
				label.style.fontSize = '36px';
				label.style.fontweight = 'bold';
				label.innerHTML = 'header1'; 
				labeldiv.setAttribute('class', 'inputH1');
				input.setAttribute('value', 'header1');
			}
			else if (headerId == 'h2') {
				label.style.fontSize = '24px';
				label.style.fontweight = 'bold';
				label.innerHTML = 'header2'; 
				labeldiv.setAttribute('class', 'inputH2');
				input.setAttribute('value', 'header2');
			}						
			else if (headerId == 'h3') {
				label.style.fontSize = '18px';
				label.innerHTML = 'header3'; 
				labeldiv.setAttribute('class', 'inputH3');
				input.setAttribute('value', 'header3');
			}				
			else if (headerId == 'h4') {
				label.style.fontSize = '14px';
				label.innerHTML = 'header4'; 
				labeldiv.setAttribute('class', 'inputH4');
				input.setAttribute('value', 'header4');
			}				
			else if (headerId == 'h5') {
				label.style.fontSize =  '12px';
				label.innerHTML = 'header5'; 
				labeldiv.setAttribute('class', 'inputH5');
				input.setAttribute('value', 'header5');
			}
			
			//labeldiv.setAttribute('class', 'inputButton');
			labeldiv.setAttribute('id', 'labeldiv'+labelCounter);
			
			label.setAttribute('class', 'labels');
			label.setAttribute('id', 'label'+labelCounter); 
			
			editTool.setAttribute('class', 'editTool');
			editTool.setAttribute("onclick", "setVisibility('popupLabel"+labelCounter+"', 'block'); $('#colordiv').show();");
			editTool.innerHTML = '&nbsp;';
			
			popupLabel.setAttribute('style', 'display: none');
			popupLabel.setAttribute('id', 'popupLabel'+labelCounter);
			popupLabel.setAttribute('class', 'popupLabel');
			input.setAttribute('class', 'changetext');
			input.setAttribute('id', 'textlbl'+labelCounter);
			input.setAttribute('placeholder', 'submit');
			
							
			deleteHandle.setAttribute('class', 'deleteHandle');
            deleteHandle.setAttribute("onclick", "Delete('labeldiv"+labelCounter+"');");
            deleteHandle.innerHTML = '&nbsp;'; 
							
			btnPopupButton.setAttribute('class', 'change');
			btnPopupButton.setAttribute('type', 'button');			
			btnPopupButton.setAttribute("onclick", "changeLabel('popupLabel"+labelCounter+"', 'none', 'label"+labelCounter+"', 'textlbl"+labelCounter+"' );"); 		
			btnPopupButton.innerHTML = 'ok';
			
			if (setPos !== null) {
				labeldiv.style.position = 'absolute';
				labeldiv.style.top = itemY;
				labeldiv.style.left = itemX;
				input.setAttribute('value', setPos["extra"]["text"]);
			} else {
				input.setAttribute('value', 'label');	
			}
						
			labeldiv.insertBefore(deleteHandle, null);
			workspace.insertBefore(labeldiv, null);
			
			document.getElementById('labeldiv'+labelCounter).insertBefore(editTool, null);
			document.getElementById('labeldiv'+labelCounter).insertBefore(label, null);
			document.getElementById('labeldiv'+labelCounter).insertBefore(popupLabel, null);
			document.getElementById('popupLabel'+labelCounter).insertBefore(input, null);
			document.getElementById('popupLabel'+labelCounter).insertBefore(btnPopupButton, null);
			
			$('#labeldiv'+labelCounter)
			.draggable({ grid: [30,30] });
			$('#labeldiv'+labelCounter)
			.resizable({  });
			elementsArray[elementsArray.length] = headerId;
			idArray[idArray.length] = labelCounter;
			labelCounter++;	
			
		}
		
		function addOwnItem(item)
		{
			var workspace = document.getElementById('workspace');
            var imageSpan = document.createElement('div');
            var deleteHandle = document.createElement('p');
            var image = document.createElement('img');
            var thisSpanId = 'span'+item['customElement'] + 'k' + ownItemCounter[item['customElement']];
            //need to add an unique id for each 'own' element, id's have to be separated!! otherwise conflicts wil concur
            image.setAttribute('id', item['customElement'] + "k" + ownItemCounter[item['customElement']]);
            image.setAttribute('src', item['src']);
            image.setAttribute('title', 'image');
            deleteHandle.setAttribute('class', 'deleteHandle');
            deleteHandle.setAttribute("onclick", "Delete('"+thisSpanId+"');");
            deleteHandle.innerHTML = '&nbsp;'; 
            //image.style.width = "150";
            //imageSpan.style.width = "150px";
           	//image.style.height = "110px";
            //imageSpan.style.height = "110px";
            imageSpan.setAttribute('id', 'span'+item['customElement'] + "k" + ownItemCounter[item['customElement']]);
            imageSpan.setAttribute('class', 'ownDraggable');
            imageSpan.insertBefore(deleteHandle, null);
            imageSpan.insertBefore(image, null);
            workspace.insertBefore(imageSpan, null);
            //$(thisId).resizable({ animate: true });
            $('#span'+item['customElement'] + 'k' +ownItemCounter[item['customElement']]).draggable({ grid: [30,30] });
            //own elements need special saving algorithm
            elementsArray[elementsArray.length] = 'image';
			idArray[idArray.length] = imageCounter;
            ownItemCounter[item["customElement"]]++;		
		}
		
		//function to add the tools to the workspace
		function addItem(item) {
			var workspace = document.getElementById('workspace');
			
			//add the default block element
			if (item == 'block') {
				var block = document.createElement('div');
				var deleteHandle = document.createElement('p');
				block.setAttribute('class', 'ui-widget-content');
				block.setAttribute('id', 'resizeDiv'+blockCounter); 
				deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('resizeDiv"+blockCounter+"');");
                deleteHandle.innerHTML = '&nbsp;'; 
				workspace.insertBefore(block, null);
				document.getElementById('resizeDiv'+blockCounter).insertBefore(deleteHandle, null);
				$('#resizeDiv'+blockCounter)
				.draggable({ grid: [30,30] })
				.resizable({ animate: true });
				//add this to the elements array for saving
				elementsArray[elementsArray.length] = 'resizeDiv'; 
				idArray[idArray.length] = blockCounter;
				blockCounter++;	
			} 
			
			//add the textfield
			else if (item == 'textField') {
				var textfield = document.createElement('div');
				var handle = document.createElement('p');
				var textarea = document.createElement('textarea');
				var deleteHandle = document.createElement('p');
							
				textfield.setAttribute('class', 'textField clearfix');
				textfield.setAttribute('id', 'textField'+textfieldCounter);
				handle.setAttribute('class', 'handle');
				handle.innerHTML = '&nbsp;';
				textarea.setAttribute('placeholder', 'text');
				textarea.setAttribute('id', 'textArea'+textfieldCounter);
				deleteHandle.setAttribute('class', 'deleteHandleSpecial');
                deleteHandle.setAttribute("onclick", "Delete('textField"+textfieldCounter+"');");
                deleteHandle.innerHTML = '&nbsp;'; 
				
				workspace.insertBefore(textfield, null);
				document.getElementById('textField'+textfieldCounter).insertBefore(handle, null);
				document.getElementById('textField'+textfieldCounter).insertBefore(deleteHandle, null);
				document.getElementById('textField'+textfieldCounter).insertBefore(textarea, null);
				
				$('.textField').draggable({ handle: "p", cancel: "textarea", grid: [30,30] });
				$('#textArea'+textfieldCounter).resizable({ animate: true });
				
				elementsArray[elementsArray.length] = 'textArea';
				idArray[idArray.length] = textfieldCounter;
				textfieldCounter++;
			}
					
			//add a button
			else if (item == 'button') {
				var button = document.createElement('div');
				var handle = document.createElement('p');
				var deleteHandle = document.createElement('p');
				var editTool = document.createElement('p');
				var btnButton = document.createElement('button');
				var popupButton = document.createElement('div');
				var input = document.createElement('input');
				var btnPopupButton = document.createElement('button');
				var input2 = document.createElement('select');
				
				button.setAttribute('class', 'inputButton');
				button.setAttribute('id', 'inputButton'+buttonCounter);
				handle.setAttribute('class', 'handle');
				handle.innerHTML = '&nbsp;';
				editTool.setAttribute('class', 'editTool');
				editTool.setAttribute("onclick", "setVisibility('popupButton"+buttonCounter+"', 'block'); $('#colordiv').show();");
				editTool.innerHTML = '&nbsp;';
				btnButton.setAttribute('type', 'button');
				btnButton.setAttribute('id', 'button'+buttonCounter);
				btnButton.innerHTML = 'button';
				popupButton.setAttribute('style', 'display: none');
				popupButton.setAttribute('id', 'popupButton'+buttonCounter);
				popupButton.setAttribute('class', 'popupButton');
				input.setAttribute('class', 'changetext');
				input.setAttribute('id', 'text'+buttonCounter);
				input.setAttribute('placeholder', 'submit');
				input.setAttribute('value', 'button');
				input2.setAttribute('class', 'changesize ');
				input2.setAttribute('id', 'size'+buttonCounter);
				input2.setAttribute('placeholder', 'submit');
				input2.setAttribute('value', '14');
				deleteHandle.setAttribute('class', 'deleteHandleSpecial');
                deleteHandle.setAttribute("onclick", "Delete('inputButton"+buttonCounter+"');");
				deleteHandle.innerHTML = '&nbsp;'; 
				
	
			    var option = document.createElement("option");
			    option.text = "10";
			    option.value = "10" ;
			    input2.add(option, null);


			    var option = document.createElement("option");
			    option.text = "12";
			    option.value = "12" ;
			    input2.add(option, null);
			    								
			    var option = document.createElement("option");
			    option.text = "14";
			    option.value = "14" ;
			    input2.add(option, null);


			    var option = document.createElement("option");
			    option.text = "16";
			    option.value = "16" ;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "20";
			    option.value = "20" ;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "22";
			    option.value = "22" ;
				option.defaultSelected = true;
			    input2.add(option, null);

			    
			    var option = document.createElement("option");
			    option.text = "25";
			    option.value = "25" ;
				option.defaultSelected = true;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "28";
			    option.value = "28" ;
			    input2.add(option, null);

					var option = document.createElement("option");
			    option.text = "30";
			    option.value = "30" ;
			    input2.add(option, null);

			    var option = document.createElement("option");
			    option.text = "32";
			    option.value = "32" ;
			    input2.add(option, null);
			   
											   
				btnPopupButton.setAttribute('class', 'change');
				btnPopupButton.setAttribute('type', 'button');
				btnPopupButton.setAttribute("onclick", "changeButton('popupButton"+buttonCounter+"', 'none', 'button"+buttonCounter+"', 'text"+buttonCounter+"', 'size"+buttonCounter+"' );"); 
				btnPopupButton.innerHTML = 'ok';
				
				workspace.insertBefore(button, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(handle, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(deleteHandle, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(editTool, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(btnButton, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(popupButton, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(input, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(input2, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(btnPopupButton, null);
				
				$('.inputButton').draggable({ handle: "p", cancel: "button", grid: [30,30] });
				$('#button'+buttonCounter).resizable ({ animate: true });
				
				elementsArray[elementsArray.length] = 'inputButton';
				idArray[idArray.length] = buttonCounter;
				buttonCounter++;
			}
			
			//image mockup 
			else if (item == 'image') {
				var deleteHandle = document.createElement('p');
	            var imageSpan = document.createElement('div');
	            var image = document.createElement('img');
	            image.setAttribute('id', 'image'+imageCounter);
	            image.setAttribute('class', 'images');
	            image.setAttribute('src', './images/elements/imageStyle.png');
	            image.setAttribute('title', 'image');
	            image.style.width = "200px";
	            imageSpan.style.width = "200px";
	            image.style.height = "150px";
	            imageSpan.style.height = "150px";
	            imageSpan.setAttribute('id', 'imageSpan'+imageCounter);
	            deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('imageSpan"+imageCounter+"');");
                deleteHandle.innerHTML = '&nbsp;'; 
                imageSpan.insertBefore(deleteHandle, null);
	            imageSpan.insertBefore(image, null);
	            workspace.insertBefore(imageSpan, null);
	            $('#image'+imageCounter).resizable({  });
	            $('#imageSpan'+imageCounter).draggable({ grid: [30,30] });
	            elementsArray[elementsArray.length] = 'image';
				idArray[idArray.length] = imageCounter;
	            imageCounter++;	
			}                        
             
            //video control mockup           
   			else if (item == 'video') {   
   				var deleteHandle = document.createElement('p');             
                var videoSpan = document.createElement('div');
                var video = document.createElement('img');
                video.setAttribute('id', 'video'+videoCounter);
                video.setAttribute('class', 'videos');
	            video.setAttribute('src', './images/elements/videoStyle.png');
	            video.setAttribute('title', 'video');
	            video.style.width = "200px";
	            videoSpan.style.width = "200px";
	            videoSpan.style.height = "150";
	            video.style.height = "150px";
	            deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('videoSpan"+videoCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
	            videoSpan.setAttribute('id', 'videoSpan'+videoCounter);
				videoSpan.insertBefore(deleteHandle, null);
	            videoSpan.insertBefore(video, null);
                workspace.insertBefore(videoSpan, null);
                $('#video'+videoCounter).resizable();
                $('#videoSpan'+videoCounter).draggable({ grid: [30,30] });
                elementsArray[elementsArray.length] = 'video';
                idArray[idArray.length] = videoCounter;
                videoCounter++;	
			}                           
  			
  			//chart mockup
     		if (item == 'chart') {
     			var deleteHandle = document.createElement('p');
     			var chartSpan = document.createElement('div');
                var chart = document.createElement('img');
                chart.setAttribute('id', 'chart'+chartCounter);
                chart.setAttribute('class', 'charts');
	            chart.setAttribute('src', './images/elements/chartStyle.png');
	            chart.setAttribute('title', 'chart');
                chartSpan.setAttribute('id', 'chartSpan'+chartCounter);
                chart.style.position = "absolute";
	            chart.style.width = "200px";
	            chartSpan.style.width = "200px";
	            chartSpan.style.height = "150";
	            chart.style.height = "150px";
				deleteHandle.setAttribute('class', 'deleteHandle');
				deleteHandle.setAttribute("onclick", "Delete('chartSpan"+chartCounter+"');");
				deleteHandle.innerHTML = '&nbsp;';   
				
				chartSpan.insertBefore(deleteHandle, null);
	            chartSpan.insertBefore(chart, null);
                workspace.insertBefore(chartSpan, null);
                $('#chart'+chartCounter).resizable({  });
                $('#chartSpan'+chartCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'chart';
				idArray[idArray.length] = chartCounter;
                chartCounter++;	
     		}  
     		
     		//gmap mockup
     		if (item == 'gmap') {
                    var deleteHandle = document.createElement('p');
     			var gmapSpan = document.createElement('span');
                var gmap = document.createElement('img');
                gmap.setAttribute('id', 'gmap'+gmapCounter);
                gmap.setAttribute('class', 'gmaps');
	            gmap.setAttribute('src', './images/elements/gmapStyle.png');
	            gmap.setAttribute('title', 'gmap');
                gmapSpan.setAttribute('id', 'gmapSpan'+gmapCounter);
                gmap.style.position = "absolute";
	            gmap.style.width = "275px";
	            gmapSpan.style.width = "275px";
	            gmapSpan.style.height = "150";
	            gmap.style.height = "150px";
                    
				deleteHandle.setAttribute('class', 'deleteHandle');
				deleteHandle.setAttribute("onclick", "Delete('gmapSpan"+gmapCounter+"');");
				deleteHandle.innerHTML = '&nbsp;';   
				
				gmapSpan.insertBefore(deleteHandle, null);
	            gmapSpan.insertBefore(gmap, null);
                workspace.insertBefore(gmapSpan, null);
                $('#gmap'+gmapCounter).resizable({  });
                $('#gmapSpan'+gmapCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'gmap';
				idArray[idArray.length] = gmapCounter;
                gmapCounter++;	
     		}  	
                        
  			//dropdown mockup
     		if (item == 'dropdown') {
                var deleteHandle = document.createElement('p');
     			var dropdownSpan = document.createElement('span');
                var dropdown = document.createElement('img');
                dropdown.setAttribute('id', 'dropdown'+dropdownCounter);
                dropdown.setAttribute('class', 'dropdowns');
	            dropdown.setAttribute('src', './images/elements/dropdownStyle.png');
	            dropdown.setAttribute('title', 'dropdown');
                dropdownSpan.setAttribute('id', 'dropdownSpan'+dropdownCounter);
                dropdown.style.position = "absolute";
	            dropdown.style.width = "150px";
	            dropdownSpan.style.width = "150px";
	            dropdownSpan.style.height = "50px";
	            dropdown.style.height = "50px";
                    
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('dropdownSpan"+dropdownCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                dropdownSpan.insertBefore(deleteHandle, null);
	            dropdownSpan.insertBefore(dropdown, null);
                workspace.insertBefore(dropdownSpan, null);
                $('#dropdown'+dropdownCounter).resizable({  });
                $('#dropdownSpan'+dropdownCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'dropdown';
				idArray[idArray.length] = dropdownCounter;
                dropdownCounter++;	
     		}  
 
  			//checkbox mockup
     		if (item == 'checkbox') {
                var deleteHandle = document.createElement('p');
     			var checkboxSpan = document.createElement('span');
                var checkbox = document.createElement('img');
                checkbox.setAttribute('id', 'checkbox'+checkboxCounter);
                checkbox.setAttribute('class', 'checkboxs');
	            checkbox.setAttribute('src', './images/elements/checkboxStyle.png');
	            checkbox.setAttribute('title', 'checkbox');
                checkboxSpan.setAttribute('id', 'checkboxSpan'+checkboxCounter);
                checkbox.style.position = "absolute";
	            checkbox.style.width = "40px";
	            checkboxSpan.style.width = "40px";
	            checkboxSpan.style.height = "40px";
	            checkbox.style.height = "40px";
                    
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('checkboxSpan"+checkboxCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                checkboxSpan.insertBefore(deleteHandle, null);
	            checkboxSpan.insertBefore(checkbox, null);
                workspace.insertBefore(checkboxSpan, null);
                $('#checkbox'+checkboxCounter).resizable({  });
                $('#checkboxSpan'+checkboxCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'checkbox';
				idArray[idArray.length] = checkboxCounter;
                checkboxCounter++;	
     		}          
                        
  			//radiobutton mockup
     		if (item == 'radiobutton') {
                var deleteHandle = document.createElement('p');
     			var radiobuttonSpan = document.createElement('span');
                var radiobutton = document.createElement('img');
                radiobutton.setAttribute('id', 'radiobutton'+radiobuttonCounter);
                radiobutton.setAttribute('class', 'radiobuttons');
	            radiobutton.setAttribute('src', './images/elements/radiobuttonStyle.png');
	            radiobutton.setAttribute('title', 'radiobutton');
                radiobuttonSpan.setAttribute('id', 'radiobuttonSpan'+radiobuttonCounter);
                radiobutton.style.position = "absolute";
	            radiobutton.style.width = "40px";
	            radiobuttonSpan.style.width = "40px";
	            radiobuttonSpan.style.height = "40px";
	            radiobutton.style.height = "40px";
                    
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('radiobuttonSpan"+radiobuttonCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                radiobuttonSpan.insertBefore(deleteHandle, null);
	            radiobuttonSpan.insertBefore(radiobutton, null);
                workspace.insertBefore(radiobuttonSpan, null);
                $('#radiobutton'+radiobuttonCounter).resizable({  });
                $('#radiobuttonSpan'+radiobuttonCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'radiobutton';
				idArray[idArray.length] = radiobuttonCounter;
                radiobuttonCounter++;	
     		} 
		}	
			
		//function to add the (saved) tools to the workspace
		function addItemXY(itemObject) {
			var workspace = document.getElementById('workspace');
			var item = itemObject["element"];
			var itemX = itemObject["x"] - 187;
			var itemY = itemObject["y"] - 60;
			var itemWidth = itemObject["width"];
			var itemHeight = itemObject["height"];
			
			//add the default block element
			if (item == 'resizeDiv') {
				var block = document.createElement('div');
				block.setAttribute('class', 'ui-widget-content');
				block.setAttribute('id', 'resizeDiv'+blockCounter); 
				block.style.position = "absolute";
				block.style.top = itemY+"px";
				block.style.left = itemX+"px";
				block.style.width = itemWidth + "px";
				block.style.height = itemHeight + "px";
				workspace.insertBefore(block, null);
				$('#resizeDiv'+blockCounter)
				.draggable({ grid: [30,30] })
				.resizable({ animate: true });
				//add to array for saving
				elementsArray[elementsArray.length] = 'resizeDiv'; 
				idArray[idArray.length] = blockCounter;
				blockCounter++;	
			} 
			
			//add the textfield
			else if (item == 'textArea') {
				var textfield = document.createElement('div');
				var handle = document.createElement('p');
				var textarea = document.createElement('textarea');
							
				textfield.setAttribute('class', 'textField clearfix');
				textfield.setAttribute('id', 'textField'+textfieldCounter);
				textfield.style.position = "absolute";
				textfield.style.top = (itemY - 20) + "px";
				textfield.style.left = itemX+"px";
				
				handle.setAttribute('class', 'handle');
				handle.innerHTML = '&nbsp;';
				textarea.setAttribute('placeholder', 'text');
				textarea.setAttribute('id', 'textArea'+textfieldCounter);
				textarea.style.width = itemWidth + "px";
				textarea.style.height = itemHeight + "px";
				textarea.value = itemObject["extra"]["text"];
				
				workspace.insertBefore(textfield, null);
				document.getElementById('textField'+textfieldCounter).insertBefore(handle, null);
				document.getElementById('textField'+textfieldCounter).insertBefore(textarea, null);
				
				$('.textField').draggable({ handle: "p", cancel: "textarea", grid: [30,30] });
				$('#textArea'+textfieldCounter).resizable({ animate: true });
				
				elementsArray[elementsArray.length] = 'textArea';
				idArray[idArray.length] = textfieldCounter;
				textfieldCounter++;
			}
					
			//add a button
			else if (item == 'inputButton') {
				var button = document.createElement('div');
				var handle = document.createElement('p');
				var editTool = document.createElement('p');
				var btnButton = document.createElement('button');
				var popupButton = document.createElement('div');
				var input = document.createElement('input');
				var btnPopupButton = document.createElement('button');
				var input2 = document.createElement('select');
				
				button.setAttribute('class', 'inputButton');
				button.setAttribute('id', 'inputButton'+buttonCounter);
				button.style.position = "absolute";
				button.style.top = itemY + "px";
				button.style.left = itemX + "px";
				handle.setAttribute('class', 'handle');
				handle.innerHTML = '&nbsp;';
				editTool.setAttribute('class', 'editTool');
				editTool.setAttribute("onclick", "setVisibility('popupButton"+buttonCounter+"', 'block'); $('#colordiv').show();");
				editTool.innerHTML = '&nbsp;';
				btnButton.setAttribute('type', 'button');
				btnButton.setAttribute('id', 'button'+buttonCounter);
				btnButton.style.fontSize = itemObject["extra"]["fontsize"];
				btnButton.style.color = itemObject["extra"]["color"];
				btnButton.innerHTML = itemObject["extra"]["value"];
				btnButton.style.width = itemWidth + "px";
				btnButton.style.height = itemHeight + "px";
				popupButton.setAttribute('style', 'display: none');
				popupButton.setAttribute('id', 'popupButton'+buttonCounter);
				popupButton.setAttribute('class', 'popupButton');
				input.setAttribute('class', 'changetext');
				input.setAttribute('id', 'text'+buttonCounter);
				input.setAttribute('placeholder', 'submit');
				input.setAttribute('value', itemObject["extra"]["value"]);
				input2.setAttribute('class', 'changesize ');
				input2.setAttribute('id', 'size'+buttonCounter);
				input2.setAttribute('placeholder', 'submit');
				input2.setAttribute('value', itemObject["extra"]["fontsize"]);
				
	
			    var option = document.createElement("option");
			    option.text = "10";
			    option.value = "10" ;
			    input2.add(option, null);


			    var option = document.createElement("option");
			    option.text = "12";
			    option.value = "12" ;
			    input2.add(option, null);
			    								
			    var option = document.createElement("option");
			    option.text = "14";
			    option.value = "14" ;
			    input2.add(option, null);


			    var option = document.createElement("option");
			    option.text = "16";
			    option.value = "16" ;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "20";
			    option.value = "20" ;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "22";
			    option.value = "22" ;
				option.defaultSelected = true;
			    input2.add(option, null);

			    
			    var option = document.createElement("option");
			    option.text = "25";
			    option.value = "25" ;
				option.defaultSelected = true;
			    input2.add(option, null);
			    
			    var option = document.createElement("option");
			    option.text = "28";
			    option.value = "28" ;
			    input2.add(option, null);

					var option = document.createElement("option");
			    option.text = "30";
			    option.value = "30" ;
			    input2.add(option, null);

			    var option = document.createElement("option");
			    option.text = "32";
			    option.value = "32" ;
			    input2.add(option, null);
			   
											   
				btnPopupButton.setAttribute('class', 'change');
				btnPopupButton.setAttribute('type', 'button');
				btnPopupButton.setAttribute("onclick", "changeButton('popupButton"+buttonCounter+"', 'none', 'button"+buttonCounter+"', 'text"+buttonCounter+"', 'size"+buttonCounter+"' );"); 
				btnPopupButton.innerHTML = 'ok';
				
				workspace.insertBefore(button, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(handle, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(editTool, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(btnButton, null);
				document.getElementById('inputButton'+buttonCounter).insertBefore(popupButton, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(input, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(input2, null);
				document.getElementById('popupButton'+buttonCounter).insertBefore(btnPopupButton, null);
				
				$('.inputButton').draggable({ handle: "p", cancel: "button", grid: [30,30] });
				$('#button'+buttonCounter).resizable ({ animate: true });
				
				elementsArray[elementsArray.length] = 'inputButton';
				idArray[idArray.length] = buttonCounter;
				buttonCounter++;
			}
			
			//image mockup 
			else if (item == 'image') {
	           	var imageSpan = document.createElement('span');
	            var image = document.createElement('img');
	            image.setAttribute('id', 'image'+imageCounter);
	            image.setAttribute('class', 'images');
	            image.setAttribute('src', './images/elements/imageStyle.png');
	            image.setAttribute('title', 'image');
	            image.style.position = "absolute";
	            image.style.top = itemY + "px";
	            image.style.left = itemX + "px";
	            image.style.width = itemWidth + "px";
	            imageSpan.style.width = itemWidth + "px";
	            image.style.height = itemHeight + "px";
	            imageSpan.style.height = itemHeight + "px";
	            imageSpan.setAttribute('id', 'imageSpan'+imageCounter);
	            imageSpan.insertBefore(image, null);
	            workspace.insertBefore(imageSpan, null);
	            $('#image'+imageCounter).resizable({  });
	            $('#imageSpan'+imageCounter).draggable({ grid: [30,30] });
	            elementsArray[elementsArray.length] = 'image';
				idArray[idArray.length] = imageCounter;
	            imageCounter++;	
			}                        
             
            //video control mockup           
   			else if (item == 'video') {
                var videoSpan = document.createElement('span');
                var video = document.createElement('img');
                video.setAttribute('id', 'video'+videoCounter);
                video.setAttribute('class', 'videos');
	            video.setAttribute('src', './images/elements/videoStyle.png');
	            video.setAttribute('title', 'video');
                video.style.position = "absolute";
	            video.style.top = itemY + "px";
	            video.style.left = itemX + "px";
	            video.style.width = itemWidth + "px";
	            videoSpan.style.width = itemWidth + "px";
	            videoSpan.style.height = itemHeight + "px";
	            video.style.height = itemHeight + "px";
	            videoSpan.setAttribute('id', 'videoSpan'+videoCounter);
	            videoSpan.insertBefore(video, null);
                workspace.insertBefore(videoSpan, null);
                $('#video'+videoCounter).resizable();
                $('#videoSpan'+videoCounter).draggable({ grid: [30,30] });
                elementsArray[elementsArray.length] = 'video';
                idArray[idArray.length] = videoCounter;
                videoCounter++;	
			}                           
  			
  			//chart mockup
     		if (item == 'chart') {
                var chartSpan = document.createElement('span');
                var chart = document.createElement('img');
                chart.setAttribute('id', 'chart'+chartCounter);
                chart.setAttribute('class', 'charts');
	            chart.setAttribute('src', './images/elements/chartStyle.png');
	            chart.setAttribute('title', 'chart');
                chartSpan.setAttribute('id', 'chartSpan'+chartCounter);
                chart.style.position = "absolute";
	            chart.style.top = itemY + "px";
	            chart.style.left = itemX + "px";
	            chart.style.width = itemWidth + "px";
	            chart.style.height = itemHeight + "px";
				chartSpan.style.width = itemWidth + "px";
	            chartSpan.style.height = itemHeight + "px";
	            chartSpan.insertBefore(chart, null);
                workspace.insertBefore(chartSpan, null);
                $('#chart'+chartCounter).resizable({  });
                $('#chartSpan'+chartCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'chart';
				idArray[idArray.length] = chartCounter;
                chartCounter++;	
			}  
			
			//google maps mockup
			if (item == 'gmap') {
				var deleteHandle = document.createElement('p');
     			var gmapSpan = document.createElement('span');
                var gmap = document.createElement('img');
                gmap.setAttribute('id', 'gmap'+gmapCounter);
                gmap.setAttribute('class', 'gmaps');
	            gmap.setAttribute('src', './images/elements/gmapStyle.png');
	            gmap.setAttribute('title', 'gmap');
                gmapSpan.setAttribute('id', 'gmapSpan'+gmapCounter);
               	gmap.style.position = "absolute";
	            gmap.style.top = itemY + "px";
	            gmap.style.left = itemX + "px";
	            gmap.style.width = itemWidth + "px";
	            gmap.style.height = itemHeight + "px";
				gmapSpan.style.width = itemWidth + "px";
	            gmapSpan.style.height = itemHeight + "px";
                    
				deleteHandle.setAttribute('class', 'deleteHandle');
				deleteHandle.setAttribute("onclick", "Delete('gmapSpan"+gmapCounter+"');");
				deleteHandle.innerHTML = '&nbsp;';   
				
				gmapSpan.insertBefore(deleteHandle, null);
	            gmapSpan.insertBefore(gmap, null);
                workspace.insertBefore(gmapSpan, null);
                $('#gmap'+gmapCounter).resizable({  });
                $('#gmapSpan'+gmapCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'gmap';
				idArray[idArray.length] = gmapCounter;
                gmapCounter++;		
			}	
			
			//dropdown mockup
     		if (item == 'dropdown') {
                var deleteHandle = document.createElement('p');
     			var dropdownSpan = document.createElement('span');
                var dropdown = document.createElement('img');
                dropdown.setAttribute('id', 'dropdown'+dropdownCounter);
                dropdown.setAttribute('class', 'dropdowns');
	            dropdown.setAttribute('src', './images/elements/dropdownStyle.png');
	            dropdown.setAttribute('title', 'dropdown');
                dropdownSpan.setAttribute('id', 'dropdownSpan'+dropdownCounter);
               	dropdown.style.position = "absolute";
	            dropdown.style.top = itemY + "px";
	            dropdown.style.left = itemX + "px";
	            dropdown.style.width = itemWidth + "px";
	            dropdown.style.height = itemHeight + "px";
				dropdownSpan.style.width = itemWidth + "px";
	            dropdownSpan.style.height = itemHeight + "px";
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('dropdownSpan"+dropdownCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                dropdownSpan.insertBefore(deleteHandle, null);
	            dropdownSpan.insertBefore(dropdown, null);
                workspace.insertBefore(dropdownSpan, null);
                $('#dropdown'+dropdownCounter).resizable({  });
                $('#dropdownSpan'+dropdownCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'dropdown';
				idArray[idArray.length] = dropdownCounter;
                dropdownCounter++;	
     		}  
 
  			//checkbox mockup
     		if (item == 'checkbox') {
                var deleteHandle = document.createElement('p');
     			var checkboxSpan = document.createElement('span');
                var checkbox = document.createElement('img');
                checkbox.setAttribute('id', 'checkbox'+checkboxCounter);
                checkbox.setAttribute('class', 'checkboxs');
	            checkbox.setAttribute('src', './images/elements/checkboxStyle.png');
	            checkbox.setAttribute('title', 'checkbox');
                checkboxSpan.setAttribute('id', 'checkboxSpan'+checkboxCounter);
               	checkbox.style.position = "absolute";
	            checkbox.style.top = itemY + "px";
	            checkbox.style.left = itemX + "px";
	            checkbox.style.width = itemWidth + "px";
	            checkbox.style.height = itemHeight + "px";
				checkboxSpan.style.width = itemWidth + "px";
	            checkboxSpan.style.height = itemHeight + "px";
                    
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('checkboxSpan"+checkboxCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                checkboxSpan.insertBefore(deleteHandle, null);
	            checkboxSpan.insertBefore(checkbox, null);
                workspace.insertBefore(checkboxSpan, null);
                $('#checkbox'+checkboxCounter).resizable({  });
                $('#checkboxSpan'+checkboxCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'checkbox';
				idArray[idArray.length] = checkboxCounter;
                checkboxCounter++;	
     		}          
                        
  			//radiobutton mockup
     		if (item == 'radiobutton') {
                var deleteHandle = document.createElement('p');
     			var radiobuttonSpan = document.createElement('span');
                var radiobutton = document.createElement('img');
                radiobutton.setAttribute('id', 'radiobutton'+radiobuttonCounter);
                radiobutton.setAttribute('class', 'radiobuttons');
	            radiobutton.setAttribute('src', './images/elements/radiobuttonStyle.png');
	            radiobutton.setAttribute('title', 'radiobutton');
                radiobuttonSpan.setAttribute('id', 'radiobuttonSpan'+radiobuttonCounter);
                radiobutton.style.position = "absolute";
	            radiobutton.style.top = itemY + "px";
	            radiobutton.style.left = itemX + "px";
	            radiobutton.style.width = itemWidth + "px";
	            radiobutton.style.height = itemHeight + "px";
				radiobuttonSpan.style.width = itemWidth + "px";
	            radiobuttonSpan.style.height = itemHeight + "px";
                    
                deleteHandle.setAttribute('class', 'deleteHandle');
                deleteHandle.setAttribute("onclick", "Delete('radiobuttonSpan"+radiobuttonCounter+"');");
                deleteHandle.innerHTML = '&nbsp;';   
                    
                radiobuttonSpan.insertBefore(deleteHandle, null);
	            radiobuttonSpan.insertBefore(radiobutton, null);
                workspace.insertBefore(radiobuttonSpan, null);
                $('#radiobutton'+radiobuttonCounter).resizable({  });
                $('#radiobuttonSpan'+radiobuttonCounter).draggable({ grid: [30,30] });
				elementsArray[elementsArray.length] = 'radiobutton';
				idArray[idArray.length] = radiobuttonCounter;
                radiobuttonCounter++;	
     		} 				
		}