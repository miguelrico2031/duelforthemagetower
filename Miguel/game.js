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
    scene:
    {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const playersInput = 
{
    wasdKeys: 0,
    arrowKeys: 0,
    jumpKey1: 0,
    jumpKey2: 0
}

let ground;
let player1;

function preload()
{
    this.load.image("bg", "roblox.jpg");
    this.load.image("floor", "testfloor.png");
    this.load.spritesheet("wizard1", "../Sprites/WizardPack/Idle.png", {frameWidth: 231, frameHeight: 190} );
}


function create()
{   
    playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
    playersInput.jumpKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    playersInput.arrowKeys = this.input.keyboard.createCursorKeys();

    this.add.image(viewport.width/2, viewport.height/2, "bg");
    
    ground = this.physics.add.staticGroup();
    ground.create(viewport.width/2, viewport.height, "floor").setScale(2).refreshBody();

    player1 = new Wizard(this, "wizard1", new Phaser.Math.Vector2(viewport.centerX, viewport.centerY));
    player1.gameObject.setScale(0.75).refreshBody();
    player1.body.setSize(54, 92, true);
    //player.gameObject.rotation = Phaser.Math.PI2 / 2;
    //this.physics.add.sprite(400, 300, "wizard1");


    this.physics.add.collider(player1, ground);
    
}

function update()
{
    processInput();

    player1.update();
}

function processInput()
{
    //player 1
    if(playersInput.wasdKeys.A.isDown)player1.xInput = -1;
    if(playersInput.wasdKeys.D.isDown) player1.xInput = 1;
    if(playersInput.wasdKeys.W.isDown) player1.yInput = -1;
    if(playersInput.wasdKeys.D.isDown) player1.yInput = 1;

    if(playersInput.jumpKey1.isDown) player1.jumpInput = 1;
    

    //player 2
}