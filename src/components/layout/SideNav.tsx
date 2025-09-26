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
  width: number;
  setWidth: (w: number) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
};

export const drawerDefaultWidth = 240;
export const drawerCollapsedWidth = 72;

export default function SideNav({ open = false, onClose, width, setWidth, collapsed, setCollapsed }: Props) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });

  const variant = isMdUp ? 'permanent' : 'temporary';
  const drawerOpen = isMdUp ? true : open;

  const paperRef = React.useRef<HTMLDivElement | null>(null);

  // Drag to resize (only on permanent drawer)
  React.useEffect(() => {
    if (!isMdUp) return;
    const paper = paperRef.current;
    if (!paper) return;

    let dragging = false;
    const min = drawerCollapsedWidth;
    const max = 600;
    const snapThreshold = 16;

    function onMove(e: MouseEvent) {
      if (!dragging) return;
      if (!paper) return;
      const rect = paper.getBoundingClientRect();
      const newWidth = Math.max(min, Math.min(max, e.clientX - rect.left));
      // Snap to collapsed
      if (newWidth <= drawerCollapsedWidth + snapThreshold) {
        setWidth(drawerCollapsedWidth);
        setCollapsed(true);
      } else {
        setWidth(newWidth);
        if (collapsed) setCollapsed(false);
      }
    }

    function onUp() {
      dragging = false;
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    }

    function onDown(e: MouseEvent) {
      // Start only when clicking the resizer area
      dragging = true;
      document.body.style.cursor = 'col-resize';
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      e.preventDefault();
    }

    const resizer = paper.querySelector('.drawer-resizer') as HTMLDivElement | null;
    resizer?.addEventListener('mousedown', onDown);

    return () => {
      resizer?.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isMdUp, setWidth, setCollapsed, collapsed]);

  return (
    <Drawer
      variant={variant}
      open={drawerOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        ref: paperRef,
        sx: {
          boxSizing: 'border-box',
          width: `${width}px`,
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
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              <HomeIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              <AssessmentIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Reports" />}
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
              <SettingsIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Settings" />}
          </ListItemButton>
        </ListItem>
      </List>

      {/* resizer - only visible on md+ when permanent */}
      {isMdUp && (
        <Box
          className="drawer-resizer"
          sx={{
            position: 'absolute',
            right: -3,
            top: 0,
            bottom: 0,
            width: 6,
            cursor: 'col-resize',
            zIndex: 1200,
          }}
          aria-hidden
        />
      )}
    </Drawer>
  );
}
