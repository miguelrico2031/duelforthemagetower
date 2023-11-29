class Shield extends Phaser.Physics.Arcade.Sprite{
    shieldRadius = 4.0;
    shieldDuration = 1.5;
    id;

    _isCasted = false;
    _shieldCooldownTimer = 0.0;

    constructor (scene, id, x, y){
        super(scene, x, y, "shield");
        this.id = id;
        scene.shields.add(this, true);
        this.body.setAllowGravity(false);
        this.body.setBounce(0);
        this.setScale(0.23).refreshBody();
        this.body.reset(x, y);
        this.shieldDuration *= 1000;
    }

}