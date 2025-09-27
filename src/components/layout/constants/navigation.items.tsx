import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import type { NavGroup } from '../types';

/**
 * Default navigation items configuration
 */
export const NAV_GROUPS: NavGroup[] = [
    {
        items: [
            { label: 'Dashboard', icon: <HomeIcon /> },
            { label: 'Reports', icon: <AssessmentIcon /> },
        ],
    },
    {
        items: [
            { label: 'Settings', icon: <SettingsIcon /> },
            { label: 'Profile', icon: <AccountCircleIcon /> },
            { label: 'Logout', icon: <LogoutIcon /> },
        ],
        bottomAlign: true,
    },
];