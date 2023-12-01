class Loading extends Phaser.Scene
{

    constructor()
    {
        super("LoadingScene");
    }

    timedEvent;

    preload()
    {
        console.log("preload del load");
        this.load.image("loadingScreen", "../Assets/UI/Screens/Loading/Loading.png");


		this.load.on('complete', this.complete, this);
    }

    create()
    {
        console.log("Create del load");
        this.add.image(0, 0, "loadingScreen").setOrigin(0, 0);
        setTimeout(() => {this.minTimeOver = true; this.complete()}, 1000 * 2)

    }

	complete() 
    {
        if(!this.minTimeOver) return;
        this.scene.start("MenuScene");
		console.log("COMPLETE!");
	}
}