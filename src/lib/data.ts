/* Single source of truth for all site content. Every fact comes from the CV (cv.pdf),
   except the MBA at BITS Pilani and the Chennai location, which were supplied by the site owner. */

export const PROFILE = {
  name: "Ajay B",
  firstName: "Ajay",
  initials: "AB",
  role: "Systems Engineer III (SRE)",
  heroTitle: "Site Reliability Engineer",
  dept: "SRE",
  company: "LexisNexis Risk Solutions",
  since: "Sep 2024",
  location: "Chennai",
  email: "ajaybobbili7@gmail.com",
  phone: "+91 9384106137",
  phoneHref: "tel:+919384106137",
  github: "https://github.com/ajaysrinic/",
  linkedin: "https://www.linkedin.com/in/ajaysrinic/",
  resume: "/cv.pdf",
  resumeSummary:
    "Systems Engineer III (SRE) at LexisNexis Risk Solutions, building GitHub Actions CI/CD, OpenTelemetry observability and cloud automation. Previously a DevOps Engineer at TCS, running Linux production servers and Azure environments. Holds a PG Diploma in Advanced Cloud Computing and DevOps from IIT Roorkee and is pursuing an MBA in Business Analytics at BITS Pilani.",
} as const;

export type SectionId = "about" | "skills" | "work" | "certifications" | "experience" | "achievements" | "contact";

/** Section tag numbers follow rendered order. Use as `${index} — ${label}`. */
export const SECTIONS: Record<SectionId, { index: string; label: string }> = {
  about: { index: "01", label: "About me" },
  skills: { index: "02", label: "Skills" },
  work: { index: "03", label: "Selected work" },
  certifications: { index: "04", label: "Certifications" },
  experience: { index: "05", label: "Experience" },
  achievements: { index: "06", label: "Honours & metrics" },
  contact: { index: "07", label: "Contact" },
};

export interface NavItem {
  id: SectionId;
  label: string;
  index: string;
}
export const NAV: NavItem[] = (["about", "skills", "work", "experience", "achievements", "contact"] as const).map((id) => ({
  id,
  index: SECTIONS[id].index,
  label: id === "work" ? "Work" : id[0].toUpperCase() + id.slice(1),
}));

/* ---------- Skills ---------- */
export type SkillFamily = "Languages" | "Tools" | "Databases" | "Observability" | "Platforms";

export interface Skill {
  /** Logo key for <TechLogo name=... /> (brand file in /public/logos or a concept icon). */
  logo: string;
  name: string;
  family: SkillFamily;
  /** Unique 2-letter element symbol. */
  symbol: string;
  /** Atomic number: 1-based position in the whole table. */
  number: number;
  /** Where the CV says it was used. Absent when the CV doesn't say. */
  usedIn?: string[];
}
export interface SkillGroup {
  family: SkillFamily;
  skills: Skill[];
}

type RawSkill = Omit<Skill, "number" | "family">;
/* Ordered by recency: skills used in the latest role (LexisNexis Risk Solutions) first, then TCS, then the rest.
   Families follow the same order. Git-SVN, Gitleaks, TruffleHog and GitHub REST API / GitHub Apps were added by the site owner. */
