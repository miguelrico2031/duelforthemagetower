class Spell extends Phaser.Physics.Arcade.Sprite
{
    direction = new Phaser.Math.Vector2();
    id;
    damage = 2;

    _moveSpeed = 500;

    constructor(scene, id, x, y, direction)
    {
        super(scene, x, y, "spell");
        this.id = id;
        this.direction = direction.clone().normalize();
        scene.spells.add(this, true);
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.setScale(0.01).refreshBody();
        this.body.reset(x, y);
        this.body.setVelocity(this.direction.x * this._moveSpeed, this.direction.y * this._moveSpeed);

    }
    
    update(time, delta)
    {
        super.update(time, delta);
        if(this.body.x < -20 || this.body.x > viewport.width + 20) this.destroy();
    }
}