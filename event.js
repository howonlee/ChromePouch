
var lastTabId = -1;
var lastTabUrl = "";
window.state = "save";
var hasRunSave = {};
var hasRunLoad = {};
window.pouch = Pouch("temp");
window.data = {};

function processUrl(url){
	url = url.replace(/.*?:\/\//g, "");
	url = url.replace(/\//g, "");
	return url;
}

function sendSaveMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = processUrl(tabs[0].url);
		chrome.tabs.sendMessage(lastTabId, {command: "getcheckbox", name: "walla"});
	});
}

function sendLoadMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = processUrl(tabs[0].url);
		console.log("attempting to access pouch:");
		console.log(lastTabUrl);
		window.pouch.get(lastTabUrl, function(err, doc){
			if (doc){
				chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: doc.msg});
			} else if (window.data[lastTabUrl]){
				chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: window.data[lastTabUrl]});
			} else {
				alert("We haven't saved that one!");
			}
		});
	});
}

function save(url){
	if (!hasRunSave[url]){
		hasRunSave = true;
		chrome.tabs.executeScript(null, {
			file: "./jquery-1.9.1.min.js"
		}, function(){
			chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
				sendSaveMessage();
			});
		});
	} else {
		sendSaveMessage();
	}
}

function load(url){
	if (!hasRunLoad[url]){
		hasRunLoad = true;
		chrome.tabs.executeScript(null, {
			file: "./jquery-1.9.1.min.js"
		}, function(){
			chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
				sendLoadMessage();
			});
		});
	} else {
		sendLoadMessage();
	}
}

window.replTo = function(to){
	Pouch.replicate("temp", to, function(err, changes){
		if (typeof err !== "undefined"){
			console.log(err);
		}
	});
};

window.replFrom = function(from){
	Pouch.replicate(from, "temp", function(err, changes){
		if (typeof err !== "undefined"){
			console.log(err);
		}
	});
};

function setStateLoad(){
	window.state = "load";
	chrome.browserAction.setIcon({path: "./iconload.png"});
}

function setStateSave(){
	window.state = "save";
	chrome.browserAction.setIcon({path: "./iconsave.png"});
}

chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = tabs[0].url;
		if (window.state === "save"){
			save(url);
			setStateLoad();
		} else if (window.state === "load") {
			load(url);
			setStateSave();
		}
	});
});

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
chrome[runtimeOrExtension].onMessage.addListener(function(message, sender, sendResponse){
	if (message.type === "content"){
		lastTabUrl = processUrl(lastTabUrl);
		window.data[lastTabUrl] = message;
		window.pouch.put({_id: lastTabUrl, msg: message});
	}
});
