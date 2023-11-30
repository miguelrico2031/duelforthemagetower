class Gameover extends Phaser.Scene{

    //public
    gameEnded;

    //private 
    _buttonPressed;
    _winnerPlayer;

    _buttonMenu;
    _buttonPlayAgain;

    _audioClick;
    _audioClack;

    constructor(){
        super("GameoverScene");
    }

    preload(){
        this.load.image("winner_bg", "../Assets/UI/Game Over Screens/P" + this._winnerPlayer + " Win.png");

        this.load.spritesheet("continuar", "../Assets/UI/Pause Menus/Continue_spritesheet.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("salir", "../Assets/UI/Pause Menus/Exit_spritesheet.png", { frameWidth: 167, frameHeight: 106 });
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    init(data){
        this._winnerPlayer = data.winner;
    }

    create(){
        this._buttonPressed = false;

        this.add.image(0, 0, "winner_bg").setOrigin(0,0);
        

        this._audioClick = this.sound.add("click");
        this._audioClack = this.sound.add("clack");
        
        this._buttonMenu = this.initMenuButton();

        this._buttonPlayAgain = this.initPlayAgainButton();
    }

    initMenuButton()
    {
        let button = this.add.sprite(viewport.width/2, viewport.height/2 - 10, "continuar")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonContinue) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonContinue);
                this.resumeGame(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this._buttonContinue) 
        );

        return button;
    }

    initPlayAgainButton()
    {
        let button = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "salir")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonExit) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonExit);
                this.exitGame(); 
            }) 
            .on('pointerout', () => this.enterButtonRestState(this._buttonExit)
        );

        return button;
    }

    enterButtonClickState(button) 
    {
        this._audioClick.play(); 
        button.setFrame(1);
        this._buttonPressed = true;
    }

    enterButtonRestState(button)
    {
        // pongo el frame de la animacion sin pulsar pq si no se ve como si se quedase pillado y no queremos eso
        if(this._buttonPressed) this._audioClack.play();
        button.setFrame(0);
        this._buttonPressed = false;
    }
}