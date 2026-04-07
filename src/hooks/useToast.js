/**
 * useToast.js
 * Convenience hook to consume the ToastContext.
 * Usage: const toast = useToast(); toast("message", "success");
 */

import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export function useToast() {
  const addToast = useContext(ToastContext);
  if (!addToast) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return addToast;
}
