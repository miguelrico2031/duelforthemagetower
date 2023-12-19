class Stats extends Phaser.Scene
{

    //publicas

    //privadas
    _pauseKey;

    _buttonPressed;     // para saber si el botón está siendo pulsado / clicado

    _buttonContinue;    // botón de continuar
    _buttonExit;        // botón de salir
    _buttonClose;

    _audioClick;        // sonido al pulsar
    _audioClack;        // sonido al soltar
    _audioClose;      // sonido al salir del menú

    _statsJ1;
    _statsJ2;

    _usernameJ1;
    _usernameJ2;

    _userJ1;
    _userJ2;


    //Metodos publicos
    constructor() 
    {
        super("StatsScene");
    }

    preload()
    {
        this.load.image("stats_screen", "../Assets/UI/Screens/Stats/Stats.png");
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
        
    }

    init(data){
        this._userJ1 = data.J1stats;
        this._userJ2 = data.J2stats;
    }


    create()
    {
        console.log("Se ha creado stats");
        this._buttonPressed = false;

        this.add.image(0, 0, "stats_screen").setOrigin(0, 0);

        this._audioClick = this.sound.add("click");
        this._audioClack = this.sound.add("clack");

        this._buttonClose = this._initCloseButton();
        this._audioClose = this.sound.add("close");

        /* 
        const userJ1Promise = this._getUser("miguel"); // En el getUser deberia ir el user loggeado
        const userJ2Promise = this._getUser("julio");  // Y en este el username del user rival
    
        // Usamos promise, para esperar a que los valores asincronos se carguen antes de cargar el resto de la UI
        Promise.all([userJ1Promise, userJ2Promise])
            .then(([userJ1Data, userJ2Data]) => {
                this._userJ1 = userJ1Data;
                this._userJ2 = userJ2Data;

                console.log(this._userJ1);
                */
        this._usernameJ1 = this.add.text((viewport.width / 2) - 135, 300, this._userJ1.username, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '48px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

        // Estadísticas
        this._statsJ1 = this.add.text((viewport.width / 2) - 140, 400, 
        'Golpes asestados:\t\t' + this._userJ1.hitsGiven + '\n' +
        'Golpes recibidos:\t\t' + this._userJ1.hitsTaken + '\n' +
        'Golpes desviados:\t\t' + this._userJ1.hitsDeflected + '\n' +
        'Victorias:\t\t' + this._userJ1.wins + '\n' +
        'Derrotas:\t\t' + this._userJ1.losses, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '30px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

        this._usernameJ2 = this.add.text((viewport.width / 2) + 135, 300, this._userJ2.username, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '48px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

        // Estadísticas
        this._statsJ2 = this.add.text((viewport.width / 2) + 140, 400, 
        'Golpes asestados:\t\t' + this._userJ2.hitsGiven + '\n' +
        'Golpes recibidos:\t\t' + this._userJ2.hitsTaken + '\n' +
        'Golpes desviados:\t\t' + this._userJ2.hitsDeflected + '\n' +
        'Victorias:\t\t' + this._userJ2.wins + '\n' +
        'Derrotas:\t\t' + this._userJ2.losses, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '30px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

    /*
        })
        .catch((error) => {
            console.error("Error en la solicitud AJAX:", error);
        });

         */
    }
    


    //Metodos privados

    _getUser(username) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: IP + "/stats/" + username
            }).done(function (data) {
                resolve(data);
            }).fail(function (error) {
                reject(error);
            });
        });
    }
    
    _initCloseButton()
    {
        
        let button = this.add.sprite(900, 200, "cerrar").setScale(0.6)
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this._enterButtonClickState(this._buttonClose) })
            .on('pointerup', () => 
            { 
                this._enterButtonRestState(this._buttonClose);
                this._closeStats(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this._enterButtonRestState(this._buttonClose) 
        );

        return button;
    }

    _closeStats() 
    {
        this._audioClose.play();
        this.scene.stop("StatsScene");
        this.scene.start("GameoverScene");
        
    }

    // Esto es lo que debe hacer el boton al ser pulsado
    _enterButtonClickState(button) 
    {
        this._audioClick.play(); 
        button.setFrame(1);
        this._buttonPressed = true;
    }

    // Esto seria cuando el boton deja de estar pulsado
    _enterButtonRestState(button)
    {
        // pongo el frame de la animacion sin pulsar pq si no se ve como si se quedase pillado y no queremos eso
        if(this._buttonPressed) this._audioClack.play();
        button.setFrame(0);
        this._buttonPressed = false;
    }

}