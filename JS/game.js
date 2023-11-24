const viewport = 
{
    width: 1280,
    height: 720,
}
const config =
{
    type: Phaser.AUTO,
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
    scene: GameplayScene
};

const game = new Phaser.Game(config);