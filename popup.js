$(document).ready(function(){
	var bg = chrome.extension.getBackgroundPage();
	function replTo(){
		var text = $("replto").val();
		bg.replTo(text);
	}

	function replFrom(){
		var text = $("replfrom").val();
		bg.replFrom(text);
	}

	$("#repltobutton").click(replTo);
	$("#replfrombutton").click(replFrom);
	$("#savebutton").click(bg.saveButtonCallback);
	$("#loadbutton").click(bg.loadButtonCallback);
});

