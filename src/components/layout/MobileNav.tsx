"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import MobileNavHeader from './MobileNavHeader';
import MobileNavContent from './MobileNavContent';
import { mobileNav } from '../../styles/components/mobile-nav';

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
            sx={mobileNav.drawer(isExpanded)}
        >
            <>
                <MobileNavHeader 
                    isExpanded={isExpanded}
                    onToggle={handleToggle}
                />
                <MobileNavContent
                    isExpanded={isExpanded}
                    onItemClick={handleItemClick}
                    onClose={() => setIsExpanded(false)}
                />
            </>
        </Drawer>
    );
};

export default MobileNav;