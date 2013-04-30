var bg = chrome.extension.getBackgroundPage();

function replTo(){
	console.log("pressed replfrom button");
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

document.querySelector('#repltobutton').addEventListener('click', replTo);
document.querySelector('#replfrombutton').addEventListener('click', replFrom);


