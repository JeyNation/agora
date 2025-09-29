"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import type { BreadcrumbItem } from '../../components/common/Breadcrumb';

export function useBreadcrumbs(): BreadcrumbItem[] {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    switch (pathname) {
        case '/':
            return [{ label: 'Dashboard', href: '/' }];
            
        case '/research':
            const items: BreadcrumbItem[] = [{ label: 'Research', href: '/research' }];
            const ticker = searchParams.get('ticker');
            if (ticker) {
                // Last item doesn't need href as it's the current page
                items.push({ 
                    label: ticker.toUpperCase()
                });
            }
            return items;

        default:
            // For any other routes, convert path segments to breadcrumb items
            const segments = pathname.split('/').filter(Boolean);
            return segments.map((segment, index) => {
                const label = segment.charAt(0).toUpperCase() + segment.slice(1);
                // Only add href if it's not the last segment
                const isLast = index === segments.length - 1;
                return {
                    label,
                    ...(isLast ? {} : { href: `/${segments.slice(0, index + 1).join('/')}` })
                };
            });
    }
}