const RAW: Record<SkillFamily, RawSkill[]> = {
  Tools: [
    { logo: "github-actions", name: "GitHub Actions", symbol: "Ga", usedIn: ["Build, packaging, release and deployment workflows, LexisNexis Risk Solutions", "CI/CD for Windows IIS-based .NET apps (PRDE project)"] },
    { logo: "github", name: "GitHub", symbol: "Gh", usedIn: ["Enterprise governance: branch protection, PR validation, secret scanning, LexisNexis Risk Solutions"] },
    { logo: "gitsvn", name: "Git-SVN (git-svn)", symbol: "Gs", usedIn: ["Latest role, LexisNexis Risk Solutions"] },
    { logo: "gitleaks", name: "Gitleaks", symbol: "Gl", usedIn: ["Latest role, LexisNexis Risk Solutions"] },
    { logo: "trufflehog", name: "TruffleHog", symbol: "Th", usedIn: ["Latest role, LexisNexis Risk Solutions"] },
    { logo: "githubapi", name: "GitHub REST API / GitHub Apps", symbol: "Ap", usedIn: ["Latest role, LexisNexis Risk Solutions"] },
    { logo: "svn", name: "SVN", symbol: "Sv", usedIn: ["Led the SVN to GitHub migration, LexisNexis Risk Solutions"] },
    { logo: "jenkins", name: "Jenkins", symbol: "Je", usedIn: ["Integrated with the PRDE CI/CD pipelines, LexisNexis Risk Solutions", "CI/CD with Jenkins and Git, TCS"] },
    { logo: "jira", name: "JIRA", symbol: "Ji", usedIn: ["Jira-GitHub traceability, LexisNexis Risk Solutions"] },
    { logo: "terraform", name: "Terraform", symbol: "Tf", usedIn: ["Terraform Certified Associate, Nov 2025"] },
    { logo: "azure-devops", name: "Azure DevOps", symbol: "Ad" },
    { logo: "ansible", name: "Ansible", symbol: "An" },
    { logo: "confluence", name: "Confluence", symbol: "Cf" },
  ],
  Observability: [
    { logo: "opentelemetry", name: "OpenTelemetry", symbol: "Ot", usedIn: ["Built a complete OTEL observability stack from scratch, LexisNexis Risk Solutions"] },
    { logo: "grafana", name: "Grafana", symbol: "Gr", usedIn: ["OTEL Collector, Grafana and Elasticsearch stack for metrics, logs and traces, LexisNexis Risk Solutions"] },
    { logo: "dynatrace", name: "Dynatrace", symbol: "Dt", usedIn: ["Proactive monitoring to improve server uptime, TCS"] },
    { logo: "kibana", name: "Kibana", symbol: "Ki" },
    { logo: "prometheus", name: "Prometheus", symbol: "Pr" },
  ],
  Languages: [
    { logo: "python", name: "Python", symbol: "Py", usedIn: ["Python-based test apps for OpenTelemetry workloads and database latency, LexisNexis Risk Solutions", "Micro-blogging Web Application Platform (Python, Flask)"] },
    { logo: "powershell", name: "PowerShell", symbol: "Ps", usedIn: ["Release reporting, deployment notifications and workflow monitoring automation, LexisNexis Risk Solutions"] },
    { logo: "sql", name: "SQL", symbol: "Sq", usedIn: ["Managed SQL databases such as MySQL, TCS"] },
    { logo: "bash", name: "Bash Scripting", symbol: "Ba" },
  ],
  Platforms: [
    { logo: "docker", name: "Docker", symbol: "Do", usedIn: ["Integrated in GitHub Actions workflows, LexisNexis Risk Solutions"] },
    { logo: "azure", name: "Azure", symbol: "Az", usedIn: ["Optimized Azure environments, $2500 CAD/month saved, TCS", "Microsoft Azure AZ 900, Mar 2023"] },
    { logo: "linux", name: "Linux", symbol: "Li", usedIn: ["Managed Linux-based production servers 24x7, 20% uptime increase, TCS"] },
    { logo: "aws", name: "AWS", symbol: "Aw", usedIn: ["Micro-blogging platform (Cognito, RDS, Lambda, IAM, CloudWatch)", "Alexa Tourist Assistant (AWS Lambda)", "AWS Cloud Practitioner, Dec 2022"] },
    { logo: "kubernetes", name: "Kubernetes", symbol: "Ku" },
    { logo: "servicenow", name: "ServiceNow", symbol: "Sn" },
  ],
  Databases: [
    { logo: "mysql", name: "MySQL", symbol: "My", usedIn: ["Managed SQL databases, TCS", "Oracle MySQL Implementation Associate, Jul 2025"] },
    { logo: "mongodb", name: "MongoDB", symbol: "Mo", usedIn: ["Managed NoSQL stores, TCS"] },
    { logo: "postgresql", name: "PostgreSQL", symbol: "Pg" },
  ],
};

export const SKILL_FAMILIES = Object.keys(RAW) as SkillFamily[];

let atomic = 0;
export const SKILL_GROUPS: SkillGroup[] = SKILL_FAMILIES.map((family) => ({
  family,
  skills: RAW[family].map((s) => ({ ...s, family, number: ++atomic })),
}));
export const SKILLS: Skill[] = SKILL_GROUPS.flatMap((g) => g.skills);

