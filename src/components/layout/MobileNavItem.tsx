"use client";

import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

type Props = {
	label: string;
	icon: React.ReactNode;
	onClick?: () => void;
};

export default function MobileNavItem({ label, icon, onClick }: Props) {
	return (
		<ListItemButton onClick={onClick}>
			<ListItemIcon>
				{icon}
			</ListItemIcon>
			<ListItemText primary={label} />
		</ListItemButton>
	);
}