const viewport = 
{
    width: 1280,
    height: 720,
}

let user = null;

let gameplayResourcesLoaded = false;

let IP = "";

let connection = null;

let wsMessageCallbacks = []

let matchData = null;

const config =
{
    parent: "parent",
    autoCenter: Phaser.Scale.CENTER_BOTH,
    type: Phaser.AUTO,
    mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
    width: viewport.width,
    height: viewport.height,
    physics:
    {
        default: 'arcade',
        arcade:
        {
            gravity: { y: 3200 },
            debug: false
        }
    },
    scene: [Loading, Menu, Login, UserData, Connecting, ConnectionLost, GameplayScene, OnlineGameplay, 
        Pause, OnlinePause, Gameover, OnlineGameover, Stats, OnlineStats, Credits, Tutorial],
    dom: 
    {
        createContainer: true
    },

};

const game = new Phaser.Game(config);


const openWS = (openCallback, errorCallback) => 
{
    connection = new WebSocket('ws://' + window.location.href.slice(6) + 'match');

    connection.onopen = openCallback;

    connection.onmessage = (m) => { for(const c of wsMessageCallbacks) c(m); }

    connection.onerror = (e)  => {console.log("WebSocket error: " + e); errorCallback()};
    
    connection.onclose = (e) => {connection = null; console.log("conexion cerrada: " + e);}
}

window.onbeforeunload = function(){
   if(user != null){
	   $.ajax
            ({
                method: "POST",
                url: IP + "/users/logout",
                data: JSON.stringify(user),
                headers: 
                {
                    "Content-type":"application/json"
                }
            })
            .done((data, textStatus, jqXHR) => 
            {
                console.log(textStatus+" "+ jqXHR.status);
                console.log(data);
                console.log(jqXHR.statusCode())

                // Borra los datos globales
                user = null;

            })
            .fail((data, textStatus, jqXHR) => 
            {
                console.log(textStatus+" "+jqXHR.status);
                console.log("Error cerrando sesión");
            });

   }
}
