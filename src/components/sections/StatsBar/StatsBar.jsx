/**
 * StatsBar.jsx
 * Displays headline stats (conversions, formats, size, price).
 * Features animated counting with number abbreviation (K, M, B).
 */

import React, { useState, useEffect, useRef } from "react";
import "./StatsBar.css";

/**
 * Format large numbers with abbreviations
 * @param {number} num - The number to format
 * @returns {string} Formatted number (e.g., "1.2K", "3.4M", "1.2B")
 */
function formatNumber(num) {
  if (num === undefined || num === null) return "0";

  const absNum = Math.abs(num);

  if (absNum >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (absNum >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (absNum >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

/**
 * Animated counter component
 */
function AnimatedCounter({ targetValue, duration = 800 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef(0);
  const animationRef = useRef(null);

  useEffect(() => {
    // Don't animate if value hasn't changed or if it's the initial render
    if (previousValueRef.current === targetValue) return;

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = previousValueRef.current;
    const endValue = targetValue;
    const startTime = performance.now();

    setIsAnimating(true);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Easing function for smooth slowdown
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    previousValueRef.current = targetValue;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetValue, duration]);

  return (
    <span className={isAnimating ? "stat-card__value--animating" : ""}>
      {formatNumber(displayValue)}
    </span>
  );
}

export function StatsBar({ totalConversions = 0 }) {
  const stats = [
    {
      key: "conversions",
      value: totalConversions,
      label: "Conversions",
      isAnimated: true,
    },
    { key: "formats", value: 8, label: "Formats", isAnimated: false },
    { key: "size", value: "unlimited", label: "File Size", isAnimated: false },
    { key: "price", value: "100%", label: "Free", isAnimated: false },
  ];

  return (
    <ul className="stats-bar" aria-label="Key statistics">
      {stats.map(({ key, value, label, isAnimated }) => (
        <li key={key} className="stat-card">
          <span className="stat-card__value">
            {isAnimated ? <AnimatedCounter targetValue={value} /> : value}
          </span>
          <span className="stat-card__label">{label}</span>
        </li>
      ))}
    </ul>
  );
}
