"use client";

import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Fab from '@mui/material/Fab';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SideNav, { drawerDefaultWidth, drawerCollapsedWidth } from './SideNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = React.useState(false);
	const [collapsed, setCollapsed] = React.useState(false);
	const handleMenu = () => setOpen((s) => !s);
	const handleClose = () => setOpen(false);

	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<SideNav open={open} onClose={handleClose} collapsed={collapsed} setCollapsed={setCollapsed} />
			
			{mounted && !isMdUp && (
				<Fab
					color="primary"
					aria-label="open menu"
					onClick={handleMenu}
					sx={{ position: 'fixed', bottom: 16, left: 16, zIndex: (t) => t.zIndex.drawer + 2 }}
				>
					<MenuIcon />
				</Fab>
			)}

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					mt: 2,
					ml: { md: `${collapsed ? drawerCollapsedWidth : drawerDefaultWidth}px` },
				}}
			>
				{children}
			</Box>
		</Box>
	);
}
