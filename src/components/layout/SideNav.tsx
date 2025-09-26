"use client";

import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  open?: boolean;
  onClose?: () => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
};

export const drawerDefaultWidth = 240;
export const drawerCollapsedWidth = 72;

export default function SideNav({ open = false, onClose, collapsed, setCollapsed }: Props) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const variant = isMdUp ? 'permanent' : 'temporary';
  const drawerOpen = isMdUp ? true : open;

  // No drag-to-resize behavior: collapse only via toggle.

  return (
    <Drawer
      variant={variant}
      open={drawerOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            boxSizing: 'border-box',
            width: `${collapsed ? drawerCollapsedWidth : drawerDefaultWidth}px`,
            transition: 'width 200ms ease',
            overflowX: 'hidden',
          },
        }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1 }}>
        <IconButton onClick={() => setCollapsed(!collapsed)} aria-label="toggle collapse">
          <MenuIcon />
        </IconButton>
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                width: `${drawerCollapsedWidth}px`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                width: `${drawerCollapsedWidth}px`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <AssessmentIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Reports" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon
              sx={{
                minWidth: 0,
                width: `${drawerCollapsedWidth}px`,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Settings" />}
          </ListItemButton>
        </ListItem>
      </List>

      {/* resizer - only visible on md+ when permanent */}
      {/* no resizer when drag is disabled */}
    </Drawer>
  );
}
