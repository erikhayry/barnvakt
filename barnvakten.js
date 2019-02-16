console.log('barnvakt')
const VERSION = '1.0.0';
const SEARCH_KEY = 'barnvaktIndex';

//Sentry.init({
//    dsn: 'https://119e710167b34a6a877b58ad0610f6f7@sentry.io/1381535'
//});
//Sentry.configureScope((scope) => {
//    scope.setTag("version", VERSION);
//});

let queue = [];

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request)
        const nextUrl = request.nextUrl;
        const nextIndex = request.nextIndex;
        start(nextUrl, nextIndex);
        sendResponse({done: true});
    });



function getIndexFromUrl(name){
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return parseInt(decodeURIComponent(results[2].replace(/\+/g, ' ')));
}

function playVideo(currentIndex){
    console.log('play', currentIndex)
    const videoEl = document.querySelector('video');
    const svtPlayBtn = document.querySelectorAll('.svp_js-splash--btn-play')[0];

    if(videoEl){
        console.log(videoEl, svtPlayBtn)
        if(svtPlayBtn){
            svtPlayBtn.click()
            console.log('click');
        } else {
            videoEl.play();
        }

        videoEl.currentTime = videoEl.duration - 15;
        videoEl.play();

        videoEl.addEventListener("timeupdate", () => {
            console.log('timeupdate');
            if(videoEl.duration - videoEl.currentTime < 10){
                //videoEl.pause();
                getNextUrl(currentIndex + 1);
            }
        }, true);
    }
}

function start(nextUrl, nextIndex){
    if(nextUrl){
        const nextUrlObject = new URL(nextUrl);
        const nextUrlAsString = nextUrlObject.toString();
        const separator = nextUrlObject.search ? '&' : '?';
        console.log('nextUrl', nextUrlAsString);

        location.href = `${nextUrlAsString}${separator}${SEARCH_KEY}=${nextIndex}`;
    } else {
        console.log('done')
    }
}

function getNextUrl(nextIndex){
    console.log(queue, nextIndex);

    chrome.runtime.sendMessage({index: nextIndex}, function(response) {
        console.log(response)
    });
}

setTimeout(function(){
    const index = getIndexFromUrl(SEARCH_KEY);

    if(typeof index === 'number'){
        playVideo(index);
    }
}, 4000);