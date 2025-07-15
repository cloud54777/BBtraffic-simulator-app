# Advanced Traffic Simulator

A comprehensive traffic simulation application built with Next.js, React, and TypeScript. This simulator features realistic traffic flow, adaptive traffic lights, and multiple intersection configurations.

## Features

- **Real-time Traffic Simulation**: Watch cars navigate through intersections with realistic physics
- **Adaptive Traffic Lights**: Traffic lights that respond to traffic flow
- **Multiple Intersection Types**: Support for 4-way and 3-way intersections
- **Configurable Parameters**: 
  - Number of intersections (1-5)
  - Intersection types (4-way or 3-way)
  - Detector distance (30-100m)
  - Car spawn rate (10-80%)
- **Visual Feedback**: 
  - Color-coded cars
  - Traffic light states
  - Detector visualization
  - Real-time statistics

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Modern icon library
- **HTML Canvas** - High-performance graphics rendering

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd traffic-simulator
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Configure Settings**: Use the control panel to adjust:
   - Number of intersections
   - Intersection type (4-way or 3-way)
   - Detector distance
   - Car spawn rate

2. **Start Simulation**: Click the "Start" button to begin the simulation

3. **Control Simulation**: 
   - Use "Pause" to temporarily stop the simulation
   - Use "Reset" to clear all cars and restart

4. **Monitor Statistics**: View real-time information about:
   - Number of cars in the simulation
   - Intersection configuration
   - Traffic flow patterns

## Simulation Features

### Traffic Light Logic
- Traffic lights cycle through green, yellow, and red states
- Adaptive timing based on traffic flow
- Perpendicular traffic management

### Car Behavior
- Cars spawn from all four directions
- Realistic stopping at red lights
- Speed reduction during yellow lights
- Lane-based movement

### Detectors
- Vehicle detection sensors at configurable distances
- Visual representation of detector zones
- Real-time car counting

## Project Structure

```
traffic-simulator/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── select.tsx
│   │   │   └── slider.tsx
│   │   └── TrafficSimulator.tsx
│   └── lib/
│       └── utils.ts
├── public/
├── package.json
└── README.md
```

## Development

### Key Components

- **TrafficSimulator.tsx**: Main simulation component with canvas rendering
- **UI Components**: Reusable components built with Radix UI
- **Animation Loop**: RequestAnimationFrame-based smooth animations
- **State Management**: React hooks for simulation state

### Canvas Rendering

The simulation uses HTML5 Canvas for high-performance graphics:
- **drawRoad()**: Renders road networks and lane markings
- **drawTrafficLight()**: Displays traffic light states
- **drawCar()**: Renders individual vehicles with rotation
- **drawDetector()**: Shows detector zones

### Performance Optimizations

- Efficient canvas rendering with minimal redraws
- Optimized collision detection
- Memory management for car objects
- Smooth 60fps animations

## Customization

### Adding New Features

1. **New Intersection Types**: Extend the `intersectionType` state
2. **Advanced Traffic Logic**: Modify the traffic light timing algorithms
3. **Additional Metrics**: Add new statistics to the display
4. **Enhanced Graphics**: Improve the visual representation

### Styling

The application uses Tailwind CSS with a custom design system:
- CSS variables for theming
- Responsive design for mobile devices
- Accessible color schemes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Save/load simulation configurations
- [ ] Export simulation data
- [ ] Advanced traffic algorithms
- [ ] Sound effects and audio feedback
- [ ] Performance metrics dashboard
- [ ] Multiplayer simulation sharing
- [ ] Mobile app version
