import type { ReactElement } from 'react';

/**
 * Represents a single navigation item with a label and icon
 */
export interface NavItem {
    /** The text label for the navigation item */
    label: string;
    /** The icon component to display next to the label */
    icon: ReactElement;
}

/**
 * Represents a group of navigation items
 */
export interface NavGroup {
    /** Array of navigation items in this group */
    items: NavItem[];
    /** Whether the group should be aligned to the bottom */
    bottomAlign?: boolean;
}

/**
 * Props for the SideNav component
 */
export interface SideNavProps {
    /** Whether the side navigation is collapsed */
    collapsed: boolean;
    /** Function to set the collapsed state */
    setCollapsed: (collapsed: boolean) => void;
}

/**
 * Props for the MobileNav component
 */
export interface MobileNavProps {
    /** Handler for navigation item clicks */
    onNavigate?: () => void;
}