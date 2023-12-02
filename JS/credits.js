class Credits extends Phaser.Scene
{
    //publicas
    credits;

    //privadas

    buttonPressed;

    buttonClose;

    audioClick;
    audioClack;

    //Metodos publicos
    constructor(scene) 
    {
        super("CreditsScene");
    }

    preload()
    {
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.image("creditos", "../Assets/UI/Screens/Credits/credits.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    create()
    {
        this.buttonPressed = false;

        this.credits = true;

        this.add.image(0, 0, "creditos").setOrigin(0, 0);

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");

        this.buttonClose = this.initCloseButton();
        
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

    initCloseButton()
    {
        
        let button = this.add.sprite((game.config.width / 3.8) * 3.1, (game.config.height / 9.8) * 1.6, "cerrar")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonClose) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonClose);
                this.closeCredits(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonClose) 
        );

        return button;
    }

    closeCredits() {

        this.scene.start("MenuScene", { isPlaying: true });

    }

}