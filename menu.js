//  menu.js

//  var viewer = document.getElementById( "viewer" );
    var SceneWindow = viewer.contentWindow; // important!
    var SceneDocument = viewer.contentDocument; // important!

    $(viewer.contentWindow).on("load", function(){
        db = this.db;
        MW = this.MW;
        THREE = this.THREE;
        scene = this.scene;
        camera = this.camera;
        renderer = this.renderer;
        localPlayer = this.localPlayer;
        cameraControls = this.cameraControls;
        keyInputControls = this.keyInputControls;
    });

(function(){

    const Home = nameCategoryMap["Home"];

    $(Home.element).on("click", function(){
        location.pathname = Home.value;
    });

})();

(function(){

    const Male  = nameCategoryMap["Male"];
    const Female = nameCategoryMap["Female"];
    const Run   = nameCategoryMap["Run"];
    const Idle  = nameCategoryMap["Idle"];
    const Walk  = nameCategoryMap["Walk"];
    const Jump  = nameCategoryMap["Jump"];
    const Back  = nameCategoryMap["Back"];
    const Left  = nameCategoryMap["Left"];
    const Right = nameCategoryMap["Right"];
    const Front = nameCategoryMap["Front"];

    function updateActionElementActive(){
        Run.element.active = localPlayer.controller.isRunning && !localPlayer.controller.isWalking;
        Walk.element.active = localPlayer.controller.isRunning && localPlayer.controller.isWalking;
    }

    function updateActionButtonsActive(){

        try {

        //  Update control tab action buttons.
            document.getElementById("run").active = localPlayer.controller.isRunning && !localPlayer.controller.isWalking;
            document.getElementById("walk").active = localPlayer.controller.isRunning && localPlayer.controller.isWalking;
        }

        catch(err){;}
    }

    $(Male.element).one("click", setGenderToMale);
    $(Female.element).one("click", setGenderToFemale);

    function setGenderToMale(){
        var data = Male.value;
        SceneWindow.localPlayerHandler(data);
        updateActionElementActive();
        updateActionButtonsActive();
        $(Male.element).one("click", setGenderToMale);
    }

    function setGenderToFemale(){
        var data = Female.value
        SceneWindow.localPlayerHandler(data);
        updateActionElementActive();
        updateActionButtonsActive();
        $(Female.element).one("click", setGenderToFemale);
    }

    $(Idle.element).on("click", function (){
        var data = "/action/idle";
        SceneWindow.localPlayerHandler(data);
        updateActionElementActive();
        updateActionButtonsActive();
    });

    $(Walk.element).on("click", function (){
        this.active = !this.active;
        if (this.active) 
            var data = "/action/walk";
        else 
            var data = "/action/idle";
        SceneWindow.localPlayerHandler(data);
        updateActionElementActive();
        updateActionButtonsActive();
    });

    $(Run.element).on("click", function (){
        this.active = !this.active;
        if (this.active) 
            var data = "/action/run";
        else 
            var data = "/action/idle";
        SceneWindow.localPlayerHandler(data);
        updateActionElementActive();
        updateActionButtonsActive();
    });

    $(Jump.element).one("click", jumpAction);
                        
    function jumpAction(){
        var data = "/action/jump";
        SceneWindow.localPlayerHandler(data);
        $(Jump.element).one("click", jumpAction);
    }

    $(Back.element).on("click", function (){
        var data = "/turn/back";
        SceneWindow.localPlayerHandler(data);
    });

    $(Left.element).on("click", function (){
        var data = "/turn/left";
        SceneWindow.localPlayerHandler(data);
    });

    $(Right.element).on("click", function (){
        var data = "/turn/right";
        SceneWindow.localPlayerHandler(data);
    });

    $(Front.element).on("click", function (){
        var data = "/turn/front";
        SceneWindow.localPlayerHandler(data);
    });

})();

