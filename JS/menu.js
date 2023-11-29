// menu principal
// no funciona :3
class Menu extends Phaser.Scene
{
    //publicas
    mainMenu;
    menuKeyIsPressed;

    //privadas
    menuScreen;
    menuKey;

    buttonPlay;
    buttonHelp;
    buttonCredits;

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
    }

    create()
    {
        this.mainMenu = true;

        this.add.image(0, 0, "menu").setOrigin(0, 0);

        //mitad izquierda
        this.buttonPlay = this.add.image(game.config.width / 4, game.config.height / 2, "play");
        this.buttonPlay.setInteractive();//.on('pointerdown', this.startGame, this);

        //mitad derecha, arriba
        this.buttonHelp = this.add.image((game.config.width / 4) * 3, game.config.height / 3, "help");
        this.buttonHelp.setInteractive();//.on('pointerdown', this.showHelp, this);

        //mitad derecha, abajo
        this.buttonCredits = this.add.image((game.config.width / 4) * 3, (game.config.height / 3) * 2, "credits");
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