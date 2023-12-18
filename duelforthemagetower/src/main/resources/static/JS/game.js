const viewport = 
{
    width: 1280,
    height: 720,
}

let user = null;

let gameplayResourcesLoaded = false;

const config =
{
    parent: "form",
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
    scene: [Loading, Menu, Login, User, GameplayScene, Pause, Gameover, Stats, Credits, Tutorial],
    dom: 
    {
        createContainer: true
    },

};

const game = new Phaser.Game(config);
