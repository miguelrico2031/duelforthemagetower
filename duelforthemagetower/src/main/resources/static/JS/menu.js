// menu principal

class Menu extends Phaser.Scene
{
    //publicas
    mainMenu;
    menuKeyIsPressed;

    //privadas

    buttonPressed;

    menuScreen;
    menuKey;

    buttonPlay;
    buttonHelp;
    buttonCredits;
    buttonMute;
    buttonSound;

    audioClick;
    audioClack;
    audioOpen;
    menuSong;

    _isAudioPlaying;
    //Metodos publicos
    constructor(scene) 
    {
        super("MenuScene");
    }

    preload()
    {
        this.load.spritesheet("play", "../Assets/UI/Screens/MainMenu/PlayButton.png", { frameWidth: 267, frameHeight: 168 });
        this.load.spritesheet("credits", "../Assets/UI/Screens/MainMenu/CreditsButton.png", { frameWidth: 214, frameHeight: 135 });
        this.load.spritesheet("help", "../Assets/UI/Screens/MainMenu/HelpButton.png", { frameWidth: 214, frameHeight: 135 });
        this.load.spritesheet("sonido", "../Assets/UI/sonido.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("mute", "../Assets/UI/mute.png", { frameWidth: 87, frameHeight: 55 });
        this.load.image("menu", "../Assets/UI/Screens/MainMenu/menu.png");
        this.load.image("logo", "../Assets/UI/Screens/MainMenu/LogoMenu.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
        this.load.audio("menuSong", "../Assets/Sounds/Music/MenuSong.wav");
        this.load.audio("open", "../Assets/UI/Sounds/Pause.wav");
    }

    init(data){
        this._isAudioPlaying = data.isPlaying;
    }

    create()
    {
        this.buttonPressed = false;

        this.mainMenu = true;

        this.add.image(0, 0, "menu").setOrigin(0, 0);

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioOpen = this.sound.add("open");

        this.Logo = this.add.image(game.config.width / 2.833, game.config.height / 3, "logo");

        
        this.menuSong = this.sound.add("menuSong", {volume: 0.35});

        if(!this._isAudioPlaying){

            this.menuSong.play();
            this.menuSong.setLoop(true);
        }

        this.buttonPlay = this.initPlayButton();
        this.buttonHelp = this.initHelpButton();
        this.buttonCredits = this.initCreditsButton();
        this.buttonMute = this.initMuteButton();
        this.buttonSound = this.initSoundButton();

        if (!this.game.sound.mute) 
        {
            this.buttonSound.setVisible(true);
            this.buttonMute.setVisible(false);
        } 
        else if (this.game.sound.mute) 
        {
            this.buttonSound.setVisible(false);
            this.buttonMute.setVisible(true);
        }
    }
    

    enterButtonClickState(button) 
    {
        this.audioClick.play(); 
        button.setFrame(1);
        this.buttonPressed = true;
    }

    enterButtonRestState(button)
    {
        // pongo el frame de la animacion sin pulsar pq si no se ve como si se quedase pillado y no queremos eso
        if(this.buttonPressed) this.audioClack.play();
        button.setFrame(0);
        this.buttonPressed = false;
    }

    initPlayButton()
    {
        
        let button = this.add.sprite(game.config.width / 2.833, game.config.height / 1.44, "play")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonPlay) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonPlay);
                this.startGame(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonPlay) 
        );

        return button;
    }

    initHelpButton()
    {
        
        let button = this.add.sprite((game.config.width / 4.425) * 3, game.config.height / 2.7, "help")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonHelp) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonHelp);
                this.showHelp(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonHelp) 
        );

        return button;
    }

    initCreditsButton()
    {
        
        let button = this.add.sprite((game.config.width / 4.425) * 3, (game.config.height / 2.95) * 2, "credits")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonCredits) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonCredits);
                this.showCredits(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonCredits) 
        );

        return button;
    }

    initMuteButton()
    {
        
        let button = this.add.sprite((game.config.width / 3.8) * 3.1, (game.config.height / 9.8) * 1.6, "mute")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonMute) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonMute);
                this.toggleSound(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonMute) 
        );
        return button;
    }

    initSoundButton()
    {
        
        let button = this.add.sprite((game.config.width / 3.8) * 3.1, (game.config.height / 9.8) * 1.6, "sonido")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonSound) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonSound);
                this.toggleSound(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonSound) 
        );
        return button;
    }

    startGame() 
    {
        this.game.sound.stopAll();
        this.scene.start("GameplayScene");

    }

    showHelp() 
    {
        this.audioOpen.play();
        this.scene.start("TutorialScene");
    }

    showCredits() 
    {
        this.audioOpen.play();
        this.scene.start("CreditsScene");
    }

    toggleSound()
    {
        if (!this.game.sound.mute)
        {
            this.game.sound.mute = true;
            this.buttonSound.setVisible(false);
            this.buttonMute.setVisible(true);
        }
        else if (this.game.sound.mute)
        {
            this.game.sound.mute = false;
            this.buttonSound.setVisible(true);
            this.buttonMute.setVisible(false);
        }

    }
}