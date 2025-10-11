import type { SxProps, Theme } from '@mui/material/styles';

/**
 * Ticker page styles
 */
export const tickerStyles = {
    container: {
        maxWidth: 'xl',
        mx: 'auto',
        p: 3,
    } as SxProps<Theme>,

    headerCard: {
        p: 3,
        mb: 3,
        borderRadius: 2,
        boxShadow: 1,
    } as SxProps<Theme>,

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
    } as SxProps<Theme>,

    symbol: {
        fontWeight: 'bold',
        color: 'primary.main',
        mb: 0.5,
    } as SxProps<Theme>,

    companyName: {
        color: 'text.secondary',
        fontWeight: 'normal',
    } as SxProps<Theme>,

    priceInfo: {
        textAlign: 'right',
    } as SxProps<Theme>,

    price: {
        fontWeight: 'bold',
        color: 'text.primary',
        mb: 0.5,
    } as SxProps<Theme>,

    priceChange: {
        color: 'success.main',
        fontWeight: 'medium',
    } as SxProps<Theme>,

    contentGrid: {
        mt: 0,
    } as SxProps<Theme>,

    mainContentWrapper: {
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: 3,
        mb: 3,
    } as SxProps<Theme>,

    chartSection: {
        flex: { xs: '1', lg: '2' },
    } as SxProps<Theme>,

    metricsSection: {
        flex: { xs: '1', lg: '1' },
    } as SxProps<Theme>,

    financialsSection: {
        width: '100%',
    } as SxProps<Theme>,

    financialsGrid: {
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
        gap: 2,
        mt: 2,
    } as SxProps<Theme>,

    chartCard: {
        height: '100%',
        borderRadius: 2,
        boxShadow: 1,
    } as SxProps<Theme>,

    chartContainer: {
        height: 400,
        width: '100%',
        mt: 2,
        position: 'relative',
    } as SxProps<Theme>,

    metricsCard: {
        height: '100%',
        borderRadius: 2,
        boxShadow: 1,
    } as SxProps<Theme>,

    metricsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 2,
        mt: 2,
    } as SxProps<Theme>,

    metricItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:last-child': {
            borderBottom: 'none',
        },
    } as SxProps<Theme>,

    financialsCard: {
        borderRadius: 2,
        boxShadow: 1,
    } as SxProps<Theme>,

    financialItem: {
        textAlign: 'center',
        p: 2,
        borderRadius: 1,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
    } as SxProps<Theme>,
};