class Tutorial extends Phaser.Scene
{
    //publicas
    tutorial;

    //privadas

    tutorialScreen;
    currentScreenIdx;

    buttonPressed;

    buttonClose;
    buttonArrow;

    audioClick;
    audioClack;

    //Metodos publicos
    constructor(scene) 
    {
        super("TutorialScene");
    }

    preload()
    {
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Tutorial/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("flecha", "../Assets/UI/Screens/Tutorial/next.png", { frameWidth: 87, frameHeight: 55 });
        this.load.image("tutorial", "../Assets/UI/Screens/Tutorial/controles.png");
        this.load.image("objetivo", "../Assets/UI/Screens/Tutorial/objetivo.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    create()
    {
        this.buttonPressed = false;

        this.tutorial = true;

        this.tutorialScreen = this.add.image(0, 0, "tutorial").setOrigin(0, 0);
        this.objectiveScreen = this.add.image(0, 0, "objetivo").setOrigin(0, 0).setVisible(false);
        this.currentScreenIdx = 1;

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");

        this.buttonClose = this.initCloseButton();
        this.buttonArrow = this.initArrowButton();
        
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
                this.closeTutorial(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonClose) 
        );

        return button;
    }

    initArrowButton()
    {
        let button = this.add.sprite((game.config.width / 3.8) * 0.7, (game.config.height / 9.8) * 1.6, "flecha")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonArrow) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonArrow);
                this.showNextPage(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonArrow) 
        );

        return button;
    }

    closeTutorial() {

        this.scene.start("MenuScene", { isPlaying: true });

    }

    showNextPage()
    {
        if (this.currentScreenIdx == 1)
        {
            this.tutorialScreen.setVisible(false);
            this.objectiveScreen.setVisible(true);
            this.currentScreenIdx = 2;
            this.buttonArrow.toggleFlipX();
        }
        else if (this.currentScreenIdx == 2)
        {
            this.tutorialScreen.setVisible(true);
            this.objectiveScreen.setVisible(false);
            this.currentScreenIdx = 1;
            this.buttonArrow.toggleFlipX();
            
        }
    }

}