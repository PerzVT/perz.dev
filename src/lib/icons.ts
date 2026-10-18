/**
 * Every icon the UI can render, resolved through media-aliases.json at author
 * time rather than in the browser. Adding an icon means adding it here, so a
 * misspelled name is a compile error instead of a 404.
 */
export const ICON_SRC = {
  imgIconArrow: "/shared/icons/imgIconArrow.svg",
  imgIconCopy: "/shared/icons/imgIconCopy.svg",
  imgIconLeft: "/shared/icons/imgIconLeft.svg",
  imgIconRight: "/shared/icons/imgIconRight.svg",
  imgIconSound: "/shared/icons/imgIconSound.svg",
  imgPerzIconSun: "/shared/icons/imgPerzIconSun.svg",
  imgBrandGithub: "/shared/branding/imgBrandGithub.svg",
  imgBrandDiscord: "/shared/branding/imgBrandDiscord.svg",
  imgBrandLinkedin: "/shared/branding/imgBrandLinkedin.svg",
  imgBrandItch: "/shared/branding/imgBrandItch.svg",
  imgBrandCurseforge: "/shared/branding/imgBrandCurseforge.svg",
} as const;

export type IconName = keyof typeof ICON_SRC;
