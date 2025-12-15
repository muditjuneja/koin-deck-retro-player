'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { dispatchKeyboardEvent } from './utils/keyboardEvents';
import { ControlMapping } from '../../lib/controls/types';

interface DpadProps {
    size?: number;
    x: number;
    y: number;
    containerWidth: number;
    containerHeight: number;
    controls?: ControlMapping;
    systemColor?: string;
    isLandscape?: boolean;
    customPosition?: { x: number; y: number } | null;
    onPositionChange?: (x: number, y: number) => void;
}

type Direction = 'up' | 'down' | 'left' | 'right';

const DRAG_HOLD_DELAY = 350; // ms to hold before drag mode
const CENTER_TOUCH_RADIUS = 0.25; // 25% of size - touch area for drag activation

/**
 * Premium D-pad component with drag repositioning
 * - Long-press center to drag
 * - Glassmorphism aesthetics
 * - Individual direction highlighting with glow
 */
const Dpad = React.memo(function Dpad({
    size = 180,
    x,
    y,
    containerWidth,
    containerHeight,
    controls,
    systemColor = '#00FF41',
    isLandscape = false,
    customPosition,
    onPositionChange,
}: DpadProps) {
    const dpadRef = useRef<HTMLDivElement>(null);
    const activeTouchRef = useRef<number | null>(null);
    const activeDirectionsRef = useRef<Set<Direction>>(new Set());

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const dragTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragStartRef = useRef({ x: 0, y: 0, touchX: 0, touchY: 0 });
    const touchStartPosRef = useRef({ x: 0, y: 0, time: 0 });

    // Refs for visual elements
    const upPathRef = useRef<SVGPathElement>(null);
    const downPathRef = useRef<SVGPathElement>(null);
    const leftPathRef = useRef<SVGPathElement>(null);
    const rightPathRef = useRef<SVGPathElement>(null);
    const centerCircleRef = useRef<SVGCircleElement>(null);

    // Use custom position if provided, otherwise defaults
    const displayX = customPosition ? customPosition.x : x;
    const displayY = customPosition ? customPosition.y : y;

    const getKeyCode = useCallback((direction: Direction): string => {
        if (!controls) {
            const defaults: Record<Direction, string> = {
                up: 'ArrowUp',
                down: 'ArrowDown',
                left: 'ArrowLeft',
                right: 'ArrowRight',
            };
            return defaults[direction];
        }
        return controls[direction] || '';
    }, [controls]);

    const getDirectionsFromTouch = useCallback((touchX: number, touchY: number, rect: DOMRect): Set<Direction> => {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = touchX - centerX;
        const dy = touchY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const deadZone = (rect.width / 2) * 0.15;

        if (distance < deadZone) return new Set();

        const directions = new Set<Direction>();
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (angle >= -150 && angle <= -30) directions.add('up');
        if (angle >= 30 && angle <= 150) directions.add('down');
        if (angle >= 120 || angle <= -120) directions.add('left');
        if (angle >= -60 && angle <= 60) directions.add('right');

        return directions;
    }, []);

    const updateVisuals = useCallback((directions: Set<Direction>) => {
        const activeFill = `${systemColor}80`;
        const inactiveFill = 'rgba(255, 255, 255, 0.05)';
        const activeStroke = systemColor;
        const inactiveStroke = 'rgba(255, 255, 255, 0.2)';
        const glow = `0 0 15px ${systemColor}`;

        const updatePart = (ref: React.RefObject<SVGPathElement>, isActive: boolean) => {
            if (ref.current) {
                ref.current.style.fill = isActive ? activeFill : inactiveFill;
                ref.current.style.stroke = isActive ? activeStroke : inactiveStroke;
                ref.current.style.filter = isActive ? `drop-shadow(${glow})` : 'none';
                ref.current.style.transform = isActive ? 'scale(0.98)' : 'scale(1)';
                ref.current.style.transformOrigin = 'center';
            }
        };

        updatePart(upPathRef, directions.has('up'));
        updatePart(downPathRef, directions.has('down'));
        updatePart(leftPathRef, directions.has('left'));
        updatePart(rightPathRef, directions.has('right'));

        if (centerCircleRef.current) {
            const isAny = directions.size > 0;
            centerCircleRef.current.style.fill = isAny ? systemColor : 'rgba(0,0,0,0.5)';
            centerCircleRef.current.style.stroke = isAny ? '#fff' : 'rgba(255,255,255,0.3)';
        }
    }, [systemColor]);

    const updateDirections = useCallback((newDirections: Set<Direction>) => {
        const prev = activeDirectionsRef.current;

        prev.forEach(dir => {
            if (!newDirections.has(dir)) {
                const keyCode = getKeyCode(dir);
                if (keyCode) dispatchKeyboardEvent('keyup', keyCode);
            }
        });

        newDirections.forEach(dir => {
            if (!prev.has(dir)) {
                const keyCode = getKeyCode(dir);
                if (keyCode) {
                    if (navigator.vibrate) navigator.vibrate(5);
                    dispatchKeyboardEvent('keydown', keyCode);
                }
            }
        });

        activeDirectionsRef.current = newDirections;
        updateVisuals(newDirections);
    }, [getKeyCode, updateVisuals]);

    const clearDragTimer = useCallback(() => {
        if (dragTimerRef.current) {
            clearTimeout(dragTimerRef.current);
            dragTimerRef.current = null;
        }
    }, []);

    const startDragging = useCallback((touchX: number, touchY: number) => {
        setIsDragging(true);
        dragStartRef.current = {
            x: displayX,
            y: displayY,
            touchX,
            touchY,
        };
        // Release all directions when entering drag mode
        activeDirectionsRef.current.forEach(dir => {
            const keyCode = getKeyCode(dir);
            if (keyCode) dispatchKeyboardEvent('keyup', keyCode);
        });
        activeDirectionsRef.current = new Set();
        updateVisuals(new Set());

        if (navigator.vibrate) navigator.vibrate([10, 30, 10]); // Distinct drag feedback
    }, [displayX, displayY, getKeyCode, updateVisuals]);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        e.preventDefault();
        if (activeTouchRef.current !== null) return;

        const touch = e.changedTouches[0];
        activeTouchRef.current = touch.identifier;
        touchStartPosRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };

        const rect = dpadRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Check if touch is on center (for drag)
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distFromCenter = Math.sqrt(
            Math.pow(touch.clientX - centerX, 2) +
            Math.pow(touch.clientY - centerY, 2)
        );
        const centerRadius = size * CENTER_TOUCH_RADIUS;

        if (distFromCenter < centerRadius && onPositionChange) {
            // Start drag timer for center touch
            dragTimerRef.current = setTimeout(() => {
                startDragging(touch.clientX, touch.clientY);
            }, DRAG_HOLD_DELAY);
        }

        // Normal direction detection
        if (!isDragging) {
            updateDirections(getDirectionsFromTouch(touch.clientX, touch.clientY, rect));
        }
    }, [getDirectionsFromTouch, updateDirections, isDragging, size, onPositionChange, startDragging]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        e.preventDefault();

        let touch: Touch | null = null;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchRef.current) {
                touch = e.changedTouches[i];
                break;
            }
        }
        if (!touch) return;

        if (isDragging && onPositionChange) {
            // Handle drag movement
            const deltaX = touch.clientX - dragStartRef.current.touchX;
            const deltaY = touch.clientY - dragStartRef.current.touchY;

            const newXPercent = dragStartRef.current.x + (deltaX / containerWidth) * 100;
            const newYPercent = dragStartRef.current.y + (deltaY / containerHeight) * 100;

            // Constrain to screen bounds
            const margin = (size / 2 / Math.min(containerWidth, containerHeight)) * 100;
            const constrainedX = Math.max(margin, Math.min(100 - margin, newXPercent));
            const constrainedY = Math.max(margin, Math.min(100 - margin, newYPercent));

            onPositionChange(constrainedX, constrainedY);
        } else {
            // Check if moved significantly - cancel drag timer
            const moveDistance = Math.sqrt(
                Math.pow(touch.clientX - touchStartPosRef.current.x, 2) +
                Math.pow(touch.clientY - touchStartPosRef.current.y, 2)
            );
            if (moveDistance > 15) {
                clearDragTimer();
            }

            // Normal direction detection
            const rect = dpadRef.current?.getBoundingClientRect();
            if (rect) {
                updateDirections(getDirectionsFromTouch(touch.clientX, touch.clientY, rect));
            }
        }
    }, [isDragging, onPositionChange, containerWidth, containerHeight, size, getDirectionsFromTouch, updateDirections, clearDragTimer]);

    const handleTouchEnd = useCallback((e: TouchEvent) => {
        e.preventDefault();
        clearDragTimer();

        let touchEnded = false;
        for (let i = 0; i < e.changedTouches.length; i++) {
            if (e.changedTouches[i].identifier === activeTouchRef.current) {
                touchEnded = true;
                break;
            }
        }

        if (touchEnded) {
            activeTouchRef.current = null;

            if (isDragging) {
                setIsDragging(false);
            } else {
                // Release all directions
                activeDirectionsRef.current.forEach(dir => {
                    const keyCode = getKeyCode(dir);
                    if (keyCode) dispatchKeyboardEvent('keyup', keyCode);
                });
                activeDirectionsRef.current = new Set();
                updateVisuals(new Set());
            }
        }
    }, [getKeyCode, updateVisuals, isDragging, clearDragTimer]);

    useEffect(() => {
        const dpad = dpadRef.current;
        if (!dpad) return;

        dpad.addEventListener('touchstart', handleTouchStart, { passive: false });
        dpad.addEventListener('touchmove', handleTouchMove, { passive: false });
        dpad.addEventListener('touchend', handleTouchEnd, { passive: false });
        dpad.addEventListener('touchcancel', handleTouchEnd, { passive: false });

        return () => {
            dpad.removeEventListener('touchstart', handleTouchStart);
            dpad.removeEventListener('touchmove', handleTouchMove);
            dpad.removeEventListener('touchend', handleTouchEnd);
            dpad.removeEventListener('touchcancel', handleTouchEnd);
            clearDragTimer();
        };
    }, [handleTouchStart, handleTouchMove, handleTouchEnd, clearDragTimer]);

    const leftPx = (displayX / 100) * containerWidth - size / 2;
    const topPx = (displayY / 100) * containerHeight - size / 2;

    const dUp = "M 35,5 L 65,5 L 65,35 L 50,50 L 35,35 Z";
    const dRight = "M 65,35 L 95,35 L 95,65 L 65,65 L 50,50 Z";
    const dDown = "M 65,65 L 65,95 L 35,95 L 35,65 L 50,50 Z";
    const dLeft = "M 35,65 L 5,65 L 5,35 L 35,35 L 50,50 Z";

    return (
        <div
            ref={dpadRef}
            className={`absolute pointer-events-auto touch-manipulation select-none ${isDragging ? 'opacity-60' : ''}`}
            style={{
                top: 0,
                left: 0,
                transform: `translate3d(${leftPx}px, ${topPx}px, 0)${isDragging ? ' scale(1.05)' : ''}`,
                width: size,
                height: size,
                opacity: isLandscape ? 0.75 : 0.9,
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                touchAction: 'none',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            }}
        >
            {/* Base layer */}
            <div className={`absolute inset-0 rounded-full bg-black/40 backdrop-blur-md border shadow-lg ${isDragging ? 'border-white/50 ring-2 ring-white/30' : 'border-white/10'}`} />

            <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-xl relative z-10">
                <path ref={upPathRef} d={dUp} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-75" />
                <path ref={rightPathRef} d={dRight} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-75" />
                <path ref={downPathRef} d={dDown} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-75" />
                <path ref={leftPathRef} d={dLeft} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="transition-all duration-75" />

                {/* Center Pivot - drag handle */}
                <circle
                    ref={centerCircleRef}
                    cx="50" cy="50" r="12"
                    fill={isDragging ? systemColor : 'rgba(0,0,0,0.5)'}
                    stroke={isDragging ? '#fff' : 'rgba(255,255,255,0.3)'}
                    strokeWidth={isDragging ? 2 : 1}
                />

                {/* Arrow icons */}
                <path d="M 50,15 L 50,25 M 45,20 L 50,15 L 55,20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" pointerEvents="none" />
                <path d="M 50,85 L 50,75 M 45,80 L 50,85 L 55,80" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" pointerEvents="none" />
                <path d="M 15,50 L 25,50 M 20,45 L 15,50 L 20,55" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" pointerEvents="none" />
                <path d="M 85,50 L 75,50 M 80,45 L 85,50 L 80,55" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.8" pointerEvents="none" />
            </svg>
        </div>
    );
});

export default Dpad;
