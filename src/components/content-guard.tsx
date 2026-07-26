"use client";

import { useEffect } from "react";

/**
 * Blocks right-click and drag on images and video so page media isn't
 * saved with a casual right-click or drag-to-desktop. Paired with
 * `user-select: none` in globals.css (text isn't selectable). This is a
 * deterrent, not DRM — anything on the page is still in the network tab.
 * Right-click stays available everywhere except over media.
 */
export function ContentGuard() {
  useEffect(() => {
    const overMedia = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("img, picture, video");
    const onContextMenu = (e: MouseEvent) => {
      if (overMedia(e.target)) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      if (overMedia(e.target)) e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);
  return null;
}
