//content script, this one interfaces with the page, as opposed to Pouch
//
//content scripts are run in an isolated environment, 
//so we can fool around however we want with globals and such

var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

var contentport = chrome[runtimeOrExtension].connect({name: "page"});
console.log(contentport);
chrome[runtimeOrExtension].onConnect.addListener(function(port){
	port.onMessage.addListener(function(message){
		console.log("message received at content.js:");
		console.log(message);
		var command = message.command;
		switch (command){
			case 'getcheckbox':
				var name = message.name || '_';
				var checkboxes = $(':checkbox');
				var arr = $.makeArray(checkboxes);
				var vals = $.map(arr, function(elem, index){
					return elem.checked;
				});
				responseMessage = {	name: name, vals: vals, type: "content" };
				console.log("gonna post message now");
				contentport.postMessage(responseMessage);
				console.log("posted message now");
				break;
			case 'setcheckbox':
				var name = message.name || '_';
				var checkboxes = $(':checkbox');
				var data = message.data;
				var arr = $.makeArray(checkboxes);
				var vals = message.data.vals;
				for (var i = 0; i < arr.length; i++){
					arr[i].checked = data.vals[i];
				}
				responseMessage = {	name: name, vals: vals };
				console.log("gonna post message now");
				contentport.postMessage(responseMessage);
				console.log("posted message now");
				break;
			default:
				break;
		}
	});
});
