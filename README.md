### `README.md`

# The Civic Catalyst Network

An AI-powered workplace productivity assistant built for South African civic tech NGOs. Submitted for the CAPACITI x ASA Online AI Project.

**Repository:** [AI-Productivity-Assistant](https://github.com/MaDhlomoCodes/AI-Productivity-Assistant)

## Project Overview
The Civic Catalyst Network is a single, unified operations console designed for resource-constrained civic organizations. Instead of managing fragmented, disparate utilities, an organisation configures its operational profile once (Name, CIPC/NPC registration, target municipality), and the system automatically propagates that data baseline to personalize every AI output generated across the environment.

The platform targets the administrative overhead typical of volunteer-led civic groups across South Africa—enabling fast translation of raw community feedback into formal demands, processing chaotic public transcripts, and mapping zero-budget local campaigns.

The interface is built using a dark-mode SaaS design language: clean off-black structural foundations (`#0B0B0C`), dark panel definitions (`#121214`), vivid electric-blue context indicators, and crisp crimson interactive controls.

## Features
The platform fulfills the mandatory core requirement of delivering at least 3 distinct AI-powered features:

### 1. Civic Action & PAIA Generator
Converts disorganized, conversational community complaints and designated recipient details into structured correspondence. It features an adjustable tone state toggle:
- **Diplomatic & Collaborative**: Relationship-preserving, constructive, and aimed at establishing a working dialogue.
- **Firm 14-Day Legal Demand**: Highly assertive framing referencing obligations under the Promotion of Access to Information Act (PAIA) and strict legislative response windows.

### 2. Community Grievance Summarizer
Ingests loose unstructured data strings—including field reports, WhatsApp community chats, and town-hall text loops—and transforms the input into clean reporting metrics:
- An aligned high-level executive situation brief.
- Grouped operational grievances divided neatly by municipal infrastructure sector (Water, Sanitation, Energy, Safety, Waste, etc.).
- A dynamic, interactive team action-item checklist.

### 3. Advocacy Campaign Mobilizer
Maps out systematic, zero-budget campaign roadmaps derived from a singular community objective. Orchestrates schedules according to *Daily* or *Weekly* cadences across three distinct chronological milestones:
- **Phase 1**: Preparation & Compliance
- **Phase 2**: Community Mobilization
- **Phase 3**: Execution & Media Pushes

All output nodes maintain full support for local, direct text overrides and inline structural inline edits.

## Tools Used

| Layer | Tools |
|---|---|
| **Frontend Framework** | React |
| **Styling** | Tailwind CSS |
| **Iconography** | Lucide React |
| **AI Generation Engine** | Google Gemini SDK (`@google/generative-ai`), executing on `gemini-2.5-flash` |
| **Data Persistence** | Client-side reactive local browser key-value context storage |

## Responsible AI
A permanent legal and operational safety compliance block is anchored to the base of the viewport on all operational routing panels:

> **Responsible AI Compliance:** This platform utilizes advanced Google Gemini safety alignment layers. All outputs are intended for civic advocacy purposes and do not substitute for formal legal counsel. Users are strictly required to verify all legislative citations, official reference numbers, and municipal details before formal distribution.

In practice, this is guarded through:
- **Zero Automation**: No email transmission, formal tracking delivery, or external scheduling takes place directly without explicit human interaction and sign-off.
- **Sanitized Citations**: Prompts structurally explicitly forbid the fabrication of specific sub-clauses or numeric citation strings, leaving placeholders that enforce manual confirmation.

## Setup Instructions

This project is structured as a standard Vite-powered React application with tailwind configurations.

### 1. Project Initialization
Scaffold a clean, modern React environment using Vite:
```bash
npm create vite@latest AI-Productivity-Assistant -- --template react
cd AI-Productivity-Assistant
npm install
2. Install Required Dependencies
Install the styling utilities, icon layout system, and the official Google Gemini SDK package:

Bash
npm install lucide-react @google/generative-ai
npm install tailwindcss @tailwindcss/vite
3. Configure Development Architecture
Configure your CSS imports inside src/index.css:

CSS
@import "tailwindcss";
Copy the console code into src/App.jsx, completely overwriting the default boilerplate file contents.

4. Set Up Environment Keys
Create a standard configuration variable file labeled .env directly within the workspace root folder directory:

Code snippet
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_goes_here
5. Execute Development Server
Spin up your local loop to access the platform:

Bash
npm run dev

Team Members - Solo project
Natasha Mkhabela 

Further Documentation
For precise breakdowns regarding system architecture mappings, prompt contraction structures, and extensive engineering limit reviews, check out TECHNICAL_DOCUMENTATION.md.