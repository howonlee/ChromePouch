
var lastTabId = -1;
var state = "save";
var data = {};
function sendSaveMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, {command: "getcheckbox", name: "walla"});
	});
}

function sendLoadMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, {command: "setcheckbox", data: data});
	});
}

function save(){
	console.log("save browseraction clicked");
	chrome.tabs.executeScript(null, {
		file: "./jquery-1.9.1.min.js"
	}, function(){
		chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
			sendSaveMessage();
		});
	});
}

function load(){
	console.log("load browseraction clicked");
	chrome.tabs.executeScript(null, {
		file: "./jquery-1.9.1.min.js"
	}, function(){
		chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
			sendLoadMessage();
		});
	});
}

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
	if (message.type === "content"){
		var iframe = document.getElementById('ourFrame');
		data = message;
		var toSave = {	command: 'save', context: message};
		iframe.contentWindow.postMessage(toSave, '*');
	}
});

window.addEventListener('message', function(event){
	console.log("eventlistener popped");
	console.log(event);
	if (event.data.type === "sandbox"){
		var notification = webkitNotifications.createNotification(
			'icon.png',
			'Saved!',
			event.data.html
			);
		notification.show();
	} else {
		console.log(event.data);
	}
});
