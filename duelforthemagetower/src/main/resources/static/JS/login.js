class Login extends Phaser.Scene
{
    //publicas
    login;

    //privadas

    userExists;
    userExistsScreen;

    buttonPressed;

    buttonClose;
    buttonCreate;
    buttonLogin;
    buttonBack;

    audioClick;
    audioClack;
    audioOpen;
    audioClose;

    usernameForm;
    passwordForm;

    //Metodos publicos
    constructor(scene) 
    {
        super("LoginScene");
    }

    preload()
    {
        this.load.image("loginScreen", "../Assets/UI/Screens/User/LoginScreen.png");
        this.load.image("alreadyExistsScreen", "../Assets/UI/Screens/User/UserAlreadyExists.png");
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("login", "../Assets/UI/Screens/User/LoginButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("signup", "../Assets/UI/Screens/User/SignupButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("okback", "../Assets/UI/Screens/User/OkBackButton.png", { frameWidth: 167, frameHeight: 106 });

        this.load.html({key : "textform", value : "../textform.html"});
        this.load.html({key : "passwordform", value : "../passwordform.html"});

    }

    create()
    {
        this.buttonPressed = false;
        this.userExists = false;

        this.add.image(0, 0, "loginScreen").setOrigin(0, 0);

        // Pantalla de error si el usuario ya existe
        this.userExistsScreen = this.add.image(0, 0, "alreadyExistsScreen").setOrigin(0, 0);
        this.userExistsScreen.setVisible(false);

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioOpen = this.sound.add("open");
        this.audioClose = this.sound.add("close");

        this.buttonClose = this.initCloseButton();
        this.buttonLogin = this.initLoginButton();
        this.buttonSignup = this.initSignupButton();
        this.buttonBack = this.initBackButton();

        // Usuario
        this.usernameForm = this.add.dom(650, 325).createFromCache("textform")
        this.usernameForm.setPosition(960, 325);

        // Contraseña
        this.passwordForm = this.add.dom(650, 325).createFromCache("passwordform");
        this.passwordForm.setPosition(960, 400);
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
        
        let button = this.add.sprite(900, 200, "cerrar").setScale(0.6)
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonClose) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonClose);
                this.closeLogin(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonClose) 
        );

        return button;
    }

    initLoginButton()
    {
        
        let button = this.add.sprite(500, 480, "login")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonLogin) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonLogin);
                this.loginFunc(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonLogin) 
        );

        return button;
    }

    initSignupButton()
    {
        
        let button = this.add.sprite(800, 480, "signup")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonSignup) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonSignup);
                this.signupFunc(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonSignup) 
        );

        return button;
    }

    initBackButton()
    {
        
        let button = this.add.sprite(650, 480, "okback")
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonBack) })
            .on('pointerup', () => 
            {
                this.enterButtonRestState(this.buttonBack);
                this.goBack();
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonBack) 
            
        );

        return button;
    }

    loginFunc()
    {
        // cosas de la api

        this.audioOpen.play();
        this.scene.start("UserScene", { isplaying: true });
    }

    signupFunc()
    {
        // cosas de la API
        // Yo creo que lo mejor sería hacer que se cree el usuario y

        // si el usuario ya existía
        this.userAlreadyExists();

        // si no existía
        // creas al usuario e inmediatamente le inicias sesión con
        const inputUsername = this.getChildByName("text").value;
        const inputPassword = this.getChildByName("pass").value;

        if (inputUsername !== '' && inputPassword !== '')
        {
            const user = 
            {
                username: inputUsername,
                password: inputPassword
            }
            
            $.ajax
            ({
                method: "POST",
                url: "http://127.0.0.1:8080/users/signup",
                data: JSON.stringify(user),
                headers: 
                {
                    "Content-type":"application/json"
                }
            })
            .done((data, textStatus, jqXHR) => console.log(textStatus+" "+jqXHR.statusCode()))
            .fail((data, textStatus, jqXHR) => console.log(textStatus+" "+jqXHR.statusCode()));

        }
    }

    closeLogin() 
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }

    // se que todo esto es super optimizable pero bueno
    userAlreadyExists()
    {
        this.userExistsScreen.setVisible(true);
        this.buttonBack.setVisible(true);
        this.buttonClose.setVisible(false);
        this.buttonLogin.setVisible(false);
        this.buttonSignup.setVisible(false);
        this.usernameForm.setVisible(false);
        this.passwordForm.setVisible(false);
    }

    goBack()
    {
        this.userExistsScreen.setVisible(false); 
        this.buttonBack.setVisible(false);
        this.buttonClose.setVisible(true);
        this.buttonLogin.setVisible(true);
        this.buttonSignup.setVisible(true);
        this.usernameForm.setVisible(true);
        this.passwordForm.setVisible(true);
        this.userExists = false;
    }

}