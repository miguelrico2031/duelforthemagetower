class GameplayScene extends Phaser.Scene
{
    playersInput = //objeto que guarda todos los inputs necesarios de los jugadores
    {
        wasdKeys: 0,
        arrowKeys: 0,
        jumpKey1: 0,
        jumpKey2: 0,
        castKey1: 0,
        castKey2: 0
    }

    ground;
    player1;
    player2;
    spells;

    preload()
    {
        this.load.image("bg", "../Miguel/roblox.jpg");
        this.load.image("floor", "../Miguel/testfloor.png");
        
        //sprites player 1
        this.load.spritesheet("wizard1_idle", "../Sprites/WizardPack/Idle.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_run", "../Sprites/WizardPack/Run.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_jump", "../Sprites/WizardPack/Jump.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_fall", "../Sprites/WizardPack/Fall.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_hit", "../Sprites/WizardPack/Hit.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_die", "../Sprites/WizardPack/Death.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_attack", "../Sprites/WizardPack/Attack2.png", {frameWidth: 231, frameHeight: 190} );

        //sprites player 2
        this.load.spritesheet("wizard2_idle", "../Sprites/EvilWizardPack/Idle.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_run", "../Sprites/EvilWizardPack/Run.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_jump", "../Sprites/EvilWizardPack/Jump.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_fall", "../Sprites/EvilWizardPack/Fall.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_hit", "../Sprites/EvilWizardPack/Hit.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_die", "../Sprites/EvilWizardPack/Death.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_attack", "../Sprites/EvilWizardPack/Attack2.png", {frameWidth: 250, frameHeight: 250} );

        //sprite hechizo
        this.load.image("spell", "../Miguel/bola.png");
    }


    create()
    {   
        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.jumpKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playersInput.castKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        
        this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();
        this.playersInput.jumpKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.playersInput.castKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.image(viewport.width/2, viewport.height/2, "bg");
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(viewport.width/2, viewport.height, "floor").setScale(2).refreshBody();
        this.ground.create(viewport.width/2, viewport.height/2, "floor").setScale(0.25).refreshBody();
        this.ground.create(100, viewport.height*3/4, "floor").setScale(0.25).refreshBody();
        this.ground.create(viewport.width - 100, viewport.height*3/4, "floor").setScale(0.25).refreshBody();

        this.initPlayer1();

        this.initPlayer2();

        this.spells = this.physics.add.group
        ({
            allowGravity: false,
            //collideWorldBounds: true,
            runChildUpdate: true 
        });

        this.physics.add.overlap(this.player1, this.spells, this.player1.spellHit, null, this.player1);
        this.physics.add.overlap(this.player2, this.spells, this.player2.spellHit, null, this.player2);

        this.input.on('pointerdown', () => this.player1.takeDamage(1), this);


        


        this.physics.add.collider(this.player1.body, this.ground);
        this.physics.add.collider(this.player2.body, this.ground);
        this.physics.add.collider(this.spells, this.ground);
        
    }

    update(time, delta)
    {
        this.processInput();

        this.player1.update(time, delta);
        this.player2.update(time, delta);

        
    }

    test = (h) => console.log(h);
    

    processInput()
    {
        //player 1
        if(this.playersInput.wasdKeys.A.isDown)this.player1.xInput = -1;
        if(this.playersInput.wasdKeys.D.isDown) this.player1.xInput = 1;
        if(this.playersInput.wasdKeys.W.isDown) this.player1.yInput = -1;
        if(this.playersInput.wasdKeys.S.isDown) this.player1.yInput = 1;

        if(this.playersInput.jumpKey1.isDown) this.player1.jumpInput = 1;
        if(this.playersInput.castKey1.isDown) this.player1.castInput = 1;

        

        //player 2
        if(this.playersInput.arrowKeys.left.isDown) this.player2.xInput = -1;
        
        if(this.playersInput.arrowKeys.right.isDown) this.player2.xInput = 1;
        if(this.playersInput.arrowKeys.up.isDown) this.player2.yInput = -1;
        if(this.playersInput.arrowKeys.down.isDown) this.player2.yInput = 1;

        if(this.playersInput.jumpKey2.isDown) this.player2.jumpInput = 1;
        if(this.playersInput.castKey2.isDown) this.player2.castInput = 1;
        
    }

    initPlayer1()
    {
        this.player1 = new Wizard(this, 1, new Phaser.Math.Vector2(viewport.width/4, viewport.height*3/4), 1);

        this.player1.gameObject.setScale(0.75).refreshBody();
        this.player1.body.setSize(54, 92, true);

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

        this.anims.create
        ({
            key: "wizard1_hit",
            frames: this.anims.generateFrameNumbers("wizard1_hit", { start: 0, end: 3 }),
            frameRate: 10,
        });

        this.anims.create
        ({
            key: "wizard1_die",
            frames: this.anims.generateFrameNumbers("wizard1_die", { start: 0, end: 6 }),
            frameRate: 10,
        });

        this.anims.create
        ({
            key: "wizard1_attack",
            frames: this.anims.generateFrameNumbers("wizard1_attack", { start: 3, end: 7 }),
            frameRate: 15,
        });
        
        this.player1.startAnimations(); //empezar a animar al jugador
        this.player1.addHitListener((h) => this.test(h)); //pruebita
    }

    initPlayer2()
    {
        this.player2 = new Wizard(this, 2, new Phaser.Math.Vector2(viewport.width*3/4, viewport.height*3/4), -1);

        this.player2.gameObject.setScale(1.15).refreshBody();
        this.player2.body.setSize(35, 60);
        this.player2.body.offset.y += 12
        //this.player2.body.setSize(54, 92, true);

        this.anims.create
        ({
            key: "wizard2_idle",
            frames: this.anims.generateFrameNumbers("wizard2_idle", { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create
        ({
            key: "wizard2_run",
            frames: this.anims.generateFrameNumbers("wizard2_run", { start: 0, end: 7 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create
        ({
            key: "wizard2_jump",
            frames: this.anims.generateFrameNumbers("wizard2_jump", { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create
        ({
            key: "wizard2_fall",
            frames: this.anims.generateFrameNumbers("wizard2_fall", { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create
        ({
            key: "wizard2_hit",
            frames: this.anims.generateFrameNumbers("wizard2_hit", { start: 0, end: 2 }),
            frameRate: 10,
        });

        this.anims.create
        ({
            key: "wizard2_die",
            frames: this.anims.generateFrameNumbers("wizard2_die", { start: 0, end: 6 }),
            frameRate: 10,
        });

        this.anims.create
        ({
            key: "wizard2_attack",
            frames: this.anims.generateFrameNumbers("wizard2_attack", { start: 3, end: 7 }),
            frameRate: 15,
        });
        
        this.player2.startAnimations(); //empezar a animar al jugador
        //this.player2.addHitListener((h) => this.test(h)); //pruebita
        
    }
}