
class Wizard
{
    

    gameObject;
    body;
    xInput = 0;
    yInput = 0;
    jumpInput = 0;
    direction = new Phaser.Math.Vector2();
    animationKeys =
    {
        idle: "idle",
        run: "run",
        jump: "jump",
        fall: "fall",
        attack: "attack",
        hit: "hit",
        die: "die"
    }

    _spriteKey = "";
    _moveSpeed = 12;
    _jumpForce = 1000;
    _animationKey = "";
    _isJumping = false;
    _jumpTimer = 0;

    constructor(scene, spriteKey, position, xDirection)
    {
        this._spriteKey = spriteKey;

        for (let key in this.animationKeys) this.animationKeys[key] = this._spriteKey + "_" + key;

        this.gameObject = scene.physics.add.sprite(position.x, position.y, this.animationKeys.idle);
        this.body = this.gameObject.body;
        this.gameObject.setCollideWorldBounds(true);

        this.direction.x = xDirection
    }

    update(time, delta)
    {
        this._move(delta);

        this._jump(delta);


        //animaciones

        
        this._updateAnimation();

        this.xInput = 0;
        this.yInput = 0;
        this.jumpInput = 0;
    }

    startAnimations()
    {
        this.gameObject.anims.play(this.animationKeys.idle, true);
    }

    _move(delta)
    {
        //movimiento
        this.body.setVelocityX(this._moveSpeed * this.xInput * delta);

        //direccion
        this.direction.y = this.yInput;
    }

    _jump(delta)
    {
        if(!this._isJumping)
        {
            if(this.jumpInput && this.body.touching.down)
            {
                this.body.setVelocityY(-this._jumpForce);
                this._isJumping = true;
                this._jumpTimer = 0;
            }
        }
        else
        {
            this._jumpTimer += delta;
            if(this._jumpTimer >= 50 && this.body.touching.down)
            {
                this._isJumping = false;
            }
        }
    }

    _updateAnimation()
    {
        if(Math.abs(this.body.velocity.x) > 0.1) this._animationKey = this.animationKeys.run;
        else this._animationKey = this.animationKeys.idle;

        if(this._isJumping)
        {
            this._animationKey = this.body.velocity.y < 0 ? this.animationKeys.jump : this.animationKeys.fall;
        }
        else if(!this.body.touching.down)
        {
            this._animationKey = this.animationKeys.fall;
        }

        this.gameObject.anims.play(this._animationKey, true);
        
    }

}