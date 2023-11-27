class HUD extends Phaser.Scene 
{
    key = "HUD";

    constructor() 
    {
        super("HUD");
    }

    hearts_number = 3; //luego la cambias a vida max / 2 idk
    hearts_p1;
    hearts_p2;

    marginX = 64;
    marginY = 64;
    hearts_separation = 32;
    scale = 20;

    init()
    {
        //Sacar la vida maxima de los magos
    }

    preload()
    {
        //sprites hud
        this.load.image("heart_full", "../Assets/UI/HUD/Heart Container Full.png");
        this.load.image("heart_half", "../Assets/UI/HUD/Heart Container Half.png");
        this.load.image("heart_empty", "../Assets/UI/HUD/Heart Container Empty.png");
    }

    create()
    {
        //Se supone q esto lo q hace es q se renderice por encima del juego
        this.scene.bringToTop();

        //funciona pero no puedo cambiar la escala y seguro q luego me da problemas a la hora de querer modificar las imagenes de cada corazon
        this.hearts_p1 = this.physics.add.staticGroup(
            {
                key: "heart_full",
                repeat: this.hearts_number - 1,
                setXY: { x: this.marginX, y: this.marginY, stepX: this.hearts_separation },
                setScale: this.scale
            }
        );

        this.hearts_p2 = this.physics.add.staticGroup(
            {
                key: "heart_full",
                repeat: this.hearts_number - 1,
                setXY: { x: (viewport.width - this.hearts_number * this.hearts_separation - this.marginX), y: this.marginY, stepX: this.hearts_separation },
                setScale: this.scale
            }
        );
    }

}