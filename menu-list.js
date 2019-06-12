//  menu-list.js

    var list = {
        "Menu": {
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
