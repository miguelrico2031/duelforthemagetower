// menu de usuario
// yo cuando mi codigo es horrible pero tengo 2 dias para hacerlo

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
    changeScreen;
    errorScreen;

    // Texto

    usernameText;
    stats;
    hitsGiven = 0;
    hitsTaken = 0;
    hitsDeflected = 0;
    wins = 0;
    losses = 0;

    oldPasswordForm;
    newPasswordForm;

    // Botones
    buttonLogout;
    buttonChangePass;
    buttonDeleteAccount;
    buttonExit;
    buttonConfirmDeletion;
    buttonAbortDeletion;
    buttonSaveNewPass;
    buttonAbortChange;

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
        this.load.spritesheet("change", "../Assets/UI/Screens/User/ChangePassButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("confirm", "../Assets/UI/Screens/User/YesDeleteButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("goBack", "../Assets/UI/Screens/User/NoButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("save", "../Assets/UI/Screens/User/SaveChangesButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("cancel", "../Assets/UI/Screens/User/CancelButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("exit", "../Assets/UI/Screens/Credits/cerrar.png", { frameWidth: 87, frameHeight: 55 });    

        // Pantallas de confirmación
        this.load.image("confirmation", "../Assets/UI/Screens/User/DeleteConfirmation.png");
        this.load.image("changePass", "../Assets/UI/Screens/User/ChangePassScreen.png");
        this.load.image("error", "../Assets/UI/Screens/User/ChangePassError.png");

        // Efectos de sonido
        this.load.audio("warning", "../Assets/UI/Sounds/Denied.wav");

        // Entrada de texto
        this.load.html({key : "oldpasswordform", url : "../oldpasswordform.html"});
        this.load.html({key : "newpasswordform", url : "../newpasswordform.html"});
    }

    create()
    {
        this.buttonPressed = false;

        // Fondo
        this.add.image(0, 0, "menu").setOrigin(0, 0);
        this.confirmationScreen = this.add.image(0, 0, "confirmation").setOrigin(0, 0).setVisible(false);
        this.changeScreen = this.add.image(0, 0, "changePass").setOrigin(0, 0).setVisible(false);
        this.errorScreen = this.add.image(0, 0, "error").setOrigin(0, 0).setVisible(false);

        // Texto
        // Nombre de usuario
        this.usernameText = this.add.text(viewport.width / 2, 125, user.username, 
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

        // Audios
        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioClose = this.sound.add("close");
        this.audioWarning = this.sound.add("warning");
        
        // Botones
        // Menú usuario
        this.buttonLogout = new Button(this, 350, 580, 1, true, "logout", () => this.logoutFunc());             // Cerrar sesión
        this.buttonChangePass = new Button(this, 650, 580, 1, true, "change", () => this.askChangePassword());  // Cambiar contraseña
        this.buttonDeleteAccount = new Button(this, 950, 580, 1, true, "delete", () => this.askDeleteAccount());// Borrar cuenta
        // Cambiar contraseña
        this.buttonSaveNewPass = new Button(this, 500, 475, 1, false, "save", () => this.changePassword());            // Guardar cambios
        this.buttonAbortChange = new Button(this, 800, 475, 1, false, "cancel", () => this.abortPasswordChange());     // Cancelar cambios
        // Borrar cuenta
        this.buttonConfirmDeletion = new Button(this, 500, 475, 1, false, "confirm", () => this.deleteAccount());      // Borrar cuenta
        this.buttonAbortDeletion = new Button(this, 800, 475, 1, false, "goBack", () => this.abortAccountDeletion());  // Cancelar borrado
        // Salir del menú
        this.buttonExit = new Button(this, 1045, 120, 1, true, "exit", () => this.closeUserScreen());           // Salir del perfil

        // Campos de texto cambio de contraseña
        // Contraseña vieja
        this.oldPasswordForm = this.add.dom(650, 325).createFromCache("oldpasswordform");
        this.oldPasswordForm.setPosition(viewport.width / 2, 325).setVisible(false);
        // Contraseña nueva
        this.newPasswordForm = this.add.dom(650, 325).createFromCache("newpasswordform");
        this.newPasswordForm.setPosition(viewport.width / 2, 400).setVisible(false);
    }

    // Función cierre de sesión
    logoutFunc()
    {
        // jQuery POST logout
        $.ajax
            ({
                method: "POST",
                url: IP + "/users/logout",
                data: JSON.stringify(user),
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

                // Borra los datos globales
                user = null;

                // Sale a la pantalla de login
                this.audioClose.play();
                this.scene.start("LoginScene", { isplaying: true });
            })
            .fail((data, textStatus, jqXHR) => 
            {
                console.log(textStatus+" "+jqXHR.status);
                console.log("Error cerrando sesión");
            });

    }

    // Funciones cambio de contraseña
    // Pantalla de confirmación
    askChangePassword()
    {
        this.setUserBaseScreenVisibility(false);

        this.setPasswordChangeScreenVisibility(true);
    }

    abortPasswordChange()
    {
        this.setPasswordChangeScreenVisibility(false);
        this.setUserBaseScreenVisibility(true);
    }

    // Cambio de contraseña
    changePassword() 
    {
        // cosas de API
        console.log("cambiar contraseña")
        console.log(this.oldPasswordForm)
        const oldPassword = this.oldPasswordForm.getChildByName("oldpass").value;
        const newPassword = this.newPasswordForm.getChildByName("newpass").value;

        if ((oldPassword !== '' && newPassword !== '') && (oldPassword === user.password))
        {
            // no se si tengo que modificar al usuario aqui y ahora pasarle esto o que

            const modifiedUser = 
            {
                username: user.username,
                password: newPassword
            }

            $.ajax
            ({
                method: "PUT",
                url: IP + "/users/changepassword",
                data: JSON.stringify(modifiedUser),
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

                // Actualizo la contraseña en la variable global
                user.password = data.password;

                this.setPasswordChangeScreenVisibility(false);
                this.setUserBaseScreenVisibility(true);
            })
            .fail((data, textStatus, jqXHR) => 
            {
                console.log(textStatus+" "+jqXHR.status);

                console.log("Error cambiando la contraseña");
            });            
        }


    }
    
    // Funciones borrado de cuenta
    // Pantalla de confirmación
    askDeleteAccount()
    {
        this.scene.get("MenuScene").menuSong.setVolume(0);
        this.audioWarning.play();

        this.setUserBaseScreenVisibility(false);

        // pantalla de confirmacion de eliminar
        this.setAccountDeletionScreenVisibility(true);

    }

    // Cancelación borrado
    abortAccountDeletion()
    {
        this.scene.get("MenuScene").menuSong.setVolume(0.35);
        this.setAccountDeletionScreenVisibility(false);
        this.setUserBaseScreenVisibility(true);
    }

    // Borrado de cuenta
    deleteAccount()
    {
        //jQuery DELETE account
        $.ajax
        ({
            method: "DELETE",
            url: IP + "/users/delete",
            data: JSON.stringify(user),
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

            // Borro los datos del config
            user = null;

            // Devuelve al usuario al menú de login
            this.audioClose.play();
            this.scene.get("MenuScene").menuSong.setVolume(0.35);
            this.scene.start("LoginScene");
        })
        .fail((data, textStatus, jqXHR) => 
        {
            console.log(textStatus+" "+jqXHR.status);
            console.log("Error eliminando la cuenta");
        });            

        
    }

    // Función para ocultar el menú base cuando se ponga otro por encima
    setUserBaseScreenVisibility(visibility)
    {
        // Gestiona la visibilidad de los botones de debajo 
        // (no es lo mas bonito pero es que si no se quedan al frente y es un poco feo)
        this.buttonLogout.setVisible(visibility);
        this.buttonChangePass.setVisible(visibility);
        this.buttonDeleteAccount.setVisible(visibility);
        this.buttonExit.setVisible(visibility);
        // también el texto de las estadísticas
        this.stats.setVisible(visibility);
    }

    setAccountDeletionScreenVisibility(visibility)
    {
        this.confirmationScreen.setVisible(visibility);
        this.buttonConfirmDeletion.setVisible(visibility);
        this.buttonAbortDeletion.setVisible(visibility);
    }

    setPasswordChangeScreenVisibility(visibility)
    {
        this.changeScreen.setVisible(visibility);
        this.oldPasswordForm.setVisible(visibility);
        this.newPasswordForm.setVisible(visibility);
        this.buttonAbortChange.setVisible(visibility);
        this.buttonSaveNewPass.setVisible(visibility);
    }

    // Salir de la pantalla de usuario
    closeUserScreen() 
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }

}