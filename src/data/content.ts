// Single source of truth for all site copy.
// Every claim here must be defensible in an interview: no invented metrics,
// team work credited as team work, unbuilt features marked "designed" or "planned".
// Private background notes: .context/career-context.md (gitignored).

export type Status = 'built' | 'designed' | 'planned';

export const profile = {
  name: 'Mirun Kaushik',
  first: 'Mirun',
  last: 'Kaushik',
  role: 'AI backend engineer',
  tagline:
    'I build the backend that AI products run on: CRM integrations for voice agents, job queues, semantic caches and knowledge graphs.',
  approach:
    'I structure data with rules first and call a model only where it is needed. It costs less, hallucinates less, and the output is easier to predict.',
  about: [
    'I’m a final-year AI and Data Science student in Tiruchirappalli, working as an AI engineer intern at Botcadence. My work there is the plumbing behind a voice-agent product: getting contacts in from a client’s CRM, getting call outcomes back out, and deciding who is allowed to see what.',
    'Most of what I know came from hackathons. Three podiums in two years taught me to scope hard, build the part that matters, and be honest about what is still a slide.',
    'I build with AI coding tools every day. I decide the architecture and the data flow, check what the tool writes, and test every feature end to end before it ships.',
  ],
  location: 'Tiruchirappalli',
  timezone: 'Asia/Kolkata',
  lookingFor: 'AI and backend engineering roles at product companies and startups in India.',
  email: '10425mirunkaushik@gmail.com',
  links: {
    github: 'https://github.com/mk-ctrl',
    linkedin: 'https://www.linkedin.com/in/mirun-kaushik',
  },
};

export const education = {
  school: 'Saranathan College of Engineering',
  university: 'Anna University',
  degree: 'B.Tech Artificial Intelligence and Data Science (Honours)',
  place: 'Tiruchirappalli, Tamil Nadu',
  period: 'Aug 2023 – Mar 2027',
  cgpa: '8.66',
};

/** One stage in a project's flow diagram. `model` stages are drawn in the accent colour. */
export type FlowStep = {
  label: string;
  sub?: string;
  kind: 'input' | 'rule' | 'model' | 'store' | 'queue' | 'output';
  team?: boolean;
};

export type Job = {
  company: string;
  product: string;
  role: string;
  period: string;
  place: string;
  context: string;
  built: string[];
  flow?: FlowStep[];
};

