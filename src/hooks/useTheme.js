/**
 * useTheme.js
 * Convenience hook to consume the ThemeContext.
 * Usage: const { isDark, toggleTheme } = useTheme();
 */

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export function useTheme() {
  return useContext(ThemeContext);
}
