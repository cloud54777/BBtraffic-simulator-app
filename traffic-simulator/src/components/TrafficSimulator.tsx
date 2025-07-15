"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw } from "lucide-react"

interface Car {
  id: string
  x: number
  y: number
  direction: "north" | "south" | "east" | "west"
  speed: number
  color: string
  lane: number
  waitingTime: number
  distanceToStop: number
}

interface TrafficLight {
  id: string
  x: number
  y: number
  direction: "north" | "south" | "east" | "west"
  state: "red" | "yellow" | "green"
  timer: number
  maxTimer: number
}

interface Intersection {
  id: string
  x: number
  y: number
  type: "4-way" | "3-way"
  trafficLights: TrafficLight[]
}

interface Detector {
  x: number
  y: number
  direction: "north" | "south" | "east" | "west"
  distance: number
  carsDetected: number
}

const CAR_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 800
const CAR_WIDTH = 30
const CAR_HEIGHT = 15
const ROAD_WIDTH = 120
const LANE_WIDTH = 30

export default function TrafficSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  const [isRunning, setIsRunning] = useState(false)
  const [intersectionCount, setIntersectionCount] = useState(1)
  const [intersectionType, setIntersectionType] = useState<"4-way" | "3-way">("4-way")
  const [detectorDistance, setDetectorDistance] = useState([50])
  const [intersectionDistance] = useState([200])
  const [cars, setCars] = useState<Car[]>([])
  const [intersections, setIntersections] = useState<Intersection[]>([])
  const [detectors, setDetectors] = useState<Detector[]>([])
  const [carSpawnRate, setCarSpawnRate] = useState([30])

  // Initialize intersections
  useEffect(() => {
    const newIntersections: Intersection[] = []
    const newDetectors: Detector[] = []

    for (let i = 0; i < intersectionCount; i++) {
      const x = CANVAS_WIDTH / 2 + i * intersectionDistance[0]
      const y = CANVAS_HEIGHT / 2

      const trafficLights: TrafficLight[] = [
        { id: `${i}-north`, x, y: y - ROAD_WIDTH / 2 - 20, direction: "north", state: "red", timer: 0, maxTimer: 180 },
        { id: `${i}-south`, x, y: y + ROAD_WIDTH / 2 + 20, direction: "south", state: "red", timer: 0, maxTimer: 180 },
        { id: `${i}-east`, x: x + ROAD_WIDTH / 2 + 20, y, direction: "east", state: "green", timer: 0, maxTimer: 180 },
        { id: `${i}-west`, x: x - ROAD_WIDTH / 2 - 20, y, direction: "west", state: "green", timer: 0, maxTimer: 180 },
      ]

      if (intersectionType === "3-way") {
        trafficLights.pop() // Remove west light for 3-way
      }

      newIntersections.push({
        id: `intersection-${i}`,
        x,
        y,
        type: intersectionType,
        trafficLights,
      })

      // Add detectors
      const directions = intersectionType === "4-way" ? ["north", "south", "east", "west"] : ["north", "south", "east"]
      directions.forEach((dir) => {
        let detX = x,
          detY = y
        switch (dir) {
          case "north":
            detY = y - ROAD_WIDTH / 2 - detectorDistance[0]
            break
          case "south":
            detY = y + ROAD_WIDTH / 2 + detectorDistance[0]
            break
          case "east":
            detX = x + ROAD_WIDTH / 2 + detectorDistance[0]
            break
          case "west":
            detX = x - ROAD_WIDTH / 2 - detectorDistance[0]
            break
        }
        newDetectors.push({
          x: detX,
          y: detY,
          direction: dir as "north" | "south" | "east" | "west",
          distance: detectorDistance[0],
          carsDetected: 0,
        })
      })
    }

    setIntersections(newIntersections)
    setDetectors(newDetectors)
  }, [intersectionCount, intersectionType, detectorDistance, intersectionDistance])

  // Car spawning
  const spawnCar = useCallback(() => {
    if (Math.random() * 100 < carSpawnRate[0]) {
      const directions = ["north", "south", "east", "west"]
      const direction = directions[Math.floor(Math.random() * directions.length)] as Car["direction"]
      const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)]

      let x, y, lane
      switch (direction) {
        case "north":
          x = CANVAS_WIDTH / 2 + (Math.random() > 0.5 ? LANE_WIDTH / 2 : -LANE_WIDTH / 2)
          y = CANVAS_HEIGHT - 50
          lane = x > CANVAS_WIDTH / 2 ? 1 : 0
          break
        case "south":
          x = CANVAS_WIDTH / 2 + (Math.random() > 0.5 ? LANE_WIDTH / 2 : -LANE_WIDTH / 2)
          y = 50
          lane = x > CANVAS_WIDTH / 2 ? 1 : 0
          break
        case "east":
          x = 50
          y = CANVAS_HEIGHT / 2 + (Math.random() > 0.5 ? LANE_WIDTH / 2 : -LANE_WIDTH / 2)
          lane = y > CANVAS_HEIGHT / 2 ? 1 : 0
          break
        case "west":
          x = CANVAS_WIDTH - 50
          y = CANVAS_HEIGHT / 2 + (Math.random() > 0.5 ? LANE_WIDTH / 2 : -LANE_WIDTH / 2)
          lane = y > CANVAS_HEIGHT / 2 ? 1 : 0
          break
      }

      const newCar: Car = {
        id: `car-${Date.now()}-${Math.random()}`,
        x,
        y,
        direction,
        speed: 1 + Math.random() * 2,
        color,
        lane,
        waitingTime: 0,
        distanceToStop: 0,
      }

      setCars((prev) => [...prev, newCar])
    }
  }, [carSpawnRate])

  // Animation loop
  const animate = useCallback(() => {
    if (!isRunning) return

    setCars((prevCars) => {
      return prevCars
        .map((car) => {
          let newX = car.x
          let newY = car.y
          let newSpeed = car.speed
          let newWaitingTime = car.waitingTime

          // Find nearest intersection
          const nearestIntersection = intersections.reduce((nearest, intersection) => {
            const distance = Math.sqrt(Math.pow(car.x - intersection.x, 2) + Math.pow(car.y - intersection.y, 2))
            return distance < Math.sqrt(Math.pow(car.x - nearest.x, 2) + Math.pow(car.y - nearest.y, 2))
              ? intersection
              : nearest
          }, intersections[0])

          if (nearestIntersection) {
            const relevantLight = nearestIntersection.trafficLights.find((light) => light.direction === car.direction)
            const distanceToIntersection = Math.sqrt(
              Math.pow(car.x - nearestIntersection.x, 2) + Math.pow(car.y - nearestIntersection.y, 2),
            )

            // Check if car should stop at red light
            if (relevantLight && relevantLight.state === "red" && distanceToIntersection < 80) {
              newSpeed = 0
              newWaitingTime += 1
            } else if (relevantLight && relevantLight.state === "yellow" && distanceToIntersection < 60) {
              newSpeed = car.speed * 0.5
            } else {
              newSpeed = car.speed
              newWaitingTime = 0
            }
          }

          // Move car based on direction
          switch (car.direction) {
            case "north":
              newY -= newSpeed
              break
            case "south":
              newY += newSpeed
              break
            case "east":
              newX += newSpeed
              break
            case "west":
              newX -= newSpeed
              break
          }

          return {
            ...car,
            x: newX,
            y: newY,
            speed: newSpeed,
            waitingTime: newWaitingTime,
            distanceToStop: nearestIntersection
              ? Math.sqrt(Math.pow(newX - nearestIntersection.x, 2) + Math.pow(newY - nearestIntersection.y, 2))
              : 0,
          }
        })
        .filter((car) => car.x > -50 && car.x < CANVAS_WIDTH + 50 && car.y > -50 && car.y < CANVAS_HEIGHT + 50)
    })

    // Update traffic lights
    setIntersections((prevIntersections) => {
      return prevIntersections.map((intersection) => {
        const updatedLights = intersection.trafficLights.map((light) => {
          let newTimer = light.timer + 1
          let newState = light.state

          if (newTimer >= light.maxTimer) {
            newTimer = 0
            if (light.state === "green") {
              newState = "yellow"
            } else if (light.state === "yellow") {
              newState = "red"
            } else {
              // Simple alternating logic - in real implementation, this would use priority scoring
              const oppositeDirection =
                light.direction === "north" || light.direction === "south" ? ["east", "west"] : ["north", "south"]
              const shouldTurnGreen = intersection.trafficLights
                .filter((l) => oppositeDirection.includes(l.direction))
                .every((l) => l.state === "red")

              if (shouldTurnGreen) {
                newState = "green"
              }
            }
          }

          return { ...light, timer: newTimer, state: newState }
        })

        return { ...intersection, trafficLights: updatedLights }
      })
    })

    spawnCar()
    animationRef.current = requestAnimationFrame(animate)
  }, [isRunning, intersections, spawnCar])

  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, animate])

  // Drawing functions
  const drawRoad = (ctx: CanvasRenderingContext2D, intersection: Intersection) => {
    ctx.fillStyle = "#2C3E50"

    // Horizontal road
    ctx.fillRect(intersection.x - CANVAS_WIDTH / 2, intersection.y - ROAD_WIDTH / 2, CANVAS_WIDTH, ROAD_WIDTH)

    // Vertical road
    ctx.fillRect(intersection.x - ROAD_WIDTH / 2, intersection.y - CANVAS_HEIGHT / 2, ROAD_WIDTH, CANVAS_HEIGHT)

    // Road markings
    ctx.strokeStyle = "#F1C40F"
    ctx.lineWidth = 2
    ctx.setLineDash([20, 20])

    // Horizontal center line
    ctx.beginPath()
    ctx.moveTo(0, intersection.y)
    ctx.lineTo(CANVAS_WIDTH, intersection.y)
    ctx.stroke()

    // Vertical center line
    ctx.beginPath()
    ctx.moveTo(intersection.x, 0)
    ctx.lineTo(intersection.x, CANVAS_HEIGHT)
    ctx.stroke()

    ctx.setLineDash([])
  }

  const drawTrafficLight = (ctx: CanvasRenderingContext2D, light: TrafficLight) => {
    // Traffic light pole
    ctx.fillStyle = "#34495E"
    ctx.fillRect(light.x - 3, light.y - 40, 6, 40)

    // Traffic light box
    ctx.fillStyle = "#2C3E50"
    ctx.fillRect(light.x - 15, light.y - 50, 30, 40)

    // Light circles
    const colors = ["#E74C3C", "#F1C40F", "#27AE60"]
    const states = ["red", "yellow", "green"]

    colors.forEach((color, index) => {
      ctx.fillStyle = light.state === states[index] ? color : "#34495E"
      ctx.beginPath()
      ctx.arc(light.x, light.y - 40 + index * 12, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const drawCar = (ctx: CanvasRenderingContext2D, car: Car) => {
    ctx.save()
    ctx.translate(car.x, car.y)

    // Rotate based on direction
    switch (car.direction) {
      case "north":
        ctx.rotate(-Math.PI / 2)
        break
      case "south":
        ctx.rotate(Math.PI / 2)
        break
      case "west":
        ctx.rotate(Math.PI)
        break
    }

    // Car body
    ctx.fillStyle = car.color
    ctx.fillRect(-CAR_WIDTH / 2, -CAR_HEIGHT / 2, CAR_WIDTH, CAR_HEIGHT)

    // Car windows
    ctx.fillStyle = "#3498DB"
    ctx.fillRect(-CAR_WIDTH / 2 + 3, -CAR_HEIGHT / 2 + 2, CAR_WIDTH - 6, CAR_HEIGHT - 4)

    // Car wheels
    ctx.fillStyle = "#2C3E50"
    ctx.beginPath()
    ctx.arc(-CAR_WIDTH / 2 + 5, -CAR_HEIGHT / 2 - 2, 3, 0, 2 * Math.PI)
    ctx.arc(CAR_WIDTH / 2 - 5, -CAR_HEIGHT / 2 - 2, 3, 0, 2 * Math.PI)
    ctx.arc(-CAR_WIDTH / 2 + 5, CAR_HEIGHT / 2 + 2, 3, 0, 2 * Math.PI)
    ctx.arc(CAR_WIDTH / 2 - 5, CAR_HEIGHT / 2 + 2, 3, 0, 2 * Math.PI)
    ctx.fill()

    // Headlights
    ctx.fillStyle = "#F1C40F"
    ctx.fillRect(CAR_WIDTH / 2 - 2, -CAR_HEIGHT / 2 + 3, 2, 3)
    ctx.fillRect(CAR_WIDTH / 2 - 2, CAR_HEIGHT / 2 - 6, 2, 3)

    ctx.restore()
  }

  const drawDetector = (ctx: CanvasRenderingContext2D, detector: Detector) => {
    ctx.strokeStyle = "#E67E22"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    // Draw detector line
    switch (detector.direction) {
      case "north":
      case "south":
        ctx.beginPath()
        ctx.moveTo(detector.x - ROAD_WIDTH / 2, detector.y)
        ctx.lineTo(detector.x + ROAD_WIDTH / 2, detector.y)
        ctx.stroke()
        break
      case "east":
      case "west":
        ctx.beginPath()
        ctx.moveTo(detector.x, detector.y - ROAD_WIDTH / 2)
        ctx.lineTo(detector.x, detector.y + ROAD_WIDTH / 2)
        ctx.stroke()
        break
    }

    ctx.setLineDash([])
  }

  // Main render function
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#27AE60"
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw roads and intersections
    intersections.forEach((intersection) => {
      drawRoad(ctx, intersection)
    })

    // Draw detectors
    detectors.forEach((detector) => {
      drawDetector(ctx, detector)
    })

    // Draw traffic lights
    intersections.forEach((intersection) => {
      intersection.trafficLights.forEach((light) => {
        drawTrafficLight(ctx, light)
      })
    })

    // Draw cars
    cars.forEach((car) => {
      drawCar(ctx, car)
    })

    // Draw statistics
    ctx.fillStyle = "#2C3E50"
    ctx.font = "14px Arial"
    ctx.fillText(`Cars: ${cars.length}`, 10, 30)
    ctx.fillText(`Intersections: ${intersectionCount}`, 10, 50)
    ctx.fillText(`Type: ${intersectionType}`, 10, 70)
  }, [cars, intersections, detectors, intersectionCount, intersectionType])

  const resetSimulation = () => {
    setIsRunning(false)
    setCars([])
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Traffic Simulator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Intersections</label>
              <Select
                value={intersectionCount.toString()}
                onValueChange={(value) => setIntersectionCount(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Intersection Type</label>
              <Select value={intersectionType} onValueChange={(value: "4-way" | "3-way") => setIntersectionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4-way">4-Way</SelectItem>
                  <SelectItem value="3-way">3-Way</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Detector Distance: {detectorDistance[0]}m</label>
              <Slider value={detectorDistance} onValueChange={setDetectorDistance} min={30} max={100} step={10} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Car Spawn Rate: {carSpawnRate[0]}%</label>
              <Slider value={carSpawnRate} onValueChange={setCarSpawnRate} min={10} max={80} step={5} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setIsRunning(!isRunning)} variant={isRunning ? "destructive" : "default"}>
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetSimulation} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="border border-gray-300 rounded-lg w-full"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </CardContent>
      </Card>
    </div>
  )
}