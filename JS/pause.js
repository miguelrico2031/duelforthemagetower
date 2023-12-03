class Pause extends Phaser.Scene
{

    //publicas
    pauseKeyIsPressed;  // comprueba si estoy pulsando escape

    //privadas
    _pauseKey;

    _buttonPressed;     // para saber si el botón está siendo pulsado / clicado

    _buttonContinue;    // botón de continuar
    _buttonExit;        // botón de salir

    _audioClick;        // sonido al pulsar
    _audioClack;        // sonido al soltar
    _audioUnpause;      // sonido al salir del menú

    //Metodos publicos
    constructor() 
    {
        super("PauseScene");
    }

    preload()
    {
        this.load.image("pause_screen", "../Assets/UI/Screens/Pause/Pause.png");
        this.load.spritesheet("continuar", "../Assets/UI/Screens/Pause/ContinueButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("salir", "../Assets/UI/Screens/Pause/ExitButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("sonido", "../Assets/UI/sonido.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("mute", "../Assets/UI/mute.png", { frameWidth: 87, frameHeight: 55 });
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
        this.load.audio("unpause", "../Assets/UI/Sounds/Unpause.wav");
    }

    create()
    {
        this._buttonPressed = false;

        this.add.image(0, 0, "pause_screen").setOrigin(0, 0);

        this._audioClick = this.sound.add("click");
        this._audioClack = this.sound.add("clack");
        this._audioUnpause = this.sound.add("unpause");

        // La forma de poner los botones es lo mas terrorifico feo e ineficiente que he hecho en mi vida dios mio
        // pero tampoco hay otra pq usar el setorigin con estas da errores y por lo q sea usar solo el viewport no las centra

        this._buttonContinue = this._initContinueButton();
        this._buttonExit = this._initExitButton();
        this._buttonMute = this._initMuteButton();
        this._buttonSound = this._initSoundButton();

        
        
        this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update()
    {
        this._checkPauseKeyPressed();

        // mira esto es terrible pero en el create no va y son la 1 de la mañana y me quiero ir a dormir
        if (!this.game.sound.mute) 
        {
            console.log("SONIDO")
            this._buttonSound.setVisible(true);
            this._buttonMute.setVisible(false);
        } 
        else if (this.game.sound.mute) 
        {
            console.log("MUTE")
            this._buttonSound.setVisible(false);
            this._buttonMute.setVisible(true);
        }
    }

    //Metodos privados
    
    // todo esto es para ver si has pulsado el escape y lo has soltado antes de hacer nada pq si no te da un ataque de epilepsia
    _checkPauseKeyPressed() 
    {
        // Comprueba que se está pulsando
        if (this._pauseKey.isDown && !this.pauseKeyIsPressed) 
        {
            this.pauseKeyIsPressed = true;
        }

        // Comprueba que se haya soltado y reanuda el juego
        else if (this._pauseKey.isUp && this.pauseKeyIsPressed) 
        {
            this.pauseKeyIsPressed = false;
            this._resumeGame();
        }
    }

    // Para continuar el juego
    _resumeGame()
    {
        this.pauseKeyIsPressed = false;
        // Continuar la música
        this.scene.get("GameplayScene")._musicIngame.resume();
        // Sonido del menú
        this._audioUnpause.play();
        // aqui la gracia es hacer que esta escena de pausa se oculte
        this.scene.resume("GameplayScene"); // continua la ejecucion del juego
        this.scene.sleep("PauseScene");
    }

    // Todo esto tiene que pasar para salir de la escena de juego (y de pausa)
    _exitGame()
    {
        this.game.sound.stopAll();
        this._audioUnpause.play();
        this.scene.launch("MenuScene", { isPlaying: false });
        this.scene.stop("GameplayScene");
        this.scene.sleep("PauseScene");
    }

    _toggleSound()
    {
        if (!this.game.sound.mute)
        {
            this.game.sound.mute = true;
            this._buttonSound.setVisible(false);
            this._buttonMute.setVisible(true);
        }
        else if (this.game.sound.mute)
        {
            this.game.sound.mute = false;
            this._buttonSound.setVisible(true);
            this._buttonMute.setVisible(false);
        }

    }

    // Esto es lo que debe hacer el boton al ser pulsado
    _enterButtonClickState(button) 
    {
        this._audioClick.play(); 
        button.setFrame(1);
        this._buttonPressed = true;
    }

    // Esto seria cuando el boton deja de estar pulsado
    _enterButtonRestState(button)
    {
        // pongo el frame de la animacion sin pulsar pq si no se ve como si se quedase pillado y no queremos eso
        if(this._buttonPressed) this._audioClack.play();
        button.setFrame(0);
        this._buttonPressed = false;
    }

    // Para inicializar el botón y dotarlo de todas las interacciones necesarias
    _initContinueButton()
    {
        let button = this.add.sprite(viewport.width/2, viewport.height/2 - 10, "continuar")
            .setInteractive({ useHandCursor: true })    // Pone el cursor como la mano
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this._enterButtonClickState(this._buttonContinue) })
            .on('pointerup', () => 
            { 
                this._enterButtonRestState(this._buttonContinue);
                this._resumeGame(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this._enterButtonRestState(this._buttonContinue) 
        );

        return button;
    }

    // Para inicializar el botón y dotarlo de todas las interacciones necesarias
    _initExitButton()
    {
        let button = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "salir")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this._enterButtonClickState(this._buttonExit) })
            .on('pointerup', () => 
            { 
                this._enterButtonRestState(this._buttonExit);
                this._exitGame(); 
            }) 
            .on('pointerout', () => this._enterButtonRestState(this._buttonExit)
        );

        return button;
    }

    _initMuteButton()
    {
        
        let button = this.add.sprite(viewport.width/2 + 240, viewport.height/2 - 140, "mute")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this._enterButtonClickState(this._buttonMute) })
            .on('pointerup', () => 
            { 
                this._enterButtonRestState(this._buttonMute);
                this._toggleSound(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this._enterButtonRestState(this._buttonMute) 
        );
        return button;
    }

    _initSoundButton()
    {
        
        let button = this.add.sprite(viewport.width/2 + 240, viewport.height/2 - 140, "sonido")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this._enterButtonClickState(this._buttonSound) })
            .on('pointerup', () => 
            { 
                this._enterButtonRestState(this._buttonSound);
                this._toggleSound(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this._enterButtonRestState(this._buttonSound) 
        );
        return button;
    }
}