/* ---------- Experience & education ---------- */
export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
}
export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "lnrs",
    role: "Systems Engineer – III (SRE)",
    company: "LexisNexis Risk Solutions",
    period: "Sep 2024 – Present",
    bullets: [
      "Led the migration of enterprise applications from SVN to GitHub, designing migration strategies, repository structures, branching models and governance standards.",
      "Architected GitHub Actions workflows integrating Docker, JFrog Artifactory, GitSync and self-hosted runners to automate build, packaging, release and deployment.",
      "Implemented GitHub governance controls: branch protection, PR validation, code review automation, secret scanning and Jira-GitHub traceability.",
      "Built operational automation for release reporting, deployment notifications and workflow monitoring using GitHub Actions, PowerShell and Microsoft Teams integrations.",
      "Developed end-to-end CI/CD pipelines using GitHub Actions for Windows IIS-based .NET applications under the PRDE project, integrating JFrog Artifactory and Jenkins, achieving a 70% reduction in deployment time.",
      "Designed and deployed a complete OpenTelemetry (OTEL) observability stack from scratch, integrating OTEL Collector, Grafana and Elasticsearch for centralized metrics, logs and traces.",
      "Developed Python-based test applications to simulate workloads, perform database queries and monitor database performance and latency under load in OpenTelemetry.",
      "Built custom OpenSearch ELK dashboards to visualize application health, system metrics and telemetry data.",
    ],
  },
  {
    id: "tcs",
    role: "DevOps Engineer",
    company: "Tata Consultancy Services (TCS)",
    period: "May 2021 – Aug 2024",
    bullets: [
      "Streamlined FOREX currency conversion infrastructure for a key banking client and directed administration of the Payment Hub for Rappi, a top food delivery app in Canada.",
      "Managed Linux-based production servers in a 24x7 live environment, resulting in a 20% increase in uptime.",
      "Introduced CI/CD best practices with Jenkins and Git, reducing deployment times by 40%.",
      "Optimized Azure cloud environments through automation, monitoring and scaling, leading to $2500 CAD/month in cost savings.",
      "Used Dynatrace and Azure Application Insights for proactive monitoring and analysis to improve server uptime.",
      "Managed SQL databases such as MySQL and NoSQL stores like MongoDB in an administrative capacity.",
    ],
  },
];

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  place?: string;
  period?: string;
  /** Currently pursuing (no end date). */
  pursuing?: boolean;
}
export const EDUCATION: EducationItem[] = [
  { id: "bits", school: "BITS Pilani", degree: "MBA in Business Analytics", pursuing: true },
  { id: "iitr", school: "Indian Institute of Technology (IIT) Roorkee", degree: "PG Diploma in Advanced Cloud Computing and DevOps", place: "Online", period: "Sep 2023" },
  { id: "anna", school: "Anna University (Prathyusha Engineering College)", degree: "Bachelor of Engineering - Computer Science", place: "Chennai", period: "May 2021" },
];

/** Education + work merged into one path, oldest first. Experience section renders this. */
export interface TimelineItem {
  id: string;
  kind: "education" | "work";
  org: string;
  title: string;
  place?: string;
  period: string;
  pursuing?: boolean;
  bullets?: string[];
}
const edu = (id: string): EducationItem => EDUCATION.find((e) => e.id === id)!;
const job = (id: string): ExperienceItem => EXPERIENCE.find((e) => e.id === id)!;
const fromEdu = (e: EducationItem): TimelineItem => ({
  id: e.id,
  kind: "education",
  org: e.school,
  title: e.degree,
  place: e.place,
  period: e.pursuing ? "Currently pursuing" : (e.period ?? ""),
  pursuing: e.pursuing,
});
const fromJob = (e: ExperienceItem): TimelineItem => ({
  id: e.id,
  kind: "work",
  org: e.company,
  title: e.role,
  period: e.period,
  bullets: e.bullets,
});
export const TIMELINE: TimelineItem[] = [
  fromEdu(edu("anna")),
  fromJob(job("tcs")),
  fromEdu(edu("iitr")),
  fromJob(job("lnrs")),
  fromEdu(edu("bits")),
];

