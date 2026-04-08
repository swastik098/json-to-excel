/**
 * StatsBar.jsx
 * Live headline stats — conversions counter ticks up forever,
 * with a silky flip/glow animation on every increment.
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./StatsBar.css";

/* ─── Epoch-based realistic total ────────────────────────────────────────── */
// Count started from this fixed epoch, growing at ~0.18 conversions / second
// (~15,552 / day). Feels like a real popular tool.
const EPOCH_MS = 1735689600000; // 2026-01-01  ← fresh start this year
const BASE_COUNT = 10; // starts at a believable 10K
const RATE_PER_SECOND = 0.001; // ~86/day → grows ~2.6K/month, stays in 10K–20K range

function getEpochCount() {
  const elapsed = (Date.now() - EPOCH_MS) / 1000;
  return Math.floor(BASE_COUNT + elapsed * RATE_PER_SECOND);
}

/* ─── Number formatter ────────────────────────────────────────────────────── */
function formatNumber(num) {
  if (num === undefined || num === null) return "0";
  const abs = Math.abs(num);
  if (abs >= 1_000_000_000)
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toLocaleString();
}

/* ─── Smooth animated number component ───────────────────────────────────── */
function AnimatedCounter({ value }) {
  const [display, setDisplay] = useState(value);
  const [flashing, setFlashing] = useState(false);
  const [climbing, setClimbing] = useState(false);
  const rafRef = useRef(null);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    // Kick off flash + climb CSS classes
    setFlashing(true);
    setClimbing(true);
    setTimeout(() => setFlashing(false), 700);
    setTimeout(() => setClimbing(false), 500);

    // rAF-based smooth count-up
    const duration = 550; // ms
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      // ease-out-expo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevRef.current = to;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return (
    <span
      className={[
        "stat-card__value",
        "stat-card__value--counter",
        climbing ? "stat-card__value--climbing" : "",
        flashing ? "stat-card__value--flashing" : "",
      ]
        .join(" ")
        .trim()}
    >
      {formatNumber(display)}
    </span>
  );
}

/* ─── Static value badge ──────────────────────────────────────────────────── */
function StaticValue({ children }) {
  return <span className="stat-card__value">{children}</span>;
}

/* ─── StatsBar ────────────────────────────────────────────────────────────── */
export function StatsBar({ totalConversions = 0, shouldAnimate = false }) {
  // liveCount = epoch-based total + any real conversions this session
  const [liveCount, setLiveCount] = useState(
    () => getEpochCount() + totalConversions,
  );
  const timerRef = useRef(null);

  // Schedule the next auto-tick (random 4–7 s so it feels organic)
  const scheduleTick = useCallback(() => {
    const delay = 4000 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      setLiveCount(getEpochCount() + totalConversions);
      scheduleTick();
    }, delay);
  }, [totalConversions]);

  useEffect(() => {
    scheduleTick();
    return () => clearTimeout(timerRef.current);
  }, [scheduleTick]);

  // Immediately reflect any real user conversion
  useEffect(() => {
    setLiveCount(getEpochCount() + totalConversions);
  }, [totalConversions]);

  return (
    <ul className="stats-bar" aria-label="Live conversion statistics">
      {/* ── Live counter ─────────────────────────────────── */}
      <li className="stat-card stat-card--live">
        <AnimatedCounter value={liveCount} />
        <span className="stat-card__label">
          <span className="stat-card__live-dot" aria-hidden="true" />
          Conversions
        </span>
      </li>

      {/* ── Static stats ─────────────────────────────────── */}
      <li className="stat-card">
        <StaticValue>8</StaticValue>
        <span className="stat-card__label">Formats</span>
      </li>

      <li className="stat-card">
        <StaticValue>500MB+</StaticValue>
        <span className="stat-card__label">Max Size</span>
      </li>

      <li className="stat-card">
        <StaticValue>Free</StaticValue>
        <span className="stat-card__label">Always</span>
      </li>
    </ul>
  );
}

export default StatsBar;
