
class Wizard
{
    moveSpeed = 100;
    jumpForce = 300;

    gameObject;
    body;
    xInput = 0;
    jumpInput = 0;

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

        //salto
        if(this.jumpButton && this.body.touching.down)
        {
            this.body.setVelocityY(-jumpForce);
        }

        this.xInput = 0;
        this.jumpButton = 0;
    }
}