importScripts('js/sw-utils.js')

const CACHE_STATIC = "static-v1";
const CACHE_DYNAMIC = "dynamic-v2";
const CACHE_INMUTABLE = "inmutable-v1";

const APP_SHELL = [
    //'/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    '/img/avatars/hulk.jpg',
    '/img/avatars/ironman.jpg',
    '/img/avatars/spiderman.jpg',
    '/img/avatars/thor.jpg',
    '/img/avatars/wolverine.jpg',
    '/js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
	'https://fonts.googleapis.com/css?family=Lato:400,300',
	'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    '/css/animate.css',
    '/js/libs/jquery.js'
];

self.addEventListener('install', e=> {

    const pCacheStatic = caches.open(CACHE_STATIC).then(cache => {
        cache.addAll(APP_SHELL);
    });

    const pCacheInmutable = caches.open(CACHE_INMUTABLE).then(cache => {
        cache.addAll(APP_SHELL_INMUTABLE);
    });

    e.waitUntil(Promise.all([pCacheStatic,pCacheInmutable]));
});

self.addEventListener('activate', e=> {

    const pBorrado = caches.keys().then ( keys => {

        keys.forEach(key => {

            if((key!==CACHE_STATIC) && (key.includes('static'))) {
                return caches.delete(key);
            }
            if((key!==CACHE_DYNAMIC) && (key.includes('dynamic'))) {
                return caches.delete(key);
            }

        });

    })

    e.waitUntil(pBorrado);

});

self.addEventListener('fetch', e => {

    const pResp = caches.match(e.request).then(resp => {

        if(resp) {
            return resp;
        } else {
            console.log(e.request.url);
            return fetch(e.request).then(newResp => {
                return actualizarCacheDinamico(CACHE_DYNAMIC,e.request,newResp);
            });
        }

    })

    e.respondWith(pResp);
});