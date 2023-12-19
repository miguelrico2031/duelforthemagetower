class Gameover extends Phaser.Scene{


    //private 
    _buttonPressed;
    _winnerPlayer;

    _buttonMenu;
    _buttonPlayAgain;
    _buttonStats;

    buttonGg;

    audioClick;
    audioClack;

    opponent;
    chatText;

    _J1Stats;
    _J2Stats;

    constructor(){
        super("GameoverScene");
    }

    preload(){
        this.load.image("p1_win", "../Assets/UI/Screens/GameOver/P1Win.png");
        this.load.image("p2_win", "../Assets/UI/Screens/GameOver/P2Win.png");

        this.load.spritesheet("bye", "../Assets/UI/Screens/GameOver/byeButton.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("congrats", "../Assets/UI/Screens/GameOver/enhorabuenaButton.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("other", "../Assets/UI/Screens/GameOver/otraButton.png", { frameWidth: 320, frameHeight: 45 });
        this.load.spritesheet("gg", "../Assets/UI/Screens/GameOver/bienButton.png", { frameWidth: 320, frameHeight: 45 });

        this.load.spritesheet("btn_menu", "../Assets/UI/Screens/GameOver/MenuButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_replay", "../Assets/UI/Screens/GameOver/ReplayButton.png", { frameWidth: 167, frameHeight: 106 });
        this.load.spritesheet("btn_stats", "../Assets/UI/Screens/GameOver/StatsButton.png", { frameWidth: 167, frameHeight: 106 });
        
        this.load.audio("click", "../Assets/UI/Sounds/Minimalist4.wav");
        this.load.audio("clack", "../Assets/UI/Sounds/Minimalist7.wav");
    }

    init(data){
        this._winnerPlayer = data.winner;
        this._J1Stats = data.J1stats;
        this._J2Stats = data.J2stats;
    }

    create(){
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

        this.buttonGg = this.initGgButton();
        this.buttonCongrats = this.initCongratsButton();
        this.buttonOther = this.initOtherButton();
        this.buttonBye = this.initByeButton();

        this.ChatStarted = false;
        this.startChatFunction(); //los if de luego por si esto no va
    }

    update(){
        this.time.delayedCall(100,()=>this.retrieveChat());
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
        this.game.sound.stopAll();
        this.scene.restart("GameplayScene"); // reinicia la escena del juego
        this.scene.start("GameplayScene"); 
    }

    exitMenu()
    {   
        console.log("Salir al menú");
        this.game.sound.stopAll();
        this.scene.launch("MenuScene", { isPlaying: false });
        this.scene.stop("GameplayScene");
        this.scene.sleep("GameoverScene");
        
    }

    seeStats(){
        this.scene.sleep("GameoverScene");
        
        this.scene.start("StatsScene", { J1stats: this._J1Stats, J2stats: this._J2Stats  }); 
        
    }

    initGgButton()
    {
        
        let button = this.add.sprite(635, 300, "gg")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonGg) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonGg);
                this.chatButtonFunction("¡Bien jugado!"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonGg) 
        );

        return button;
    }

    initCongratsButton()
    {
        
        let button = this.add.sprite(635, 420, "congrats")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonCongrats) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonCongrats);
                this.chatButtonFunction("¡Enhorabuena!"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonCongrats) 
        );

        return button;
    }

    initOtherButton()
    {
        
        let button = this.add.sprite(635, 360, "other")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonOther) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonOther);
                this.chatButtonFunction("¿Jugamos otra?"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonOther) 
        );

        return button;
    }

    initByeButton()
    {
        
        let button = this.add.sprite(635, 480, "bye")
            .setInteractive({ useHandCursor: true })
            // lo cambio para que se vea la animacion y se ejecute la accion al SOLTAR el boton y no pulsarlo
            .on('pointerdown', () => { this.enterButtonClickState(this.buttonBye) })
            .on('pointerup', () => 
            { 
                this.enterButtonRestState(this.buttonBye);
                this.chatButtonFunction("Adiós"); 
            })
            // vale esto es por si por lo q sea te interesa q al salir el cursor del boton se reinicie la animacion
            .on('pointerout', () => this.enterButtonRestState(this.buttonBye) 
        );

        return button;
    }

    
    chatButtonFunction(text){
        console.log("okkk");
        if (this.ChatStarted == false) this.startChatFunction();
        if (this.ChatStarted) this.sendMessage(text);
    }

    //ajax
    startChatFunction() {

        if (user == null){
            if (!this.loginError) 
            {
                console.log("iniciar sesión") 
                this.loginError = true;
            }
            return;
        }

        const gameUser = 
        {
            username: user.username,
            password: user.password
        };

        if (user == null) return;
        $.ajax
            ({
                method: "POST",
                url: IP + "/chat/start",
                data: JSON.stringify(gameUser),
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
                console.log("chat iniciado");
                this.ChatStarted = true; 
                this.opponent = data.otherUsername;    
            })
            .fail((data, textStatus, jqXHR) => 
            {
                // Texto de error
                console.log(textStatus+" "+jqXHR.status);
                console.log("error al iniciar chat");
            });  
    }

    retrieveChat(){

        
        if(!this.ChatStarted) return; //no tiene mucho sentido tener que iniciar tú el chat primero?¡??
        let opponentMessage = "texto";
        this.chatText = this.add.text(viewport.width / 2 + 310, viewport.height / 2 - 150, opponentMessage, 
        { 
            fontFamily: 'GrapeSoda',
            fontSize: '24px', 
            fill: 'black' 
        }).setOrigin(0, 0);
    
    
        $.ajax({
            url: IP + "/chat/" + user.username
        })
        .done((data)=>
        {
            this.chatText = data.chat
        })
        .fail((error)=>
        {
            console.log(error);
        });
    }

    sendMessage(msg){
        const message = {
            username: user.username,
            otherUsername: this.opponent,
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
                console.log(textStatus+" "+ jqXHR.status);
                console.log(data);
                console.log(jqXHR.statusCode())  
                console.log("mensaje enviado");            
            })
            .fail((data, textStatus, jqXHR) => 
            {
                // Texto de error
                console.log(textStatus+" "+jqXHR.status);
                console.log("error al enviar mensaje");
            }); 

    }


}