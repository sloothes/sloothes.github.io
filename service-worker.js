
self.version = 3.0;
var debugMode = true;

self.importScripts(
    "/js/Objectid.js",
    "/js/zangodb.min.js",
    "/js/AW3D.db.js",
);


async function install(){

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

    db.drop();
    debugMode && console.log(`Database ${db.name} (v${db.version}) dropped.`);

//  await install();

//  await activate();

});

self.addEventListener("activate", async function(e){

    self.clients.claim();

});














