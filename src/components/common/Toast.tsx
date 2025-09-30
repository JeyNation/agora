"use client";

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { messageStyles } from '@/styles/components/message';

type ToastProps = {
    open: boolean;
    message: string | null;
    severity?: 'error' | 'success' | 'info' | 'warning';
    autoHideDuration?: number;
    onClose?: (event?: React.SyntheticEvent | Event, reason?: string) => void;
};

export default function Toast({ open, message, severity = 'error', autoHideDuration = 3500, onClose }: ToastProps) {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={messageStyles.snackbar}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%', zIndex: 13001 }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
