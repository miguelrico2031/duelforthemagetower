const viewport = 
{
    width: 1280,
    height: 720,
}
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
            debug: true
        }
    },
    scene: [GameplayScene, Pause]
};

const game = new Phaser.Game(config);
