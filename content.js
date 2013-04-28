//content script, this one interfaces with the page, as opposed to Pouch
//
//content scripts are run in an isolated environment, 
//so we can fool around however we want with globals and such

console.log("begin content script");
var checkboxes = $(':checkbox');
console.log("length");
console.log(checkboxes.length);
var arr = $.makeArray(checkboxes);
console.log(arr);
