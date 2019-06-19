
    self.version = 2.0;
    var debugMode = true;

    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
        "/js/AW3D.db.js",
    );

    async function installDB(url){

        var cache = await caches.open("databases")
        .then(async function(cache){ return cache; });

        await cache.add(url);

        var collections = await cache.match(url)
        .then(function(response){
            return response.json();
        }).then(function(json){
            return json;
        });

        debugMode && console.log({"collections":collections});

        for (var name in collections) {

            var collection = db.collection(name);
            await collection.insert(collections[name], function(err){
                if (err) throw err;
            }).catch(function(err){
                console.error(err);
            });

        }

        return;

    }

    async function install(){

        await installDB("/AW3D_db/dev_DB_v3.6.json");

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

        install();

        activate();

    });

    self.addEventListener("activate", async function(e){

        self.clients.claim();

    });














