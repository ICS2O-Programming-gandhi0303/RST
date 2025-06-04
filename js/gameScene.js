class GameScene extends Phaser.Scene {
  // ... (rest of your code)

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
    this.highScore = 0 // Add high score
    this.scoreText = null
    this.highScoreText = null // Add high score text
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }

    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
    this.gameOver = false
    this.gameOverText = null
  }

  init() {
    this.cameras.main.setBackgroundColor('#ffffff')
    // Load high score from localStorage if available
    const savedHighScore = localStorage.getItem('highScore')
    this.highScore = savedHighScore ? parseInt(savedHighScore) : 0
  }

  create() {
    // Reset score when the scene starts
    this.score = 0

    this.background = this.add.image(0, 0, 'starBackground').setOrigin(0, 0).setScale(2.0).setDepth(-1)
    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)
    this.highScoreText = this.add.text(10, 90, 'High Score: ' + this.highScore.toString(), this.scoreTextStyle) // Show high score

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.ship.setCollideWorldBounds(true)
    if (this.ship.body) {
      this.ship.body.allowGravity = false
    }
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()
    this.createAlien()

    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      this.sound.play("explosion")
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
      if (this.score > this.highScore) {
        this.highScore = this.score
        this.highScoreText.setText('High Score: ' + this.highScore.toString())
        localStorage.setItem('highScore', this.highScore)
      }
      this.createAlien()
      this.createAlien()
    }.bind(this))

    this.physics.add.overlap(this.ship, this.alienGroup, function(shipCollide, alienCollide) {
      if (!this.gameOver) {
        this.sound.play('bomb')
        this.physics.pause()
        alienCollide.destroy()
        shipCollide.destroy()
        this.gameOver = true
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again.', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => {
          this.gameOver = false
          this.scene.restart()
        })
      }
    }.bind(this))

    this.cursors = this.input.keyboard.createCursorKeys()
    this.keySpaceObj = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  // ... (rest of your code)
}

export default GameScene
