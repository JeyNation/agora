"use client";

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { Breadcrumbs, Link as MuiLink, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { breadcrumbStyles } from '../../styles/components';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: ReactNode;
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
                            sx={breadcrumbStyles.breadcrumbItem}
                        >
                            {item.label}
                        </Typography>
                    );
                }

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        style={breadcrumbStyles.link}
                    >
                        <MuiLink
                            component="span"
                            color="inherit"
                            underline="hover"
                            sx={breadcrumbStyles.breadcrumbItem}
                        >
                            {item.label}
                        </MuiLink>
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
}