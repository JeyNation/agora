"use client";

import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

type Props = {
	label: string;
	icon: React.ReactNode;
	onClick?: () => void;
	tooltipPlacement?: 'left' | 'right' | 'top' | 'bottom';
};

export default function MobileNavItem({ 
	label, 
	icon, 
	onClick,
	tooltipPlacement = 'right'
}: Props) {
	return (
		<Tooltip 
			title={label}
			placement={tooltipPlacement}
			arrow
		>
			<ListItemButton onClick={onClick}>
				<ListItemIcon>
					{icon}
				</ListItemIcon>
				<ListItemText primary={label} />
			</ListItemButton>
		</Tooltip>
	);
}