class Pause extends Phaser.Scene
{

    //publicas
    pauseKeyIsPressed;  // comprueba si estoy pulsando escape

    //privadas
    pauseKey;

    buttonPressed;     // para saber si el botón está siendo pulsado / clicado

    buttonContinue;    // botón de continuar
    buttonExit;        // botón de salir

    audioClick;        // sonido al pulsar
    audioClack;        // sonido al soltar
    audioUnpause;      // sonido al salir del menú

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
        this.buttonPressed = false;

        // Fondo
        this.add.image(0, 0, "pause_screen").setOrigin(0, 0);

        // Audio
        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioUnpause = this.sound.add("unpause");

        // Botones
        this.buttonContinue = new Button(this, 640, 350, 1, true, "continuar", () => this._resumeGame());
        this.buttonExit = new Button(this, 640, 480, 1, true, "salir", () => this._exitGame());
        this._buttonMute = new Button(this, 880, 220, 1, true, "mute", () => this._toggleSound());
        this._buttonSound = new Button(this, 880, 220, 1, true, "sonido", () => this._toggleSound());
        
        // Teclas
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update()
    {
        this._checkPauseKeyPressed();

        // mira esto es terrible pero en el create no va y son la 1 de la mañana y me quiero ir a dormir
        if (!this.game.sound.mute) 
        {
            this._buttonSound.setVisible(true);
            this._buttonMute.setVisible(false);
        } 
        else if (this.game.sound.mute) 
        {
            this._buttonSound.setVisible(false);
            this._buttonMute.setVisible(true);
        }
    }

    //Metodos privados
    
    // todo esto es para ver si has pulsado el escape y lo has soltado antes de hacer nada pq si no te da un ataque de epilepsia
    _checkPauseKeyPressed() 
    {
        // Comprueba que se está pulsando
        if (this.pauseKey.isDown && !this.pauseKeyIsPressed) 
        {
            this.pauseKeyIsPressed = true;
        }

        // Comprueba que se haya soltado y reanuda el juego
        else if (this.pauseKey.isUp && this.pauseKeyIsPressed) 
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
        this.audioUnpause.play();
        // aqui la gracia es hacer que esta escena de pausa se oculte
        this.scene.resume("GameplayScene"); // continua la ejecucion del juego
        this.scene.sleep("PauseScene");
    }

    // Todo esto tiene que pasar para salir de la escena de juego (y de pausa)
    _exitGame()
    {
        this.game.sound.stopAll();
        this.audioUnpause.play();

        // ESTO COMPROBAR QUE FUNCIONE

        this.input.keyboard.disableGlobalCapture() 

        this.scene.launch("MenuScene", { isPlaying: false });
        this.scene.get("GameplayScene").enableInput(false);
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
}