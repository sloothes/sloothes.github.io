//  menu-list.js

    var list = {

        "Sitemap": {
            "Pages": [
                ["Home", "/home"],
            ],
        },

        "Menu": {
            "Sex": [
                ["Male", "/gender/male"],
                ["Female", "/gender/female"],
            ],
            "Actions": [
                ["Idle", "/action/idle"],
                ["Walk", "/action/walk"],
                ["Run",  "/action/run"],
                ["Jump", "/action/jump"],
            ],
            "Controls": [
                ["Back",  "/turn/back"],
                ["Left",  "/turn/left"],
                ["Right", "/turn/right"],
                ["Front", "/turn/front"],
            ],

            "User": [
                ["Login", "/user/login"],
                ["Signup", "/user/signup"],
                ["Logout", "/user/logout"],
            ],
        },
    };
    var pages = {};
    for ( var section in list ) {
        pages[ section ] = {};
        for ( var category in list[ section ] ) {
            pages[ section ][ category ] = {};
            for ( var i = 0; i < list[ section ][ category ].length; i ++ ) {
                var page = list[ section ][ category ][ i ];
                pages[ section ][ category ][ page[ 0 ] ] = page[ 1 ];
            }
        }
    }
