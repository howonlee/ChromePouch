
chrome.browserAction.onClicked.addListener(function(){
	console.log("browseraction clicked");
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
			'command received'
			);
		notification.show();
	}
});
