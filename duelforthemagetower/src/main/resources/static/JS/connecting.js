class Connecting extends Phaser.Scene
{

    constructor()
    {
        super("ConnectingScene");
    }

    buttonClose;

    preload()
    {
        this.load.image("waitingScreen", "../Assets/UI/Screens/Loading/WaitingForPlayer.png");
        this.load.image("connectingScreen", "../Assets/UI/Screens/Loading/Connecting.png");
        this.load.image("loadingScreen", "../Assets/UI/Screens/Loading/Loading.png");


    }

    create()
    {
        this.add.image(0, 0, "waitingScreen").setOrigin(0, 0);
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

        // si el mensaje es timeout tal

        if(msg.info == "Sesion cerrada por tiempo de espera demasiado largo en la cola.")
        {
            console.log ("funcion de timeout o algo");
            //Hago visible el boton de salir
            this.buttonClose.setVisible(true);
            // Esto por si se lleva un rato (20 segundos sin hacer nada, que se cierre solo el error)
            setTimeout(() => {this.minTimeOver = true; this.closeScreen()}, 1000 * 20);
        }

        // si el mensaje es de partida encontrada cual
    }

    closeScreen()
    {
        this.audioClose.play();
        this.scene.start("MenuScene", { isPlaying: true });
    }
}