class GameScene extends Phaser.Scene {
  createAlien() {
    const alien = this.physics.add.sprite(1920 / 2, 100, 'alien')
    alien.setVelocityY(50)
    alien.setCollideWorldBounds(true)
    alien.setBounce(1)
    this.alienGroup.add(alien)
    this.physics.add.collider(this.ship, this.alienGroup, function(ship, alien) {
      console.log('Ship collided with alien!')
      alien.destroy() 
    })
  }
  constructor() {
    super({ key: 'gameScene', physics: { default: 'arcade' } })

    this.background = null
    this.ship = null
    this.fireMissile = false
    this.missileGroup = null
    this.cursors = null
    this.keySpaceObj = null
  }

  init() {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload() {
    console.log('Game Scene')
    this.load.image("starBackground", "./assets/starBackground.png")
    this.load.image("ship", "./assets/spaceShip.png")
    this.load.image("missile", "./assets/missile.png")
    this.load.image("alien", "./assets/alien.png")
    // Load the sound effect for the laser
    this.load.audio("laser", "./assets/laser1.wav")
  }

  create(data) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.add.group()
    this.createAlien()

    // Set up keyboard cursors
    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 0
      }
    }
    if (this.cursors.right.isDown) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }
    if (this.keySpaceObj.isDown) {
      if (!this.fireMissile) {
        this.fireMissile = true
      
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
        this.sound.play("laser")
      }
    }
    if (this.keySpaceObj.isUp) {
      this.fireMissile = false
    }
    this.missileGroup.getChildren().forEach(function(item) {
      item.y -= 10
      if (item.y < 0) {
        item.destroy()
      }
    })
  }
}
export default GameScene