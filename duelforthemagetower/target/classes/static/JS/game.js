const viewport = 
{
    width: 1280,
    height: 720,
}

let user = null;

let gameplayResourcesLoaded = false;

let IP = "";

let connection = null;

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
    scene: [Loading, Menu, Login, UserData, Connecting, GameplayScene, OnlineGameplay, Pause, Gameover, Stats, Credits, Tutorial],
    dom: 
    {
        createContainer: true
    },

};

const game = new Phaser.Game(config);
