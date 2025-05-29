/*global phaser*/
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene', physics: { default: 'arcade' } })

    this.background = null
    this.ship = null
  }

  init() {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload() {
    console.log('Game Scene')
    this.load.image("starBackground", "./assets/starBackground.png")
    this.load.image("ship", "./assets/spaceShip.png")
  }

  create() {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
  }

  update(time, delta) {
    const keyleftObj = this.input.keyboard.addKEY('LEFT')
    if (keyleftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 0
      }
    }
    if (keyRightObj.isDown === true) {
      this.ship.x = this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }
  }
}
export default GameScene