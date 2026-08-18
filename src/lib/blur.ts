/**
 * blurDataURL for next/image on dynamic-path images (string srcs
 * next/image can't pre-analyze at build time), so they fade in from a
 * placeholder instead of popping in. 8×8 solid #1e1e1e PNG, matching
 * the surrounding card/page background.
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAD0lEQVR4nGOQwwEYhpYEAMtAFoHyVPthAAAAAElFTkSuQmCC";
