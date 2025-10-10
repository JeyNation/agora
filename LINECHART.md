# LineChart Component Documentation

A flexible, generic LineChart component built with D3.js and React that supports multiple data types and extensive customization options.

## Features

- **Multiple X-axis Types**: Linear, Time, and Categorical (Band) scales
- **Multiple Y-axis Types**: Linear and Logarithmic scales  
- **Animations**: Smooth line drawing animations with customizable duration
- **Interactions**: Hover callbacks and dot highlighting
- **Theming**: Automatic MUI theme integration for colors
- **Customization**: Extensive styling and formatting options
- **Responsive**: Configurable dimensions and margins
- **TypeScript**: Full type safety with comprehensive interfaces

## Basic Usage

```tsx
import LineChart, { DataPoint } from './components/charts/LineChart';

const data: DataPoint[] = [
  { x: new Date('2024-01-01'), y: 150.25 },
  { x: new Date('2024-01-02'), y: 152.80 },
  // ... more data points
];

function MyComponent() {
  return (
    <LineChart
      data={data}
      xAxisType="time"
      xAxisLabel="Date"
      yAxisLabel="Price ($)"
      width={800}
      height={400}
    />
  );
}
```

## Props Interface

```tsx
interface LineChartProps {
  data: DataPoint[];                    // Required: Array of data points
  width?: number;                       // Chart width (default: 800)
  height?: number;                      // Chart height (default: 400)
  margin?: {                           // Chart margins
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xAxisLabel?: string;                 // X-axis label text
  yAxisLabel?: string;                 // Y-axis label text
  lineColor?: string;                  // Line color (defaults to theme primary)
  strokeWidth?: number;                // Line thickness (default: 2)
  showDots?: boolean;                  // Show data point dots (default: false)
  dotRadius?: number;                  // Dot size (default: 4)
  showGrid?: boolean;                  // Show grid lines (default: true)
  animate?: boolean;                   // Enable animations (default: true)
  animationDuration?: number;          // Animation length in ms (default: 1000)
  xAxisType?: 'linear' | 'time' | 'band'; // X-axis scale type (default: 'linear')
  yAxisType?: 'linear' | 'log';        // Y-axis scale type (default: 'linear')
  formatX?: (value: any) => string;    // Custom X-axis formatter
  formatY?: (value: number) => string; // Custom Y-axis formatter
  onHover?: (data: DataPoint | null) => void; // Hover callback
  className?: string;                  // CSS class name
}
```

## Data Format

```tsx
interface DataPoint {
  x: number | string | Date;  // X-coordinate value
  y: number;                  // Y-coordinate value
  [key: string]: any;         // Additional properties allowed
}
```

## Axis Types

### Linear Axis (`xAxisType: 'linear'`)
For numerical data with continuous values.

```tsx
const linearData = [
  { x: 0, y: 10 },
  { x: 1, y: 15 },
  { x: 2, y: 12 },
];
```

### Time Axis (`xAxisType: 'time'`)  
For date/time data with chronological progression.

```tsx
const timeData = [
  { x: new Date('2024-01-01'), y: 150 },
  { x: new Date('2024-01-02'), y: 155 },
  { x: new Date('2024-01-03'), y: 148 },
];
```

### Categorical Axis (`xAxisType: 'band'`)
For discrete categories or labels.

```tsx
const categoryData = [
  { x: 'Jan', y: 65 },
  { x: 'Feb', y: 75 },
  { x: 'Mar', y: 80 },
];
```

## Custom Formatters

### Currency Formatter
```tsx
const currencyFormatter = (value: number) => `$${value.toFixed(2)}`;

<LineChart
  data={stockData}
  formatY={currencyFormatter}
  yAxisLabel="Price ($)"
/>
```

### Date Formatter  
```tsx
const dateFormatter = (value: any) => 
  new Date(value).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });

<LineChart
  data={timeSeriesData}
  xAxisType="time"
  formatX={dateFormatter}
/>
```

### Percentage Formatter
```tsx
const percentageFormatter = (value: number) => `${value.toFixed(1)}%`;
```

## Animation Options

```tsx
<LineChart
  data={data}
  animate={true}
  animationDuration={2000}  // 2 second animation
/>
```

## Hover Interactions

```tsx
<LineChart
  data={data}
  showDots={true}
  onHover={(dataPoint) => {
    if (dataPoint) {
      console.log(`Value: ${dataPoint.y} at ${dataPoint.x}`);
      // Show tooltip, update state, etc.
    }
  }}
/>
```

## Styling Customization

```tsx
<LineChart
  data={data}
  lineColor="#ff6b35"
  strokeWidth={3}
  dotRadius={6}
  margin={{ top: 30, right: 50, bottom: 80, left: 80 }}
/>
```

## Theme Integration

The component automatically uses MUI theme colors:
- Line color defaults to `theme.palette.primary.main`
- Grid lines use `theme.palette.divider`
- Text color uses `theme.palette.text.secondary`

## Examples

### Stock Price Chart
```tsx
<LineChart
  data={stockData}
  xAxisType="time"
  xAxisLabel="Date"
  yAxisLabel="Price ($)"
  formatX={dateFormatter}
  formatY={currencyFormatter}
  showDots={true}
  animate={true}
/>
```

### Performance Metrics
```tsx
<LineChart
  data={performanceData}
  xAxisType="band"
  xAxisLabel="Metric"
  yAxisLabel="Score (%)"
  formatY={percentageFormatter}
  lineColor="#4caf50"
  showGrid={true}
/>
```

### Revenue Growth
```tsx
<LineChart
  data={revenueData}
  xAxisType="linear"
  yAxisType="linear"
  xAxisLabel="Year" 
  yAxisLabel="Revenue"
  formatY={(value) => `$${(value/1000000).toFixed(1)}M`}
  strokeWidth={3}
/>
```

## Browser Compatibility

- Modern browsers with SVG support
- D3.js v7+ compatibility
- React 18+ recommended
- TypeScript 4.5+ for full type support