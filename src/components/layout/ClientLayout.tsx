"use client";

import React from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { styles } from '../../app/styles/clientlayout.styles';
import SideNav from './SideNav';
import MobileNav from './MobileNav';
import PageHeader from './PageHeader';

export interface ClientLayoutProps {
    children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
    // State
    const [collapsed, setCollapsed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    // Hooks
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

    // Effects
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    // Render helpers
    const renderDesktopLayout = () => (
        <>
            <SideNav 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
            />
            <PageHeader />
            <Box
                component="main"
                sx={styles.desktopMain(collapsed)}
            >
                {children}
            </Box>
        </>
    );

    const renderMobileLayout = () => (
        <>
			<MobileNav />
            <Box
                component="main"
                sx={styles.mobileMain}
            >
                {children}
            </Box>
        </>
    );

    return (
        <Box sx={styles.container}>
            <CssBaseline />
            {isMdUp ? renderDesktopLayout() : renderMobileLayout()}
        </Box>
    );
};

export default ClientLayout;
