class Wizard
{
    //propiedades publicas
    gameObject; //referencia al objeto/sprite
    body; //cuerpo de las fisicas
    xInput = 0; //input horizontal : -1, 0, 1
    yInput = 0; //input vertiañ : -1, 0, 1
    jumpInput = 0; //input de salto: 0, 1
    castInput = 0; //input de disparar: 0, 1
    shieldCastInput = 0;
    direction = new Phaser.Math.Vector2(); //direccion (para disparar)
    id;



    //propiedades privadas
    _scene; //escena
    _animationKeys = // objeto con todas las keys para reproducir las animaciones
    {
        idle: "idle",
        run: "run",
        jump: "jump",
        fall: "fall",
        attack: "attack",
        hit: "hit",
        die: "die",
        attack: "attack",
        shield: "shield"
    }
    _currentAnimationKey = ""; //animacion actual
    _moveSpeed = 200; //velocidad de movimiento (horizontal)
    _jumpForce = 1000; //fuerza de salto
    _castCooldown = 0.5; //tiempo a esperar entre disparo y disparo
    _isJumping = false; //control para evitar doble salto
    _isOnCooldown = false; //control para el cooldown del disparo
    _isShieldOnCooldown = false; //control para el cooldown del escudo
    _jumpTimer = 0; //timer para evitar hacer check de suelo justo cuando se salta
    _cooldownTimer = 0 //timer para el cooldown del disparo
    _shieldCooldownTimer = 0 //timer para el cooldown del escudo
    _health = 6; //salud
    _isAlive = true; //control para no moverse al estar muerto
    _onHitCallbacks = []; //array para guardar todos los callbacks a llamar cuando el jugador reciba daño
    _onDeathCallbacks = []; //lo mismo de arriba pero cuando el jugador muera
    _updateAnims = true; //control para no cambiar de animacion si el jugador esta en la de hit o die
    _isOnShieldState = false;
    _shieldObject;
    _shieldIsCasted = false;
    _shieldCastCooldown = 15.0;      // tiempo a esperar entre escudo y escudo
    _shieldDuration = 1.75;         // DURACION ESCUDITOS (creo)
    _shieldCastedTime = 0.0;


    

    constructor(scene, id, position, xDirection)
    {
        this._scene = scene;
        this.id = id;
        //cambiar las keys de anim. para que lleven la id del jugador
        //esto porque las animaciones son globales y si hay 2 jugadores hande llevar difs nombres
        for (let key in this._animationKeys) this._animationKeys[key] = "wizard" + this.id + "_" + key;
        //crear el sprite
        this.gameObject = scene.physics.add.sprite(position.x, position.y, this._animationKeys.idle);
        this.body = this.gameObject.body;



        this.gameObject.setCollideWorldBounds(true); //evitar que se salga del viewport del juego
        //establecer callback para cuando las animaciones que no loopean terminan
        this.gameObject.on('animationcomplete', this.onAnimationEnd, this); 
        this.direction.x = xDirection; //direccion inicial (como parametro para que c/jugador tenga una distinta)

        this.gameObject.flipX = xDirection < 1;

        this._castCooldown *= 1000; //pasarlo a milisegundos
        this._shieldCastCooldown *= 1000; //pasarlo a milisegundos
        
        this._shieldDuration *= 1000;
        this._shieldCastedTime *= 1000;
    }




    //metodos publicos

    update(time, delta)
    {
        if(!this._isAlive) 
        {//si esta muerto se resetea la velocidad horizontal para que no se mueva, la vertical no por si esta en el aire al morir
            this.body.setVelocityX(0);
            return;
        }

        if(this._shieldIsCasted){
            this.xInput = 0;
            this.yInput = 0;
            this.jumpInput = 0;
            this.castInput = 0;
            this.shieldCastInput = 0;
            this._shieldTimer(delta);
            this.body.setVelocityX(0);
        }

        this._move(delta);
        this._jump(delta);
        this._cast(delta);

        if(this.body.touching.down){
            this._castShield(delta);
        }

        this._updateAnimations();

        //reseteo de inputs para el siguiente frame
        this.xInput = 0;
        this.yInput = 0;
        this.jumpInput = 0;
        this.castInput = 0;
        this.shieldCastInput = 0;
    }

    startAnimations = () => this.gameObject.anims.play(this._animationKeys.idle, true); //inicializa la anim. a idle

    //metodos para añadir callbacks cuando el jugador recibe daño y muere
    addHitListener = (callback) => this._onHitCallbacks.push(callback);
    addDeathListener = (callback) => this._onDeathCallbacks.push(callback);
    
