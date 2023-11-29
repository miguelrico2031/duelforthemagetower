class Pause extends Phaser.Scene
{

    //publicas
    gameIsPaused;
    pauseKeyIsPressed;

    //privadas
    pauseScreen;
    pauseKey;

    buttonContinue;
    buttonExit;

    //Metodos publicos
    constructor(scene) 
    {
        super("PauseScene");
    }

    preload()
    {
        this.load.image("pause_screen", "../Assets/UI/Pause Menus/Pause Base.png");
        this.load.image("continuar", "../Assets/UI/Pause Menus/PAUSA_DUMMY.png");
        this.load.image("salir", "../Assets/UI/Pause Menus/CONTINUAR_DUMMY.png");
    }

    create()
    {
        this.gameIsPaused = true;

        this.add.image(0, 0, "pause_screen").setOrigin(0, 0);

        // La forma de poner los botones es lo mas terrorifico feo e ineficiente que he hecho en mi vida dios mio
        // pero tampoco hay otra pq usar el setorigin con estas da errores y por lo q sea usar solo el viewport no las centra
        this.buttonContinue = this.add.image(viewport.width/2, viewport.height/2 - 10, "continuar");
        this.buttonExit = this.add.image(viewport.width/2, 120 + viewport.height/2, "salir");
        
        this.buttonContinue.setInteractive();
        this.buttonExit.setInteractive();

        
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    }
    
    update()
    {
        console.log("paused: " + this.gameIsPaused)
        this.processInput();
    }

    //Metodos privados
    
    processInput()
    {
        // eventos de teclado

        if (this.gameIsPaused) this.checkPauseToggled();

        if (!this.gameIsPaused) this.resumeGame();

        // Eventos de ratón
        this.buttonContinue.on('pointerdown', () => { this.resumeGame(); });
        this.buttonExit.on('pointerdown', () => { console.log('Salir del Juego'); });
    }
    
    resumeGame()
    {
        this.pauseKeyIsPressed = false;
        this.scene.start("GameplayScene");
    }

    checkPauseToggled() 
    {
        if (this.pauseKey.isDown && !this.pauseKeyIsPressed) {
            console.log("pabajo");
            this.pauseKeyIsPressed = true;
        }

        if (this.pauseKey.isUp && this.pauseKeyIsPressed) {
            console.log("parriba");
            this.pauseKeyIsPressed = false;
            this.gameIsPaused = false;
        }
    }
}