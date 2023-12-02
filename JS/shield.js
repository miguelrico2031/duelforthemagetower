class Shield extends Phaser.Physics.Arcade.Sprite{
    shieldRadius = 45;
    shieldDuration = 1.5;
    id;

    _isCasted = false;
    _shieldCooldownTimer = 0.0;

    constructor (scene, id, x, y){
        super(scene, x, y, "shield");
        this.id = id;
        scene.shields.add(this, true);
        
        //this.body.setCircle(this.shieldRadius);
        this.setScale(0.25).refreshBody();
        this.shieldDuration *= 1000;
    }

    deflect(shield, spell){
        this.shield.destroy();
    }
}