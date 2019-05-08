const repository = 'pwa-cache-2'

self.addEventListener('install', (e) => {
  let cacheReady = caches.open(repository).then((cache) => {
    return cache.addAll([
      '/',
      'style.css',
      'thumb.png',
      'main.js'
    ])
  })

  e.waitUntil(cacheReady)
})

self.addEventListener('activate', (e) => {
  let cacheCleaned = caches.keys().then((keys) => {
    keys.forEach((key) => {
      if(key !== repository) caches.delete(key)
    })
  })

  e.waitUntil(cacheCleaned)
})

self.addEventListener('fetch', (e) => {

  // Skip for remote fetch
  if (e.request.url.match(location.origin)){ // = 도메인

    // Serve local fetch from cache
    let respond = caches.open(repository).then((cache) => {
      return cache.match(e.request).then((res) => {

        // Check request was found in cache
        if(res) {
          console.log('Serving from cache.' + res.url)
          
          return res;
        }

        // fetch로 request 가로채온거임. 따라서 캐쉬에 등록하지 않은 파일 있으면 오류나고 큰일남. 이건 뭐 유저는 고치지도 못함
        // 그래서 캐쉬에 등록되지 않은 파일을 위해서 오리지널 request를 다시 보내게끔 해줘야해.
        return fetch(e.request).then((fetchRes) => {
          console.log("didn't served by cache" + fetchRes.url)
          cache.put(e.request, fetchRes.clone())
        })
      })
    })

    e.respondWith(respond)
  }
})