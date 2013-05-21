$(document).ready(function(){
  var bg = chrome.extension.getBackgroundPage();

  function save_url(){
    localStorage["chrome_pouch_remote_url"] = $("#replto").val();
    localStorage["chrome_pouch_local_url"] = $("#replfrom").val();
    var stat = $("#status");
    stat.html("Url saved");
    setTimeout(function(){
      stat.html("");
    }, 1000);
  }

  function restore_url(){
    var remoteurl = localStorage["chrome_pouch_remote_url"];
    var localurl = localStorage["chrome_pouch_local_url"];
    if (!remoteurl){
      remoteurl = "";
    }
    if (!localurl){
      localurl = "";
    }
    var remote = $("#replto");
    remote.val(remoteurl);
    var local = $("#replfrom");
    local.val(localurl);
  }

  function replTo(){
    save_url();
    var text = $("#replto").val();
    console.log(text);
    bg.replTo(text);
  }

  function replFrom(){
    save_url();
    var text = $("#replfrom").val();
    console.log(text);
    bg.replFrom(text);
  }

  restore_url();
  $("#repltobutton").click(replTo);
  $("#replfrombutton").click(replFrom);
  $("#savebutton").click(bg.saveButtonCallback);
  $("#loadbutton").click(bg.loadButtonCallback);
});

