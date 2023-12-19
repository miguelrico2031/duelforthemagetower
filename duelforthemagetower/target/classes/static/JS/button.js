class Button extends Phaser.GameObjects.Sprite
{

    constructor(scene, posX, posY, scale, visible, animKey, onPressCallback)
    {

        // Datos del sprite
        super(scene, posX, posY, animKey);

        // Crea el botón y lo añade
        this.scene.add.existing(this);

        // Escala del botón
        this.setScale(scale);

        // Visibilidad del botón
        this.setVisible(visible);

        // Cursor cuando se posiciona encima del botón
        this.setInteractive({ useHandCursor: true });

        // Al pulsar el botón
        this.on('pointerdown', this.enterButtonClickState );

        // Al soltar el botón
        this.on('pointerup', () => 
        { 
            this.enterButtonRestState();
            // Llamada a la función que debería ejecutar el botón
            onPressCallback();
        });

        // Si el puntero se sale del botón
        this.on('pointerout', this.enterButtonRestState);
        

    };

    // Define lo que debe de pasar al pulsar el botón
    enterButtonClickState() 
    {   
        // Frame 1 debería de ser la imagen del botón presionado
        this.setFrame(1);
        // Sonido de pulsar
        this.scene.audioClick.play(); 
        // Bool para saber si está siendo pulsado (util para el pointerout)
        this.pressed = true;
    }

    // Define lo que debe de pasar al soltar
    enterButtonRestState()
    {
        // Sonido de soltar el botón
        if(this.pressed) this.scene.audioClack.play();
        // Frame 0 para "restaurar" el botón
        this.setFrame(0);
        // Hace saber que se ha soltado el botón
        this.pressed = false;
    }

}