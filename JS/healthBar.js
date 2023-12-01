class HealthBar {

    // Variables del juego
    gameScene;
    player;

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

    constructor(scene, player, iconKey) 
    {   
        // Variables de juego

        this.gameScene = scene;
        this.player = player;

        // Icono del jugador

        // Sirve para hacer la simetria horizontal para los iconos del jugador 2
        let x = player.id === 1 ? this.marginX * 2  : viewport.width - this.marginX * 2;

        let playericon = this.gameScene.add.sprite(x, this.marginY, iconKey)

        // Si ya se ha creado la animacion me interesa saltarme esta parte para que no de advertencias
        if(!gameplayResourcesLoaded) 
        {
            scene.anims.create
            ({
                key: iconKey,
                frames: scene.anims.generateFrameNumbers(iconKey, { start: 0, end: 3 }),
                duration: 500,
                repeat: -1
            });
        }

        playericon.anims.play(iconKey, true);
        
        // Corazones

        // Igual que arriba
        x = player.id === 1 ? (this.marginX + this.hearts_displacement_x) * 2  : viewport.width - (this.marginX - this.hearts_displacement_x) * 2;

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
        player.addHitListener((h) => this.onTakeDamage(h));         
    }


    onTakeDamage(health)
    {
        // Esto sirve para bajar la vida de derecha a izquierda en el jugador 1, y al revés en el jugador 2
        let indexes = [0, 1, 2];
        if(this.player.id !== 1) for (let i = 0; i < 3; i++) indexes[i]= 2 - i;

        switch (health)
        {   // Cada caso lo que hace es destruir el sprite que tenía y reemplazarlo por uno del corazón a medias o vacío
            case 5:
                this.heart_list[indexes[2]].image.destroy();
                this.heart_list[indexes[2]].image = this.createHeart("heart_half", this.heart_list[indexes[2]].x);
                break;
            case 4:
                this.heart_list[indexes[2]].image.destroy();
                this.heart_list[indexes[2]].image = this.createHeart("heart_empty", this.heart_list[indexes[2]].x);
                break;
            case 3:
                this.heart_list[indexes[1]].image.destroy();
                this.heart_list[indexes[1]].image = this.createHeart("heart_half", this.heart_list[indexes[1]].x);
                break;
            case 2:
                this.heart_list[indexes[1]].image.destroy();
                this.heart_list[indexes[1]].image = this.createHeart("heart_empty", this.heart_list[indexes[1]].x);
                break;
            case 1:
                this.heart_list[indexes[0]].image.destroy();
                this.heart_list[indexes[0]].image = this.createHeart("heart_half", this.heart_list[indexes[0]].x);
                break;
            case 0:
                this.heart_list[indexes[0]].image.destroy();
                this.heart_list[indexes[0]].image = this.createHeart("heart_empty", this.heart_list[indexes[0]].x);
                break;
                        
        }
        this.updateSprites();
    }

    updateSprites = () =>  this.heart_list.forEach((h) => h.image.flipX = this.player.id === 1);
}