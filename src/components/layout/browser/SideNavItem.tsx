"use client";

import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { sideNav } from '../../../styles/components/navigation';
import { Tooltip } from '@mui/material';

type Props = {
	collapsed: boolean;
	label: string;
	icon: React.ReactNode;
};

export default function SideNavItem({ collapsed, label, icon }: Props) {
	return (
		<ListItem disablePadding>
			<Tooltip title={label} placement={collapsed ? "right" : "auto" } arrow>
				<ListItemButton sx={sideNav.itemButton}>
					<ListItemIcon sx={sideNav.itemIcon}>
						{icon}
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography
								noWrap
								component="span"
								sx={sideNav.typography}
							>
								{label}
							</Typography>
						}
						sx={sideNav.itemText}
					/>
				</ListItemButton>
			</Tooltip>
		</ListItem>
	);
}
