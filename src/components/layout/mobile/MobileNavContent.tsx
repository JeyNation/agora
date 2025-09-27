"use client";

import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import MobileNavItem from './MobileNavItem';
import { NAV_GROUPS } from '../../../app/constants';
import { mobileNav } from '../../../styles/components/navigation';

interface MobileNavContentProps {
    isExpanded: boolean;
    onItemClick: () => void;
    onClose?: () => void;
}

const MobileNavContent: React.FC<MobileNavContentProps> = ({ isExpanded, onItemClick, onClose }) => {
    const handleEmptySpaceClick = React.useCallback(() => {
        if (isExpanded) {
            onClose?.();
        }
    }, [isExpanded, onClose]);

    return (
        <Box
            sx={mobileNav.content(isExpanded)}
        >
            <Divider />
            {NAV_GROUPS.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                    {groupIndex > 0 && <Divider />}
                    <List>
                        {group.items.map((item) => (
                            <MobileNavItem
                                key={item.label}
                                label={item.label}
                                icon={item.icon}
                                onClick={onItemClick}
                            />
                        ))}
                    </List>
                </React.Fragment>
            ))}
            {/* Empty space that can be clicked to close the menu */}
            <Box 
                sx={mobileNav.emptySpace}
                onClick={handleEmptySpaceClick}
            />
        </Box>
    );
}

export default MobileNavContent;