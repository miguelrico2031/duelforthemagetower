// menu principal
// no funciona :3
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

    audioClick;
    audioClack;

    //Metodos publicos
    constructor(scene) 
    {
        super("MenuScene");
    }

    preload()
    {
        this.load.image("menu", "../Assets/UI/Menu Principal/menu.png");
        this.load.image("play", "../Assets/UI/Menu Principal/play_dummy.png");
        this.load.image("help", "../Assets/UI/Menu Principal/help_dummy.png");
        this.load.image("credits", "../Assets/UI/Menu Principal/credits_dummy.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    create()
    {
        this.buttonPressed = false;

        this.mainMenu = true;

        this.add.image(0, 0, "menu").setOrigin(0, 0);

        this._audioClick = this.sound.add("click");
        this._audioClack = this.sound.add("clack");

        //mitad izquierda
        this.buttonPlay = this.add.image(game.config.width / 2.833, game.config.height / 2, "play");
        this.buttonPlay.setInteractive().on('pointerdown', this.startGame, this);

        this.buttonPlay = this.initPlayButton();



        //mitad derecha, arriba
        this.buttonHelp = this.add.image((game.config.width / 4.425) * 3, game.config.height / 3.6, "help");
        this.buttonHelp.setInteractive();//.on('pointerdown', this.showHelp, this);

        //mitad derecha, abajo
        this.buttonCredits = this.add.image((game.config.width / 4.425) * 3, (game.config.height / 2.82) * 2, "credits");
        this.buttonCredits.setInteractive();//.on('pointerdown', this.showCredits, this);
        
        this.menuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);
    }
    
    update()
    {
        this.processInput();
    }

    //métodos privados
    
    processInput() {
        if (Phaser.Input.Keyboard.JustDown(this.menuKey)) {
            this.scene.start("MenuScene");
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
        
        let button = this.add.sprite(game.config.width / 2.833, game.config.height / 2, "play")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonPlay) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonPlay);
                this.resumeGame(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonPlay) 
        );

        return button;
    }

    startGame() {
        console.log("Iniciando el juego");
        this.scene.start("GameplayScene");

    }

    showHelp() {
        console.log("Cómo jugar");
        //mimimi la interfaz no existe
    }

    showCredits() {
        console.log("Pantalla de créditos");
        //mimimi la interfaz no existe
    }
}