
var lastTabId = -1;
var lastTabUrl = "";
var state = "save";
var hasRunSave = {};
var hasRunLoad = {};
window.pouch = Pouch("temp");
window.data = {};

function sendSaveMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = tabs[0].url;
		chrome.tabs.sendMessage(lastTabId, {command: "getcheckbox", name: "walla"});
	});
}

function sendLoadMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = tabs[0].url;
		window.pouch.get(lastTabUrl, function(err, doc){
			if (typeof err === "undefined"){
				chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: doc});
			} else if (window.data[lastTabUrl]){
				chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: window.data[lastTabUrl]});
			} else {
				alert("We haven't saved that one!");
			}
		});
	});
}

function save(url){
	console.log("save browseraction clicked");
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
	console.log("load browseraction clicked");
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
	console.log("all teh datas");
	console.log(window.data);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		var url = tabs[0].url;
		if (state === "save"){
			save(url);
			state = "load";
		} else if (state === "load") {
			load(url);
			state = "save";
		}
	});
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log("got back from content script");
	console.log(message);
	if (message.type === "content"){
		console.log("url:");
		console.log(lastTabUrl);
		window.data[lastTabUrl] = message;
		window.pouch.put({_id: lastTabUrl, msg: message});
	}
});
