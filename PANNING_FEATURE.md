# 🖱️ Chart Panning Feature

The LineChart component now supports interactive panning functionality that allows users to drag the chart to view different date ranges.

## ✨ Features

- **Mouse Panning**: Click and drag to navigate through different time periods
- **Smooth Interaction**: Real-time chart updates while dragging  
- **Callback Support**: Get notified when the user pans to a new date range
- **Visual Feedback**: Cursor changes to indicate panning mode
- **Time Axis Only**: Currently works with `xAxisType: 'time'` for date-based charts

## 🚀 Usage

### Basic Implementation

```tsx
import LineChart from './components/charts/LineChart';

function MyChart() {
    const handlePan = (newDomain: [Date, Date]) => {
        console.log('User panned to:', newDomain);
        // Handle the new date range - e.g., fetch new data
    };

    return (
        <LineChart
            data={myTimeSeriesData}
            interaction={{
                enablePanning: true,
                onPan: handlePan,
                showTooltip: true
            }}
            axes={{
                xAxisType: 'time',
                xAxisLabel: 'Date',
                yAxisLabel: 'Price ($)',
                xDomain: [startDate, endDate]
            }}
            dimensions={{
                width: '100%',
                height: 400
            }}
        />
    );
}
```

### Configuration Options

```tsx
interface ChartInteractionConfig {
    // Enable panning functionality (only works with xAxisType='time')
    enablePanning?: boolean;
    
    // Callback when user pans - receives new date domain
    onPan?: (newDomain: [Date, Date]) => void;
    
    // Other interaction options
    showTooltip?: boolean;
    showDots?: boolean;
    onHover?: (data: DataPoint | null) => void;
}
```

## 📋 Requirements

- **Time-based Data**: The chart must use `xAxisType: 'time'` 
- **Date Domain**: Initial `xDomain` should be provided as `[Date, Date]`
- **Mouse Support**: Requires mouse input (touch support not implemented yet)

## 🎯 User Experience

1. **Visual Indicator**: Cursor changes to "grab" when hovering over pannable area
2. **Drag to Pan**: Click and drag horizontally to move through time
3. **Active State**: Cursor changes to "grabbing" while panning
4. **Smooth Updates**: Chart redraws in real-time during panning

## 💡 Example Use Cases

- **Stock Charts**: Navigate through different trading periods
- **Time Series Analytics**: Explore data across various time ranges  
- **Financial Dashboards**: Interactive exploration of historical data
- **Monitoring Dashboards**: Scroll through historical metrics

## 🔧 Implementation Details

The panning feature:
- Uses D3.js scale transformations for smooth interactions
- Maintains state using React hooks (`useState`)
- Calculates new domain based on pixel movement
- Provides proper cleanup of event listeners
- Only enables for time-based x-axis scales

## 🎨 Example Integration

See the implementation in `/research/[ticker]` page:

```tsx
<LineChart
    data={SAMPLE_STOCK_DATA}
    interaction={{
        enablePanning: true,
        showTooltip: true,
        onPan: (newDomain) => {
            console.log('Panned to new domain:', newDomain);
            // You could fetch new data for this range
        }
    }}
    axes={{
        xAxisType: 'time',
        xAxisLabel: 'Date',
        yAxisLabel: 'Price ($)',
        xDomain: [startDate, endDate]
    }}
/>
```

## 🚀 Future Enhancements

Potential improvements could include:
- Touch/mobile gesture support
- Zooming functionality  
- Keyboard navigation
- Momentum/inertial panning
- Constrained panning boundaries
- Vertical panning for y-axis