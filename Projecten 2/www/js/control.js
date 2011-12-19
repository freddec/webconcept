if(window.addEventListener) {
window.addEventListener('load', function () {
	
	function handleDragStart(e) {
		this.style.borderColor = '#8c1a20';  // this / e.target is the source node.
	}
	
	var cols = document.querySelectorAll('#resizable .ui-widget-content');
	[].forEach.call(cols, function(col) {
	 	col.addEventListener('dragstart', handleDragStart, false);
	});

}, false); }