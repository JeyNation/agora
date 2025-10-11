import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { easeCubicOut } from 'd3';

export interface UseAnimatedDomainOptions {
    duration?: number;
    enabled?: boolean;
    easing?: (t: number) => number;
}

function areDomainsEqual(
    a: [number, number] | null | undefined,
    b: [number, number] | null | undefined,
    tolerance = 1e-6
): boolean {
    if (!a || !b) {
        return a === b;
    }

    return (
        Math.abs(a[0] - b[0]) <= tolerance &&
        Math.abs(a[1] - b[1]) <= tolerance
    );
}

/**
 * Smoothly interpolates between domain changes to avoid abrupt scale jumps.
 */
export function useAnimatedDomain(
    targetDomain: [number, number] | null | undefined,
    options: UseAnimatedDomainOptions = {}
): [
    [number, number] | null,
    (fromDomain?: [number, number] | null) => void
] {
    const { duration = 400, enabled = true, easing } = options;
    const easingFn = useMemo(() => easing ?? easeCubicOut, [easing]);

    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const startDomainRef = useRef<[number, number] | null>(null);
    const latestDomainRef = useRef<[number, number] | null>(targetDomain ?? null);

    const [animatedDomain, setAnimatedDomain] = useState<[number, number] | null>(() => {
        return targetDomain ?? null;
    });

    // Keep latest domain in sync for use in future animations
    useEffect(() => {
        latestDomainRef.current = animatedDomain;
    }, [animatedDomain]);

    const restartAnimation = useCallback((fromDomain?: [number, number] | null) => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }

        if (!targetDomain) {
            startDomainRef.current = null;
            latestDomainRef.current = null;
            setAnimatedDomain(null);
            return;
        }

        if (!enabled || duration <= 0) {
            startDomainRef.current = targetDomain;
            latestDomainRef.current = targetDomain;
            setAnimatedDomain(targetDomain);
            return;
        }

        const startDomain = fromDomain ?? latestDomainRef.current ?? targetDomain;
        startDomainRef.current = startDomain;
        startTimeRef.current = performance.now();

        const animateFrame = () => {
            if (!startDomainRef.current) {
                setAnimatedDomain(targetDomain);
                latestDomainRef.current = targetDomain;
                return;
            }

            const elapsed = performance.now() - startTimeRef.current;
            const progress = Math.min(1, elapsed / duration);
            const eased = easingFn(progress);

            const [startMin, startMax] = startDomainRef.current;
            const [targetMin, targetMax] = targetDomain;

            const interpolated: [number, number] = [
                startMin + (targetMin - startMin) * eased,
                startMax + (targetMax - startMax) * eased
            ];

            setAnimatedDomain(interpolated);
            latestDomainRef.current = interpolated;

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animateFrame);
            } else {
                startDomainRef.current = targetDomain;
                latestDomainRef.current = targetDomain;
                setAnimatedDomain(targetDomain);
            }
        };

        frameRef.current = requestAnimationFrame(animateFrame);
    }, [targetDomain, enabled, duration, easingFn]);

    useEffect(() => {
        if (!targetDomain) {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            startDomainRef.current = null;
            latestDomainRef.current = null;
            setAnimatedDomain(null);
            return;
        }

        if (!enabled || duration <= 0 || areDomainsEqual(targetDomain, latestDomainRef.current)) {
            restartAnimation();
            return;
        }

        restartAnimation();

        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [targetDomain, duration, enabled, easingFn, restartAnimation]);

    return [animatedDomain, restartAnimation];
}
