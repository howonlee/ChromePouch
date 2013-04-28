
chrome.browserAction.onClicked.addListener(function(){
	console.log("browseraction clicked");
	chrome.tabs.executeScript(null, {
		file: "./jquery-1.9.1.min.js"
	});
	chrome.tabs.executeScript(null, {file: "./content.js"});
	var iframe = document.getElementById('ourFrame');
	var message = {
		command: 'save',
		context: {thing: 'world'}
	};
	iframe.contentWindow.postMessage(message, '*')
});

window.addEventListener('message', function(event){
	console.log("eventlistener popped");
	console.log(event);
	if (event.data.html){
		var notification = webkitNotifications.createNotification(
			'icon.png',
			'Templated!',
			event.data.html
			);
		notification.show();
	}
});
