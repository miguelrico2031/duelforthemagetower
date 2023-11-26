class Spell
{
    gameObject;
    body;
    direction = new Phaser.Math.Vector2();
    id;

    _moveSpeed = 500;

    constructor(scene, id, position, direction)
    {
        this.id = id;
        this.direction = direction.clone().normalize();

        this.gameObject = scene.spells.create(position.x, position.y, "spell");
        this.body = this.gameObject.body;
        this.body.setAllowGravity(false);
        this.body.setBounce(1);
        this.gameObject.setCollideWorldBounds(true);
        this.gameObject.setScale(0.01).refreshBody();
        this.body.setVelocity(this.direction.x * this._moveSpeed, this.direction.y * this._moveSpeed);
    }
}