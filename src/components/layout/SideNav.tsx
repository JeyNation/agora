"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SideNavItem from './SideNavItem';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  open?: boolean;
  onClose?: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
};

export const drawerDefaultWidth = 240;
export const drawerCollapsedWidth = 55;

export default function SideNav({ open = false, onClose, collapsed, setCollapsed }: Props) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const variant = isMdUp ? 'permanent' : 'temporary';
  const drawerOpen = isMdUp ? true : open;

  return (
		<Drawer
			variant={variant}
			open={drawerOpen}
			onClose={onClose}
			ModalProps={{ keepMounted: true }}
			slotProps={{
				paper: {
					sx: {
						boxSizing: 'border-box',
						width: `${collapsed ? drawerCollapsedWidth : drawerDefaultWidth}px`,
						transition: 'width 200ms ease',
						overflowX: 'hidden',
					},
				},
			}}
		>
		<Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
			<IconButton onClick={() => setCollapsed(!collapsed)} aria-label="toggle collapse">
				<MenuIcon />
			</IconButton>
		</Box>

		<List>
			<SideNavItem collapsed={collapsed} collapsedWidth={drawerCollapsedWidth} label="Dashboard" icon={<HomeIcon />} />
			<SideNavItem collapsed={collapsed} collapsedWidth={drawerCollapsedWidth} label="Reports" icon={<AssessmentIcon />} />
			<SideNavItem collapsed={collapsed} collapsedWidth={drawerCollapsedWidth} label="Settings" icon={<SettingsIcon />} />
		</List>
	</Drawer>
  );
}
