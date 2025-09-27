import React from 'react';
import type { ReactElement } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

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
            { label: 'Profile', icon: <AccountCircleIcon />, href: '/profile' },
            { label: 'Logout', icon: <LogoutIcon />, href: '/logout' },
        ],
        bottomAlign: true,
    },
];