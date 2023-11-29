class Pause extends Phaser.Scene
{

    //publicas
    gameIsPaused;
    pauseKeyIsPressed;

    //privadas
    pauseScreen;
    pauseKey;

    buttonContinue;
    buttonExit;

    //Metodos publicos
    constructor(scene) 
    {
        super("PauseScene");
    }

    preload()
    {
        this.load.image("pause_screen", "../Assets/UI/Pause Menus/Pause no buttons.png");
        this.load.spritesheet("continuar", "../Assets/UI/Pause Menus/Continue_spritesheet.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("salir", "../Assets/UI/Pause Menus/Exit_spritesheet.png", { frameWidth: 167, frameHeight: 106 });
    }

    create()
    {
        this.gameIsPaused = true;

        this.add.image(0, 0, "pause_screen").setOrigin(0, 0);

        this.anims.create
        ({
            key: "continue_press",
            frames: this.anims.generateFrameNumbers("continuar", { start: 0, end: 1 }),
            frameRate: 12,
        });

        this.anims.create
        ({
            key: "exit_press",
            frames: this.anims.generateFrameNumbers("salir", { start: 0, end: 1 }),
            frameRate: 12,
        });

        // La forma de poner los botones es lo mas terrorifico feo e ineficiente que he hecho en mi vida dios mio
        // pero tampoco hay otra pq usar el setorigin con estas da errores y por lo q sea usar solo el viewport no las centra
        this.buttonContinue = this.add.sprite(viewport.width/2, viewport.height/2 - 10, "continuar");
        this.buttonExit = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "salir");
        
        this.buttonContinue.setInteractive();
        this.buttonExit.setInteractive();

        
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update()
    {
        this.processInput();
    }

    //Metodos privados
    
    processInput()
    {
        // eventos de teclado

        if (this.gameIsPaused) this.checkPauseToggled();

        if (!this.gameIsPaused) this.resumeGame();

        // Eventos de ratón
        this.buttonContinue.on('pointerdown', () => { this.resumeGame(); });
        this.buttonExit.on('pointerdown', () => { this.exitGame(); });

        // creo q es un poco chapucero pero es la que hay no encuentro nada mas en la referencia
        this.buttonContinue.on('pointerover', () => { this.buttonContinue.setFrame(0); });
        this.buttonExit.on('pointerup', () => { this.buttonExit.setFrame(0); });
    }
    
    checkPauseToggled() 
    {
        if (this.pauseKey.isDown && !this.pauseKeyIsPressed) {
            console.log("pabajo");
            this.pauseKeyIsPressed = true;
        }

        if (this.pauseKey.isUp && this.pauseKeyIsPressed) {
            console.log("parriba");
            this.pauseKeyIsPressed = false;
            this.gameIsPaused = false;
        }
    }

    resumeGame()
    {
        this.pauseKeyIsPressed = false;
        this.add.sprite(this.buttonContinue.x, this.buttonContinue.y).play("continue_press");
        this.buttonExit.setFrame(0);
        // aqui la gracia es hacer que esta escena de pausa se oculte
        //this.scene.sendToBack("PauseScene"); // la oculta pero luego no puedo volver a poner el juego en pausa
        this.scene.sleep("PauseScene");
        this.scene.resume("GameplayScene"); // continua la ejecucion del juego
    }

    exitGame()
    {
        console.log("Salir del juego");
        //this.add.sprite(this.buttonExit.x, this.buttonExit.y).play("exit_press"); // va feo
        this.buttonExit.setFrame(1);
    }
}