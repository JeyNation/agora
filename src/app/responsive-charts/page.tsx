'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import LineChart from '../../components/charts/LineChart';
import { 
    SAMPLE_STOCK_DATA, 
    SAMPLE_LINEAR_DATA, 
    SAMPLE_CATEGORICAL_DATA,
    currencyFormatter,
    dateFormatter,
    percentageFormatter
} from '../../lib/data/chart-sample-data';

export default function ResponsiveChartsPage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Responsive LineChart Examples
            </Typography>
            
            <Typography variant="body1" sx={{ mb: 4 }}>
                Demonstrating different responsive configurations: 100% width/height, fixed dimensions, and mixed approaches.
            </Typography>

            {/* Full Width, Fixed Height */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    1. Full Width, Fixed Height (400px)
                </Typography>
                <Box sx={{ width: '100%', height: 400, border: '1px dashed #ccc' }}>
                    <LineChart
                        data={SAMPLE_STOCK_DATA}
                        width="100%"
                        height={400}
                        xAxisLabel="Date"
                        yAxisLabel="Price ($)"
                        formatX={dateFormatter}
                        formatY={currencyFormatter}
                        showDots={true}
                        animate={true}
                    />
                </Box>
            </Paper>

            {/* Full Width and Height */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    2. Full Width and Height (Container: 100% x 500px)
                </Typography>
                <Box sx={{ width: '100%', height: 500, border: '1px dashed #ccc' }}>
                    <LineChart
                        data={SAMPLE_LINEAR_DATA}
                        width="100%"
                        height="100%"
                        xAxisType="linear"
                        xAxisLabel="Time (hours)"
                        yAxisLabel="Temperature (°C)"
                        showDots={true}
                        animate={true}
                        lineColor="#ff6b35"
                        strokeWidth={3}
                    />
                </Box>
            </Paper>

            {/* Grid Layout with Responsive Charts */}
            <Typography variant="h5" gutterBottom>
                3. Grid Layout with Responsive Charts
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Stock Performance (Responsive)
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <LineChart
                                data={SAMPLE_STOCK_DATA}
                                width="100%"
                                height="100%"
                                xAxisType="time"
                                formatX={dateFormatter}
                                formatY={currencyFormatter}
                                showDots={true}
                                animate={true}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Monthly Performance (Responsive)
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <LineChart
                                data={SAMPLE_CATEGORICAL_DATA}
                                width="100%"
                                height="100%"
                                xAxisType="band"
                                xAxisLabel="Month"
                                yAxisLabel="Performance (%)"
                                formatY={percentageFormatter}
                                showDots={true}
                                lineColor="#4caf50"
                                strokeWidth={2}
                                dotRadius={6}
                                animate={true}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            {/* Aspect Ratio Container */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    4. Aspect Ratio Container (16:9)
                </Typography>
                <Box sx={{ 
                    width: '100%', 
                    aspectRatio: '16 / 9',
                    border: '1px dashed #ccc',
                    maxWidth: 800
                }}>
                    <LineChart
                        data={SAMPLE_STOCK_DATA}
                        width="100%"
                        height="100%"
                        xAxisType="time"
                        xAxisLabel="Date"
                        yAxisLabel="Price ($)"
                        formatX={dateFormatter}
                        formatY={currencyFormatter}
                        showDots={true}
                        animate={true}
                        lineColor="#9c27b0"
                    />
                </Box>
            </Paper>

            {/* Mobile Responsive */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    5. Mobile Responsive (Different heights for mobile/desktop)
                </Typography>
                <Box sx={{ 
                    width: '100%', 
                    height: { xs: 250, sm: 350, md: 400 },
                    border: '1px dashed #ccc'
                }}>
                    <LineChart
                        data={SAMPLE_LINEAR_DATA}
                        width="100%"
                        height="100%"
                        xAxisType="linear"
                        xAxisLabel="X Axis"
                        yAxisLabel="Y Axis"
                        showDots={true}
                        animate={true}
                        lineColor="#ff9800"
                        strokeWidth={2}
                    />
                </Box>
            </Paper>

            {/* Usage Examples */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Usage Examples:
                </Typography>
                
                <Box component="pre" sx={{ 
                    bgcolor: 'grey.900', 
                    color: 'grey.100', 
                    p: 2, 
                    borderRadius: 1, 
                    overflow: 'auto',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace'
                }}>
{`// Full responsive chart
<LineChart
  data={data}
  width="100%"
  height="100%"
/>

// Fixed width, responsive height  
<LineChart
  data={data}
  width={800}
  height="100%"
/>

// Responsive width, fixed height
<LineChart
  data={data}
  width="100%"
  height={400}
/>

// Container with aspect ratio
<Box sx={{ width: '100%', aspectRatio: '16/9' }}>
  <LineChart
    data={data}
    width="100%"
    height="100%"
  />
</Box>`}
                </Box>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Key Features:</strong>
                </Typography>
                <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                    <Typography component="li">✅ Supports both number and string (percentage) dimensions</Typography>
                    <Typography component="li">✅ Uses ResizeObserver for responsive behavior</Typography>
                    <Typography component="li">✅ Maintains aspect ratios when container resizes</Typography>
                    <Typography component="li">✅ Works with CSS Grid and Flexbox layouts</Typography>
                    <Typography component="li">✅ Automatic min-width/min-height for string dimensions</Typography>
                </Box>
            </Box>
        </Box>
    );
}