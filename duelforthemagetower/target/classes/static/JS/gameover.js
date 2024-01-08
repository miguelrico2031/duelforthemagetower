class Gameover extends Phaser.Scene{


    //private 
    _buttonPressed;
    _winnerPlayer;

    _buttonMenu;
    _buttonPlayAgain;
    _buttonStats;

    audioClick;
    audioClack;

    
    _J1Stats;
    _J2Stats;
    
    chatText; //texto en pantalla del ultimo chat recibido
    //errorText;
    otherUsername; //username del otro usuario del chat
    lastReceivedChat; //ultimo objeto GameChat reibido
    retrieveChatInterval; //interval que llama a retrieveChat

    constructor()
    {
        super("GameoverScene");
    }

    preload(){
        this.load.image("p1_win", "../Assets/UI/Screens/GameOver/P1Win.png");
        this.load.image("p2_win", "../Assets/UI/Screens/GameOver/P2Win.png");

        this.load.spritesheet("chipi", "../Assets/UI/Screens/GameOver/chipi.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("chapa", "../Assets/UI/Screens/GameOver/chapa.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("dubi", "../Assets/UI/Screens/GameOver/dubi.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("daba", "../Assets/UI/Screens/GameOver/daba.png", { frameWidth: 320, frameHeight: 45 });

        this.load.spritesheet("btn_menu", "../Assets/UI/Screens/GameOver/MenuButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_replay", "../Assets/UI/Screens/GameOver/ReplayButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_stats", "../Assets/UI/Screens/GameOver/StatsButton.png", { frameWidth: 167, frameHeight: 106 });
        
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    init(data)
    {
        this._winnerPlayer = data.winner;
        this._J1Stats = data.J1stats;
        this._J2Stats = data.J2stats;
    }

    create()
    {
        this._buttonPressed = false;


        if(this._winnerPlayer === 1){
            this.add.image(0, 0, "p1_win").setOrigin(0,0);
        } else {
            this.add.image(0, 0, "p2_win").setOrigin(0,0);
        }


        this.audioClick = this.sound.add("click");
        this.audioClack = this.sound.add("clack");
        
        this._buttonMenu = new Button(this, 150 + viewport.width/2, 230 + viewport.height/2, 0.7, true, "btn_menu", ()=>this.exitMenu());
        this._buttonStats = new Button(this, viewport.width/2 - 150, 230 + viewport.height/2, 0.7, true, "btn_stats", ()=>this.seeStats());
        this._buttonPlayAgain = new Button(this, viewport.width/2, 230 + viewport.height/2, 0.7, true, "btn_replay", ()=>this.restartGame());

        //aviso al jugador
        if (user==null) {
            this.errorText = this.add.text(viewport.width / 2 - 100, viewport.height / 2, 'Necesitas iniciar sesión\npara poder usar el chat', 
            { 
                fontFamily: 'GrapeSoda',
                fontSize: '20px', 
                fill: 'red' 
            }).setOrigin(0, 0);
        }
        
        this.startChat(); //funcion que inicializa el chat si es posible
    }
    
    enterButtonClickState(button) 
    {
        this.audioClick.play(); 
        button.setFrame(1);
        this._buttonPressed = true;
    }

    enterButtonRestState(button)
    {
        if(this._buttonPressed) this.audioClack.play();
        button.setFrame(0);
        this._buttonPressed = false;
    }

    restartGame()
    {
        if(this.retrieveChatInterval !== null) clearInterval(this.retrieveChatInterval);
        this.game.sound.stopAll();
        this.scene.restart("GameplayScene"); // reinicia la escena del juego
        this.scene.start("GameplayScene"); 
    }

    exitMenu()
    {   
        if(this.retrieveChatInterval !== null) clearInterval(this.retrieveChatInterval);
        console.log("Salir al menú");
        this.game.sound.stopAll();
        this.scene.launch("MenuScene", { isPlaying: false });
        this.scene.stop("GameplayScene");
        this.scene.sleep("GameoverScene");
        
    }

    seeStats(){
        if(this.retrieveChatInterval !== null) clearInterval(this.retrieveChatInterval);
        this.scene.sleep("GameoverScene");
        
        this.scene.start("StatsScene", { J1stats: this._J1Stats, J2stats: this._J2Stats  }); 
        
    }

    initChatButtonsAndText()
    {
        
        this.buttonGg = this.add.sprite(635, 300, "chipi")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonGg) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonGg);
                this.sendMessage("chipi chipi"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonGg));


        this.buttonCongrats = this.add.sprite(635, 420, "dubi")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonCongrats) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonCongrats);
                this.sendMessage("dubi dubi"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonCongrats));


        this.buttonOther = this.add.sprite(635, 360, "chapa")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonOther) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonOther);
                this.sendMessage("chapa chapa"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonOther));
            
            
            this.buttonBye = this.add.sprite(635, 480, "daba")
                .setInteractive({ useHandCursor: true })
                // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
                .on('pointerdown', () => { this.enterButtonClickState(this.buttonBye) })
                .on('pointerup', () => 
                { 
                    this.enterButtonRestState(this.buttonBye);
                    this.sendMessage("daba daba"); 
                })
                // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
                .on('pointerout', () => this.enterButtonRestState(this.buttonBye));
            

            this.chatText = this.add.text(viewport.width / 2 + 310, viewport.height / 2 - 150, "", 
                { 
                    fontFamily: 'GrapeSoda',
                    fontSize: '24px', 
                    fill: 'black' 
                }).setOrigin(0, 0);
    }

    disableChatButtonsAndText()
    {
        this.buttonGg.setActive(false).setVisible(false);
        this.buttonCongrats.setActive(false).setVisible(false);
        this.buttonOther.setActive(false).setVisible(false);
        this.buttonBye.setActive(false).setVisible(false);
        this.chatText.setActive(false).setVisible(false);
    }

    //ajax
    startChat()
    {
        // miguel no me mates porfa lo he hecho en el create
        if (user == null)
        {
            //aqui poner aviso en el juego de "no se pudo iniciar chat, tienes que iniciar sesion"
            return;
        }


        $.ajax
            ({
                method: "POST",
                url: IP + "/chat/start",
                data: JSON.stringify({ username: user.username, otherUsername: this._J1Stats.username }),
                headers: 
                {
                    "Content-type":"application/json"
                }
            })
            
            .done((data, textStatus, jqXHR) => 
            {
                // DEBUG estado servidor
                console.log("chat iniciado");
                console.log(textStatus+" "+ jqXHR.status);
                console.log(data);
                console.log(jqXHR.statusCode())  

                this.otherUsername = data.otherUsername;  
                
                //SOLO si hemos cosneguido iniciar el chat inicializamos los botones
                this.initChatButtonsAndText();

                //y el mensaje de chat

                this.lastReceivedChat = null;

                this.retrieveChatInterval = setInterval(() => this.retrieveChat(), 0.5 * 1000)

            })

            .fail((data, textStatus, jqXHR) => 
            {
                // Texto de error
                console.log("error al iniciar chat, no hay usuarios disponibles");
                console.log(textStatus+" "+jqXHR.status);
                //Aqui aviso en el juego de "no hay usuarios disponibles para chatear"
                this.errorText = this.add.text(viewport.width / 2 - 170, viewport.height / 2, 'No hay usuarios disponibles para chatear', 
                { 
                    fontFamily: 'GrapeSoda',
                    fontSize: '20px', 
                    fill: 'red' 
                }).setOrigin(0, 0);
                this.retrieveChatInterval = null;
            });  
    }

    retrieveChat(){
        
        console.log("retrieveando");
        $.ajax
        ({
            url: IP + "/chat/" + user.username
        })
        .done((data)=>
        {

            if(this.lastReceivedChat === null || this.lastReceivedChat.id !== data.id)
            {
                this.lastReceivedMessage = data;
                this.chatText.text = data.text;
            }

        })
        .fail((error)=>
        {
            console.log("error al recibir mensaje, el otro user se desconecto");
            console.log(error);

            this.errorText = this.add.text(viewport.width / 2, viewport.height / 2, 'Chat terminado. El otro usuario se desconectó', 
                { 
                    fontFamily: 'GrapeSoda',
                    fontSize: '20px', 
                    fill: 'red' 
                }).setOrigin(0.5, 0.5);

            this.disableChatButtonsAndText();
            clearInterval(this.retrieveChatInterval); //para la ejecucion de este metodo
        });
    }

    
    sendMessage(msg){
        const message = {
            username: user.username,
            otherUsername: this.otherUsername,
            text: msg
        }
        $.ajax
        ({
            method: "PUT",
            url: IP + "/chat/send",
            data: JSON.stringify(message),
            headers: 
            {
                "Content-type":"application/json"
            }
        })
        .done((data, textStatus, jqXHR) => 
        {
            // DEBUG estado servidor
            console.log("mensaje enviado");            
            console.log(textStatus+" "+ jqXHR.status);
            console.log(data);
        })
        .fail((data, textStatus, jqXHR) => 
        {
            // Texto de error
            console.log("error al enviar mensaje");
            console.log(textStatus+" "+jqXHR.status);
            //Mostrar en el juego mensaje de: "no se pudo enviar el mensaje"
            this.errorText = this.add.text(viewport.width / 2 - 100, viewport.height / 2, 'No se pudo enviar el mensaje', 
            { 
                fontFamily: 'GrapeSoda',
                fontSize: '20px', 
                fill: 'red' 
            }).setOrigin(0, 0);
        }); 

    }


}