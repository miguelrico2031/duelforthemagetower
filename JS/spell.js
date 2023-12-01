class Spell extends Phaser.Physics.Arcade.Sprite
{
    direction = new Phaser.Math.Vector2();
    id;
    damage = 1;

    _moveSpeed = 500;
    _spellRadius = 6;
    _explosion;
    _scene;

    constructor(scene, id, x, y, direction)
    {
        let key = id === 1 ? "blueSpell" : "redSpell";
        super(scene, x, y, key);
        this._scene = scene;
        this.id = id;
        this.direction = direction.clone().normalize();
        scene.spells.add(this, true);
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.body.setCircle(this._spellRadius);
        //this.body.reset(x, y);
        this.body.setVelocity(this.direction.x * this._moveSpeed, this.direction.y * this._moveSpeed);
        


        const sign = id === 1 ? -1 : 1;
        this.angle = this.angle + (90 * sign);
        this.body.offset = new Phaser.Math.Vector2(-sign * 6,8)


        this.anims.play(key, true);
        

    }
    
    update(time, delta)
    {
        super.update(time, delta);
        if(this.body.x < -20 || this.body.x > viewport.width + 20) this.destroy();
    }

    explode() 
    {
        this._scene.explosion = new Explosion(this._scene, this.x, this.y, this.id);
        this.destroy();
    }

    onCollision(other)
    {
        let angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * (180/Math.PI);
        angle -= 90;
        this.angle = angle;
    }
}

class Explosion extends Phaser.GameObjects.Sprite
{

    constructor(scene, x, y, id)
    {
        let key = id === 1 ? "blueExplosion" : "redExplosion";
        super(scene, x, y);
        scene.add.existing(this);
        this.on('animationcomplete', () => this.destroy(), this); 
        this.anims.play(key, true);

    }
}