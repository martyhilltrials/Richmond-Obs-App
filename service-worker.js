const CACHE='richmond-scoring-300-riders-v2';
const ASSETS=['./','./richmond-logo.jpg','./index.html','./manifest.webmanifest','./icon-192.png?v=20260921-richmond-v1','./icon-512.png?v=20260921-richmond-v1','./icon-maskable-192.png?v=20260921-richmond-v1','./icon-maskable-512.png?v=20260921-richmond-v1','./apple-touch-icon.png?v=20260921-richmond-v1'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim());});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(event.request);
   if(response.ok)await cache.put(event.request,response.clone());
   return response;
  }catch(error){
   const cached=await cache.match(event.request);
   if(cached)return cached;
   if(event.request.mode==='navigate')return await cache.match('./index.html');
   throw error;
  }
 })());
});
