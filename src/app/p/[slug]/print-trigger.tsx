"use client";

import { useEffect } from "react";

// Auto-triggers window.print() when the page loads with ?print=1.
// Small delay lets styles and fonts render before the dialog opens.
export function PrintTrigger() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);
  return null;
}
