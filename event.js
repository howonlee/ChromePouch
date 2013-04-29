
var lastTabId = -1;
var state = "save";
var hasRunSave = false;
var hasRunLoad = false;
window.pouch = Pouch("temp");
window.data = {};

function sendSaveMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, {command: "getcheckbox", name: "walla"});
	});
}

function sendLoadMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: window.data});
	});
}

function save(){
	console.log("save browseraction clicked");
	if (!hasRunSave){
		chrome.tabs.executeScript(null, {
			file: "./jquery-1.9.1.min.js"
		}, function(){
			chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
				hasRunSave = true;
				sendSaveMessage();
			});
		});
	} else {
		sendSaveMessage();
	}
}

function load(){
	console.log("load browseraction clicked");
	if (!hasRunLoad){
		chrome.tabs.executeScript(null, {
			file: "./jquery-1.9.1.min.js"
		}, function(){
			chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
				hasRunLoad = true;
				sendLoadMessage();
			});
		});
	} else {
		sendLoadMessage();
	}
}

window.replTo = function(to){
	Pouch.replicate("temp", to, function(err, changes){
		console.log("errors in replicating to something");
		console.log(err);
	});
};

window.replFrom = function(from){
	Pouch.replicate(from, "temp", function(err, changes){
		console.log("errors in replicating from something");
		console.log(err);
	});
};

chrome.browserAction.onClicked.addListener(function(){
	if (state === "save"){
		save();
		state = "load";
	} else if (state === "load") {
		load();
		state = "save";
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log("got back from content script");
	console.log(message);
	window.data = message;
});
