class MainMenu extends Phaser.Scene {

    menuKey;

    constructor() {
        super("MainMenuScene");
    }

    preload() {
        this.load.image("menu", "../Assets/UI/Menu Principal/menu.png");
        this.load.image("button_play", "../Assets/UI/Menu Principal/menu.png");
        this.load.image("button_help", "../Assets/UI/Menu Principal/help_dummy.png");
        this.load.image("button_credits", "../Assets/UI/Menu Principal/credits_dummy.png");
    }

    create() {

        this.mainMenu = true;

        this.add.image(0, 0, "menu").setOrigin(0, 0);

        //mitad izquierda
        const buttonPlay = this.add.image(game.config.width / 4, game.config.height / 2, "button_play");
        buttonPlay.setInteractive().on('pointerdown', this.startGame, this);

        //mitad derecha, arriba
        const buttonHelp = this.add.image((game.config.width / 4) * 3, game.config.height / 3, "button_help");
        buttonHelp.setInteractive().on('pointerdown', this.showHelp, this);

        //mitad derecha, abajo
        const buttonCredits = this.add.image((game.config.width / 4) * 3, (game.config.height / 3) * 2, "button_credits");
        buttonCredits.setInteractive().on('pointerdown', this.showCredits, this);

        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB);

    }

    startGame() {
        console.log("Comenzar juego");
        //mimimi
    }

    showHelp() {
        console.log("Mostrar ayuda");
        // mimimi
    }

    showCredits() {
        console.log("Mostrar créditos");
        //blablabla
    }
}

// para q sea lo primero que se inicia¿¿¿
/*
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainMenu, OtherScenes],//nose
};

const game = new Phaser.Game(config);
*/