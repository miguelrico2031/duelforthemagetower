class Pause extends Phaser.Scene
{

    //publicas
    gameIsPaused;
    pauseKeyIsPressed;

    //privadas
    pauseScreen;
    pauseKey;

    buttonPressed;
    buttonContinue;
    buttonExit;

    click;
    clack;

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
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    create()
    {
        this.gameIsPaused = true;
        this.buttonPressed = false;

        this.add.image(0, 0, "pause_screen").setOrigin(0, 0);

        this.click = this.sound.add("click");
        this.clack = this.sound.add("clack");

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
        this.buttonContinue = this.add.sprite(viewport.width/2, viewport.height/2 - 10, "continuar")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { 
                this.buttonPressed = true;
                this.click.play(); 
                this.buttonContinue.setFrame(1);
            })
            .on('pointerup', () => { 
                if(this.buttonPressed) this.clack.play()
                this.resumeGame(); 
            })
            .on('pointerout', () => this.enterButtonRestState(this.buttonContinue) // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
        );

        this.buttonExit = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "salir")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => {
                this.buttonPressed = true; 
                this.click.play();
                this.buttonExit.setFrame(1); 
            })
            .on('pointerup', () => { 
                if(this.buttonPressed) this.clack.play()
                this.exitGame(); 
            })
            .on('pointerout', () => this.enterButtonRestState(this.buttonExit) // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
        );
        
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

        // Eventos de ratón MOVIDOS AL CREATE PARA QUE CADA BOTON SE CREE CON SU FUNCIONALIDAD
        // this.buttonContinue.on('pointerdown', () => { this.resumeGame(); });
        // this.buttonExit.on('pointerdown', () => { this.exitGame(); });

        // // creo q es un poco chapucero pero es la que hay no encuentro nada mas en la referencia
        // this.buttonContinue.on('pointerup', () => { this.buttonContinue.setFrame(0); });
        // this.buttonExit.on('pointerup', () => { this.buttonExit.setFrame(0); });
    }
    
    // todo esto es para ver si has pulsado el escape y lo has soltado antes de hacer nada pq si no te da un ataque de epilepsia
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
        this.buttonContinue.setFrame(0);
        // aqui la gracia es hacer que esta escena de pausa se oculte
        //this.scene.sendToBack("PauseScene"); // la oculta pero luego no puedo volver a poner el juego en pausa
        this.scene.sleep("PauseScene");
        this.scene.resume("GameplayScene"); // continua la ejecucion del juego
    }

    exitGame()
    {
        console.log("Salir del juego");
        //this.add.sprite(this.buttonExit.x, this.buttonExit.y).play("exit_press"); // va feo
        this.buttonExit.setFrame(0);
    }

    enterButtonRestState(button)
    {
        // pongo el frame de la animacion sin pulsar pq si no se ve como si se quedase pillado y no queremos eso
        if(this.buttonPressed) this.clack.play();
        button.setFrame(0);
        this.buttonPressed = false;
    }
}