class Connecting extends Phaser.Scene
{

    constructor()
    {
        super("ConnectingScene");
    }

    searchingScreen;
    connectingScreen;
    loadingScreen;
    timeoutErrorScreen;
    disconnectErrorScreen;
    buttonClose;

    preload()
    {
        // Pantallas informativas
        this.load.image("waitingScreen", "../Assets/UI/Screens/Loading/WaitingForPlayer.png");
        this.load.image("connectingScreen", "../Assets/UI/Screens/Loading/Connecting.png");
        this.load.image("loadingScreen", "../Assets/UI/Screens/Loading/Loading.png");

        // Pantallas de error
        this.load.image("timeoutError", "../Assets/UI/Screens/Error/partidaNOencontrada.png");
        this.load.image("disconnectError", "../Assets/UI/Screens/Error/JugadorDesconectado.png");

    }

    create()
    {
        this.connectingScreen = this.add.image(0, 0, "connectingScreen").setOrigin(0, 0);
        this.searchingScreen = this.add.image(0, 0, "waitingScreen").setOrigin(0, 0).setVisible(false);
        this.loadingScreen = this.add.image(0, 0, "loadingScreen").setOrigin(0, 0).setVisible(false);
        this.timeoutErrorScreen = this.add.image(0, 0, "timeoutError").setOrigin(0, 0).setVisible(false);
        this.disconnectErrorScreen = this.add.image(0, 0, "disconnectError").setOrigin(0, 0).setVisible(false);

        this.buttonClose = new Button(this, 900, 200, 0.6, false, "cerrar", () => this.closeScreen());

        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        this.audioOpen = this.sound.add("open");
        this.audioClose = this.sound.add("close");

        //WebSocket();

        
        
        // Enviar el user con el que quiero jugar
        openWS(() => this.onWSOpen(), () => this.onWSError());
        wsMessageCallbacks.push((msg) => this.processWSMessage(msg.data))

        

        // boton para cancelar partida que envie un mensaje de cancelar
    }

    onWSOpen()
    {
        console.log("conexion abierta")
        const userData = {username : user.username}

        connection.send('!' + JSON.stringify(userData));
    }

    onWSError()
    {
        console.log("no se ha podido conectar, volviendo al menu.")
        this.closeScreen();
    }

    processWSMessage(msg)
    {
        msg = JSON.parse(msg)

        if(msg.onStart) //si es el mensaje de respuesta al intentar iniciar una sesion
        {
            if(msg.error) console.log(msg.error);

            else if(msg.info) //el usuario entro en la cola de emparejamiento
            {
                console.log(msg.info);
                this.connectingScreen.setVisible(false);
                this.searchingScreen.setVisible(true);
            }
            return;
        }

        if(msg.onQueue)
        {
            if(msg.queueTimeout)  // si el mensaje es timeout
            {
                console.log(msg.error); // Mostrar el error al jugador
                this.timeoutErrorScreen.setVisible(true);
                //Hago visible el boton de salir
                this.buttonClose.setVisible(true);
                // Esto por si se lleva un rato (20 segundos sin hacer nada, que se cierre solo el error)
                setTimeout(() => {this.minTimeOver = true; this.closeScreen()}, 1000 * 20);
            }

            if(msg.matchStart)
            {
                matchData = msg;

                wsMessageCallbacks.shift(); //quitar el callback del array

        		this.game.sound.stopAll();
                this.scene.start("OnlineGameplayScene");
            }
        }
    }


    closeScreen()
    {
        this.game.sound.stopAll();
        this.audioClose.play();
        if(connection != null && connection.readyState < 2) connection.close();
        this.scene.start("MenuScene", { isPlaying: true });
    }
}