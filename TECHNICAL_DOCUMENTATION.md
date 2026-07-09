# Technical Documentation: The Civic Catalyst Network

## 1. Purpose of This Document
This document explains how The Civic Catalyst Network is built, how its AI features are engineered, and how it maps to the CAPACITI x ASA Online AI Project brief. It is intended for evaluators and for any developer who picks up the codebase after submission.

## 2. Architecture Overview
The application is a single-page React console with client-side view routing (no external router library). One root component (`App`) holds the active view and the organisation profile in state, and renders one of five view components based on the selected sidebar item.

App├── Sidebar               (navigation, org status, mobile drawer)├── TopBar                (page title, mobile menu trigger)├── active view:│    ├── Dashboard        (overview + quick launch cards)│    ├── OrgProfile       (onboarding form)│    ├── PaiaGenerator    (Feature 1)│    ├── GrievanceSummarizer (Feature 2)│    └── CampaignMobilizer (Feature 3)└── ComplianceBar         (persistent, fixed to layout base)
Each feature view follows the same internal shape: an input panel on the left, an output panel on the right (stacking vertically on small screens), a loading state while the AI call is in flight, and an inline error state that never breaks layout.

### Layout and Responsiveness
- **Desktop**: Fixed sidebar (18rem) plus a fluid content column.
- **Mobile (below the `lg` breakpoint)**: Sidebar becomes an off-canvas drawer triggered by a hamburger icon in the top bar, with a scrim overlay.
- **Feature Grids**: Collapse from a two-column split to a single column below `lg`.
- **Interactive Controls**: Buttons, inputs, and tone toggles expand to full width on small screens to maintain generous touch targets.

### Design Tokens
| Token | Value | Usage |
|---|---|---|
| Background | `#0B0B0C` | Page background |
| Panel | `#121214` | Cards, sidebar, inputs |
| Border | `#1E1E22` | Card and input borders |
| Accent, electric blue | `#3B82F6` | Eyebrow labels, active nav state, focus rings |
| Accent, crimson | `#DC2626` | Primary actions, buttons, active nav indicator bar |

## 3. AI Integration
Each of the three features interfaces with Google Gemini directly from the client side using the official `@google/generative-ai` SDK. The integration utilizes a shared initialization sequence and helper pattern:

```js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Gemini SDK via environment variables
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
Two output modes are engineered depending on what the UI needs to render:Free-text mode (PAIA Generator): The prompt instructs the model to return only the finished letter, omitting markdown code fences and introductory conversational fluff, allowing it to drop straight into an editable text area.JSON mode (Grievance Summarizer, Campaign Mobilizer): The prompt enforces a strict structural response contract, requiring a single JSON object matching an exact schema. A utility function (stripJsonFences) cleanses the raw response text of any unexpected markdown wrappers before parsing it directly into UI components (sector cards, phase timelines, checklists).4. Prompt Engineering ApproachEvery prompt in the system follows a rigorous four-part structure, which is the core prompt engineering contribution of this project.4.1 Role FramingEach system-level instruction opens by assigning a highly specialized professional role rather than a generic assistant persona:PAIA Generator: "a legal-correspondence assistant supporting a South African civic organisation"Grievance Summarizer: "a civic operations analyst"Campaign Mobilizer: "a zero-budget grassroots campaign strategist"This narrows the model's linguistic register and domain specific vocabulary before execution parameters are processed.4.2 Context InjectionThe saved organisation profile details (name, CIPC/NPO registration, target municipality) are interpolated into every prompt structure as active state variables. If fields are omitted, bracketed fallback text placeholders prevent data failures. This shared profile baseline personalizes all three modules simultaneously without requiring redundant input from the user.4.3 Output ContractsEach prompt terminates with explicit structural rules regarding response constraints:The PAIA Generator mandates strict plain text formatting divided into a date line, recipient block, subject line, body paragraphs, and formal sign-off.The Grievance Summarizer and Campaign Mobilizer enforce programmatic JSON structure coupled with strict token limits (e.g., "Keep each grievance and task under 20 words") to guarantee clean rendering on viewport constraints.4.4 Tone and Parameter ConditioningWhere programmatic variations occur (such as the PAIA Generator's Diplomatic vs. Firm modes), choices map to expanded structural guidance blocks rather than simple abstract adjectives. Selecting "Firm 14-Day Legal Demand" explicitly orders the model to invoke rights under the Promotion of Access to Information Act (PAIA), dictate explicit calendar day boundaries, and outline clear oversight escalation channels.5. Responsible AI ImplementationResponsible AI practices are embedded deep within the software's operational design:Persistent Compliance Anchoring: The ComplianceBar is statically pinned to the view footer across all components, continually surfacing warnings regarding safety layout alignments, the boundaries of civic advocacy scope, and critical verification mandates.Human-in-the-Loop Validation: The application strictly avoids automated pipeline delivery. Outputs load into fully editable fields, requiring an intentional human choice to copy, alter, verify, and distribute.Prevention of Hallucinated Authority: Prompts instruct the model never to fabricate legal section numbers or specific court citations; layout logic dictates that precise reference slots are left as structured spaces for manual verification.Opt-in Escalation Boundaries: Factual, collaborative engagement options remain default; aggressive legal pathways require deliberate interactive selection.6. Known LimitationsKey Visibility: The SDK runs directly on the client layer using Vite environment injection; a hardened production implementation should route prompts through an encapsulated API proxy layer to prevent API key exposure in client bundles.Token Windows: Token parameters are tuned for compact operation; exceptionally dense town-hall chat loops or historical transcripts may require front-end windowing or pagination structures in future patches.State Lifecycle: Persistence is maintained locally via reactive client-side container bindings; an absolute multi-tenant release would swap this mechanism for server-backed relational database storage.7. Requirement TraceabilityBrief RequirementWhere It Is SatisfiedOne integrated platform, not multiple appsSingle App container orchestrating global sidebar state and organisation profile tokensAt least 3 AI-powered featuresPAIA Generator, Grievance Summarizer, Campaign MobilizerDashboard layout with sidebar navigationHandled globally via responsive Sidebar and structural TopBar layout componentsResponsive designDriven cleanly by dynamic structural adjustments wrapping across tailwind lg breakpointsInput and output sectionsStructured side-by-side execution split panels rendering across all three feature modulesEditable AI-generated responsesManaged by binding outputs directly into fluid, editable TextArea structuresResponsible AI disclaimerImplemented inside the static layout base block via ComplianceBar