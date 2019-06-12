    self.version = 1.0;
    var debugMode = true;

    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
        "/js/AW3D.db.js",
    );

    var skinned = {};

    skinned.male = [
        "/skinned/male/body.json",
        "/skinned/male/eyes.json",
        "/skinned/male/hairs.json",
        "/skinned/male/underwears.json",
        "/skinned/male/costume.json",
        "/skinned/male/trousers.json",
        "/skinned/male/shoes.json",
    ];

    skinned.female = [
        "/skinned/female/body.json",
        "/skinned/female/eyes.json",
        "/skinned/female/hairs.json",
        "/skinned/female/stockings.json",
        "/skinned/female/underwears.json",
        "/skinned/female/dress.json",
        "/skinned/female/costume.json",
        "/skinned/female/trousers.json",
        "/skinned/female/shoes.json",
    ];

    skinned.skeleton = [
        "/skinned/skeleton/bones.json",
        "/skinned/skeleton/skeleton.json",
    ];

    var animations = {};

    animations.basic = [
        "/animations/basic/idle.json",
        "/animations/basic/walk.json",
        "/animations/basic/run.json",
        "/animations/basic/jump.json",
    ];

    animations.male = [
        "/animations/male/idle.json",
        "/animations/male/walk.json",
        "/animations/male/run.json",
        "/animations/male/jump.json",
    ];

    animations.female = [
        "/animations/female/idle.json",
        "/animations/female/walk.json",
        "/animations/female/run.json",
        "/animations/female/jump.json",
    ];

    function installOutfits(options){

        caches.open(options.name).then(async function(cache){
            await cache.addAll( options.URLS );
        }).then(async function(){

            var collection = db.collection(options.name);
            await options.URLS.forEach(function(url){
                caches.match(url).then(function(response){
                    return response.json();
                }).then(function(json){
                //  "json._id" included.
                    collection.insert(json, function(err){
                        if (err) throw err;
                    });
                }).catch(function(err){
                    console.error(err);
                });
            });

        });
    }

    function installAnimations(options){

        caches.open(options.name).then(async function(cache){
            await cache.addAll( options.URLS );
        }).then(async function(){

            var doc = {_id:options._id};
            var collection = db.collection(options.name);
            for (var i=0; i < options.URLS.length; i++){
                await caches.match(options.URLS[i])
                .then(function(response){
                    return response.json();
                }).then(function(json){
                    doc[json.name] = json;
                });
            }

        //  debugMode && console.log({"doc":doc});
            collection.insert(doc, function(err){
                if (err) throw err;
            });

        }).catch(function(err){
            console.error(err);
        });

    }

    async function install(){

        await installOutfits({
            name:"male",
            URLS: skinned.male,
        });

        await installOutfits({
            name:"female",
            URLS: skinned.female,
        });

        await installOutfits({
            name:"skeleton",
            URLS: skinned.skeleton,
        });


        await installAnimations({
            _id:"basic",
            name:"animations",
            URLS:animations.basic,
        });

        await installAnimations({
            _id:"male",
            name:"animations",
            URLS:animations.male,
        });

        await installAnimations({
            _id:"female",
            name:"animations",
            URLS:animations.female,
        });

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

    install();

    self.addEventListener("install", async function(e){

        await install();

        self.skipWaiting();

    });















