
const VERSION = '1.0.0';
const SEARCH_KEY = 'barnvaktIndex';

Sentry.init({
    dsn: 'https://fec2d6f8d43a488286b76e2ecc469e99@sentry.io/1399736'
});
Sentry.configureScope((scope) => {
    scope.setTag("version", VERSION);
});

function onMessage(request){
    const { message } = request;
    if(message === 'start'){
        browser.storage.sync.set({
            isRunning: true
        }).then(() => {
            getPlaylist().then((playlist) => {
                const nextUrl = buildUrl(playlist, 0);
                goToNext(nextUrl);
            });
        });
    }
}

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
    const videoEl = document.querySelector('video');
    const svtPlayBtn = document.querySelectorAll('.svp_js-splash--btn-play')[0] || document.querySelectorAll('.bp_featured-episode__button')[0];

    if(videoEl || svtPlayBtn){
        if(svtPlayBtn){
            //TODO handle video loading
            svtPlayBtn.click()
        } else {
            videoEl.play();
        }

        //only debug
        try{
            videoEl.currentTime = videoEl.duration - 15;
            videoEl.play();
        } catch{
            goToNext(nextUrl);
        }

        videoEl.addEventListener('timeupdate', () => {
            if(videoEl.duration - videoEl.currentTime < 10){
                videoEl.pause();
                goToNext(nextUrl);
            }
        }, true);
    } else {
        goToNext(nextUrl);
    }
}


function goToNext(nextUrl){
    if(nextUrl){
        location.href = nextUrl;
    } else {
        stop();
    }
}

function getPlaylist(){
    return new Promise((resolve) => {
        browser.storage.sync.get('playlist')
            .then((result) => {
                const { playlist = [] } = result;
                resolve(playlist)
            });
    });
}

function isRunning() {
    return new Promise((resolve, reject) => {
        browser.storage.sync.get('isRunning')
            .then((result) => {
                console.log('isr', result);
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
    browser.storage.sync.set({
        isRunning: false
    }).then(() => {
        console.log('stopped')
    })
}

browser.runtime.onMessage.addListener(onMessage);

setTimeout(() => {
    const index = getIndexFromUrl(SEARCH_KEY);

    if(typeof index === 'number'){
        isRunning().then(() =>{
            getPlaylist().then((playlist) => {
                const nextUrl = buildUrl(playlist, index + 1);
                playVideo(nextUrl);
            });
        }).catch(() => {
            console.log('Barnvakt not running')
        })
    } else {
        stop()
    }
}, 4000);