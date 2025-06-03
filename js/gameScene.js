class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'gameScene' })

    this.background = null
    this.ship = null
    this.fireMissile = false
    this.missileGroup = null
    this.alienGroup = null
    this.cursors = null
    this.keySpaceObj = null
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
    this.gameOverText = null
    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
    this.gameOver = false
  }

  init() {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload() {
    this.load.image("starBackground", "./assets/starBackground.png")
    this.load.image("ship", "./assets/spaceShip.png")
    this.load.image("missile", "./assets/missile.png")
    this.load.image("alien", "./assets/alien.png")
    this.load.audio("laser", "./assets/laser1.wav")
    this.load.audio("explosion", "./assets/barrelExploding.wav")
    this.load.audio("bomb", "./assets/bomb.wav")
  }

  create() {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0).setOrigin(0, 0)

    this.scoreText = this.add.text(10, 10, 'Score: 0', this.scoreTextStyle)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship').setCollideWorldBounds(true)
    this.ship.body.allowGravity = false

    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()

    this.createAlien()

    this.physics.add.collider(this.missileGroup, this.alienGroup, (missile, alien) => {
      missile.destroy()
      alien.destroy()
      this.sound.play("explosion")
      this.score += 1
      this.scoreText.setText('Score: ' + this.score)
      this.createAlien()
      this.createAlien()
    })

    this.physics.add.overlap(this.ship, this.alienGroup, (ship, alien) => {
      if (!this.gameOver) {
        this.sound.play('bomb')
        this.physics.pause()
        ship.destroy()
        alien.destroy()
        this.gameOver = true

        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => {
          this.scene.restart()
        })
      }
    })

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  createAlien() {
    const alienXLocation = Phaser.Math.Between(100, 1820) // avoid edges
    let alienXVelocity = Phaser.Math.Between(50, 100)
    alienXVelocity *= Phaser.Math.Between(0, 1) ? 1 : -1
    const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
    anAlien.setVelocity(alienXVelocity, 200)
    this.alienGroup.add(anAlien)
  }

  update() {
    if (this.gameOver) return

    // Ship movement
    if (this.cursors.left.isDown) {
      this.ship.setVelocityX(-300)
    } else if (this.cursors.right.isDown) {
      this.ship.setVelocityX(300)
    } else {
      this.ship.setVelocityX(0)
    }

    // Missile firing
    if (this.keySpaceObj.isDown && !this.fireMissile) {
      this.fireMissile = true
      const missile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
      missile.body.allowGravity = false
      missile.setVelocityY(-600)
      this.missileGroup.add(missile)
      this.sound.play("laser")
    }

    if (this.keySpaceObj.isUp) {
      this.fireMissile = false
    }

    // Destroy off-screen missiles
    this.missileGroup.getChildren().forEach(missile => {
      if (missile.active && missile.y < 0) {
        missile.destroy()
      }
    })

    // Update aliens and respawn if needed
    this.alienGroup.getChildren().forEach(alien => {
      if (alien.active && alien.y > 1080) {
        alien.destroy()
        this.createAlien()
      }
    })
  }
}

export default GameScene