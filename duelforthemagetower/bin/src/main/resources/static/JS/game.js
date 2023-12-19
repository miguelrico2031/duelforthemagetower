const viewport = 
{
    width: 1280,
    height: 720,
}

let gameplayResourcesLoaded = false;

const config =
{
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
    scene: [Loading, Menu, Login, User, GameplayScene, Pause, Gameover, Stats, Credits, Tutorial]
};

const game = new Phaser.Game(config);
