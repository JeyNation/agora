'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import LineChart from '../charts/LineChart';
import { 
    SAMPLE_STOCK_DATA, 
    SAMPLE_LINEAR_DATA, 
    SAMPLE_CATEGORICAL_DATA, 
    SAMPLE_REVENUE_DATA,
    currencyFormatter,
    percentageFormatter,
    millionsFormatter,
    dateFormatter
} from '../../lib/data/chartSampleData';

export default function ChartShowcase() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                LineChart Component Showcase
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
                {/* Stock Price Chart (Time Series) */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Stock Price Chart (Time Series)
                        </Typography>
                        <LineChart
                            data={SAMPLE_STOCK_DATA}
                            dimensions={{ width: 500, height: 300 }}
                            axes={{
                                xAxisType: 'time',
                                xAxisLabel: 'Date',
                                yAxisLabel: 'Price ($)',
                                formatX: dateFormatter,
                                formatY: currencyFormatter
                            }}
                            interaction={{
                                showDots: true,
                                onHover: (data) => {
                                    if (data) {
                                        console.log(`Stock Price: ${currencyFormatter(data.y)} on ${dateFormatter(data.x)}`);
                                    }
                                }
                            }}
                            styling={{ strokeWidth: 2 }}
                            animation={{ animate: true }}
                        />
                    </CardContent>
                </Card>

                {/* Linear Data Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Linear Data Chart
                        </Typography>
                        <LineChart
                            data={SAMPLE_LINEAR_DATA}
                            dimensions={{ width: 500, height: 300 }}
                            axes={{
                                xAxisType: 'linear',
                                xAxisLabel: 'Time (hours)',
                                yAxisLabel: 'Temperature (°C)'
                            }}
                            interaction={{ showDots: true }}
                            styling={{ lineColor: '#ff6b35', strokeWidth: 3 }}
                            animation={{ animate: true }}
                        />
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
                {/* Categorical Data Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Monthly Sales (Categorical)
                        </Typography>
                        <LineChart
                            data={SAMPLE_CATEGORICAL_DATA}
                            dimensions={{ width: 500, height: 300 }}
                            axes={{
                                xAxisType: 'band',
                                xAxisLabel: 'Month',
                                yAxisLabel: 'Sales (%)',
                                formatY: percentageFormatter
                            }}
                            interaction={{ showDots: true, dotRadius: 6 }}
                            styling={{ lineColor: '#4caf50', strokeWidth: 2 }}
                            animation={{ animate: true }}
                        />
                    </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Annual Revenue (Custom Formatting)
                        </Typography>
                        <LineChart
                            data={SAMPLE_REVENUE_DATA}
                            dimensions={{ width: 500, height: 300 }}
                            axes={{
                                xAxisType: 'linear',
                                xAxisLabel: 'Year',
                                yAxisLabel: 'Revenue',
                                formatY: millionsFormatter
                            }}
                            interaction={{ showDots: true, dotRadius: 5 }}
                            styling={{ lineColor: '#9c27b0', strokeWidth: 2 }}
                            animation={{ animate: true, animationDuration: 2000 }}
                        />
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Features Demonstrated:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li">✅ Time series data with date formatting</Typography>
                    <Typography component="li">✅ Linear numerical data</Typography>
                    <Typography component="li">✅ Categorical/band scale data</Typography>
                    <Typography component="li">✅ Custom color schemes</Typography>
                    <Typography component="li">✅ Hover interactions</Typography>
                    <Typography component="li">✅ Custom formatters (currency, percentage, millions)</Typography>
                    <Typography component="li">✅ Animated line drawing</Typography>
                    <Typography component="li">✅ Grid lines and axis labels</Typography>
                    <Typography component="li">✅ Responsive design</Typography>
                    <Typography component="li">✅ Theme integration (MUI)</Typography>
                </Box>
            </Box>
        </Box>
    );
}