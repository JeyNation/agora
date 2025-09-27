"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import MobileNavItem from './MobileNavItem';
import { TRANSITION_DURATION } from './constants';
import { NAV_GROUPS } from './constants';
import { HEADER_HEIGHT } from './constants';

interface MobileNavContentProps {
    isExpanded: boolean;
    onItemClick: () => void;
}

const styles = {
    content: (isExpanded: boolean): SxProps<Theme> => ({
        opacity: isExpanded ? 1 : 0,
        transition: (theme: Theme) => theme.transitions.create(['opacity'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
        overflow: 'hidden',
        flexGrow: 1,
        marginTop: `${HEADER_HEIGHT}px`,
        position: 'relative',
    }),
} as const;

const MobileNavContent: React.FC<MobileNavContentProps> = ({ isExpanded, onItemClick }) => (
    <Box sx={styles.content(isExpanded)}>
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
    </Box>
);

export default MobileNavContent;