import { siteConfig } from "@/lib/config";

export function JsonLd() {
  const personId = `${siteConfig.url}/#person`;
  const siteId = `${siteConfig.url}/#website`;

  const sameAs = [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.itch,
    siteConfig.links.discord,
    siteConfig.links.curseforge,
  ];

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.fullName,
        alternateName: siteConfig.name,
        url: siteConfig.url,
        jobTitle: siteConfig.title,
        description: siteConfig.description,
        sameAs,
        knowsAbout: [
          "Game Development",
          "Game Design",
          "Product Design",
          "Unity",
          "VR Development",
          "Multiplayer Games",
          "System Design",
        ],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: siteConfig.url,
        name: `${siteConfig.name}.dev`,
        description: siteConfig.description,
        inLanguage: "en",
        author: { "@id": personId },
        publisher: { "@id": personId },
      },
    ],
  };

  // Escape `<` bytes so a stray "</script>" substring inside any
  // string field can't terminate the surrounding <script> block.
  // The browser still parses the escape as a literal "<" inside the
  // JSON string. Cheap defense in depth — most JSON-LD fields are
  // hand-controlled today, but anything pulled from frontmatter or
  // CMS later inherits this guard automatically.
  const json = JSON.stringify(graph).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
