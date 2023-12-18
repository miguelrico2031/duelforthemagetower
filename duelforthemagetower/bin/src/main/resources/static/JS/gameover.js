class Gameover extends Phaser.Scene{


    //private 
    _buttonPressed;
    _winnerPlayer;

    _buttonMenu;
    _buttonPlayAgain;
    _buttonStats;

    _audioClick;
    _audioClack;

    constructor(){
        super("GameoverScene");
    }

    preload(){
        this.load.image("p1_win", "../Assets/UI/Screens/GameOver/P1Win.png");
        this.load.image("p2_win", "../Assets/UI/Screens/GameOver/P2Win.png");

        this.load.spritesheet("btn_menu", "../Assets/UI/Screens/GameOver/MenuButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_replay", "../Assets/UI/Screens/GameOver/ReplayButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_stats", "../Assets/UI/Screens/GameOver/StatsButton.png", { frameWidth: 167, frameHeight: 106 });
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

        this._buttonStats = this.initStatsButton();

        this._buttonPlayAgain = this.initPlayAgainButton();
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

    initMenuButton()
    {
        let button = this.add.sprite(viewport.width/2, 120 + viewport.height/2, "btn_menu")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonMenu) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonMenu);
                this.exitMenu(); 
            })
            .on('pointerout', () => this.enterButtonRestState(this._buttonMenu) 
        ).setScale(.7);

        return button;
    }

    initStatsButton()
    {
        let button = this.add.sprite(viewport.width/2, 40 + viewport.height/2, "btn_stats")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonStats) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonStats);
                this.seeStats(); 
            })
            .on('pointerout', () => this.enterButtonRestState(this._buttonStats) 
        ).setScale(.7);

        return button;
    }

    initPlayAgainButton()
    {
        let button = this.add.sprite(viewport.width/2, viewport.height/2 - 40, "btn_replay")
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => { this.enterButtonClickState(this._buttonPlayAgain) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this._buttonPlayAgain);
                this.restartGame(); 
            }) 
            .on('pointerout', () => this.enterButtonRestState(this._buttonPlayAgain)
        ).setScale(.7);

        return button;
    }

    restartGame()
    {
        this.game.sound.stopAll();
        this.scene.restart("GameplayScene"); // reinicia la escena del juego
        this.scene.start("GameplayScene"); 
    }

    exitMenu()
    {   
        console.log("Salir al menú");
        this.game.sound.stopAll();
        this.scene.launch("MenuScene", { isPlaying: false });
        this.scene.stop("GameplayScene");
        this.scene.sleep("GameoverScene");
        
    }

    seeStats(){
        this.scene.sleep("GameoverScene");
        
        this.scene.start("StatsScene"); 
        
    }

}