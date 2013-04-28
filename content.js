//content script, this one interfaces with the page, as opposed to Pouch
//
//content scripts are run in an isolated environment, 
//so we can fool around however we want with globals and such

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){	
	console.log("message listener in content script popped");
	console.log(message);
	var command = message.command;
	var name = message.name || 'hello';
	switch (command){
		case 'checkbox':
			console.log("command checkbox popped");
			var checkboxes = $(':checkbox');
			console.log("length");
			console.log(checkboxes.length);
			var arr = $.makeArray(checkboxes);
			var vals = $.map(arr, function(elem, index){
				return elem.checked;
			});
			console.log(vals);
			responseMessage = {	name: name, vals: vals,type: "content" };
			chrome.runtime.sendMessage(responseMessage, function(resp){});
			break;
		default:
			break;
	}
});