/* ---------- Projects ---------- */
export interface ProjectTech {
  name: string;
  /** Logo key, only when a logo exists. */
  logo?: string;
}
export interface Project {
  id: string;
  number: string;
  title: string;
  date: string;
  kicker: string;
  /** First CV bullet, used as the main description. */
  description: string;
  /** Both CV bullets, verbatim. */
  bullets: string[];
  /** Short feature phrases built from CV words. */
  features: string[];
  tech: ProjectTech[];
  link?: { href: string; label: string };
  /** Which illustrative mini-UI to draw. */
  visual: "blog" | "voice" | "iot";
}
export const PROJECTS: Project[] = [
  {
    id: "microblog",
    number: "01",
    title: "Micro-blogging Web Application Platform",
    date: "Feb 2023",
    kicker: "Cloud-native web app",
    description:
      "Developed a cloud-native web application using Python, Flask, and Gitpod, implementing backend services and database-driven functionality.",
    bullets: [
      "Developed a cloud-native web application using Python, Flask, and Gitpod, implementing backend services and database-driven functionality.",
      "Integrated AWS services including Cognito, RDS, Lambda, IAM, CloudWatch, and Honeycomb to enable authentication, access control, event-driven notifications, application monitoring, distributed tracing, and alerting.",
    ],
    features: [
      "Cloud-native web application",
      "Backend services",
      "Database-driven functionality",
      "Authentication",
      "Access control",
      "Event-driven notifications",
      "Application monitoring",
      "Distributed tracing and alerting",
    ],
    tech: [
      { name: "Python", logo: "python" },
      { name: "Flask", logo: "flask" },
      { name: "Gitpod" },
      { name: "AWS", logo: "aws" },
      { name: "Cognito" },
      { name: "RDS" },
      { name: "Lambda" },
      { name: "IAM" },
      { name: "CloudWatch" },
      { name: "Honeycomb" },
    ],
    link: { href: "https://github.com/ajaysrinic/aws-bootcamp-cruddur-2023", label: "View on GitHub" },
    visual: "blog",
  },
  {
    id: "alexa",
    number: "02",
    title: "Alexa voice-based Tourist Assistant",
    date: "Feb 2020",
    kicker: "Conversational travel assistant",
    description:
      "Designed and developed a conversational travel assistant using Voiceflow, creating intuitive voice interaction flows and seamless user experiences.",
    bullets: [
      "Designed and developed a conversational travel assistant using Voiceflow, creating intuitive voice interaction flows and seamless user experiences.",
      "Integrated third-party Webhook APIs and AWS Lambda functions to deliver dynamic travel information, including hotel reviews, destination recommendations, visa policies, and tourism insights based on user queries.",
    ],
    features: [
      "Conversational travel assistant",
      "Voice interaction flows",
      "Seamless user experiences",
      "Third-party Webhook APIs",
      "AWS Lambda functions",
      "Hotel reviews",
      "Destination recommendations",
      "Visa policies and tourism insights",
    ],
    tech: [{ name: "Voiceflow" }, { name: "Webhook APIs" }, { name: "AWS Lambda", logo: "aws" }],
    link: {
      href: "https://docs.google.com/presentation/d/1Jp8dvbxxDoNAjT8eSt9kgSikM1WCNHDw-9_CKx6vQsQ/edit?usp=sharing",
      label: "View presentation",
    },
    visual: "voice",
  },
  {
    id: "iot",
    number: "03",
    title: "Home Automation using IoT",
    date: "March 2018",
    kicker: "IoT-based automation",
    description:
      "Developed an IoT-based home automation system using Arduino and Blynk, enabling remote control of electrical appliances through a smartphone application and API integrations.",
    bullets: [
      "Developed an IoT-based home automation system using Arduino and Blynk, enabling remote control of electrical appliances through a smartphone application and API integrations.",
      "Implemented voice-controlled automation using IFTTT and Google Assistant, enhancing user experience through hands-free appliance management and smart home functionality.",
    ],
    features: [
      "IoT-based home automation",
      "Arduino and Blynk",
      "Remote control of electrical appliances",
      "Smartphone application",
      "API integrations",
      "Voice-controlled automation",
      "IFTTT and Google Assistant",
      "Hands-free appliance management",
    ],
    tech: [{ name: "Arduino", logo: "arduino" }, { name: "Blynk" }, { name: "IFTTT" }, { name: "Google Assistant" }],
    visual: "iot",
  },
];

