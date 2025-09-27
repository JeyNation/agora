"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import Typography from '@mui/material/Typography';
import SideNavItem from './SideNavItem';
import { NAV_GROUPS } from '../../app/constants';
import { styles } from '../../app/styles/sidenav.styles';

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
                    sx: styles.drawer(collapsed),
                },
            }}
        >
            <Box sx={styles.header(collapsed)}>
                {!collapsed && (
					<Typography sx={styles.brandText}>
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
