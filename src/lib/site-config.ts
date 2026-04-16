export const siteConfig = {
  name: "RRDCH",
  description: "Rajarajeswari Dental College and Hospital digital platform",
  publicNav: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/departments/general-dentistry", label: "Departments" },
    { href: "/admissions", label: "Admissions" },
    { href: "/research", label: "Research" },
    { href: "/events", label: "Events" },
    { href: "/virtual-tour", label: "Virtual Tour" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export type PortalCard = {
  title: string;
  description: string;
  href: string;
};
