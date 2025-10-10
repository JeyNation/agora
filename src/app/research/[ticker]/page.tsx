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
import { useResearchHistory } from '@/lib/hooks/useResearchHistory';

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

export default function TickerPage() {
    const params = useParams();
    const ticker = (params.ticker as string)?.toUpperCase();
    
	const {
		addToHistory
	} = useResearchHistory();
	
    const [error, setError] = React.useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [stockData, setStockData] = React.useState<StockInfo | null>(null);

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
                                <Typography variant="h6" gutterBottom>
                                    Stock Performance
                                </Typography>
                                <Box sx={tickerStyles.chartContainer}>
                                    <LineChart />
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