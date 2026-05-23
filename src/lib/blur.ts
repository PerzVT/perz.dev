/**
 * Shared blurDataURL passed to next/image so dynamic-path images
 * (string srcs that next/image can't pre-analyze at build time) get
 * a placeholder layer to fade out from. The real image decodes over
 * top of this; you get a smooth dark-block → image transition
 * instead of an empty-card → pop-in.
 *
 * The payload is an 8×8 solid #1e1e1e PNG — matches the surrounding
 * card / page background so the blur reads as part of the page
 * surface, not a contrasting placeholder.
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAD0lEQVR4nGOQwwEYhpYEAMtAFoHyVPthAAAAAElFTkSuQmCC";
