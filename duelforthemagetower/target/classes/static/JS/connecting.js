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

        connection = new WebSocket('ws://' + window.location.href.slice(6) + 'match');
        
        // Enviar el user con el que quiero jugar
        connection.onopen = () =>
        {
            console.log("conexion abierta")
            const userData = {username : user.username}

            connection.send('!' + JSON.stringify(userData));
        }

        // recibir mensajes del ws

        connection.onmessage = (msg) => this.processWsMessage(msg.data);
        
        // timeout error

        connection.onerror = function(e) {
            console.log("WS error: " + e);
        }

        // boton para cancelar partida que envie un mensaje de cancelar
    }
    
    update()
    {
        


    }

    processWsMessage(msg)
    {
        msg = JSON.parse(msg)
        if(msg.info) console.log(msg.info)

        else if(msg.error) console.log(msg.error)

        else if(msg.username) console.log(msg)

        // si el mensaje es timeout
        if(msg.info == "Sesion cerrada por tiempo de espera demasiado largo en la cola.")
        {
            // Mostrar el error al jugador
            this.timeoutErrorScreen.setVisible(true);
            //Hago visible el boton de salir
            this.buttonClose.setVisible(true);
            // Esto por si se lleva un rato (20 segundos sin hacer nada, que se cierre solo el error)
            setTimeout(() => {this.minTimeOver = true; this.closeScreen()}, 1000 * 20);
        }

        // si el mensaje es de partida encontrada
        // uso el includes porque el mensaje de info contiene una variable del 
        // nombre de usuario rival y no puedo conocerla a priori
        if(msg.info == "Sesion de emparejamiento iniciada para " + user.username + ".")
        {
            console.log("JUEGO ONLINE");
            // Cambio el mensaje a conectando
            this.connectingScreen.setVisible(false);
            this.searchingScreen.setVisible(true);
        }

        // ahora con el msg que me indique que se ha encontrado a otro jugador
        {

        // Por ahora pongo que a los 5 segundos lance el juego normal pero
            // 1. habria q hacerlo cuando la conexion esté completa
            // 2. tendría que lanzar el juego online
            //this.scene.start("GameplayScene");
        }
    }


    closeScreen()
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }
}