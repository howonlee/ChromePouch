
var lastTabId = -1;
var lastTabUrl = "";
window.state = "save";
var hasRunSave = {};
var hasRunLoad = {};
window.pouch = Pouch("temp");
window.data = {};
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

function processUrl(url){
	url = url.replace(/.*?:\/\//g, "");
	url = url.replace(/\//g, "");
	return url;
}

function sendSaveMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = processUrl(tabs[0].url);
		var port = chrome.tabs.connect(lastTabId, {name: "page"});
		console.log(port);
		port.postMessage({command: "getcheckbox", name: "_"});
	});
}

function sendLoadMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		lastTabUrl = processUrl(tabs[0].url);
		console.log("attempting to access pouch:");
		console.log(lastTabUrl);
		window.pouch.get(lastTabUrl, function(err, doc){
			var port = chrome.tabs.connect(lastTabId, {name: "page"});
			console.log(port);
			if (window.data[lastTabUrl]){
				port.postMessage({command: "setcheckbox", data: window.data[lastTabUrl]});
			} else if (doc){
				port.postMessage({command: "setcheckbox", data: doc.msg});
			} else {
				alert("We haven't saved that one!");
			}
		});
	});
}

function save(url){
	if (!hasRunSave[url]){
		hasRunSave[url] = true;
		console.log("we will run the save script again");
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
		hasRunLoad[url] = true;
		console.log("we will run the load script again");
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

function replTo(to){
	Pouch.replicate("temp", to, function(err, changes){
		if (typeof err !== "undefined"){
			console.log(err);
		}
	});
};

function replFrom(from){
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

function saveButtonCallback(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var url = tabs[0].url;
		save(url);
		setStateLoad();
	})
}

function loadButtonCallback(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		var url = tabs[0].url;
		load(url);
		setStateSave();
	})
}

chrome[runtimeOrExtension].onConnect.addListener(function(port){
	console.assert(port.name == "page");
	console.log("got message from content.js");
	port.onMessage.addListener(function(request){
		console.log("event got a message");
		console.log(request);
		if (request.type === "content"){
			console.log("event.js gets a message from content.js:");
			lastTabUrl = processUrl(lastTabUrl);
			window.data[lastTabUrl] = request;
			window.pouch.put({_id: lastTabUrl, msg: request});
		}
	});
});
