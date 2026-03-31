import { portfolioActionLinks, portfolioHome, portfolioProfile, portfolioSectionLinks } from './data/portfolio';
import { getPermalink } from './utils/permalinks';

const sectionHref = (section: string) => getPermalink(`/#${section}`);

const emailAction = portfolioActionLinks.find((link) => link.label === '이메일');
const resumeAction = portfolioActionLinks.find((link) => link.label === '이력서 PDF');
const githubAction = portfolioActionLinks.find((link) => link.label === 'GitHub');

const footerQuickLinks = [
  { text: '홈', href: getPermalink('/') },
  emailAction ? { text: emailAction.label, href: emailAction.href } : null,
  githubAction ? { text: githubAction.label, href: githubAction.href } : null,
  resumeAction ? { text: resumeAction.label, href: resumeAction.href } : null,
].filter((item): item is { text: string; href: string } => Boolean(item?.href));

export const headerData = {
  links: portfolioSectionLinks.map(({ label, id }) => ({ text: label, href: sectionHref(id) })),
  actions: resumeAction ? [{ text: resumeAction.label, href: resumeAction.href }] : [],
};

export const footerData = {
  links: [],
  secondaryLinks: footerQuickLinks,
  socialLinks: [],
  summary: portfolioHome.footerSummary,
  footNote: `${portfolioProfile.name} · ${portfolioProfile.role}`,
};
