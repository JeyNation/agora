"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';

type Props = {
	label: string;
	icon: React.ReactNode;
	onClick?: () => void;
	tooltipPlacement?: 'left' | 'right' | 'top' | 'bottom';
	href?: string;
};

export default function MobileNavItem({ 
	label, 
	icon, 
	onClick,
	tooltipPlacement = 'right',
	href
}: Props) {
    const pathname = usePathname();
    const isSelected = href ? pathname === href || pathname.startsWith(`${href}?`) : false;
	const content = (
		<ListItemButton onClick={onClick} selected={isSelected}>
			<ListItemIcon>
				{icon}
			</ListItemIcon>
			<ListItemText primary={label} />
		</ListItemButton>
	);

	return (
		<Tooltip 
			title={label}
			placement={tooltipPlacement}
			arrow
		>
			{href ? (
				<Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
					{content}
				</Link>
			) : content}
		</Tooltip>
	);
}