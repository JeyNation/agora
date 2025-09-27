"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SideNavItem from './SideNavItem';
import { NAV_GROUPS } from './constants';
import { styles } from './styles/sidenav.styles';
import type { SideNavProps } from './types';
import { DRAWER_COLLAPSED_WIDTH } from './constants';

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
                    sx: styles.drawer(collapsed),
                },
            }}
        >
            <Box sx={styles.header}>
                <IconButton 
                    onClick={handleToggle} 
                    aria-label={collapsed ? 'expand navigation' : 'collapse navigation'}
                    aria-expanded={!collapsed}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Box sx={styles.container}>
                {NAV_GROUPS.map((group, groupIndex) => (
                    <List 
                        key={groupIndex}
                        sx={styles.list(group.bottomAlign)}
                    >
                        {group.items.map((item) => (
                            <SideNavItem
                                key={item.label}
                                collapsed={collapsed}
                                collapsedWidth={DRAWER_COLLAPSED_WIDTH}
                                label={item.label}
                                icon={item.icon}
                            />
                        ))}
                    </List>
                ))}
            </Box>
        </Drawer>
    );
};

export default SideNav;
