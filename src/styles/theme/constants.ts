/**
 * Layout measurements and spacing constants
 */
export const DRAWER_DEFAULT_WIDTH = 240;
export const DRAWER_COLLAPSED_WIDTH = 55;
export const HEADER_HEIGHT = 56;
export const NAV_ITEM_HEIGHT = 48;

/**
 * Animation durations
 */
export const TRANSITION_DURATION = 200; // milliseconds

/**
 * Z-index values for proper layering
 */
export const Z_INDEX = {
    DRAWER: 1200,
    HEADER: 1100,
    MODAL: 1300,
} as const;

/**
 * Common spacing units
 */
export const SPACING = {
    UNIT: 8, // Base spacing unit (8px)
    XXS: 4,  // 0.5x
    XS: 8,   // 1x
    SM: 16,  // 2x
    MD: 24,  // 3x
    LG: 32,  // 4x
    XL: 40,  // 5x
    XXL: 48, // 6x
} as const;