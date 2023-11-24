class Pause
{

    //publicas
    isPaused;

    //privadas
    pauseScreen;

    //Metodos publicos
    constructor(scene) 
    {
        this.activeScene = scene;
        this.isPaused = false;
    }

    pause()
    {
        if (!this.isPaused) this.loadPause();
        else this.exitPause();
    }

    //Metodos privados
    loadPause() 
    {
        this.isPaused = true;
        this.activeScene.pause();
        this.pauseScreen = this.add.image(viewport.width/2, viewport.height/2, 'pause_local');
    }

    exitPause()
    {
        this.isPaused = false;
        this.activeScene.resume();

    }
}