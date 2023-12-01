class GameplayScene extends Phaser.Scene
{

    constructor()
    {
        super("GameplayScene")
    }

    playersInput = //objeto que guarda todos los inputs necesarios de los jugadores
    {
        wasdKeys: 0,
        arrowKeys: 0,
        jumpKey1: 0,
        jumpKey2: 0,
        castKey1: 0,
        castKey2: 0,
        shieldCastKey1: 0,
        shieldCastKey2: 0,
        pauseKey: 0
    }

    ground;
    barrera;
    player1;
    player2;
    spells;
    shields;
    healthbar1;
    healthbar2;

    pauseKeyIsPressed;

    preload()
    {
        //fondo
        this.load.image("bg", "../Assets/Scenery/Background/bg.png");
        //suelo
        this.load.image("floor", "../Assets/Scenery/Background/floor.png");
        //plataformas
        this.load.image("plataforma1", "../Assets/Scenery/Background/p4.png");
        this.load.image("plataforma2", "../Assets/Scenery/Background/p1.png");
        this.load.image("plataforma3", "../Assets/Scenery/Background/p2.png");
        this.load.image("plataforma4", "../Assets/Scenery/Background/p3.png");
        //barrera
        this.load.image("barrier", "../Assets/Scenery/barrerapocha.png");
        
        //sprites player 1
        this.load.spritesheet("wizard1_idle", "../Assets/Sprites/BlueWizard/Idle.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_run", "../Assets/Sprites/BlueWizard/Run.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_jump", "../Assets/Sprites/BlueWizard/Jump.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_fall", "../Assets/Sprites/BlueWizard/Fall.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_hit", "../Assets/Sprites/BlueWizard/Hit.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_die", "../Assets/Sprites/BlueWizard/Death.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_attack", "../Assets/Sprites/BlueWizard/Attack2.png", {frameWidth: 231, frameHeight: 190} );
        this.load.spritesheet("wizard1_shield", "../Assets/Sprites/BlueWizard/Attack1.png", {frameWidth: 231, frameHeight: 190} );

        //sprites player 2
        this.load.spritesheet("wizard2_idle", "../Assets/Sprites/RedWizard/Idle.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_run", "../Assets/Sprites/RedWizard/Run.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_jump", "../Assets/Sprites/RedWizard/Jump.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_fall", "../Assets/Sprites/RedWizard/Fall.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_hit", "../Assets/Sprites/RedWizard/Hit.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_die", "../Assets/Sprites/RedWizard/Death.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_attack", "../Assets/Sprites/RedWizard/Attack2.png", {frameWidth: 250, frameHeight: 250} );
        this.load.spritesheet("wizard2_shield", "../Assets/Sprites/RedWizard/Attack1.png", {frameWidth: 250, frameHeight: 250} );

        //sprite hechizo
        this.load.image("spell", "../Assets/Sprites/Particles/bola.png");

        //sprites escudo
        this.load.spritesheet("shield", "../Assets/Sprites/Particles/shield.png", {frameWidth: 412, frameHeight: 412, margin: 50, spacing: 50} );


        //sprites hud
        this.load.image("heart_full", "../Assets/UI/HUD/Hearts/HeartContainerFull.png");
        this.load.image("heart_half", "../Assets/UI/HUD/Hearts/HeartContainerHalf.png");
        this.load.image("heart_empty", "../Assets/UI/HUD/Hearts/HeartContainerEmpty.png");
        this.load.spritesheet("PlayerIcon1", "../Assets/UI/HUD/Icons/BlueMageIcon.png", { frameWidth: 64, frameHeight: 64 } );
        this.load.spritesheet("PlayerIcon2", "../Assets/UI/HUD/Icons/RedMageIcon.png", { frameWidth: 64, frameHeight: 64 } );

    }


    create()
    {   
        this.pauseKeyIsPressed = false;

        this.playersInput.wasdKeys = this.input.keyboard.addKeys("W,A,S,D");
        this.playersInput.jumpKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.playersInput.castKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.playersInput.shieldCastKey1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        
        this.playersInput.arrowKeys = this.input.keyboard.createCursorKeys();
        this.playersInput.jumpKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.playersInput.castKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.playersInput.shieldCastKey2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        
        this.playersInput.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        this.add.image(viewport.width/2, viewport.height/2, "bg");
        
        this.ground = this.physics.add.staticGroup();
        this.ground.create(viewport.width/2, viewport.height-123/2, "floor").setScale(1).refreshBody();
        this.ground.create(viewport.width/2, viewport.height/2, "plataforma1").setScale(2.5).refreshBody();

        //plataformas mitad izquierda
        this.ground.create(100, viewport.height*2/3, "plataforma1").setScale(2).refreshBody();
        this.ground.create(500, viewport.height*4/5.8, "plataforma4").setScale(2).refreshBody();
        this.ground.create(350, viewport.height*1/3.5, "plataforma4").setScale(2).refreshBody();
        this.ground.create(50, viewport.height*4/9, "plataforma2").setScale(2).refreshBody();  
        this.ground.create(300, viewport.height*4/7.7, "plataforma3").setScale(1.75).refreshBody(); 
        
        //plataformas mitad derecha
        this.ground.create(game.config.width - 100, viewport.height*2/3, "plataforma1").setScale(2).refreshBody();
        this.ground.create(game.config.width - 500, viewport.height*4/5.8, "plataforma4").setScale(2).refreshBody();
        this.ground.create(game.config.width - 350, viewport.height*1/3.5, "plataforma4").setScale(2).refreshBody();
        this.ground.create(game.config.width - 50, viewport.height*4/9, "plataforma2").setScale(2).refreshBody();  
        this.ground.create(game.config.width - 300, viewport.height*4/7.7, "plataforma3").setScale(1.75).refreshBody();


        this.barrera = this.physics.add.staticGroup();
        this.barrera.create(viewport.width/2, viewport.height/2, "barrier").setScale(1).refreshBody();
        
        this.initPlayer1();
        // Asignar una barra de vida / HUD al jugador 1
        this.healthbar1 = new HealthBar(this, this.player1, "PlayerIcon1");
        
        this.initPlayer2();
        // Asignar una barra de vida / HUD al jugador 2
        this.healthbar2 = new HealthBar(this, this.player2, "PlayerIcon2");


        this.spells = this.physics.add.group
        ({
            allowGravity: false,
            //collideWorldBounds: true,
            runChildUpdate: true 
        });

        this.shields = this.physics.add.staticGroup();

        this.physics.add.overlap(this.player1, this.spells, this.player1.spellHit, null, this.player1);
        this.physics.add.overlap(this.player2, this.spells, this.player2.spellHit, null, this.player2);

        this.input.on('pointerdown', () => this.player1.takeDamage(1), this);


        


        this.physics.add.collider(this.player1.body, this.ground);
        this.physics.add.collider(this.player2.body, this.ground);
        this.physics.add.collider(this.player1.body, this.barrera);
        this.physics.add.collider(this.player2.body, this.barrera);
        this.physics.add.collider(this.spells, this.ground);
        
        this.physics.add.collider(this.shields, this.spells);
        
        this.gameEnded = false;
        gameplayResourcesLoaded = true; //para evitar volver a cargar las animaciones porque se cargan de manera global

    }

    update(time, delta)
    {
        this.processInput();

        this.player1.update(time, delta);
        this.player2.update(time, delta);

        this.processDeath();
    }    

    processInput()
    {
        //player 1
        if(this.playersInput.wasdKeys.A.isDown)this.player1.xInput = -1;
        if(this.playersInput.wasdKeys.D.isDown) this.player1.xInput = 1;
        if(this.playersInput.wasdKeys.W.isDown) this.player1.yInput = -1;
        if(this.playersInput.wasdKeys.S.isDown) this.player1.yInput = 1;

        if(this.playersInput.jumpKey1.isDown) this.player1.jumpInput = 1;
        if(this.playersInput.castKey1.isDown) this.player1.castInput = 1;
        if(this.playersInput.shieldCastKey1.isDown) this.player1.shieldCastInput = 1;
        

        

        //player 2
        if(this.playersInput.arrowKeys.left.isDown) this.player2.xInput = -1;
        
        if(this.playersInput.arrowKeys.right.isDown) this.player2.xInput = 1;
        if(this.playersInput.arrowKeys.up.isDown) this.player2.yInput = -1;
        if(this.playersInput.arrowKeys.down.isDown) this.player2.yInput = 1;

        if(this.playersInput.jumpKey2.isDown) this.player2.jumpInput = 1;
        if(this.playersInput.castKey2.isDown) this.player2.castInput = 1;
        if(this.playersInput.shieldCastKey2.isDown) this.player2.shieldCastInput = 1;
        
        //pausa
        this.checkPauseKeyPressed();
        
    }

    processDeath(){
        if(!this.player1._isAlive){
            this.launchGameOverScene(2);
        }

        if(!this.player2._isAlive){
            this.launchGameOverScene(1);
        }
    }

    initPlayer1()
    {
        this.player1 = new Wizard(this, 1, new Phaser.Math.Vector2(viewport.width/4, viewport.height*3/4), 1);

        this.player1.gameObject.setScale(0.75).refreshBody();
        this.player1.body.setSize(54, 92, true);

        if(gameplayResourcesLoaded)
        {
            this.player1.startAnimations(); //empezar a animar al jugador
            return;
        }

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

        this.anims.create
        ({
            key: "wizard1_shield",
            frames: this.anims.generateFrameNumbers("wizard1_shield", { start: 3, end: 7 }),
            frameRate: 15,
        });
        
        this.player1.startAnimations(); //empezar a animar al jugador
        //this.player1.addHitListener((h) => this.test(h)); //pruebita
    }

    initPlayer2()
    {
        this.player2 = new Wizard(this, 2, new Phaser.Math.Vector2(viewport.width*3/4, viewport.height*3/4), -1);

        this.player2.gameObject.setScale(1.15).refreshBody();
        this.player2.body.setSize(35, 60);
        this.player2.body.offset.y += 12
        //this.player2.body.setSize(54, 92, true);

        if(gameplayResourcesLoaded)
        {
            this.player2.startAnimations(); //empezar a animar al jugador
            return;
        }

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
        
        this.anims.create
        ({
            key: "wizard2_shield",
            frames: this.anims.generateFrameNumbers("wizard2_shield", { start: 3, end: 7 }),
            frameRate: 15,
        });

        this.player2.startAnimations(); //empezar a animar al jugador
        //this.player2.addHitListener((h) => this.test(h)); //pruebita
        
    }

    // Al igual que en la escena de pausa, es para evitar que dejar pulsado el botón haga cosas feas
    checkPauseKeyPressed() 
    {
        // Comprueba que se ha presionado el escape
        if (this.playersInput.pauseKey.isDown && !this.pauseKeyIsPressed) {
            this.pauseKeyIsPressed = true;
        }

        // Cuando se ha soltado, llama al launchPauseMenu
        else if (this.playersInput.pauseKey.isUp && this.pauseKeyIsPressed) {
            this.pauseKeyIsPressed = false;
            this.launchPauseMenu();
        }
    }

    // Detiene el juego y lanza el menú de pausa
    launchPauseMenu() 
    {
        this.pauseKeyIsPressed = false;
        // Pausa el juego
        this.scene.pause("GameplayScene");

        // Evita que se vuelva a crear el objeto del menú si ya existe
        if(!this.scene.get("PauseScene").loaded)
        {
            this.scene.get("PauseScene").loaded = true;
            this.scene.launch("PauseScene"); // pone el menu de pausa por encima
        }
        else
        {
            this.scene.wake("PauseScene"); // reactiva el menú de pausa (que ya estaba por encima)
        }
    }

    launchGameOverScene(winnerId){
        //console.log(winnerId);
        this.scene.start('GameoverScene', { winner: winnerId });
    }
}