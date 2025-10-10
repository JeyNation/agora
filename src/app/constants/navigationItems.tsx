import React from 'react';
import type { ReactElement } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ResearchIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';

interface NavItem {
    label: string;
    icon: ReactElement;
    href?: string;
}

interface NavGroup {
    items: NavItem[];
    bottomAlign?: boolean;
}

export const NAV_GROUPS: NavGroup[] = [
    {
        items: [
            { label: 'Dashboard', icon: <HomeIcon />, href: '/' },
            { label: 'Research', icon: <ResearchIcon />, href: '/research' },
        ],
    },
    {
        items: [
            { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
        ],
        bottomAlign: true,
    },
];