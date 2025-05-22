/* global Phaser */
class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: "splashScene" })
    }
  
    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts,
     * before preload() and create().
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    init(data) {
        this.cameras.main.setBackgroundColor('#ffffff')
    }
    Preload() {
        console.log('Splash Scene')
    }
    create(data) {
    }
    update(time, delta) {
    }
}
export default splashScene