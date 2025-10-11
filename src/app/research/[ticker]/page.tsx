'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Toast from '../../../components/common/Toast';
import LineChart from '../../../components/charts/LineChart';
import { searchStocks } from '../../../lib/services/stock-search';
import { tickerStyles } from '../../../styles/components';
import type { StockInfo } from '../../../lib/types/stock';
import { SAMPLE_STOCK_DATA, EXTENDED_STOCK_DATA, currencyFormatter, currencyFormatterFull, dateFormatter, dateFormatterFull } from '../../../lib/data/chartSampleData';
import { useResearchHistory } from '@/lib/hooks/useResearchHistory';
import type { HighlightRange, DataPoint } from '../../../components/charts/LineChart';

interface StockMetric {
    label: string;
    value: string | number;
    unit?: string;
}

interface FinancialData {
    revenue: string;
    netIncome: string;
    totalAssets: string;
    totalDebt: string;
    freeCashFlow: string;
}

// Function to calculate weekend ranges within a given date range
function calculateWeekendRanges(startDate: Date, endDate: Date): HighlightRange[] {
    const weekends: HighlightRange[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
        const dayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 6) { // Saturday
            const weekendStart = new Date(current);
			weekendStart.setHours(0, 0, 0, 0); // Start of Saturday	

            const weekendEnd = new Date(current);
            weekendEnd.setDate(weekendEnd.getDate() + 1); // Sunday
            weekendEnd.setHours(23, 59, 59, 999); // End of Sunday
            
            // Only add if weekend end is within our date range
            if (weekendEnd <= endDate) {
                weekends.push({
                    start: weekendStart,
                    end: weekendEnd,
                    color: '#f5f5f5',
                    opacity: 0.4
                });
            } else if (weekendStart <= endDate) {
                // Partial weekend at the end of range
                weekends.push({
                    start: weekendStart,
                    end: endDate,
                    color: '#f5f5f5',
                    opacity: 0.4
                });
            }
            
            // Skip to Monday
            current.setDate(current.getDate() + 2);
        } else if (dayOfWeek === 0) { // Sunday
            const weekendStart = new Date(current);
            weekendStart.setDate(weekendStart.getDate() - 1); // Saturday
            const weekendEnd = new Date(current);
            weekendEnd.setHours(23, 59, 59, 999);
            
            // Only add if weekend start is within our date range
            if (weekendStart >= startDate) {
                weekends.push({
                    start: weekendStart,
                    end: weekendEnd,
                    color: '#f5f5f5',
                    opacity: 0.4
                });
            } else if (weekendEnd >= startDate) {
                // Partial weekend at the start of range
                weekends.push({
                    start: startDate,
                    end: weekendEnd,
                    color: '#f5f5f5',
                    opacity: 0.4
                });
            }
            
            // Move to next day
            current.setDate(current.getDate() + 1);
        } else {
            // Weekday, move to next day
            current.setDate(current.getDate() + 1);
        }
    }
    
    return weekends;
}

