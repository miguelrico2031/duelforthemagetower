class HealthBar {

    hearts_number = 3; //luego la cambias a vida max / 2 idk
    hearts_p1;
    hearts_p2;

    marginX = 64;
    marginY = 64;
    hearts_separation = 64;
    scale = 3;

    gameScene;
    player;
    createHeart;

    constructor(scene, player) 
    {
        let x = player.id === 1 ? this.marginX *2  : viewport.width - this.marginX*2;

        this.gameScene = scene;
        this.player = player;

        this.createHeart = (key, x) => this.gameScene.add.image(x, this.marginY, key).setScale(this.scale)


        this.heart_list = 
        [
            {
                x: x - this.hearts_separation ,
                image: this.createHeart("heart_full", x - this.marginX)
            },
            {
                x: x ,
                image: this.createHeart("heart_full", x)
            },
            {
                x: x + this.hearts_separation ,
                image: this.createHeart("heart_full", x + this.marginX)
            },
        ]

       this.updateSprites();

        player.addHitListener((h) => this.onTakeDamage(h)); //pruebita

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