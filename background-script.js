//chrome.browserAction.onClicked.addListener(() => {
//    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//        chrome.storage.sync.get('playlist', function(result) {
//            console.log(result)
//            chrome.tabs.sendMessage(tabs[0].id, {nextUrl: result.playlist[0], nextIndex: 1}, function(response) {
//                console.log('response?', response);
//            });
//        });
//    });
//});


//chrome.runtime.onMessage.addListener(
//    function(request, sender, sendResponse) {
//        console.log("Message from the content script: " + request.index);
//        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//            //chrome.storage.sync.get('playlist', function(result) {
//                //console.log(result)
//                sendResponse('hejhej')
//                chrome.tabs.sendMessage(tabs[0].id, {nextUrl: [], nextIndex: 666}, function(response) {
//                    console.log('response?', response);
//                });
//            //});
//        });
//    });
const SEARCH_KEY = 'barnvaktIndex';


function getPlaylist(){
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get('playlist', function(result) {
            const { playlist = [] } = result;
            resolve(playlist)
        });
    });

}


function handleContentMessage(request, sender, sendResponse){
    console.log('onMessage', request);
    const { index: currentIndex } = request;

    getPlaylist(currentIndex).then((playlist) => {
        sendResponse(buildUrl(playlist, currentIndex + 1))
    });


    return true;
}

function buildUrl(playlist = [], index = 0){
    const url = playlist[index];
    if(url){
        const urlObject = new URL(url);
        const urlAsString = urlObject.toString();
        const separator = urlObject.search ? '&' : '?';

        return `${urlAsString}${separator}${SEARCH_KEY}=${index}`;
    } else {
        console.log('done')
    }
}

chrome.runtime.onMessage.addListener(handleContentMessage);