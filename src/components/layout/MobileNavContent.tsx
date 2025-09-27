"use client";

import React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { useGesture } from '@use-gesture/react';
import MobileNavItem from './MobileNavItem';
import { TRANSITION_DURATION } from '../../app/constants';
import { NAV_GROUPS } from '../../app/constants';
import { HEADER_HEIGHT } from '../../app/constants';

interface MobileNavContentProps {
    isExpanded: boolean;
    onItemClick: () => void;
    onClose?: () => void;
}

const styles = {
    content: (isExpanded: boolean): SxProps<Theme> => ({
        opacity: isExpanded ? 1 : 0,
        transition: (theme: Theme) => theme.transitions.create(['opacity', 'transform'], {
            easing: theme.transitions.easing.easeInOut,
            duration: TRANSITION_DURATION,
        }),
        overflow: 'hidden',
        flexGrow: 1,
        marginTop: `${HEADER_HEIGHT}px`,
        position: 'relative',
        touchAction: 'pan-y',
    }),
} as const;

const MobileNavContent: React.FC<MobileNavContentProps> = ({ isExpanded, onItemClick, onClose }) => {
    const [dragY, setDragY] = React.useState(0);

    const bind = useGesture(
        {
            onDrag: ({ movement: [, my], direction: [, dy], velocity: [, vy], last }) => {
                if (!isExpanded) return;
                
                // Only handle upward swipes
                if (dy < 0 || my < 0) {
                    if (last) {
                        // If swipe was fast enough or dragged far enough, close the nav
                        if (vy > 0.5 || my < -50) {
                            onClose?.();
                            setDragY(0);
                        } else {
                            // Spring back
                            setDragY(0);
                        }
                    } else {
                        setDragY(my);
                    }
                }
            },
        },
        {
            drag: {
                from: () => [0, dragY],
                filterTaps: true,
                threshold: 5,
            },
        }
    );

    return (
        <Box
            sx={{
                ...styles.content(isExpanded),
                transform: `translateY(${dragY}px)`,
            }}
            {...bind()}
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
        </Box>
    );
}

export default MobileNavContent;