import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Elie Brosset",
  EMAIL: "eliebrosset@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 3,
  NUM_WORKS_ON_HOMEPAGE: 3,
  NUM_PROJECTS_ON_HOMEPAGE: 4,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Software engineer building AI products end-to-end. Python, TypeScript, Go, LLMs.",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "Writing about AI, software engineering, and building products.",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "Where I have worked and what I have done.",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "AI products and tools I've built.",
};

export const SOCIALS: Socials = [
  { 
    NAME: "twitter-x",
    HREF: "https://x.com/eliebrosset",
  },
  { 
    NAME: "github",
    HREF: "https://github.com/youplala"
  },
  { 
    NAME: "linkedin",
    HREF: "https://linkedin.com/in/eliebrosset",
  }
];
