if(typeof browser !== 'undefined'){
    browser.browserAction.onClicked.addListener(() => {
        console.log('start')
    });
} else if(typeof chrome !== 'undefined'){
    chrome.browserAction.onClicked.addListener(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.storage.sync.get('playlist', function(result) {
                console.log(result)
                chrome.tabs.sendMessage(tabs[0].id, {nextUrl: result.playlist[0], nextIndex: 1}, function(response) {
                    console.log('response?', response);
                });
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("Message from the content script: " + request.index);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.storage.sync.get('playlist', function(result) {
                console.log(result)
                chrome.tabs.sendMessage(tabs[0].id, {nextUrl: result.playlist[request.index], nextIndex: request.index + 1}, function(response) {
                    console.log('response?', response);
                });
            });
        });
    });