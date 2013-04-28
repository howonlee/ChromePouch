//content script, this one interfaces with the page, as opposed to Pouch
//
//content scripts are run in an isolated environment, 
//so we can fool around however we want with globals and such

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){	
	console.log("message listener in content script popped");
	console.log(message);
	var command = message.command;
	switch (command){
		case 'getcheckbox':
			console.log("command getcheckbox popped");
			var name = message.name || 'hello';
			var checkboxes = $(':checkbox');
			var arr = $.makeArray(checkboxes);
			var vals = $.map(arr, function(elem, index){
				return elem.checked;
			});
			console.log(vals);
			responseMessage = {	name: name, vals: vals,type: "content" };
			chrome.runtime.sendMessage(responseMessage, function(resp){});
			break;
		case 'setcheckbox':
			console.log("command setcheckbox popped");
			var checkboxes = $(':checkbox');
			var data = message.data;
			var arr = $.makeArray(checkboxes);
			for (var i = 0; i < arr.length; i++){
				arr[i].checked = data.vals[i];
			}
			responseMessage = {	ok: true };
			chrome.runtime.sendMessage(responseMessage, function(resp){});
			break;
		default:
			break;
	}
});
