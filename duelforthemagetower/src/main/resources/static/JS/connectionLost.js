class ConnectionLost extends Phaser.Scene
{
    buttonClose;

    audioClick;
    audioClack;
    audioClose;

    //Metodos publicos
    constructor(scene) 
    {
        super("ConnectionLostScene");
    }

    preload()
    {
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.image("disconnectError", "../Assets/UI/Screens/Error/JugadorDesconectado.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
        this.load.audio("close", "../Assets/UI/Sounds/Unpause.wav");
    }

    create()
    {
        this.add.image(0, 0, "disconnectError").setOrigin(0, 0);

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioClose = this.sound.add("close");

        this.buttonClose = new Button(this, 900, 200, 0.6, true, "cerrar", () => this.closeScreen());
        
    }

    closeScreen() 
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }

}