# Traffic Intersection Simulator

A dynamic traffic intersection simulator built with HTML, CSS, and JavaScript. This web application simulates a four-way traffic intersection with animated cars, traffic lights, and real-time controls.

## Features

- **Realistic Traffic Simulation**: Cars spawn randomly from all four directions
- **Traffic Light Control**: Automated traffic light system with green, yellow, and red phases
- **Interactive Controls**: Start, stop, and reset the simulation
- **Real-time Statistics**: View car count, current phase, and time remaining
- **Responsive Design**: Works on both desktop and mobile devices
- **Beautiful UI**: Modern gradient design with smooth animations

## Files Structure

```
traffic-intersection-simulator/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript logic
├── vercel.json         # Vercel deployment configuration
└── README.md           # This file
```

## How to Use

1. **Start Simulation**: Click the "Start Simulation" button to begin
2. **Stop Simulation**: Click "Stop Simulation" to pause the traffic
3. **Reset**: Click "Reset" to clear all cars and reset the traffic lights
4. **Monitor**: Watch the info panel for real-time statistics

## Deployment on Vercel

### Option 1: Deploy from GitHub
1. Push this project to a GitHub repository
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy automatically

### Option 2: Deploy using Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy

### Option 3: Drag and Drop
1. Go to [Vercel](https://vercel.com)
2. Drag and drop the project folder to the Vercel dashboard
3. Deploy instantly

## Technical Details

- **No dependencies**: Pure HTML, CSS, and JavaScript
- **Responsive**: Mobile-friendly design
- **Performance**: Smooth 60fps animations using `requestAnimationFrame`
- **Traffic Logic**: Realistic traffic light timing and car behavior

## Customization

You can easily customize:
- Traffic light timing in `script.js` (greenTime, yellowTime)
- Car spawn rate and colors
- Intersection size and styling
- UI colors and fonts

## Browser Support

Works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.