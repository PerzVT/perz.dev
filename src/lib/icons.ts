/**
 * Every icon the UI can render, resolved through media-aliases.json at author
 * time rather than in the browser. Adding an icon means adding it here, so a
 * misspelled name is a compile error instead of a 404.
 */
export const ICON_SRC = {
  imgIconArrow: "/shared/icons/imgIconArrow.svg",
  imgIconCheck: "/shared/icons/imgIconCheck.svg",
  imgIconCopy: "/shared/icons/imgIconCopy.svg",
  imgIconClose: "/shared/icons/imgIconClose.svg",
  imgIconLeft: "/shared/icons/imgIconLeft.svg",
  imgIconRight: "/shared/icons/imgIconRight.svg",
  imgIconSound: "/shared/icons/imgIconSound.svg",
  imgPerzIconSun: "/shared/icons/imgPerzIconSun.svg",
  imgBrandGithub: "/shared/branding/imgBrandGithub.svg",
  imgBrandDiscord: "/shared/branding/imgBrandDiscord.svg",
  imgBrandLinkedin: "/shared/branding/imgBrandLinkedin.svg",
  imgBrandItch: "/shared/branding/imgBrandItch.svg",
  imgBrandCurseforge: "/shared/branding/imgBrandCurseforge.svg",
  imgSkillUnity: "/shared/skills/imgSkillUnity.svg",
  imgSkillUnrealEngine: "/shared/skills/imgSkillUnrealEngine.svg",
  imgSkillGodot: "/shared/skills/imgSkillGodot.svg",
  imgSkillThreejs: "/shared/skills/imgSkillThreejs.svg",
  imgSkillRaylib: "/shared/skills/imgSkillRaylib.svg",
  imgSkillCplusplus: "/shared/skills/imgSkillCplusplus.svg",
  imgSkillDavinciResolve: "/shared/skills/imgSkillDavinciResolve.svg",
  imgSkillMiro: "/shared/skills/imgSkillMiro.svg",
  imgSkillDrawio: "/shared/skills/imgSkillDrawio.svg",
  imgSkillRider: "/shared/skills/imgSkillRider.svg",
  imgSkillVisualStudio: "/shared/skills/imgSkillVisualStudio.svg",
  imgSkillGit: "/shared/skills/imgSkillGit.svg",
  imgSkillGithub: "/shared/skills/imgSkillGithub.svg",
  imgSkillBitbucket: "/shared/skills/imgSkillBitbucket.svg",
  imgSkillClaude: "/shared/skills/imgSkillClaude.svg",
  imgSkillFigma: "/shared/skills/imgSkillFigma.svg",
  imgSkillJira: "/shared/skills/imgSkillJira.svg",
  imgSkillConfluence: "/shared/skills/imgSkillConfluence.svg",
  imgSkillMeta: "/shared/skills/imgSkillMeta.svg",
  imgSkillCsharp: "/shared/skills/imgSkillCsharp.svg",
  imgSkillPico8: "/shared/skills/imgSkillPico8.svg",
} as const;

export type IconName = keyof typeof ICON_SRC;

/** Brand marks for résumé skills, keyed by the skill name as authored in pages.json. */
export const SKILL_ICON: Record<string, IconName> = {
  "Unity": "imgSkillUnity",
  "Unreal Engine 5 (Blueprints)": "imgSkillUnrealEngine",
  "Godot": "imgSkillGodot",
  "Three.js": "imgSkillThreejs",
  "Raylib": "imgSkillRaylib",
  "C++": "imgSkillCplusplus",
  "DaVinci Resolve": "imgSkillDavinciResolve",
  "Miro": "imgSkillMiro",
  "Draw.io": "imgSkillDrawio",
  "JetBrains Rider": "imgSkillRider",
  "Visual Studio": "imgSkillVisualStudio",
  "Git": "imgSkillGit",
  "GitHub": "imgSkillGithub",
  "Bitbucket": "imgSkillBitbucket",
  "Claude": "imgSkillClaude",
  "Figma": "imgSkillFigma",
  "Jira": "imgSkillJira",
  "Confluence": "imgSkillConfluence",
  "VR/AR Development": "imgSkillMeta",
  "C# Scripting": "imgSkillCsharp",
  "Pico-8": "imgSkillPico8",
};
