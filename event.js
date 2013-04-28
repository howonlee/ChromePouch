
var lastTabId = -1;
function sendMessage(){
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		lastTabId = tabs[0].id;
		chrome.tabs.sendMessage(lastTabId, {command: "checkbox", name: "walla"});
	});
}

chrome.browserAction.onClicked.addListener(function(){
	console.log("browseraction clicked");
	chrome.tabs.executeScript(null, {
		file: "./jquery-1.9.1.min.js"
	}, function(){
		chrome.tabs.executeScript(null, {file: "./content.js"}, function(){
			sendMessage();
		});
	});
	var iframe = document.getElementById('ourFrame');
	var message = {	command: 'save', context: {thing: 'world'}};
	iframe.contentWindow.postMessage(message, '*')
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	console.log("got back from content script");
	console.log(message);
});

window.addEventListener('message', function(event){
	console.log("eventlistener popped");
	console.log(event);
	if (event.data.type === "sandbox"){
		var notification = webkitNotifications.createNotification(
			'icon.png',
			'Templated!',
			event.data.html
			);
		notification.show();
	} else {
		console.log(event.data);
	}
});
