import type { ReactNode } from 'react';

/**
 * Props for the ClientLayout component
 */
export interface ClientLayoutProps {
    /** The child components to render in the main content area */
    children: ReactNode;
}

/**
 * Props for the PageHeader component
 */
export interface PageHeaderProps {
    /** Optional title to display in the header */
    title?: string;
    /** Optional actions to display in the header */
    actions?: ReactNode;
}