
class Wizard
{
    moveSpeed = 200;
    jumpForce = 1000;

    gameObject;
    body;
    xInput = 0;
    yInput = 0;
    jumpInput = 0;
    direction = new Phaser.Math.Vector2();

    constructor(scene, spriteKey, position)
    {
        this.gameObject = scene.physics.add.sprite(position.x, position.y, spriteKey);
        this.body = this.gameObject.body;
        this.gameObject.setCollideWorldBounds(true);
    }

    update()
    {
        //movimiento
        this.body.setVelocityX(this.moveSpeed * this.xInput);

        //direccion
        if(this.xInput != 0) this.direction.x = this.xInput;
        if(this.yInput != 0) this.direction.y = this.yInput;

        //salto
        if(this.jumpInput && this.body.touching.down)
        {
            this.body.setVelocityY(-this.jumpForce);
        }

        this.xInput = 0;
        this.yInput = 0;
        this.jumpInput = 0;
    }
}