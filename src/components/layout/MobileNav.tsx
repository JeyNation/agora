"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MobileNavItem from './MobileNavItem';

type Props = {
	onNavigate?: () => void;
};

// Constants
const HEADER_HEIGHT = 56;
const TRANSITION_DURATION = 500;

// Navigation groups definition
const NAV_GROUPS = [
	{
		items: [
			{ label: 'Dashboard', icon: <HomeIcon /> },
			{ label: 'Reports', icon: <AssessmentIcon /> },
			{ label: 'Settings', icon: <SettingsIcon /> },
		],
	},
	{
		items: [
			{ label: 'Profile', icon: <AccountCircleIcon /> },
			{ label: 'Logout', icon: <LogoutIcon /> },
		],
	},
] as const;

// Styles
const getDrawerStyles = (isExpanded: boolean): SxProps<Theme> => ({
	'& .MuiDrawer-paper': {
		width: '100%',
		background: 'background.paper',
		borderTop: 0,
		height: '100%',
		maxHeight: isExpanded ? '100vh' : `${HEADER_HEIGHT}px`,
		overflow: 'hidden',
		transition: theme => 
			theme.transitions.create(['max-height'], {
				easing: theme.transitions.easing.easeInOut,
				duration: TRANSITION_DURATION,
			}),
	},
});

const headerStyles: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	px: 1,
	py: 1,
	minHeight: '48px',
	flexShrink: 0,
};

const getContentStyles = (isExpanded: boolean): SxProps<Theme> => ({
	opacity: isExpanded ? 1 : 0,
	transition: theme => 
		theme.transitions.create(['opacity'], {
			easing: theme.transitions.easing.easeInOut,
			duration: TRANSITION_DURATION,
		}),
	overflow: 'hidden',
	flexGrow: 1,
});

/**
 * Mobile navigation component that provides a collapsible drawer with navigation items.
 * Shows a hamburger menu when collapsed and expands to show full navigation when clicked.
 */
export default function MobileNav({ onNavigate }: Props) {
	const [isExpanded, setIsExpanded] = React.useState(false);

	const handleItemClick = React.useCallback(() => {
		setIsExpanded(false);
		onNavigate?.();
	}, [onNavigate]);

	const handleToggle = React.useCallback(() => {
		setIsExpanded(prev => !prev);
	}, []);

	return (
		<Drawer
			anchor="top"
			variant="permanent"
			sx={getDrawerStyles(isExpanded)}
		>
			<Box
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				{/* Header with hamburger menu */}
				<Box sx={headerStyles}>
					<IconButton
						onClick={handleToggle}
						size="medium"
						color="inherit"
						aria-label={isExpanded ? 'collapse menu' : 'expand menu'}
						aria-expanded={isExpanded}
					>
						<MenuIcon />
					</IconButton>
				</Box>

				{/* Navigation content */}
				<Box sx={getContentStyles(isExpanded)}>
					<Divider />
					{NAV_GROUPS.map((group, groupIndex) => (
						<React.Fragment key={groupIndex}>
							{groupIndex > 0 && <Divider />}
							<List>
								{group.items.map((item) => (
									<MobileNavItem
										key={item.label}
										label={item.label}
										icon={item.icon}
										onClick={handleItemClick}
									/>
								))}
							</List>
						</React.Fragment>
					))}
				</Box>
			</Box>
		</Drawer>
	);
}