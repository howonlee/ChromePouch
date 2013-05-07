
var lastTabId = -1;
var lastTabUrl = "";
var hasRunSave = {};
var hasRunLoad = {};
window.pouch = Pouch("chromestore");
window.data = {};
window.ports = {};
var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

function processUrl(url){
  url = url.replace(/.*?:\/\//g, "");
  url = url.replace(/\//g, "");
  return url;
}

function getPort(lastTabUrl){
  if (!ports[lastTabUrl]){
    ports[lastTabUrl] = chrome.tabs.connect(lastTabId, {name: "page"});
  }
  return ports[lastTabUrl];
}

function doInCurrTab(callback){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    callback(tabs);
  });
}

function sendSaveMessage(){
  doInCurrTab(function(tabs){
    lastTabId = tabs[0].id;
    lastTabUrl = processUrl(tabs[0].url);
    getPort(lastTabUrl).postMessage({command: "getcheckbox", name: "_"});
  });
}

function sendLoadMessage(){
  doInCurrTab(function(tabs){
    lastTabId = tabs[0].id;
    lastTabUrl = processUrl(tabs[0].url);
    window.pouch.get(lastTabUrl, function(err, doc){
      if (window.data[lastTabUrl]){
        getPort(lastTabUrl).postMessage({command: "setcheckbox", data: window.data[lastTabUrl]});
      } else if (doc){
        getPort(lastTabUrl).postMessage({command: "setcheckbox", data: doc.msg});
      } else {
        alert("We haven't saved that one!");
      }
    });
  });
}

function save(url){
  if (!hasRunSave[url]){
    hasRunSave[url] = true;
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

function saveButtonCallback(){
  doInCurrTab(function(tabs){
    var url = tabs[0].url;
    save(url);
    chrome.browserAction.setIcon({path: "./iconsave.png"});
  })
}

function loadButtonCallback(){
  doInCurrTab(function(tabs){
    var url = tabs[0].url;
    load(url);
    chrome.browserAction.setIcon({path: "./iconload.png"});
  })
}

chrome[runtimeOrExtension].onConnect.addListener(function(port){
  port.onMessage.addListener(function(request){
    if (request.type === "content"){
      lastTabUrl = processUrl(lastTabUrl);
      window.data[lastTabUrl] = request;
      window.pouch.put({_id: lastTabUrl, msg: request});
    }
  });
});
