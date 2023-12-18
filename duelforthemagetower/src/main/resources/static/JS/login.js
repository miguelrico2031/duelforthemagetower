// IMPORTANTE AÑADIR QUE SE MANTENGA LA SESION INICIADA

class Login extends Phaser.Scene
{
    //privadas

    userExistsScreen;

    buttonClose;
    buttonCreate;
    buttonLogin;
    buttonBack;

    audioClick;
    audioClack;
    audioOpen;
    audioClose;

    errorText;

    usernameForm;
    passwordForm;

    //Metodos publicos
    constructor(scene) 
    {
        super("LoginScene");
    }

    preload()
    {
        // Imagenes y fondos
        this.load.image("loginScreen", "../Assets/UI/Screens/User/LoginScreen.png");
        this.load.image("alreadyExistsScreen", "../Assets/UI/Screens/User/UserAlreadyExists.png");

        // Sprites botones
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.spritesheet("login", "../Assets/UI/Screens/User/LoginButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("signup", "../Assets/UI/Screens/User/SignupButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("okback", "../Assets/UI/Screens/User/OkBackButton.png", { frameWidth: 167, frameHeight: 106 });

        // Formularios entrada de texto
        this.load.html({key : "textform", url : "../textform.html"});
        this.load.html({key : "passwordform", url : "../passwordform.html"});

    }

    create()
    {
        // Imagen de fondo
        this.add.image(0, 0, "loginScreen").setOrigin(0, 0);

        // Pantalla de error si el usuario ya existe
        this.userExistsScreen = this.add.image(0, 0, "alreadyExistsScreen").setOrigin(0, 0);
        this.userExistsScreen.setVisible(false);

        // Texto de error de contraseña
        this.errorText = this.add.text(viewport.width / 2 - 180, viewport.height / 2, 'El usuario \no contraseña \nson erróneos', 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '16px', 
            fill: 'red' 
        }).setOrigin(0.5, 0.5).setVisible(false);

        // Efectos de sonido
        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioOpen = this.sound.add("open");
        this.audioClose = this.sound.add("close");

        // Botones
        this.buttonClose = new Button(this, 900, 200, 0.6, true, "cerrar", () => this.closeLogin());
        this.buttonLogin = new Button(this, 500, 480, 1, true, "login", () => this.loginFunc());
        this.buttonSignup = new Button(this, 800, 480, 1, true, "signup", () => this.signupFunc());
        this.buttonBack = new Button(this, 650, 480, 1, false, "okback", () => this.userAlreadyExists(false));

        // Campo de texto usuario
        this.usernameForm = this.add.dom(650, 325).createFromCache("textform")
        this.usernameForm.setPosition(viewport.width / 2, 325);

        // Campo de texto contraseña
        this.passwordForm = this.add.dom(650, 325).createFromCache("passwordform");
        this.passwordForm.setPosition(viewport.width / 2, 400);
    }

    // Función a ejecutar al pulsar el botón de inicio de sesión
    loginFunc()
    {
        // Lectura de datos introducidos
        const inputUsername = this.usernameForm.getChildByName("text").value;
        const inputPassword = this.passwordForm.getChildByName("pass").value;

        // Comprobación de valores no nulos
        if (inputUsername !== '' && inputPassword !== '')
        {
            // Objeto que se enviará al servidor
            const loginUser = 
            {
                username: inputUsername,
                password: inputPassword
            }

            // jQuery POST login
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
                // DEBUG estado servidor
                console.log(textStatus+" "+ jqXHR.status);
                console.log(data);
                console.log(jqXHR.statusCode())

                // Actualizo los datos globales para conocer la identidad del usuario
                // a lo largo de la sesión
                user = 
                {
                    username: data.username,
                    password: data.password
                }

                // Cambio de escena a la del perfil del jugador
                this.audioOpen.play();
                this.scene.start("UserScene", { isplaying: true });

            })
            .fail((data, textStatus, jqXHR) => 
            {
                // Texto de error
                console.log(textStatus+" "+jqXHR.status);

                // Función notificando el error al usuario
                this.wrongCredentials();
            });            
        }


    }

    signupFunc()
    {
        // Lectura de valores en los campos de texto
        const inputUsername = this.usernameForm.getChildByName("text").value;
        const inputPassword = this.passwordForm.getChildByName("pass").value;

        // Comprobación de valores no nulos
        if (inputUsername !== '' && inputPassword !== '')
        {

            // Objeto que se envía al servidor
            const signupUser = 
            {
                username: inputUsername,
                password: inputPassword
            }
            
            // jQuery POST signup
            $.ajax
            ({
                method: "POST",
                url: IP + "/users/signup",
                data: JSON.stringify(signupUser),
                headers: 
                {
                    "Content-type":"application/json"
                }
            })
            // Si sale bien
            .done((data, textStatus, jqXHR) => 
            {
                // DEBUG estado servidor
                console.log(textStatus+" "+ jqXHR.status);
                console.log(data);
                console.log(jqXHR.statusCode())

                // Actualizo los datos para saber que usuario soy y mantener la sesión iniciada
                user = 
                {
                    username: data.username,
                    password: data.password
                }

                // Se inicia sesión automáticamente, por lo que se comporta igual que en login
                this.audioOpen.play();
                this.scene.start("UserScene", { isplaying: true });
            })
            // Si falla
            .fail((data, textStatus, jqXHR) => 
            {
                // Información del error al usuario
                console.log(textStatus+" "+jqXHR.status);
                this.userAlreadyExists(true);
            });

        }
    }

    // Función para cerrar la pantalla de login y volver al menú principal
    closeLogin() 
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }

    // Función para mostrar al usuario un mensaje de error si introduce datos erróneos
    wrongCredentials()
    {
        this.errorText.setVisible(true);
        //this.time.delayedCall(300000000, this.hideText()); este mierdon no va
    }

    // NO ACTIVA. Función para ocultar el texto de error
    hideText()
    {
        this.errorText.setVisible(false);
    }

    // se que todo esto es super optimizable pero bueno
    // Función para mostrar al usuario la pantalla que indica que el usuario ya existe
    // y no se puede crear uno nuevo.
    userAlreadyExists(showScreen)
    {
        // Elementos de la pantalla de aviso
        this.userExistsScreen.setVisible(showScreen);
        this.buttonBack.setVisible(showScreen);

        // Elementos de la pantalla de login
        this.buttonClose.setVisible(!showScreen);
        this.buttonLogin.setVisible(!showScreen);
        this.buttonSignup.setVisible(!showScreen);
        this.usernameForm.setVisible(!showScreen);
        this.passwordForm.setVisible(!showScreen);
        this.errorText.setVisible(!showScreen);
    }
}