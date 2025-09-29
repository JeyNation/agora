"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
	href?: string;
};

export default function SideNavItem({ collapsed, label, icon, href }: Props) {
    const pathname = usePathname();
    const isSelected = href ? pathname === href || pathname.startsWith(`${href}?`) : false;
	return (
		<ListItem disablePadding>
			<Tooltip title={label} placement={collapsed ? "right" : "auto" } arrow>
				{href ? (
					<Link href={href} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
						<ListItemButton sx={sideNav.itemButton} selected={isSelected}>
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
					</Link>
				) : (
					<ListItemButton sx={sideNav.itemButton} selected={isSelected}>
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
				)}
			</Tooltip>
		</ListItem>
	);
}
