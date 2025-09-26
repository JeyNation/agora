"use client";

import React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import TopBar from './TopBar';
import SideNav from './SideNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const handleMenu = () => setOpen((s) => !s);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <TopBar onMenuClick={handleMenu} />
      <SideNav open={open} onClose={handleClose} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
