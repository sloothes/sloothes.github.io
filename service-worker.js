
self.version = 3.0;
var debugMode = true;

self.importScripts(
    "/js/Objectid.js",
    "/js/zangodb.min.js",
);


async function install(){

    var cache = await caches.open("collections").then(function(cache){return cache;});

    await cache.addAll([
        "/AW3D_db/male.json",
        "/AW3D_db/female.json",
        "/AW3D_db/skeleton.json",
        "/AW3D_db/materials.json",
        "/AW3D_db/animations.json",
    ]);

    db = new zango.Db( "AW3D", {

        male:       false,
        female:     false,
        skeleton:   false,
        materials:  false,
        textures:   false,
        animations: false,

    });

    await db.open().then(function(){
        debugMode && console.log(`Database ${db.name} (v${db.version}) opened.`);
    });

    await db.drop().then(function(){
        debugMode && console.log(`Database ${db.name} (v${db.version}) dropped.`);
    });

    await self.importScripts("/js/AW3D.db.js");

    await cache.match("/AW3D_db/animations.json")
    .then(function(response){return response.json();}).then(function(json){return json;})
    .then(function(json){db.collection("animations").insert(json);});

    await cache.match("/AW3D_db/male.json")
    .then(function(response){return response.json();}).then(function(json){return json;})
    .then(function(json){db.collection("male").insert(json);});

    await cache.match("/AW3D_db/female.json")
    .then(function(response){return response.json();}).then(function(json){return json;})
    .then(function(json){db.collection("female").insert(json);});

    await cache.match("/AW3D_db/skeleton.json")
    .then(function(response){return response.json();}).then(function(json){return json;})
    .then(function(json){db.collection("skeleton").insert(json);});

    await cache.match("/AW3D_db/materials.json")
    .then(function(response){return response.json();}).then(function(json){return json;})
    .then(function(json){db.collection("materials").insert(json);});

}

function activate(){

    self.skipWaiting();

}

function getClinet(){

    self.clients.matchAll().then(function(clients){

        client = clients[0];

        console.log({"client": client});

    });

}

function unistall(){

    self.registration.unregister().then(function(){

        return self.clients.matchAll();

    }).then(function(clients) {

        clients.forEach(function(client){
            client.navigate(client.url);
            console.log(`service worker unistalled from client "${client.url}"`);
        });

    });

}

self.addEventListener("install", async function(e){

//  await install();

//  await activate();

});

self.addEventListener("activate", async function(e){

    self.clients.claim();

});