export default function TickerPage() {
    const params = useParams();
    const ticker = (params.ticker as string)?.toUpperCase();
    
	const {
		addToHistory
	} = useResearchHistory();
	
    const [error, setError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [stockData, setStockData] = React.useState<StockInfo | null>(null);
    
    // Dynamic chart data state
    const [chartData, setChartData] = React.useState<DataPoint[]>(SAMPLE_STOCK_DATA);
    const [isLoadingData, setIsLoadingData] = React.useState(false);
    const [loadedRanges, setLoadedRanges] = React.useState<{ before: boolean; after: boolean }>({
        before: false,
        after: false
    });

    // Define initial chart domain and calculate weekend ranges
    const chartXDomain: [Date, Date] = [new Date('2024-01-01'), new Date('2024-02-01')];
    const [currentDomain, setCurrentDomain] = React.useState<[Date, Date]>(chartXDomain);
    const chartStartDate = currentDomain[0];
    const chartEndDate = currentDomain[1];
    const weekendRanges = React.useMemo(() => 
        calculateWeekendRanges(chartStartDate, chartEndDate), 
        [chartStartDate, chartEndDate]
    );
    
    // Handle dynamic data loading when panning beyond current data boundaries
    const handleDataNeeded = React.useCallback((
        direction: 'before' | 'after',
        currentRange: [Date, Date],
        dataRange: [Date, Date]
    ) => {
        // Prevent multiple simultaneous loads or loading already loaded ranges
        if (isLoadingData || loadedRanges[direction]) return;
        
        console.log('Data needed:', direction, 'Current range:', currentRange, 'Data range:', dataRange);
        setIsLoadingData(true);
        
        // Simulate loading delay (in real app, this would be an API call)
        setTimeout(() => {
            setChartData(currentData => {
                // Get existing data timestamps for duplicate check
                const existingTimestamps = new Set(
                    currentData.map(point => (point.x as Date).getTime())
                );
                
                let newDataToAdd: DataPoint[] = [];
                
                if (direction === 'before') {
                    // Only add earlier data that doesn't already exist and is before current data range
                    newDataToAdd = EXTENDED_STOCK_DATA.before.filter(point => {
                        const pointTime = (point.x as Date).getTime();
                        return pointTime < dataRange[0].getTime() && !existingTimestamps.has(pointTime);
                    });
                    
                    console.log(`Loading ${newDataToAdd.length} earlier data points`);
                    return [...newDataToAdd, ...currentData].sort((a, b) => (a.x as Date).getTime() - (b.x as Date).getTime());
                } else {
                    // Only add later data that doesn't already exist and is after current data range
                    newDataToAdd = EXTENDED_STOCK_DATA.after.filter(point => {
                        const pointTime = (point.x as Date).getTime();
                        return pointTime > dataRange[1].getTime() && !existingTimestamps.has(pointTime);
                    });
                    
                    console.log(`Loading ${newDataToAdd.length} later data points`);
                    return [...currentData, ...newDataToAdd].sort((a, b) => (a.x as Date).getTime() - (b.x as Date).getTime());
                }
            });
            
            setIsLoadingData(false);
            
            // Mark this range as loaded to prevent duplicate requests
            setLoadedRanges(prev => ({
                ...prev,
                [direction]: true
            }));
        }, 500); // 500ms loading simulation
    }, [isLoadingData, loadedRanges]);
    
    // Handle panning to update current domain for weekend calculations
    const handlePan = React.useCallback((newDomain: [Date, Date]) => {
        setCurrentDomain(newDomain);
    }, []);
    

    const mockMetrics: StockMetric[] = [
        { label: 'P/E Ratio (TTM)', value: '28.5' },
        { label: 'PEG Ratio', value: '2.1' },
        { label: 'Market Cap', value: '2.8T', unit: 'USD' },
        { label: 'Dividend Yield', value: '0.5', unit: '%' },
        { label: '52 Week High', value: '199.62', unit: 'USD' },
        { label: '52 Week Low', value: '164.08', unit: 'USD' },
    ];

    const mockFinancials: FinancialData = {
        revenue: '$394.3B',
        netIncome: '$97.0B',
        totalAssets: '$352.8B',
        totalDebt: '$104.6B',
        freeCashFlow: '$99.6B',
    };

    React.useEffect(() => {
        if (!ticker) {
            setError('No ticker symbol provided');
            setSnackbarOpen(true);
            return;
        }

        const results = searchStocks(ticker);
        if (results.length > 0) {
            setStockData(results[0]);
            setError(null);
			addToHistory(ticker);
        } else {
            const msg = `Stock ${ticker} not found`;
            setError(msg);
            setSnackbarOpen(true);
        }
    }, [ticker, addToHistory]);

    const handleCloseSnackbar = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (!ticker) {
        return (
            <Box sx={tickerStyles.container}>
                <Typography variant="h6" color="error">
                    No ticker symbol provided
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={tickerStyles.container}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Toast open={snackbarOpen} message={error} onClose={handleCloseSnackbar} severity="error" />
            </Box>
        );
    }

    return (
        <Box sx={tickerStyles.container}>
            <Paper sx={tickerStyles.headerCard}>
                <Box sx={tickerStyles.header}>
                    <Box>
                        <Typography variant="h4" component="h1" sx={tickerStyles.symbol}>
                            {ticker}
                        </Typography>
                        <Typography variant="h6" sx={tickerStyles.companyName}>
                            {stockData?.companyName || 'Company Name'}
                        </Typography>
                    </Box>
                    <Box sx={tickerStyles.priceInfo}>
                        <Typography variant="h4" sx={tickerStyles.price}>
                            $189.84
                        </Typography>
                        <Typography variant="body2" sx={tickerStyles.priceChange}>
                            +2.45 (+1.31%)
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Box sx={tickerStyles.contentGrid}>
                {/* Main Content Grid */}
                <Box sx={tickerStyles.mainContentWrapper}>
                    {/* Stock Chart */}
                    <Box sx={tickerStyles.chartSection}>
                        <Card sx={tickerStyles.chartCard}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">
                                        Stock Performance
                                    </Typography>
                                </Box>
                                <Box sx={tickerStyles.chartContainer}>
                                    <LineChart
                                        data={chartData}
                                        dimensions={{ width: '100%', height: '100%' }}
                                        axes={{
                                            xAxisType: 'time',
                                            xDomain: chartXDomain,
                                            formatX: dateFormatter,
                                            formatY: currencyFormatter,
											tooltipFormatX: dateFormatterFull,
                                            tooltipFormatY: currencyFormatterFull
                                        }}
                                        xHighlightRanges={weekendRanges}
                                        grid={{ showXGrid: true, showYGrid: false }}
                                        interaction={{
                                            showDots: true,
                                            showTooltip: true,
                                            enablePanning: true,
                                            onPan: handlePan,
                                            onDataNeeded: handleDataNeeded
                                        }}
                                        animation={{ animate: true, animateOnDataChange: false }}
                                        errorHandling={{ loading: isLoadingData }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Key Metrics */}
                    <Box sx={tickerStyles.metricsSection}>
                        <Card sx={tickerStyles.metricsCard}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Key Metrics
                                </Typography>
                                <Box sx={tickerStyles.metricsGrid}>
                                    {mockMetrics.map((metric, index) => (
                                        <Box key={index} sx={tickerStyles.metricItem}>
                                            <Typography variant="body2" color="text.secondary">
                                                {metric.label}
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {metric.value}{metric.unit && ` ${metric.unit}`}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>

                {/* Financial Overview */}
                <Box sx={tickerStyles.financialsSection}>
                    <Card sx={tickerStyles.financialsCard}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Financial Overview (TTM)
                            </Typography>
                            <Box sx={tickerStyles.financialsGrid}>
                                <Box sx={tickerStyles.financialItem}>
                                    <Typography variant="body2" color="text.secondary">
                                        Revenue
                                    </Typography>
                                    <Typography variant="h6">
                                        {mockFinancials.revenue}
                                    </Typography>
                                </Box>
                                <Box sx={tickerStyles.financialItem}>
                                    <Typography variant="body2" color="text.secondary">
                                        Net Income
                                    </Typography>
                                    <Typography variant="h6">
                                        {mockFinancials.netIncome}
                                    </Typography>
                                </Box>
                                <Box sx={tickerStyles.financialItem}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Assets
                                    </Typography>
                                    <Typography variant="h6">
                                        {mockFinancials.totalAssets}
                                    </Typography>
                                </Box>
                                <Box sx={tickerStyles.financialItem}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Debt
                                    </Typography>
                                    <Typography variant="h6">
                                        {mockFinancials.totalDebt}
                                    </Typography>
                                </Box>
                                <Box sx={tickerStyles.financialItem}>
                                    <Typography variant="body2" color="text.secondary">
                                        Free Cash Flow
                                    </Typography>
                                    <Typography variant="h6">
                                        {mockFinancials.freeCashFlow}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            <Toast open={snackbarOpen} message={error} onClose={handleCloseSnackbar} severity="error" />
        </Box>
    );
}