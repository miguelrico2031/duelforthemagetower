class Pause extends Phaser.Scene
{

    //publicas
    pauseKeyIsPressed;  // comprueba si estoy pulsando escape

    //privadas
    _pauseKey;

    _buttonPressed;     // para saber si el botón está siendo pulsado / clicado

    _buttonContinue;    // botón de continuar
    _buttonExit;        // botón de salir

    audioClick;        // sonido al pulsar
    audioClack;        // sonido al soltar
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

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this._audioUnpause = this.sound.add("unpause");

        // La forma de poner los botones es lo mas terrorifico feo e ineficiente que he hecho en mi vida dios mio
        // pero tampoco hay otra pq usar el setorigin con estas da errores y por lo q sea usar solo el viewport no las centra

        this._buttonContinue = new Button(this, 640, 350, 1, true, "continuar", () => this._resumeGame());
        this._buttonExit = new Button(this, 640, 480, 1, true, "salir", () => this._exitGame());
        this._buttonMute = new Button(this, 880, 220, 1, true, "mute", () => this._toggleSound());
        this._buttonSound = new Button(this, 880, 220, 1, true, "sonido", () => this._toggleSound());
        
        this._pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
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
        this.scene.get("GameplayScene").enableInput(false);
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
}