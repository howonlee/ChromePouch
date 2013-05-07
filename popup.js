$(document).ready(function(){
	var bg = chrome.extension.getBackgroundPage();
	function replTo(){
		console.log("pressed replto button");
		var text = document.getElementById("replto").value;
		console.log(text);
		bg.replTo(text);
	}

	function replFrom(){
		console.log("pressed replfrom button");
		var text = document.getElementById("replfrom").value;
		console.log(text);
		bg.replFrom(text);
		bg.setStateLoad();
	}

	function saveButton(){
		console.log("begin saving");
		bg.saveButtonCallback();
	}

	function loadButton(){
		console.log("begin loading");
		bg.loadButtonCallback();
	}
	$("#repltobutton").click(replTo);
	$("#replfrombutton").click(replFrom);
	$("#savebutton").click(saveButton);
	$("#loadbutton").click(loadButton);
});

