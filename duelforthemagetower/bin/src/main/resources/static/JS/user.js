// menu principal

class User extends Phaser.Scene
{
    //publicas

    constructor()
    {
        super("UserScene");
    }

    //privadas

    buttonPressed;

    userScreen;
    confirmationScreen;

    // Texto

    username;
    stats;
    hitsGiven = 0;
    hitsTaken = 0;
    hitsDeflected = 0;
    wins = 0;
    losses = 0;

    // Botones
    buttonLogout;
    buttonDelete;
    buttonClose;
    buttonConfirm;
    buttonCancel;

    // Audio
    audioClick;
    audioClack;
    audioClose;
    audioWarning;

    preload()
    {
        // Sprites botones
        this.load.spritesheet("logout", "../Assets/UI/Screens/User/LogoutButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("delete", "../Assets/UI/Screens/User/DeleteAccountButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("confirm", "../Assets/UI/Screens/User/YesDeleteButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("cancel", "../Assets/UI/Screens/User/NoButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("cerrar", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });    

        // Pantalla de confirmación
        this.load.image("confirmation", "../Assets/UI/Screens/User/DeleteConfirmation.png")

        // Fuente (FUNCION CREADA ABAJO)
        this.loadFont("GrapeSoda", "../Assets/Fonts/GrapeSoda.ttf");

        // Audio y música
        this.load.audio("warning", "../Assets/UI/Sounds/Denied.wav");
    }

    create()
    {
        this.buttonPressed = false;

        // Fondo
        this.add.image(0, 0, "menu").setOrigin(0, 0);
        this.confirmationScreen = this.add.image(0, 0, "confirmation").setOrigin(0, 0).setVisible(false);

        // Texto
        // Nombre de usuario
        this.username = this.add.text(viewport.width / 2, 125, 'USER', 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '64px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

        // Estadísticas
        this.stats = this.add.text(viewport.width / 2, 350, 
        'Golpes asestados:\t\t' + this.hitsGiven + '\n' +
        'Golpes recibidos:\t\t' + this.hitsTaken + '\n' +
        'Golpes desviados:\t\t' + this.hitsDeflected + '\n' +
        'Victorias:\t\t' + this.wins + '\n' +
        'Derrotas:\t\t' + this.losses, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '32px', 
            fill: '#000' 
        }).setOrigin(0.5, 0.5);

        // Botones
        this.buttonLogout = this.initLogoutButton();
        this.buttonDelete = this.initDeleteButton();
        this.buttonClose = this.initCloseButton();
        this.buttonConfirm = this.initConfirmButton();
        this.buttonCancel = this.initCancelButton();

        // Audios
        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioClose = this.sound.add("close");
        this.audioWarning = this.sound.add("warning");
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

    initLogoutButton()
    {
        let button = this.add.sprite(500, 580, "logout")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonLogout) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonLogout);
                this.logoutFunc(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonLogout) 
        );

        return button;
    }

    // botón rojo de "borrar cuenta"
    initDeleteButton()
    {
        let button = this.add.sprite(800, 580, "delete")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonDelete) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonDelete);
                this.askDeleteAccount(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonDelete) 
        );

        return button;
    }

    initCloseButton()
    {
        
        let button = this.add.sprite((game.config.width / 3.8) * 3.1, (game.config.height / 9.8) * 1.6, "cerrar")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonClose) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonClose);
                this.closeUserScreen(); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonClose) 
        );

        return button;
    }

    // botón de "si, borrar cuenta"
    initConfirmButton()
    {
        
        let button = this.add.sprite(500, 475, "confirm")
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonConfirm) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonConfirm);
                this.deleteAccount();
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonConfirm) 
        );

        return button;
    }

    // boton de "no, volver"
    initCancelButton()
    {
        let button = this.add.sprite(800, 475, "cancel")
            .setVisible(false)
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonCancel) })
            .on('pointerup', () => 
            { 
                this.scene.get("MenuScene").menuSong.setVolume(0.35);
                this.enterButtonRestState(this.buttonCancel);
                // texto de las estadísticas
                this.stats.setVisible(true);
                // pantalla de confirmacion de eliminar
                this.confirmationScreen.setVisible(false);
                this.buttonConfirm.setVisible(false);
                this.buttonCancel.setVisible(false);
                // restaura las cosas del usuario
                this.buttonLogout.setVisible(true);
                this.buttonDelete.setVisible(true);
                this.buttonClose.setVisible(true);
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonCancel) 
        );

        return button;
    }

    logoutFunc()
    {

        // cosas de API para cerrar sesión

        this.audioClose.play();
        this.scene.start("LoginScene");
    }

    askDeleteAccount()
    {
        this.scene.get("MenuScene").menuSong.setVolume(0);
        this.audioWarning.play();
        // oculto los botones de debajo (no es lo mas bonito pero es que si no se quedan al frente y es un poco feo)
        this.buttonLogout.setVisible(false);
        this.buttonDelete.setVisible(false);
        this.buttonClose.setVisible(false);
        // también el texto de las estadísticas
        this.stats.setVisible(false);
        // pantalla de confirmacion de eliminar
        this.confirmationScreen.setVisible(true);
        this.buttonConfirm.setVisible(true);
        this.buttonCancel.setVisible(true);

    }

    deleteAccount()
    {
        // cosas de API para borrar la cuenta

        // y que te mande al menu de login supongo
        this.scene.get("MenuScene").menuSong.setVolume(0.35);
        this.scene.start("LoginScene");
    }

    closeUserScreen() 
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }

    loadFont(name, url) {
        var newFont = new FontFace(name, `url(${url})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
        }).catch(function (error) {
            return error;
        });
    }

}