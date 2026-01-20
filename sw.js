const VERSION = "v1";
const WORDLIST_VERSION = "v1";
const ROOT = "/meikamasiina";
const CACHE_NAME = `meikamasiina-${VERSION}`;
const RESOURCES = [
    `${ROOT}/`,
    `${ROOT}/index.html`,
    `${ROOT}/styles.css`,
    `${ROOT}/wordlist_${WORDLIST_VERSION}.json`,
    `${ROOT}/fonts/CourierPrime-Regular.ttf`,
    `${ROOT}/fonts/OFL.txt`,
    `${ROOT}/favicon.ico`,
    `${ROOT}/icon.png`,
    `${ROOT}/LICENSES.md`,
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(RESOURCES);
        })(),
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(
                names.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                    return undefined;
                })
            );
            await clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(e.request.url);
            if (cachedResponse) {
                return cachedResponse;
            }
            return new Response(null, { status: 404 });
        })(),
    )
});