export const experience: Job[] = [
  {
    company: 'Botcadence',
    product: 'Multilingual AI voice-agent platform',
    role: 'AI Engineer Intern',
    period: 'Aug 2026 – Present',
    place: 'Remote',
    context:
      'A subscription platform where clients sync contacts from their CRM and run outbound campaigns: voice-agent calls in the customer’s own language, plus SMS and WhatsApp. The agent collects information during the call and writes it back to the CRM. I work with a US-based team across time zones.',
    built: [
      'Integrated Zoho CRM, Salesforce and Pipedrive so clients can sync contacts into campaigns and have call outcomes written back to their CRM.',
      'Built post-call webhooks that send call details and AI-generated insights as JSON to any endpoint the client configures.',
      'Implemented role-based access control across the application and tested each feature end to end before release.',
    ],
    flow: [
      { label: 'Client CRM', sub: 'Zoho · Salesforce · Pipedrive', kind: 'input' },
      { label: 'Contact sync', sub: 'into campaigns', kind: 'rule' },
      { label: 'Voice agent call', sub: 'native language', kind: 'model', team: true },
      { label: 'Write-back', sub: 'outcomes to CRM', kind: 'rule' },
      { label: 'Post-call webhook', sub: 'JSON to client endpoint', kind: 'output' },
    ],
  },
  {
    company: 'Euredas.ai',
    product: 'Loyalty-points CRM for local businesses',
    role: 'Full-Stack AI Engineer Intern',
    period: 'Mar 2026 – Aug 2026',
    place: 'Tiruchirappalli',
    context:
      'A loyalty-points CRM launching for local businesses in Trichy. I joined after placing 2nd at Hackwell 2026.',
    built: [
      'Built a brand-asset extractor: give it a website URL and it parses the HTML, CSS and DOM to pull out the brand’s colours, logos, fonts and tagline.',
      'Implemented product web pages and features from product specs, testing each flow end to end.',
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  kind: string;
  role: string;
  award?: string;
  featured: boolean;
  repo: string;
  repoNote?: string;
  stack: string[];
  problem: string;
  approach: string;
  iBuilt: string[];
  teamBuilt?: string[];
  notBuilt?: { status: Exclude<Status, 'built'>; text: string }[];
  flow: FlowStep[];
  note?: string;
};

export const projects: Project[] = [
  {
    slug: 'mind-armor',
    role: 'Hackathon team',
    title: 'Mind Armor',
    subtitle: 'A browser extension that flags manipulative content and explains why',
    year: '2026',
    kind: 'Hackathon',
    award: '2nd place, Hackwell 2026',
    featured: true,
    repo: 'https://github.com/mk-ctrl/hackwell-griffins',
    stack: ['React', 'WXT', 'Hugging Face'],
    problem:
      'The problem statement: use AI to detect manipulative content online. Around 30 to 40 teams picked it. Among the finalists, ours was the only team to build a browser extension, so it works on the page you are already reading.',
    approach:
      'Ontology rules narrow down the page content first, so only the relevant parts go to Hugging Face models. Instead of stopping at the problem statement, I treated it as a product: a personal extension for everyday browsing, plus a school edition for media and AI literacy.',
    iBuilt: [
      'Onboarding that asks for your interests (sports, finance and so on) so results are personalised.',
      'Page scanning that highlights manipulative claims, like “grow hair in 5 days with this oil”. It doesn’t just say true or false: it gives logical and analytical reasoning so you stop and think before buying in a hurry.',
      'A teacher view for schools: the teacher shares a website, and sees each manipulative claim on it with its severity and a plain explanation.',
    ],
    notBuilt: [
      { status: 'designed', text: 'Student exercises: students get the same website with the answers hidden, find the manipulative content themselves, explain it, and are scored against the teacher’s answers.' },
      { status: 'designed', text: 'A subscription model for schools.' },
    ],
    flow: [
      { label: 'Page you’re reading', sub: 'DOM text', kind: 'input' },
      { label: 'Ontology rules', sub: 'narrow to candidate claims', kind: 'rule' },
      { label: 'Hugging Face models', sub: 'only on candidates', kind: 'model' },
      { label: 'Highlight + reasoning', sub: 'personalised by interests', kind: 'output' },
    ],
  },
  {
    slug: 'health-link',
    role: 'Hackathon team',
    title: 'Health Link',
    subtitle: 'Turns scattered medical reports into a graph a patient can understand',
    year: '2025',
    kind: 'Hackathon · 24 hours',
    award: '3rd place, KRCE hackathon 2025',
    featured: true,
    repo: 'https://github.com/Alavandhan-Arivuselvan/health_link',
    repoNote: 'on a teammate’s account',
    stack: ['Tesseract OCR', 'Neo4j', 'Hugging Face'],
    problem:
      'Medical records sit on paper or in scattered files, with no good place to keep them or make sense of them.',
    approach:
      'OCR the reports, then use ontology rules to structure the text into a Neo4j graph, so a model isn’t needed for every step. Models come in only where rules can’t help: explaining jargon, and mapping findings to the body.',
    iBuilt: [
      'The ingestion pipeline: upload scans or PDFs, Tesseract extracts the text, ontology rules structure it, and it is stored as graph relationships in Neo4j.',
      'A chatbot over the graph that explains medical jargon in the patient’s own reports.',
      'An interactive 3D anatomy model: a medical LLM on Hugging Face maps each report to the affected body parts, which light up on a spinning skeleton. Clicking a part shows its findings.',
      'A Duolingo-style learning flow (my idea): each uploaded report unlocks a chapter with a 7-card lesson and 2–3 quiz questions, with streaks.',
    ],
    teamBuilt: [
      'The original product idea.',
      'Smartwatch integration, tested with a Google watch and a Fitbit.',
      'The ML model that combines watch metrics with medical history.',
    ],
    flow: [
      { label: 'Scans & PDFs', kind: 'input' },
      { label: 'Tesseract OCR', sub: 'text extraction', kind: 'rule' },
      { label: 'Ontology rules', sub: 'structure, no LLM', kind: 'rule' },
      { label: 'Neo4j graph', sub: 'reports as relationships', kind: 'store' },
      { label: 'Medical LLM', sub: 'jargon + body mapping', kind: 'model' },
      { label: 'Chat · 3D body · lessons', kind: 'output' },
    ],
  },
  {
    slug: 'github-automation',
    role: 'Solo',
    title: 'GitHub Automation Console',
    subtitle: 'A rule-based bot that triages issues and pull requests with AI',
    year: '2026',
    kind: 'Take-home assessment',
    featured: true,
    repo: 'https://github.com/mk-ctrl/abstrabit.assessment',
    stack: ['Node.js', 'Express', 'BullMQ', 'Redis', 'Supabase', 'React', 'OpenRouter'],
    problem:
      'Repository owners want issues and pull requests labelled, commented on and announced in Slack automatically, without the webhook handler timing out while a model thinks.',
    approach:
      'The webhook handler only verifies the signature, queues the event and returns 202. A background worker does the slow work: AI triage, rule matching, GitHub and Slack calls, and an audit log of every action.',
    iBuilt: [
      'Set the scope and architecture, then built it with an AI coding agent and wrote down which parts the AI wrote and which decisions were mine.',
      'Rejected the AI’s first draft, which did everything inside the webhook handler, and moved the work onto a BullMQ queue. A unique delivery ID in Postgres makes GitHub’s retries harmless.',
      'Chose to keep the GitHub token inside a signed JWT so authenticated requests need no database read, and wrote down the trade-off: a revoked token stays valid until it expires.',
      'Tracked down why push events silently failed. GitHub’s delivery history showed 401s, and the cause was a placeholder secret that an earlier AI-written script had registered on the webhook.',
    ],
    flow: [
      { label: 'GitHub event', sub: 'HMAC-signed webhook', kind: 'input' },
      { label: 'Verify + enqueue', sub: 'returns 202', kind: 'rule' },
      { label: 'BullMQ', sub: 'Redis', kind: 'queue' },
      { label: 'Idempotency check', sub: 'unique delivery ID', kind: 'store' },
      { label: 'AI triage', sub: 'category + priority', kind: 'model' },
      { label: 'Rules engine', sub: 'labels · comments · Slack', kind: 'output' },
    ],
  },
  {
    slug: 'aura-mall',
    role: 'Hackathon team',
    title: 'Aura Mall',
    subtitle: 'An AI shopping assistant that searches a mall by photo',
    year: '2025',
    kind: 'Hackathon',
    award: '3rd place, DevSpark 2025',
    featured: true,
    repo: 'https://github.com/Agiless/Aura-Mall-assistant',
    repoNote: 'on a teammate’s account',
    stack: ['CLIP', 'RAG', 'MongoDB Atlas', 'Blender'],
    problem:
      'In a large mall it is hard to find a product, know which store has it, and get there.',
    approach:
      'Embed a shopper’s photo with CLIP and compare it against embeddings of inventory images. Questions about stores and products go to a RAG chatbot over the mall’s data.',
    iBuilt: [
      'Visual product search, like Google Lens but built from scratch: photograph an item, the photo is embedded with CLIP and matched against inventory image embeddings to show similar products.',
      'Outfit recommendations that suggest matching items, such as trousers and shoes for a shirt.',
      'A RAG chatbot that answers questions about the mall, stores and products, using a sample inventory dataset I created in MongoDB Atlas.',
    ],
    teamBuilt: [
      'A 3D model of the mall in Blender showing every store.',
      'A breadth-first-search pathfinder for store-to-store routes across floors.',
    ],
    notBuilt: [
      { status: 'planned', text: 'Connecting the chatbot to real store inventory systems.' },
      { status: 'planned', text: 'An SOS feature that broadcasts an alert to everyone using the app.' },
    ],
    flow: [
      { label: 'Shopper’s photo', kind: 'input' },
      { label: 'CLIP embedding', kind: 'model' },
      { label: 'Similarity match', sub: 'inventory image embeddings', kind: 'store' },
      { label: 'Similar items + outfit', kind: 'output' },
      { label: 'Route to store', sub: 'BFS across floors', kind: 'rule', team: true },
    ],
  },
  {
    slug: 'transaction-pipeline',
    role: 'Solo',
    title: 'Transaction Pipeline',
    subtitle: 'Cleans messy bank CSVs, flags anomalies, categorises with an LLM',
    year: '2026',
    kind: 'Internship assignment',
    featured: false,
    repo: 'https://github.com/mk-ctrl/alemeno.Transaction_Processing_Pipeline',
    stack: ['Python', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Docker', 'OpenRouter'],
    problem:
      'Bank CSV exports are messy: different column names, mixed date formats, currency symbols in amounts, duplicates and missing categories.',
    approach:
      'Upload returns a job ID straight away and a Celery worker runs the pipeline in stages. Plain rules do the cleaning and the anomaly checks; the LLM is used only for transactions that are still uncategorised, and for the final summary.',
    iBuilt: [
      'Built it with AI coding tools; the design decisions were mine.',
      'A cleaning stage that maps column-name variants to one schema, normalises dates and amounts, fills defaults and removes duplicates.',
      'Two anomaly rules: amounts above 3× the account’s median, and USD charges at Indian-only merchants such as Swiggy, Ola and IRCTC.',
      'Batch LLM categorisation for uncategorised transactions, and a written summary of spending behaviour.',
      'Job tracking through pending, processing, completed and failed, with a results endpoint that never returns partial data.',
    ],
    flow: [
      { label: 'Dirty CSV', kind: 'input' },
      { label: 'Celery job', sub: 'Redis broker', kind: 'queue' },
      { label: 'Clean + dedupe', kind: 'rule' },
      { label: 'Anomaly rules', sub: '3× median · currency', kind: 'rule' },
      { label: 'LLM', sub: 'uncategorised only', kind: 'model' },
      { label: 'Postgres + summary', kind: 'output' },
    ],
  },
  {
    slug: 'triage-system',
    role: 'Solo',
    title: 'Support Ticket Triage',
    subtitle: 'Classifies and prioritises support tickets, with a semantic cache',
    year: '2026',
    kind: 'Take-home assessment',
    featured: false,
    repo: 'https://github.com/mk-ctrl/triageSystem',
    stack: ['Node.js', 'Redis', 'BullMQ', 'pgvector', 'Hugging Face'],
    problem:
      'Support teams need incoming tickets sorted and prioritised without blocking on slow model calls.',
    approach:
      'Process tickets asynchronously through job queues, and check a semantic cache first so the model isn’t called again for a question it has already answered.',
    iBuilt: [
      'A service that classifies and prioritises tickets with a Hugging Face model, processing them asynchronously through Redis-backed BullMQ job queues.',
      'A pgvector semantic cache that reuses responses for similar tickets to avoid repeated LLM calls.',
    ],
    flow: [
      { label: 'Ticket', kind: 'input' },
      { label: 'BullMQ', sub: 'Redis', kind: 'queue' },
      { label: 'pgvector cache', sub: 'similar ticket seen?', kind: 'store' },
      { label: 'Hugging Face model', sub: 'on cache miss', kind: 'model' },
      { label: 'Category + priority', kind: 'output' },
    ],
  },
  {
    slug: 'tainttrace',
    title: 'TaintTrace',
    subtitle: 'A security layer that stops hijacked AI agents from touching real data',
    year: '2026',
    kind: 'In design',
    role: 'Team lead',
    featured: false,
    repo: 'https://github.com/mk-ctrl/TaintTrace',
    stack: ['Python', 'LLM agents', 'MCP'],
    problem:
      'AI agents can be hijacked by instructions hidden in content they read, like an email or a web page. Because the agent acts with the real user’s permissions, normal access checks see nothing wrong.',
    approach:
      'Sit between the agent and its tools. For every tool call, check where the values came from, whether it breaks a rule, and whether it matches what the user actually asked for. Suspicious sessions move to a shadow environment with fake tools and fake data, so nothing real leaks and the agent doesn’t crash.',
    iBuilt: [
      'I lead the team. I wrote the project reference and the first-phase build plan: the problem, the threat model, the detection checks and the roadmap.',
    ],
    notBuilt: [
      { status: 'designed', text: 'The core engine: provenance and policy checks, shadow tools and session quarantine. Implementation hasn’t started.' },
      { status: 'planned', text: 'Evaluation on the AgentDojo benchmark, and an MCP proxy adapter.' },
    ],
    flow: [
      { label: 'Agent tool call', kind: 'input' },
      { label: 'Provenance check', sub: 'where did values come from?', kind: 'rule' },
      { label: 'Policy rules', kind: 'rule' },
      { label: 'Intent judge', sub: 'optional', kind: 'model' },
      { label: 'Real tools or shadow', kind: 'output' },
    ],
  },
];

// Career story, oldest first.
export const timeline = [
  { date: '2025', title: '3rd place · DevSpark', detail: 'KPR College of Engineering, Coimbatore', link: 'aura-mall' },
  { date: '2025', title: '3rd place · KRCE hackathon', detail: 'K. Ramakrishnan College of Engineering', link: 'health-link' },
  { date: '2026', title: '2nd place · Hackwell', detail: 'Saranathan College of Engineering. Led to an internship offer.', link: 'mind-armor' },
  { date: 'Mar 2026', title: 'Euredas.ai', detail: 'Full-Stack AI Engineer Intern' },
  { date: 'Aug 2026', title: 'Botcadence', detail: 'AI Engineer Intern. Production CRM integrations.' },
];

export const skills: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'SQL'] },
  { group: 'Backend', items: ['Node.js', 'REST APIs', 'Webhooks', 'Role-based access control'] },
  { group: 'Data & queues', items: ['MongoDB', 'Redis', 'pgvector', 'BullMQ', 'Celery'] },
  { group: 'AI', items: ['RAG', 'LLM agents', 'Vector search', 'Hugging Face'] },
  { group: 'Tools', items: ['Git', 'Claude Code', 'Cursor', 'Antigravity'] },
];

export const certifications = [
  { title: 'Azure Fundamentals', code: 'AZ-900', issuer: 'Microsoft' },
  { title: 'Azure AI Fundamentals', code: 'AI-900', issuer: 'Microsoft' },
];
