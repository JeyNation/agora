import React from 'react';
import type { ReactElement } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
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
            { label: 'Reports', icon: <AssessmentIcon />, href: '/reports' },
        ],
    },
    {
        items: [
            { label: 'Settings', icon: <SettingsIcon />, href: '/settings' },
        ],
        bottomAlign: true,
    },
];