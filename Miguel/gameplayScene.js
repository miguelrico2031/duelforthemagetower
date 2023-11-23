class GameplayScene extends Phaser.Scene
{
    playersInput = 
    {
        wasdKeys: 0,
        arrowKeys: 0,
        jumpKey1: 0,
        jumpKey2: 0
    }

    ground;
    player1;

    preload()
    {
        this.load.image("bg", "roblox.jpg");
        this.load.image("floor", "testfloor.png");

        this.load.spritesheet("wizard1_idle", "../Sprites/WizardPack/Idle.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_run", "../Sprites/WizardPack/Run.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_jump", "../Sprites/WizardPack/Jump.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_fall", "../Sprites/WizardPack/Fall.png", {frameWidth: 231, frameHeight: 190} );
    }


    create()
    {   
        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.jumpKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();

        this.add.image(viewport.width/2, viewport.height/2, "bg");
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(viewport.width/2, viewport.height, "floor").setScale(2).refreshBody();

        this.player1 = new Wizard(this, "wizard1", new Phaser.Math.Vector2(viewport.centerX, viewport.centerY), 1);
        this.player1.gameObject.setScale(0.75).refreshBody();
        this.player1.body.setSize(54, 92, true);

        //player1 animations
        this.anims.create
        ({
            key: "wizard1_idle",
            frames: this.anims.generateFrameNumbers("wizard1_idle", { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create
        ({
            key: "wizard1_run",
            frames: this.anims.generateFrameNumbers("wizard1_run", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create
        ({
            key: "wizard1_jump",
            frames: this.anims.generateFrameNumbers("wizard1_jump", { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create
        ({
            key: "wizard1_fall",
            frames: this.anims.generateFrameNumbers("wizard1_fall", { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        

        this.player1.startAnimations();


        this.physics.add.collider(this.player1, this.ground);
        
    }

    update(time, delta)
    {
        this.processInput();

        this.player1.update(time, delta);
    }

    processInput()
    {
        //player 1
        if(this.playersInput.wasdKeys.A.isDown)this.player1.xInput = -1;
        if(this.playersInput.wasdKeys.D.isDown) this.player1.xInput = 1;
        if(this.playersInput.wasdKeys.W.isDown) this.player1.yInput = -1;
        if(this.playersInput.wasdKeys.S.isDown) this.player1.yInput = 1;

        if(this.playersInput.jumpKey1.isDown) this.player1.jumpInput = 1;
        

        //player 2
    }
}