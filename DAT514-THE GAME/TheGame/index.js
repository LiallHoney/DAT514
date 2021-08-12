// Setup 
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')




canvas.width = innerWidth
canvas.height = innerHeight


const scoreEL = document.querySelector('#scoreEL')
const startgameBTN = document.querySelector('#startgameBTN')
const leaderboardBTN = document.querySelector('#leaderboardBTN')
const modalEL = document.querySelector('#modalEL')
const bigscoreEL = document.querySelector('#bigscoreEL')
const leaderboardEL = document.querySelector('#leaderboardEL')
const backBTN = document.querySelector('#backBTN')

// Creating the player

class Player{
    constructor(x,y,radius,color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
    }
}

const x = canvas.width / 2
const y = canvas.height / 2




// Creating Projectiles / Creating Enemies  
class Projectile {
    constructor(x,y,radius,color,velocity){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }

}
class Enemy {
    constructor(x,y,radius,color,velocity){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
const friction = 0.99
class Particle {
    constructor(x,y,radius,color,velocity){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.velocity = velocity
            this.alpha = 1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y,this.radius,0,Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }

    update(){
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.alpha -= 0.003
    }
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (90 - 15) + 15
       
       let x 
       let y
       
        if (Math.random() < 0.5) {

        
        x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
        y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
           
        }
        const color = `hsl(${Math.random() * 360},50%,50%)`
        const angle = Math.atan2(canvas.height / 2 - y,canvas.width / 2 - x) 
        const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
        }

        enemies.push(new Enemy(x,y,radius,color,velocity))

    }, 1000)
}

let player = new Player(x,y,15,'white')
let projectiles = []
let enemies = []
let particles = []

function init() {
    player = new Player(x,y,15,'white')
    projectiles = []
    enemies = []
    particles = []
    score = 0
    scoreEL.innerHTML = score
    bigscoreEL.innerHTML = score
}
    // Animation

let animationId
let score = 0
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0,0,0,0.18)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.draw()
    particles.forEach((particle,index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
        particle.update()
        }
    });

    projectiles.forEach((projectile,index) => {
        projectile.update()
        
        // removing projectiles that leave the screen   
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1)
              }, 0)
        }
    })

    enemies.forEach((Enemy,index) => {
        Enemy.update()
       
        const dist = Math.hypot(player.x - Enemy.x, player.y - Enemy.y)

        // End game
        if (dist - Enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEL.style.display = 'flex'
            bigscoreEL.innerHTML = score
        }

        projectiles.forEach((projectile,projectileIndex) => {
            const dist = Math.hypot(projectile.x - Enemy.x, projectile.y - Enemy.y)
            
            // when projectiles touch enemy
            if (dist - Enemy.radius - projectile.radius < 1) 
              {
                
                // Create Explosions
                for (let i = 0; i < Enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y
                        ,Math.random() * 4,Enemy.color, {
                            x: (Math.random() - 0.5) * (Math.random() * 6), 
                            y:(Math.random() - 0.5) * (Math.random() * 6)
                        }))
                }

                  if (Enemy.radius - 25 > 25) {
                      
                    score += 100
                    scoreEL.innerHTML = score
                    
                    gsap.to(Enemy, {
                          radius: Enemy.radius - 25
                      })
                      setTimeout(() => {
                        projectiles.splice(projectileIndex, 1)
                      },0)
                  } else {

                    score += 250
                    scoreEL.innerHTML = score

                  setTimeout(() => {
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)
                  }, 0)
                }
                
              }
        })
    })
} 


addEventListener('click', (event) =>  {
    const angle = Math.atan2(event.clientY - canvas.height / 2,event.clientX - canvas.width / 2) 
    const velocity = {
        x: Math.cos(angle)* 4,
        y: Math.sin(angle) *4
    }
    projectiles.push(new Projectile
        (canvas.width / 2,
        canvas.height / 2,5,
        'white',
        velocity))  
})

startgameBTN.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEL.style.display = 'none'
})



leaderboardBTN.addEventListener('click', () => {
    modalEL.style.display = 'none'
    leaderboardEL.style.display = 'flex'
    
})

backBTN.addEventListener('click', () => {
    
    modalEL.style.display = 'flex'
    leaderboardEL.style.display = 'none'
    
    
})