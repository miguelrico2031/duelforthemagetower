const viewport = 
{
    width: 800,
    height: 600
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
            gravity: { y: 500 },
            debug: false
        }
    },
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;

function preload()
{
    this.load.image("bg", "roblox.jpg");
    this.load.spritesheet("wizard1", "../Sprites/WizardPack/Idle.png", {frameWidth: 231, frameHeight: 190} );
}


function create()
{   
    this.add.image(viewport.width/2, viewport.height/2, "bg");

    player = new Wizard(this, "wizard1", {x: viewport.width/2, y: viewport.height/2});
    player.body.setSize(54, 92, true);
    //player.gameObject.rotation = Phaser.Math.PI2 / 2;
    //this.physics.add.sprite(400, 300, "wizard1");
    
}

function update()
{
    player.xInput = -10;
    player.update();
}