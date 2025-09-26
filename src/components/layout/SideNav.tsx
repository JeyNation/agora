"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SideNavItem from './SideNavItem';

// Constants
export const drawerDefaultWidth = 240;
export const drawerCollapsedWidth = 55;
const TRANSITION_DURATION = 200;

// Types for navigation
type NavItem = {
	label: string;
	icon: React.ReactElement;
};

type NavGroup = {
	items: NavItem[];
	bottomAlign?: boolean;
};

// Navigation groups definition
const NAV_GROUPS: NavGroup[] = [
	{
		items: [
			{ label: 'Dashboard', icon: <HomeIcon /> },
			{ label: 'Reports', icon: <AssessmentIcon /> },
		],
	},
	{
		items: [
			{ label: 'Settings', icon: <SettingsIcon /> },
			{ label: 'Profile', icon: <AccountCircleIcon /> },
			{ label: 'Logout', icon: <LogoutIcon /> },
		],
		bottomAlign: true,
	},
];

// Types
type Props = {
	collapsed: boolean;
	setCollapsed: (c: boolean) => void;
};

// Styles
const getDrawerStyles = (collapsed: boolean): SxProps<Theme> => ({
	boxSizing: 'border-box',
	width: `${collapsed ? drawerCollapsedWidth : drawerDefaultWidth}px`,
	transition: theme => 
		theme.transitions.create('width', {
			easing: theme.transitions.easing.easeInOut,
			duration: TRANSITION_DURATION,
		}),
	overflowX: 'hidden',
});

const headerStyles: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	px: 1,
	py: 1,
};

const containerStyles: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
};

const getListStyles = (bottomAlign?: boolean): SxProps<Theme> => ({
	borderTop: 1,
	borderColor: 'divider',
	...(bottomAlign && { mt: 'auto' }),
});

export default function SideNav({ collapsed, setCollapsed }: Props) {
	const handleToggle = React.useCallback(() => {
		setCollapsed(!collapsed);
	}, [collapsed, setCollapsed]);

	return (
		<Drawer
			variant="permanent"
			open={true}
			slotProps={{
				paper: {
					sx: getDrawerStyles(collapsed),
				},
			}}
		>
			{/* Header with toggle button */}
			<Box sx={headerStyles}>
				<IconButton 
					onClick={handleToggle} 
					aria-label={collapsed ? 'expand navigation' : 'collapse navigation'}
					aria-expanded={!collapsed}
				>
					<MenuIcon />
				</IconButton>
			</Box>

			{/* Navigation container */}
			<Box sx={containerStyles}>
				{NAV_GROUPS.map((group, groupIndex) => (
					<List 
						key={groupIndex}
						sx={getListStyles(group.bottomAlign)}
					>
						{group.items.map((item) => (
							<SideNavItem
								key={item.label}
								collapsed={collapsed}
								collapsedWidth={drawerCollapsedWidth}
								label={item.label}
								icon={item.icon}
							/>
						))}
					</List>
				))}
			</Box>
		</Drawer>
	);
}
