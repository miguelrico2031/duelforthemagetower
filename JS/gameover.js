class Gameover extends Phaser.Scene{


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
        this.load.image("p1_win", "../Assets/UI/Game Over Screens/P1 Win.png");
        this.load.image("p2_win", "../Assets/UI/Game Over Screens/P2 Win.png");

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

        if(this._winnerPlayer === 1){
            this.add.image(0, 0, "p1_win").setOrigin(0,0);
        } else {
            this.add.image(0, 0, "p2_win").setOrigin(0,0);
        }
        

        this._audioClick = this.sound.add("click");
        this._audioClack = this.sound.add("clack");
        
        this._buttonMenu = this.initMenuButton();

        this._buttonPlayAgain = this.initPlayAgainButton();
    }

    initMenuButton()
    {
        let button = this.add.sprite(viewport.width/2, viewport.height/2 - 10, "continuar")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonMenu) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonMenu);
                this.exitMenu(); 
            })
            .on('pointerout', () => this.enterButtonRestState(this._buttonMenu) 
        );

        return button;
    }

    initPlayAgainButton()
    {
        let button = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "salir")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonPlayAgain) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonPlayAgain);
                this.restartGame(); 
            }) 
            .on('pointerout', () => this.enterButtonRestState(this._buttonPlayAgain)
        );

        return button;
    }

    restartGame()
    {
        this._buttonPlayAgain.setFrame(0);
        this.scene.restart("GameplayScene"); // reinicia la escena del juego
        this.scene.start("GameplayScene"); 
    }

    exitMenu()
    {   
        this._buttonMenu.setFrame(0);
        console.log("Salir al menú");
        //this.scene.switch("MenuScene"); 
        
    }


    enterButtonClickState(button) 
    {
        this._audioClick.play(); 
        button.setFrame(1);
        this._buttonPressed = true;
    }

    enterButtonRestState(button)
    {
        if(this._buttonPressed) this._audioClack.play();
        button.setFrame(0);
        this._buttonPressed = false;
    }
}