"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SideNav, { drawerDefaultWidth, drawerCollapsedWidth } from './SideNav';
import MobileNav from './MobileNav';

// Constants
const MOBILE_NAV_HEIGHT = 56;
const CONTENT_PADDING = 3;

// Types
type Props = {
	children: React.ReactNode;
};

// Styles
const containerStyles: SxProps<Theme> = {
	display: 'flex',
	minHeight: '100vh',
};

const getDesktopMainStyles = (collapsed: boolean): SxProps<Theme> => ({
	flexGrow: 1,
	p: CONTENT_PADDING,
	ml: `${collapsed ? drawerCollapsedWidth : drawerDefaultWidth}px`,
	transition: theme => theme.transitions.create('margin-left', {
		easing: theme.transitions.easing.easeInOut,
		duration: 200,
	}),
});

const mobileMainStyles: SxProps<Theme> = {
	width: '100%',
	mt: `${MOBILE_NAV_HEIGHT}px`,
	p: CONTENT_PADDING,
};

/**
 * ClientLayout component that handles responsive layout switching between
 * desktop (with collapsible side navigation) and mobile (with slide-down navigation) modes.
 */
export default function ClientLayout({ children }: Props) {
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

	// Render helpers
	const renderDesktopLayout = () => (
		<>
			<SideNav 
				collapsed={collapsed} 
				setCollapsed={setCollapsed} 
			/>
			<Box
				component="main"
				sx={getDesktopMainStyles(collapsed)}
			>
				{children}
			</Box>
		</>
	);

	const renderMobileLayout = () => (
		<>
			{mounted && <MobileNav />}
			<Box
				component="main"
				sx={mobileMainStyles}
			>
				{children}
			</Box>
		</>
	);

	return (
		<Box sx={containerStyles}>
			<CssBaseline />
			{isMdUp ? renderDesktopLayout() : renderMobileLayout()}
		</Box>
	);
}
