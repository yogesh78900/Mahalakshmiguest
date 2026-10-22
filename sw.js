const C = "gh-v1";
const FB = ["app", "auth", "firestore"].map(n => "https://www.gstatic.com/firebasejs/10.12.2/firebase-" + n + "-compat.js");
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(async c => {
    await c.addAll(["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"]);
    for (const u of FB) { try { await c.put(u, await fetch(new Request(u, { mode: "no-cors" }))); } catch (e) {} }
  }));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || !(u.origin === location.origin || u.hostname === "www.gstatic.com")) return;
  e.respondWith(fetch(r).then(res => {
    const copy = res.clone();
    caches.open(C).then(c => c.put(r, copy));
    return res;
  }).catch(() => caches.match(r, { ignoreSearch: true })));
});