    spellHit(wizard, spell)
    {
        if(this.id === 1){
            this._scene.playerStatsJ1.hitsTaken++;
            this._scene.playerStatsJ2.hitsGiven++;
        }
        if(this.id === 2){
            this._scene.playerStatsJ1.hitsGiven++;
            this._scene.playerStatsJ2.hitsTaken++;
        }
        this.takeDamage(spell.damage);
        this._scene._audioHit.play();
        spell.explode();
    }

    takeDamage(damage)
    {
        if(!this._isAlive) return;

        this._health = Math.max(this._health - damage, 0); //para no bajar de 0 la salud
        this._onHitCallbacks.forEach(callback => callback(this._health)); //llamar a todos los callbacks

        if(this._health === 0) this._die();
        else
        {//animacion de daño
            this._setAnimation(this._animationKeys.hit);
            this._updateAnims = false;
        }
    }

    onAnimationEnd() //llamado al terminar cualquier animacion que no se loopea
    {
        switch(this.gameObject.anims.currentAnim.key)
        {
            case this._animationKeys.hit:
                //lo de abajo porque no queremos hacer nada si no ha acabado la animacion (de momento no hace falta)
                //if(!this.gameObject.anims.currentFrame.isLast) break;
                this._updateAnims = true; //control para volver a actualizar animaciones (idle, run, jump)
                break;

            case this._animationKeys.die:
                //console.log("MUELTO"); //xd
                break;

            case this._animationKeys.attack:
                this._updateAnims = true;
                break;
                
            case this._animationKeys.shield:
                this._updateAnims = true;
                break;
        }
    }



    //metodos privados

    _move(delta)
    {
        //movimiento
        this.body.setVelocityX(this._moveSpeed * this.xInput);

        //direccion (para disparar)
        this.direction.y = this.yInput;
    }

    _jump(delta)
    {
        if(!this._isJumping)
        {
            if(this.jumpInput && this.body.touching.down)
            {
                this._scene._audioJump.play();
                this.body.setVelocityY(-this._jumpForce);
                this._isJumping = true;
                this._jumpTimer = 0;
            }
        }
        else
        {
            this._jumpTimer += delta;
            if(this._jumpTimer >= 50/*numero hardcodeado a cambiar en release*/ && this.body.touching.down)
                this._isJumping = false;
        }
    }

    _cast(delta)
    {
        if(!this._isOnCooldown)
        {
            if(this.castInput)
            {
                //cast
                this._scene._audioBlast.play();
                this._isOnCooldown = true;
                this._cooldownTimer = 0;
                //console.log("Bala");
                let spell = new Spell(this._scene, this.id, this.gameObject.x + this.direction.x * 50, this.body.y + 20, this.direction);

                this._setAnimation(this._animationKeys.attack);
                this._updateAnims = false;
            }
        }
        else
        {
            this._cooldownTimer += delta;
            if(this._cooldownTimer >= this._castCooldown) this._isOnCooldown = false;
        }
    }

    _castShield(delta){
        if(!this._isShieldOnCooldown)
        {
            if(this.shieldCastInput)
            {
                this._scene._audioShield.play();
                this._isShieldOnCooldown = true;
                this._shieldCooldownTimer = 0;
                //console.log("Escudo");
                
                this._shieldIsCasted = true;
                this._shieldObject = new Shield(this._scene, this.id, this.gameObject.x, this.gameObject.y);
                this._setAnimation(this._animationKeys.shield);
                this._updateAnims = false;
            }
        }
        else
        {
            this._shieldCooldownTimer += delta;
            if(this._shieldCooldownTimer >= this._shieldCastCooldown) this._isShieldOnCooldown = false;
        }
    }

    _shieldTimer(delta){
        this._shieldCastedTime += delta;

        if(this._shieldCastedTime >= this._shieldDuration){
            this._shieldIsCasted = false;
            this._shieldCastedTime = 0.0;
            this._shieldObject.destroy();
        }
    }

    _updateAnimations()
    {
        if(!this._updateAnims) return; //no cambiar de animacion si esta en las no loopeables

        if(Math.abs(this.body.velocity.x) > 0.1) this._currentAnimationKey = this._animationKeys.run;
        else this._currentAnimationKey = this._animationKeys.idle;

        if(this._isJumping)
        {
            this._currentAnimationKey = this.body.velocity.y < 0 ? this._animationKeys.jump : this._animationKeys.fall;
        }
        else if(!this.body.touching.down)
        {
            this._currentAnimationKey = this._animationKeys.fall;
        }

        this.gameObject.anims.play(this._currentAnimationKey, true);
        
    }

    _setAnimation(key)
    {
        this._currentAnimationKey = key;
        this.gameObject.anims.play(this._currentAnimationKey, true);
    }

    _die()
    {
        this._isAlive = false;
        this._onDeathCallbacks.forEach(c => c()); //llamar a los callbacks de muerte del jugador

        this._setAnimation(this._animationKeys.die);
        this._updateAnims = false;
        
    }


}