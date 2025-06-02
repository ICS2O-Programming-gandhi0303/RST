class GameScene extends Phaser.Scene {
  createAlien() {
    const alienXLocation = Math.floor(Math.random() * 1920) + 1
    let alienXVelocity = Math.floor(Math.random() * 50) + 1
    alienXVelocity *= Math.round(Math.random()) ? -1 : 1 
    const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
    anAlien.body.velocity.y = 200 // Makes the alien fall down
    anAlien.body.velocity.x = alienXVelocity
    this.alienGroup.add(anAlien)
  }

  create(data) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)
    this.scoreText = this.add.text(10, 10, 'Score: '+ this.score.toString(), this.scoreTextStyle)
    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')
    this.ship.body.allowGravity = false
    this.missileGroup = this.physics.add.group()
    this.alienGroup = this.physics.add.group()
    // Now it's safe to create aliens
    this.createAlien()
    this.createAlien()
    // ... rest of your code ...
  }
  // ... rest of your class ...
}
