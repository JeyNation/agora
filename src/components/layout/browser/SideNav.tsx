"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import SideNavItem from './SideNavItem';
import { NAV_GROUPS } from '../../../app/constants';
import { sideNav } from '../../../styles/components/navigation';
import { Divider } from '@mui/material';

export interface SideNavProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ collapsed, setCollapsed }) => {
    const handleToggle = React.useCallback(() => {
        setCollapsed(!collapsed);
    }, [collapsed, setCollapsed]);

    return (
        <Drawer
            variant="permanent"
            open={true}
            slotProps={{
                paper: {
                    sx: sideNav.drawer(collapsed),
                },
            }}
        >
            <Box sx={sideNav.header}>
                {!collapsed && (
					<Typography sx={sideNav.brandText}>
						Agora
					</Typography>
                )}
                <IconButton 
                    onClick={handleToggle} 
                    aria-label={collapsed ? 'expand navigation' : 'collapse navigation'}
                    aria-expanded={!collapsed}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Box sx={sideNav.container}>
                {NAV_GROUPS.map((group, groupIndex) => (
                    <List 
                        key={groupIndex}
                        sx={sideNav.list(group.bottomAlign)}
                    >
						{groupIndex > 0 && <Divider />}
                        {group.items.map((item) => (
							<SideNavItem
								key={item.label}
								collapsed={collapsed}
								label={item.label}
								icon={item.icon}
								href={item.href}
							/>
                        ))}
                    </List>
                ))}
            </Box>
        </Drawer>
    );
};

export default SideNav;
