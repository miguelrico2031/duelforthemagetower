// menu principal

class Menu extends Phaser.Scene
{
    //publicas
    mainMenu;
    menuKeyIsPressed;

    //privadas

    buttonPressed;

    menuScreen;
    menuKey;

    buttonPlayLocal;
    buttonPlayOnline;
    buttonHelp;
    buttonCredits;
    buttonUser;
    buttonMute;
    buttonSound;

    audioClick;
    audioClack;
    audioOpen;
    menuSong;

    _isAudioPlaying;
    //Metodos publicos
    constructor(scene) 
    {
        super("MenuScene");
    }

    preload()
    {
        this.load.spritesheet("online", "../Assets/UI/Screens/MainMenu/PlayOnline.png", { frameWidth: 266, frameHeight: 180 });
        this.load.spritesheet("local", "../Assets/UI/Screens/MainMenu/PlayLocal.png", { frameWidth: 266, frameHeight: 180 });
        this.load.spritesheet("credits", "../Assets/UI/Screens/MainMenu/CreditsButton.png", { frameWidth: 214, frameHeight: 135 });
        this.load.spritesheet("help", "../Assets/UI/Screens/MainMenu/HelpButton.png", { frameWidth: 214, frameHeight: 135 });
        this.load.spritesheet("user", "../Assets/UI/Screens/MainMenu/UserButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("sonido", "../Assets/UI/sonido.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("mute", "../Assets/UI/mute.png", { frameWidth: 87, frameHeight: 55 });
        this.load.image("menu", "../Assets/UI/Screens/MainMenu/menu.png");
        this.load.image("logo", "../Assets/UI/Screens/MainMenu/LogoMenu.png");
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
        this.load.audio("menuSong", "../Assets/Sounds/Music/MenuSong.wav");
        this.load.audio("open", "../Assets/UI/Sounds/Pause.wav");
        this.load.audio("close", "../Assets/UI/Sounds/Unpause.wav");
    }

    init(data){
        this._isAudioPlaying = data.isPlaying;
    }

    create()
    {
        this.buttonPressed = false;

        this.mainMenu = true;

        this.add.image(0, 0, "menu").setOrigin(0, 0);

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioOpen = this.sound.add("open");

        //this.Logo = this.add.image(game.config.width / 2.833, game.config.height / 3, "logo");

        
        this.menuSong = this.sound.add("menuSong", {volume: 0.35});

        if(!this._isAudioPlaying){

            this.menuSong.play();
            this.menuSong.setLoop(true);
        }

        this.buttonPlayOnline = new Button(this, 450, 300, 1, true, "online", () => this.startOnlineGame());
        this.buttonPlayLocal = new Button(this, 450, 500, 1, true, "local", () => this.startLocalGame());
        this.buttonHelp = new Button(this, 865, 230, 0.8, true, "help", () => this.showHelp()); 
        this.buttonCredits = new Button(this, 865, 380, 0.8, true, "credits", () => this.showCredits());
        this.buttonUser = new Button(this, 865, 530, 1, true, "user", () => this.showLoginScreen());
        this.buttonMute = new Button(this, 1045, 120, 1, true, "mute", () => this.toggleSound());
        this.buttonSound = new Button(this, 1045, 120, 1, true, "sonido", () => this.toggleSound());

        if (!this.game.sound.mute) 
        {
            this.buttonSound.setVisible(true);
            this.buttonMute.setVisible(false);
        } 
        else if (this.game.sound.mute) 
        {
            this.buttonSound.setVisible(false);
            this.buttonMute.setVisible(true);
        }
    }

    startOnlineGame()
    {
        // Si no ha iniciado sesión, se lleva a la pantalla para hacerlo
        if (user === null) this.showLoginScreen();
        // Si la sesión está iniciada, se procede al matchmaking
        else this.scene.start("ConnectingScene");
    }

    startLocalGame() 
    {
        this.game.sound.stopAll();
        this.scene.start("GameplayScene");
    }

    showHelp() 
    {
        this.audioOpen.play();
        this.scene.start("TutorialScene");
    }

    showCredits() 
    {
        this.audioOpen.play();
        this.scene.start("CreditsScene");
    }

    showLoginScreen()
    {
        if (user === null)
        {
            this.scene.start("LoginScene");
            this.audioOpen.play();
        }
        else // Si ya inició sesión
        {
            this.showUserScreen();
        }
    }

    toggleSound()
    {
        if (!this.game.sound.mute)
        {
            this.game.sound.mute = true;
            this.buttonSound.setVisible(false);
            this.buttonMute.setVisible(true);
        }
        else if (this.game.sound.mute)
        {
            this.game.sound.mute = false;
            this.buttonSound.setVisible(true);
            this.buttonMute.setVisible(false);
        }

    }

    showUserScreen()
    {
        const loginUser = 
        {
            username: user.username,
            password: user.password
        }

        $.ajax
        ({
            method: "POST",
            url: IP + "/users/login",
            data: JSON.stringify(loginUser),
            headers: 
            {
                "Content-type":"application/json"
            }
        })
        .done((data, textStatus, jqXHR) => 
        {
            console.log(textStatus+" "+ jqXHR.status);
            console.log(data);
            console.log(jqXHR.statusCode())

            this.audioOpen.play();
            this.scene.start("UserScene", { isplaying: true });

        })
        .fail((data, textStatus, jqXHR) => 
        {
            console.log(textStatus+" "+jqXHR.status);
        });
    }
}