class GameScene extends Phaser.Scene {
    /**
     * This method is the constructor.
     */
    constructor() {
      super({ key: "gameScene" })
    }
  
    /**
     * Can be defined on your own Scenes.
     * This method is called by the Scene Manager when the scene starts,
     * before preload() and create().
     * @param {object} data - Any data passed via ScenePlugin.add() or ScenePlugin.start().
     */
    init(data) {
      this.cameras.main.setBackgroundColor("ffffff")
    }
    preload() {
      console.log("Game Scene")
    }
    create(data) {
    
    }
    update(time, delta) {
      
    }
  }
  
  export default GameScene