/* ---------- Certifications ---------- */
export interface Certification {
  id: string;
  index: string;
  title: string;
  date: string;
  url: string;
  /** Issuer, when known (derived from the title, plus HashiCorp for Terraform). */
  issuer?: string;
}
const CERT_RAW: Omit<Certification, "index">[] = [
  { id: "terraform", title: "Terraform Certified Associate", issuer: "HashiCorp", date: "Nov 2025", url: "https://www.credly.com/badges/28af38c2-9977-47c1-b129-b0e6dda5d729/public_url" },
  { id: "mckinsey", title: "Forward Learning Program – McKinsey & Company", issuer: "McKinsey & Company", date: "Jul 2025", url: "https://www.credly.com/badges/9d6e515a-3eac-4953-bca9-dde2c7057322/public_url" },
  { id: "mysql", title: "Oracle MySQL Implementation Associate", issuer: "Oracle", date: "Jul 2025", url: "https://www.linkedin.com/posts/ajaysrinic_mysql-oraclecertification-dba-activity-7351201151259693056-prWQ?utm_source=share&utm_medium=member_desktop&rcm=ACoAACOrnI8BO2fLCVFZUyL8xe1iXEK-eLyYZaI" },
  { id: "exampro", title: "AWS Cloud Project Bootcamp – ExamPro", issuer: "ExamPro", date: "Sep 2023", url: "https://app.exampro.co/validate/certificate/KbFoaSAJEKiTR7-c74xB0Q1afbf" },
  { id: "az900", title: "Microsoft Azure AZ 900", issuer: "Microsoft", date: "Mar 2023", url: "https://www.credly.com/badges/b08211a8-a380-4c66-b868-73133794fbd9/linked_in_profile" },
  { id: "awscp", title: "AWS Cloud Practitioner", issuer: "AWS", date: "Dec 2022", url: "https://www.credly.com/badges/e9fd7851-8d5f-496c-b447-7ca8e6ec0d58/public_url" },
];
export const CERTIFICATIONS: Certification[] = CERT_RAW.map((c, i) => ({ ...c, index: String(i + 1).padStart(2, "0") }));

/* ---------- Achievements ---------- */
export interface Achievement {
  id: string;
  /** "01" .. "07" */
  index: string;
  label: string;
  caption: string;
  detail: string;
  /** Logo key: lnrs, github-actions, srm, medal (concept), linux, jenkins, azure */
  logo: string;
  /** Soft glow behind the logo, rgba. */
  tint: string;
  number?: number;
  prefix?: string;
  suffix?: string;
  /** Small unit text beside the number, e.g. "CAD / month". */
  unit?: string;
}
const ACH_RAW: Omit<Achievement, "index">[] = [
  {
    id: "spotlight",
    label: "Spotlight Award",
    caption: "Recognized for delivering high-impact automation and observability solutions",
    detail: "Values: Collaborate to Deliver, Act with Agility, Drive Commercial Edge",
    logo: "lnrs",
    tint: "rgba(237,28,36,0.16)",
  },
  {
    id: "deploy",
    label: "Deployment acceleration",
    caption: "Reduction in deployment time via GitHub Actions CI/CD",
    detail: "Windows IIS .NET apps, PRDE project, with JFrog Artifactory and Jenkins",
    logo: "github-actions",
    tint: "rgba(33,114,229,0.16)",
    number: 70,
    suffix: "%",
  },
  {
    id: "beacon",
    label: "Inspiration Beacon Award",
    caption: "Honored for a well-received guest lecture on DevOps/SRE fundamentals and career guidance",
    detail: "Motivating students and sharing practical industry insights",
    logo: "srm",
    tint: "rgba(18,70,160,0.16)",
  },
  {
    id: "skills2020",
    label: "India Skills 2020",
    caption: "Runner-up at the state-level competition",
    detail: "Recognized by the District Collectorate of Tiruvallur",
    logo: "medal",
    tint: "rgba(13,13,13,0.08)",
  },
  {
    id: "uptime",
    label: "Uptime",
    caption: "Increase in uptime managing Linux production servers 24x7",
    detail: "Live environment at TCS",
    logo: "linux",
    tint: "rgba(250,190,20,0.18)",
    number: 20,
    suffix: "%",
  },
  {
    id: "releases",
    label: "Faster releases",
    caption: "Reduction in deployment times",
    detail: "CI/CD best practices with Jenkins and Git at TCS",
    logo: "jenkins",
    tint: "rgba(215,51,39,0.14)",
    number: 40,
    suffix: "%",
  },
  {
    id: "savings",
    label: "Cost savings",
    caption: "Saved through Azure optimisation: automation, monitoring and scaling",
    detail: "Azure cloud environments at TCS",
    logo: "azure",
    tint: "rgba(0,120,212,0.16)",
    number: 2500,
    prefix: "$",
    unit: "CAD / month",
  },
];
export const ACHIEVEMENTS: Achievement[] = ACH_RAW.map((a, i) => ({ ...a, index: String(i + 1).padStart(2, "0") }));
