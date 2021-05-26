const LINK_CHOICE = "link-choice";

const LINK_REMOVE = "link-remove";

const LINK_SAVE = "link-save"
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: CONTEXT_MENU_ID,
//     title: "Search: %s", 
//     contexts:["selection"] 
    
//   })
// });
chrome.runtime.onInstalled.addListener(function() {
  var contexts = ["page","selection","link","editable"];
  var title = LINK_CHOICE;
  chrome.contextMenus.create({
    "title": title,
    "contexts": contexts,
    "id": LINK_CHOICE
  });
  // ...
});

chrome.runtime.onInstalled.addListener(function() {
  var contexts = ["page","selection","link","editable"];
  chrome.contextMenus.create({
    "id": LINK_REMOVE,
    "title": LINK_REMOVE,
    "contexts": contexts
    
  });
  // ...
});

chrome.runtime.onInstalled.addListener(function() {
  var contexts = ["page","selection","link","editable"];
  chrome.contextMenus.create({
    "id": LINK_SAVE,
    "title": LINK_SAVE,
    "contexts": contexts
    
  });
  // ...
});

var textFile = null;
function makeTextFile(text) {
  var data = new Blob([text], {type: 'text/plain'});

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);

  return textFile;
}


chrome.contextMenus.onClicked.addListener(function(info, tab) {
  
  if (info.menuItemId == LINK_CHOICE) {
    console.log("Word " + info.selectionText + " was clicked.");
    var text = localStorage.getItem('myText');
    if (text == undefined) {
      text = ""
    }
    var res = text.concat("\n", info.selectionText);
    localStorage.setItem('myText', res);
    // chrome.tabs.create({  
    //   url: "http://www.google.com/search?q=" + localStorage.getItem('myText')
    // });
  } 
  
  if (info.menuItemId == LINK_REMOVE) {
    if (confirm("Do you want to remove link?")) {
      localStorage.setItem('myText', "");
    } else {
      return
    }
  }

  if (info.menuItemId == LINK_SAVE) {
    var text = localStorage.getItem('myText');
    if (text == undefined) {
      text = ""
    }

    var file = new Blob([text], {type: "text/plain"});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        a.download = date+"_"+time;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
  }
  
})