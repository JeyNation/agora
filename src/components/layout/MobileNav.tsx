"use client";

import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MobileNavHeader from './MobileNavHeader';
import MobileNavContent from './MobileNavContent';
import { styles } from './styles/mobilenav.styles';

interface MobileNavProps {
    onNavigate?: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ onNavigate }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const handleItemClick = React.useCallback(() => {
        setIsExpanded(false);
        onNavigate?.();
    }, [onNavigate]);

    const handleToggle = React.useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    return (
        <Drawer
            anchor="top"
            variant="permanent"
            sx={styles.drawer(isExpanded)}
        >
            <Box sx={styles.container}>
                <MobileNavHeader 
                    isExpanded={isExpanded}
                    onToggle={handleToggle}
                />
                <MobileNavContent
                    isExpanded={isExpanded}
                    onItemClick={handleItemClick}
                />
            </Box>
        </Drawer>
    );
};

export default MobileNav;