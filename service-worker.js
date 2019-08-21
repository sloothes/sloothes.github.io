//  service-worker.js

    self.version = 3.5;
    var debugMode = true;

    self.importScripts(
        "/js/Objectid.js",
        "/js/zangodb.min.js",
        "/socketcluster.js",
        "/sc-codec-min-bin.js",
    );

    var socket = socketCluster.create({
        hostname: "anywhere3d.com",
        codecEngine: scCodecMinBin,
    });

    socket.on("connect", function(status){
        debugMode && console.log("[service-worker]:", {"status": status});
    });

    socket.on("error", function (err) {
        console.error( "[service-worker]:", err );
    });

    socket.on("authStateChange", function( state ){
        debugMode && console.log("[service-worker]:", {"authStateChange": state});
    });


    self.addEventListener("install", function(e){

        drop().then(install).then(activate);

    });

    self.addEventListener("activate", function(e){

        self.clients.claim();

    });


    function drop(){

        db = new zango.Db( "AW3D" );

        return db.open().then(function(){
            debugMode && console.log(`Database ${db.name} (v${db.version}) ready to drop.`);
        }).then(function(){

            return db.drop().then(function(){
                debugMode && console.log(`Database ${db.name} (v${db.version}) dropped.`);
            });

        }).catch(function(err){
            console.error(err);
        });

    }

    function clear(){

    //  not tested yet.

        db = new zango.Db( "AW3D" );

        return db.open().then(function(){
            debugMode && console.log(`Database ${db.name} (v${db.version}) ready for cleanup.`);
        }).then(function(){

            var cleanups = [];

            for (var name in db._cols){

                cleanups.push(function(){
                    var collection = db._cols[name];
                    return collection.find()
                    .forEach(function(doc){
                        if ( !doc ) return;
                        var selector = {_id:doc._id};
                        collection.remove( selector );
                    }, function(err){ 
                        if (err) throw err; 
                    }).catch(function(err){
                        console.error(err);
                    });
                });

            }
            
            return cleanups;

        }).then(function(cleanups){
            
            return Promise.all(cleanups).then(function(){
                debugMode && console.log(`Database ${db.name} (v${db.version}) cleared.`);
            });

        //  or...

        //  while( cleanups.length ){
        //      cleanups.shift().call();
        //  }

        }).catch(function(err){
            console.error(err);
        });

    }

    function install(){

        db = new zango.Db( "AW3D", 1, {

            male:       true,
            female:     true,
            skeleton:   true,
            materials:  true,
            textures:   true,
            animations: true,

        });

        return db.open(function(err, database){
            if (err) console.error(err);
        }).then( function(){
            debugMode && console.log(`Database ${db.name} (v${db.version}) ready for install.`);
        }).catch(function(err){
            console.error(err);
        }).then(function(){

            return caches.open("collections")
            .then(function(cache){
                return cache;
            });

        }).then(function(cache){

            return cache.addAll([
                "/AW3D_db/male.json",
                "/AW3D_db/female.json",
                "/AW3D_db/skeleton.json",
                "/AW3D_db/materials.json",
                "/AW3D_db/animations.json",
            ]).then(function(){
                return cache;
            });

        }).then(function(cache){

            cache.match("/AW3D_db/animations.json")
            .then(function(response){
                return response.json();
            }).then(function(json){
                db.collection("animations")
                .insert(json, function(err){
                    if (err) throw err;
                }).catch(function(err){
                    console.error(err);
                });
            });

            cache.match("/AW3D_db/male.json")
            .then(function(response){
                return response.json();
            }).then(function(json){
                db.collection("male")
                .insert(json, function(err){
                    if (err) throw err;
                }).catch(function(err){
                    console.error(err);
                });
            });

            cache.match("/AW3D_db/female.json")
            .then(function(response){
                return response.json();
            }).then(function(json){
                db.collection("female")
                .insert(json, function(err){
                    if (err) throw err;
                }).catch(function(err){
                    console.error(err);
                });
            });

            cache.match("/AW3D_db/skeleton.json")
            .then(function(response){
                return response.json();
            }).then(function(json){
                db.collection("skeleton")
                .insert(json, function(err){
                    if (err) throw err;
                }).catch(function(err){
                    console.error(err);
                });
            });

            cache.match("/AW3D_db/materials.json")
            .then(function(response){
                return response.json();
            }).then(function(json){
                db.collection("materials")
                .insert(json, function(err){
                    if (err) throw err;
                }).catch(function(err){
                    console.error(err);
                });
            });

        }).then(function(){
            debugMode && console.log(`Database ${db.name} (v${db.version}) ready for use.`);
        }).catch(function(err){
            console.error(err);
        });

    }

    function activate(){
        self.skipWaiting();
        debugMode && console.log("activated.");
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
                client.navigate(client.url);  // it will re-install on reload!
                console.log(`service worker unistalled from client "${client.url}"`);
            });
        });
    }
