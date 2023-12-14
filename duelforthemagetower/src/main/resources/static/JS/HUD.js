class HUD {

    // Variables del juego
    gameScene;
    player;
    iconKey;

    // Margenes del HUD respecto a los bordes de la pantalla
    marginX = 24;
    marginY = 48;

    // Separación de los corazones en funcion de los iconos de jugador
    hearts_displacement_y = 20;
    hearts_displacement_x = 36;
    hearts_separation = 24; // Separacion entre los propios corazones
    heartScale = 1.5;       // Escala de los sprites de los corazones ( + grande = + borroso)

    // Cabeceras de funcion
    createHeart;

    // Variable privada para gestión de barra de vida
    indexes;

    constructor(scene, player, iconKey) 
    {   
        // Variables de juego

        this.gameScene = scene;
        this.player = player;
        this.iconKey = iconKey;

        // Icono del jugador
        this.initPlayerIcon();

        // Corazones
        this.initPlayerHealthBar();      
    }


    onTakeDamage(health)
    {
        // Esto sirve para bajar la vida de derecha a izquierda en el jugador 1, y al revés en el jugador 2
        this.indexes = [0, 1, 2];
        if(this.player.id !== 1) for (let i = 0; i < 3; i++) this.indexes[i]= 2 - i;

        switch (health)
        {   // Gestiona los cambios de los sprites de la barra de vida
            case 5:
                this.switchHeartSprite(2, "heart_half");
                break;
            case 4:
                this.switchHeartSprite(2, "heart_empty");
                break;
            case 3:
                this.switchHeartSprite(1, "heart_half");
                break;
            case 2:
                this.switchHeartSprite(1, "heart_empty");
                break;
            case 1:
                this.switchHeartSprite(0, "heart_half");
                break;
            case 0:
                this.switchHeartSprite(0, "heart_empty");
                break;
                        
        }
        this.updateSprites();
    }

    // Crea el icono del jugador y su animación correspondiente
    initPlayerIcon()
    {
        // Sirve para hacer la simetria horizontal para la posición de los iconos del jugador 2
        let x = this.player.id === 1 ? this.marginX * 2  : viewport.width - this.marginX * 2;

        let playericon = this.gameScene.add.sprite(x, this.marginY, this.iconKey)

        // Si ya se ha creado la animacion me interesa saltarme esta parte para que no de advertencias
        if(!gameplayResourcesLoaded) 
        {
            this.gameScene.anims.create
            ({
                key: this.iconKey,
                frames: this.gameScene.anims.generateFrameNumbers(this.iconKey, { start: 0, end: 3 }),
                duration: 500,
                repeat: -1
            });
        }

        playericon.anims.play(this.iconKey, true);
    }

    // Crea la barra de vida del jugador
    initPlayerHealthBar()
    {
        // Igual que en initPlayerIcon, pero esta vez cuenta con un desplazamiento extra para separar los corazones de los iconos
        let x = this.player.id === 1 ? (this.marginX + this.hearts_displacement_x) * 2  : viewport.width - (this.marginX + this.hearts_displacement_x) * 2;

        // Crea el sprite del corazón. Como hay 3 tipos, pues segun la key que se le pase como parámetro (lleno/mitad/vacio)
        this.createHeart = (key, x) => this.gameScene.add.image(x, this.marginY + this.hearts_displacement_y, key).setScale(this.heartScale)

        this.heart_list = 
        [
            {   // Corazon 1
                x: x - this.hearts_separation ,
                image: this.createHeart("heart_full", x - this.hearts_separation)
            },
            {   // Corazon 2
                x: x ,
                image: this.createHeart("heart_full", x)
            },
            {   // Corazon 3
                x: x + this.hearts_separation ,
                image: this.createHeart("heart_full", x + this.hearts_separation)
            },
        ]

        // Le da la vuelta a los corazones para la barra del jugador 2
        this.updateSprites();

        // Actualiza la barra de vida si el jugador recibe daño
        this.player.addHitListener((h) => this.onTakeDamage(h));   
    }

    // Destruye el sprite que tenía y reemplazarlo por uno del corazón a medias o vacío, según la key
    switchHeartSprite(index, heartSpriteKey)
    {
        this.heart_list[this.indexes[index]].image.destroy();
        this.heart_list[this.indexes[index]].image = this.createHeart(heartSpriteKey, this.heart_list[this.indexes[index]].x);
    }

    // Voltea los sprites para el jugador 2
    updateSprites = () =>  this.heart_list.forEach((h) => h.image.flipX = this.player.id === 1);
}