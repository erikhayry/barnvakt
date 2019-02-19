chrome.browserAction.onClicked.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.storage.sync.set({
            isRunning: true
        }, function() {
            chrome.tabs.sendMessage(tabs[0].id, {start: true}, function(response) {
                console.log('response?', response);
            });
        });
    });
});

function handleContentMessage(request, sender, sendResponse){
    console.log('onMessage', request);

    return true;
}

chrome.runtime.onMessage.addListener(handleContentMessage);