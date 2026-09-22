const CACHE_NAAM =
    "volleybal-kassa-v5";


const BESTANDEN = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icon.svg"
];


self.addEventListener(
    "install",
    event => {

        self.skipWaiting();

        event.waitUntil(
            caches
                .open(CACHE_NAAM)
                .then(cache => {
                    return cache.addAll(BESTANDEN);
                })
        );
    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(
            caches
                .keys()
                .then(cacheNamen => {
                    return Promise.all(
                        cacheNamen
                            .filter(
                                naam => naam !== CACHE_NAAM
                            )
                            .map(
                                naam => caches.delete(naam)
                            )
                    );
                })
                .then(() => self.clients.claim())
        );
    }
);


self.addEventListener(
    "fetch",
    event => {

        if (event.request.method !== "GET") {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .then(response => {

                    const kopie = response.clone();

                    caches
                        .open(CACHE_NAAM)
                        .then(cache => {
                            cache.put(
                                event.request,
                                kopie
                            );
                        });

                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    }
);
