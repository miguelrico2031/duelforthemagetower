class HealthBar {

    hearts_number = 3; //luego la cambias a vida max / 2 idk
    hearts_p1;
    hearts_p2;

    marginX = 84;
    marginY = 64;

    hearts_displacement_y = 20;
    hearts_separation = 24;
    heartScale = 1.5;

    iconMargin = 48;

    gameScene;
    player;
    createHeart;
    createIcon;

    constructor(scene, player, iconKey) 
    {               
        this.gameScene = scene;
        this.player = player;
        
        let x = player.id === 1 ? this.marginX * 2  : viewport.width - this.marginX * 2;

        this.createHeart = (key, x) => this.gameScene.add.image(x, this.marginY + this.hearts_displacement_y, key).setScale(this.heartScale)

        this.heart_list = 
        [
            {
                x: x - this.hearts_separation ,
                image: this.createHeart("heart_full", x - this.hearts_separation)
            },
            {
                x: x ,
                image: this.createHeart("heart_full", x)
            },
            {
                x: x + this.hearts_separation ,
                image: this.createHeart("heart_full", x + this.hearts_separation)
            },
        ]

        this.updateSprites();

        player.addHitListener((h) => this.onTakeDamage(h)); 


        // Icono del jugador

        x = player.id === 1 ? this.iconMargin * 2  : viewport.width - this.iconMargin * 2;

        this.createIcon = (key, x) => this.gameScene.add.sprite(x, this.marginY, key)

        let playericon = this.createIcon(iconKey, x);

        //playericon.setFrame(1);

        if(gameplayResourcesLoaded) 
        {
            playericon.anims.play(iconKey, true);
            return;
        }

        scene.anims.create
        ({
            key: iconKey,
            frames: scene.anims.generateFrameNumbers(iconKey, { start: 0, end: 3 }),
            duration: 500,
            repeat: -1
        });

        playericon.anims.play(iconKey, true);
    }


    onTakeDamage(health)
    {
        
        let indexes = [0, 1, 2];
        if(this.player.id !== 1) for (let i = 0; i < 3; i++) indexes[i]= 2 - i;

        switch (health)
        {
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