"use client";

import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

type Props = {
	collapsed: boolean;
	label: string;
	icon: React.ReactNode;
};

export default function SideNavItem({ collapsed, label, icon }: Props) {
	return (
		<ListItem disablePadding>
			<ListItemButton
				sx={{
					justifyContent: 'flex-start',
					alignItems: 'center',
					py: 1.5,
				}}
			>
				<ListItemIcon
					sx={{
						minWidth: 0,
						width: '42px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'left',
					}}
				>
					{icon}
				</ListItemIcon>

				{!collapsed && (
					<ListItemText
						primary={
							<Typography
								noWrap
								component="span"
								sx={{
								lineHeight: 1,
								whiteSpace: 'nowrap',
								fontSize: '0.9rem',
								margin: 0,
								}}
							>
								{label}
							</Typography>
						}
						sx={{ 
							ml: 0,
							margin: 0,
						}}
					/>
				)}
			</ListItemButton>
		</ListItem>
	);
}
