"use client";

import React from 'react';
import Link from 'next/link';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    maxItems?: number;
}

export default function Breadcrumb({ 
    items,
    separator = <NavigateNextIcon fontSize="small" />,
    maxItems = 8
}: BreadcrumbProps) {
    if (!items?.length) return null;

    return (
        <Breadcrumbs 
            separator={separator}
            maxItems={maxItems}
            aria-label="breadcrumb"
        >
            {items.map((item: BreadcrumbItem, index: number) => {
                const isLast = index === items.length - 1;

                if (isLast || !item.href) {
                    return (
                        <Typography
                            key={item.label}
                            color={isLast ? 'text.primary' : 'text.secondary'}
                            fontSize="0.875rem"
                        >
                            {item.label}
                        </Typography>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={{ textDecoration: 'none' }}
                    >
                        <MuiLink
                            component="span"
                            color="inherit"
                            underline="hover"
                            sx={{ fontSize: '0.875rem' }}
                        >
                            {item.label}
                        </MuiLink>
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}