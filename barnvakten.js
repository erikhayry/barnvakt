console.log('barnvakt')
const VERSION = '1.0.0';
const SEARCH_KEY = 'barnvaktIndex';

//Sentry.init({
//    dsn: 'https://119e710167b34a6a877b58ad0610f6f7@sentry.io/1381535'
//});
//Sentry.configureScope((scope) => {
//    scope.setTag("version", VERSION);
//});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        const { message } = request;
        if(message === 'start'){
            chrome.storage.sync.set({
                isRunning: true
            }, function() {
                getPlaylist().then((playlist) => {
                    const nextUrl = buildUrl(playlist, 0);
                    goToNext(nextUrl);
                });
            });
        }
    }
);
function getIndexFromUrl(name){
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return parseInt(decodeURIComponent(results[2].replace(/\+/g, ' ')));
}

function playVideo(nextUrl){
    console.log('play', nextUrl)
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

        //only debug
        try{
            console.log(videoEl.currentTime, videoEl.duration - 15);
            videoEl.currentTime = videoEl.duration - 15;
            videoEl.play();
        } catch{
            console.log('Unable to play')
            goToNext(nextUrl);
        }

        videoEl.addEventListener("timeupdate", () => {
            if(videoEl.duration - videoEl.currentTime < 10){
                console.log('timeupdate');
                videoEl.pause();
                goToNext(nextUrl);
            }
        }, true);
    } else {
        console.log('no video');
        goToNext(nextUrl);
    }
}


function goToNext(nextUrl){
    if(nextUrl){
        location.href = nextUrl;
    } else {
        console.log('done')
        stop();
    }
}

function getPlaylist(){
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get('playlist', function(result) {
            const { playlist = [] } = result;
            resolve(playlist)
        });
    });
}

function isRunning() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get('isRunning', function(result) {
            const { isRunning } = result;
            if(isRunning){
                resolve()
            } else {
                reject()
            }
        });
    });
}

function buildUrl(playlist = [], index = 0){
    const url = playlist[index];
    if(url){
        const urlObject = new URL(url);
        const urlAsString = urlObject.toString();
        const separator = urlObject.search ? '&' : '?';

        return `${urlAsString}${separator}${SEARCH_KEY}=${index}`;
    } else {
        return undefined
    }
}

function stop(){
    chrome.storage.sync.set({
        isRunning: false
    }, function(){
        console.log('stoppped')
    })
}


setTimeout(function(){
    const index = getIndexFromUrl(SEARCH_KEY);

    if(typeof index === 'number'){
        isRunning().then(() =>{
            console.log('send req to bg', index);
            getPlaylist().then((playlist) => {
                const nextUrl = buildUrl(playlist, index + 1);
                playVideo(nextUrl);
            });
        }).catch(() => {
            console.log('not started')
        })
    } else {
        stop()
    }
}, 4000);