self.addEventListener("install", event => {
  console.log("Service Worker installato");
});

self.addEventListener("activate", event => {
  console.log("Service Worker attivo");
});
