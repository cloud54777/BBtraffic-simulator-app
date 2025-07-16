class TrafficSimulator {
  constructor() {
    this.isRunning = false
    this.cars = []
    this.carId = 0
    this.currentPhase = "NS" // NS (North-South) or EW (East-West)
    this.phaseTimeRemaining = 0
    this.phaseTimer = null
    this.animationFrame = null
    this.carSpawnTimer = null

    // Traffic light timing (in seconds)
    this.greenTime = 5
    this.yellowTime = 2
    this.redTime = 0 // Red time is handled by the other direction's green+yellow

    // Car spawn settings
    this.carSpawnRate = 2000 // milliseconds between spawns
    this.carColors = ["red", "blue", "green", "yellow", "purple", "orange"]
    this.directions = ["north", "south", "east", "west"]

    this.initializeElements()
    this.setupEventListeners()
    this.initializeTrafficLights()
  }

  initializeElements() {
    this.startBtn = document.getElementById("startBtn")
    this.stopBtn = document.getElementById("stopBtn")
    this.resetBtn = document.getElementById("resetBtn")
    this.carCountElement = document.getElementById("carCount")
    this.currentPhaseElement = document.getElementById("currentPhase")
    this.timeRemainingElement = document.getElementById("timeRemaining")
    this.carsContainer = document.getElementById("cars-container")

    // Traffic light elements
    this.trafficLights = {
      north: document.querySelector(".traffic-light-north"),
      south: document.querySelector(".traffic-light-south"),
      east: document.querySelector(".traffic-light-east"),
      west: document.querySelector(".traffic-light-west"),
    }
  }

  setupEventListeners() {
    this.startBtn.addEventListener("click", () => this.startSimulation())
    this.stopBtn.addEventListener("click", () => this.stopSimulation())
    this.resetBtn.addEventListener("click", () => this.resetSimulation())
  }

  initializeTrafficLights() {
    // Set initial state - NS green, EW red
    this.setTrafficLight("north", "green")
    this.setTrafficLight("south", "green")
    this.setTrafficLight("east", "red")
    this.setTrafficLight("west", "red")
  }

  setTrafficLight(direction, color) {
    const lightElement = this.trafficLights[direction]
    const lights = lightElement.querySelectorAll(".light")

    lights.forEach((light) => light.classList.remove("active"))
    lightElement.querySelector(`.light.${color}`).classList.add("active")
  }

  startSimulation() {
    if (this.isRunning) return

    this.isRunning = true
    this.startBtn.disabled = true
    this.stopBtn.disabled = false

    this.currentPhase = "NS"
    this.phaseTimeRemaining = this.greenTime

    this.updateTrafficLights()
    this.startPhaseTimer()
    this.startCarSpawning()
    this.startAnimation()

    this.updateUI()
  }

  stopSimulation() {
    if (!this.isRunning) return

    this.isRunning = false
    this.startBtn.disabled = false
    this.stopBtn.disabled = true

    this.stopPhaseTimer()
    this.stopCarSpawning()
    this.stopAnimation()

    this.currentPhaseElement.textContent = "Stopped"
    this.timeRemainingElement.textContent = "--"
  }

  resetSimulation() {
    this.stopSimulation()

    // Remove all cars
    this.cars = []
    this.carsContainer.innerHTML = ""
    this.carId = 0

    // Reset traffic lights
    this.initializeTrafficLights()
    this.currentPhase = "NS"
    this.phaseTimeRemaining = 0

    this.updateUI()
  }

  startPhaseTimer() {
    this.phaseTimer = setInterval(() => {
      this.phaseTimeRemaining--

      if (this.phaseTimeRemaining <= 0) {
        this.switchPhase()
      } else if (this.phaseTimeRemaining === this.yellowTime) {
        // Switch to yellow
        this.setYellowLights()
      }

      this.updateUI()
    }, 1000)
  }

  stopPhaseTimer() {
    if (this.phaseTimer) {
      clearInterval(this.phaseTimer)
      this.phaseTimer = null
    }
  }

  switchPhase() {
    if (this.currentPhase === "NS") {
      this.currentPhase = "EW"
      this.setTrafficLight("north", "red")
      this.setTrafficLight("south", "red")
      this.setTrafficLight("east", "green")
      this.setTrafficLight("west", "green")
    } else {
      this.currentPhase = "NS"
      this.setTrafficLight("north", "green")
      this.setTrafficLight("south", "green")
      this.setTrafficLight("east", "red")
      this.setTrafficLight("west", "red")
    }

    this.phaseTimeRemaining = this.greenTime
  }

  setYellowLights() {
    if (this.currentPhase === "NS") {
      this.setTrafficLight("north", "yellow")
      this.setTrafficLight("south", "yellow")
    } else {
      this.setTrafficLight("east", "yellow")
      this.setTrafficLight("west", "yellow")
    }
  }

  updateTrafficLights() {
    if (this.currentPhase === "NS") {
      this.setTrafficLight("north", "green")
      this.setTrafficLight("south", "green")
      this.setTrafficLight("east", "red")
      this.setTrafficLight("west", "red")
    } else {
      this.setTrafficLight("north", "red")
      this.setTrafficLight("south", "red")
      this.setTrafficLight("east", "green")
      this.setTrafficLight("west", "green")
    }
  }

  startCarSpawning() {
    this.carSpawnTimer = setInterval(() => {
      if (this.isRunning && this.cars.length < 20) {
        // Limit max cars
        this.spawnCar()
      }
    }, this.carSpawnRate)
  }

  stopCarSpawning() {
    if (this.carSpawnTimer) {
      clearInterval(this.carSpawnTimer)
      this.carSpawnTimer = null
    }
  }

  spawnCar() {
    const direction = this.directions[Math.floor(Math.random() * this.directions.length)]
    const color = this.carColors[Math.floor(Math.random() * this.carColors.length)]

    const car = new Car(this.carId++, direction, color, this)
    this.cars.push(car)
    this.carsContainer.appendChild(car.element)
  }

  startAnimation() {
    const animate = () => {
      if (this.isRunning) {
        this.updateCars()
        this.animationFrame = requestAnimationFrame(animate)
      }
    }
    animate()
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  updateCars() {
    this.cars = this.cars.filter((car) => {
      car.update()
      if (car.shouldRemove) {
        car.element.remove()
        return false
      }
      return true
    })
  }

  getTrafficLightState(direction) {
    const lightElement = this.trafficLights[direction]
    if (lightElement.querySelector(".light.green.active")) return "green"
    if (lightElement.querySelector(".light.yellow.active")) return "yellow"
    if (lightElement.querySelector(".light.red.active")) return "red"
    return "red"
  }

  updateUI() {
    this.carCountElement.textContent = this.cars.length
    this.currentPhaseElement.textContent = this.currentPhase === "NS" ? "North-South" : "East-West"
    this.timeRemainingElement.textContent = this.phaseTimeRemaining > 0 ? `${this.phaseTimeRemaining}s` : "--"
  }
}

class Car {
  constructor(id, direction, color, simulator) {
    this.id = id
    this.direction = direction
    this.color = color
    this.simulator = simulator
    this.speed = 2 + Math.random() * 2 // Random speed between 2-4
    this.normalSpeed = this.speed
    this.position = this.getStartPosition()
    this.shouldRemove = false
    this.stoppedAtLight = false

    this.createElement()
    this.updatePosition()
  }

  createElement() {
    this.element = document.createElement("div")
    this.element.className = `car ${this.direction} ${this.color}`
    this.element.style.zIndex = this.id
  }

  getStartPosition() {
    const intersectionSize = 600
    const roadWidth = 120
    const laneWidth = 60

    switch (this.direction) {
      case "north":
        return {
          x: intersectionSize / 2 - laneWidth / 2,
          y: intersectionSize,
        }
      case "south":
        return {
          x: intersectionSize / 2 + laneWidth / 2,
          y: -40,
        }
      case "east":
        return {
          x: -40,
          y: intersectionSize / 2 - laneWidth / 2,
        }
      case "west":
        return {
          x: intersectionSize,
          y: intersectionSize / 2 + laneWidth / 2,
        }
      default:
        return { x: 0, y: 0 }
    }
  }

  update() {
    const lightState = this.simulator.getTrafficLightState(this.direction)
    const distanceToLight = this.getDistanceToTrafficLight()

    // Traffic light behavior
    if (distanceToLight < 80 && distanceToLight > 0) {
      if (lightState === "red") {
        this.speed = 0
        this.stoppedAtLight = true
      } else if (lightState === "yellow") {
        this.speed = this.normalSpeed * 0.5 // Slow down
        this.stoppedAtLight = false
      } else {
        this.speed = this.normalSpeed
        this.stoppedAtLight = false
      }
    } else {
      this.speed = this.normalSpeed
      this.stoppedAtLight = false
    }

    // Move the car
    this.move()
    this.updatePosition()

    // Check if car should be removed
    this.checkRemoval()
  }

  getDistanceToTrafficLight() {
    const intersectionCenter = 300
    const stopLine = 60 // Distance from center to stop line

    switch (this.direction) {
      case "north":
        return intersectionCenter - stopLine - this.position.y
      case "south":
        return this.position.y - (intersectionCenter + stopLine)
      case "east":
        return this.position.x - (intersectionCenter + stopLine)
      case "west":
        return intersectionCenter - stopLine - this.position.x
      default:
        return 100
    }
  }

  move() {
    switch (this.direction) {
      case "north":
        this.position.y -= this.speed
        break
      case "south":
        this.position.y += this.speed
        break
      case "east":
        this.position.x += this.speed
        break
      case "west":
        this.position.x -= this.speed
        break
    }
  }

  updatePosition() {
    this.element.style.left = `${this.position.x}px`
    this.element.style.top = `${this.position.y}px`
  }

  checkRemoval() {
    const buffer = 50
    if (
      this.position.x < -buffer ||
      this.position.x > 600 + buffer ||
      this.position.y < -buffer ||
      this.position.y > 600 + buffer
    ) {
      this.shouldRemove = true
    }
  }
}

// Initialize the simulation when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TrafficSimulator()
})