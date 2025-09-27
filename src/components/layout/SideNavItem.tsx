"use client";

import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { styles } from '../../app/styles/sidenav.styles';
import { Box, Tooltip } from '@mui/material';

type Props = {
	collapsed: boolean;
	label: string;
	icon: React.ReactNode;
};

export default function SideNavItem({ collapsed, label, icon }: Props) {
	return (
		<ListItem disablePadding>
			<Tooltip title={label} placement={collapsed ? "right" : "auto" } arrow>
				<ListItemButton sx={styles.itemButton}>
					<ListItemIcon sx={styles.itemIcon}>
						{icon}
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography
								noWrap
								component="span"
								sx={styles.typography}
							>
								{label}
							</Typography>
						}
						sx={styles.itemText}
					/>
				</ListItemButton>
			</Tooltip>
		</ListItem>
	);
}
