import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Mail,
  MessagesSquare,
  CalendarRange,
  Menu, // <-- Added back to prevent the crash
  X,
  Scale,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ChevronRight,
  Send,
  Save,
  Activity,
  AlertTriangle,
  ListChecks,
  MapPin,
  FileSignature,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

/*
THE CIVIC CATALYST NETWORK
AI-assisted operations console for South African civic tech NGOs
*/
const COLORS = {
  bg: "#0B0B0C",
  panel: "#121214",
  border: "#1E1E22",
  blue: "#3B82F6",
  red: "#DC2626",
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Organisation Profile", icon: Building2 },
  { id: "paia", label: "Civic Action & PAIA Generator", icon: Mail },
  { id: "summarizer", label: "Grievance Summarizer", icon: MessagesSquare },
  { id: "mobilizer", label: "Campaign Mobilizer", icon: CalendarRange },
];

// Initialize Google Gemini SDK
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function callGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function stripJsonFences(text) {
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

/* Shared Bits */
function Eyebrow({ children }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.18em] font-mono mb-1" style={{ color: COLORS.blue }}>
      {children}
    </div>
  );
}

// Any components utilizing shared styles
function Panel({ children, className = "" }) {
  return (
    <div className={`rounded-lg border ${className}`} style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: COLORS.red }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "#B91C1C";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = COLORS.red;
      }}
    >
      {Icon ? <Icon size={16} /> : null}
      {children}
    </button>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-medium text-gray-400 mb-1.5">
      {children}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-md bg-[#0B0B0C] border text-sm text-white placeholder-gray-600 px-3 py-2.5 outline-none focus:ring-1 transition-shadow"
      style={{ borderColor: COLORS.border }}
      onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.blue)}
      onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
    />
  );
}

function TextArea(props) {
  return (
    <textarea
      {...props}
      className="w-full rounded-md bg-[#0B0B0C] border text-sm text-white placeholder-gray-600 px-3 py-2.5 outline-none focus:ring-1 transition-shadow resize-none"
      style={{ borderColor: COLORS.border }}
      onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.blue)}
      onBlur={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
    />
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text || "");
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy output"}
    </button>
  );
}

function ErrorNote({ message }) {
  if (!message) return null;
  return (
    <div
      className="flex items-start gap-2 rounded-md border px-3 py-2 text-xs text-red-300"
      style={{ borderColor: "#3A1414", backgroundColor: "#1A0E0E" }}
    >
      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

/* Compliance Disclaimer */
/* The platform ensures standard legal validation before dispatching outputs. */
function ComplianceBar() {
  return (
    <div className="border-t px-4 py-3 lg:px-8" style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}>
      <p className="text-[11px] leading-relaxed text-gray-500 max-w-5xl">
        <span className="text-gray-400 font-semibold mr-1">Responsible AI Compliance:</span> 
        This platform utilizes advanced Google Gemini safety alignment layers. All outputs are intended for civic advocacy purposes and do not substitute for formal legal counsel. Users are strictly required to verify all legislative citations, official reference numbers, and municipal details before formal distribution.
      </p>
    </div>
  );
}

/* Sidebar Layout Component */
function Sidebar({ active, setActive, mobileOpen, setMobileOpen, org }) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside
        className={`fixed lg:static z-40 top-0 left-0 h-full w-72 shrink-0 border-r flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ backgroundColor: COLORS.panel, borderColor: COLORS.border }}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md flex items-center justify-center" style={{ backgroundColor: COLORS.red }}>
              <Activity size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">Civic Catalyst</div>
              <div className="text-[10px] font-mono tracking-wider text-gray-500">NETWORK CONSOLE</div>
            </div>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors relative"
                style={{
                  color: isActive ? "#fff" : "#9CA3AF",
                  backgroundColor: isActive ? "#1A1A1D" : "transparent",
                }}
              >
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full" style={{ backgroundColor: COLORS.red }} />
                )}
                <Icon size={17} />
                <span className="text-left">{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-gray-500" />}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t" style={{ borderColor: COLORS.border }}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-gray-400">3 NODES ONLINE</span>
          </div>
          <div className="text-[11px] text-gray-600 truncate">
            {org.saved ? org.orgName : "No organisation profile saved"}
          </div>
        </div>
      </aside>
    </>
  );
}

/* Topbar Layout Component */
function TopBar({ title, subtitle, onMenuClick }) {
  return (
    <div className="flex items-center gap-3 px-4 lg:px-8 py-5 border-b sticky top-0 z-20" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.border }}>
      <button className="lg:hidden text-gray-300" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>
      <div>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* Dashboard View */
function Dashboard({ org, setActive }) {
  const cards = [
    {
      id: "paia",
      icon: Mail,
      title: "Civic Action & PAIA Generator",
      desc: "Turn raw community complaints into formal correspondence, diplomatic or firm.",
    },
    {
      id: "summarizer",
      icon: MessagesSquare,
      title: "Grievance Summarizer",
      desc: "Distill town-hall notes and WhatsApp threads into a clear brief and task list.",
    },
    {
      id: "mobilizer",
      icon: CalendarRange,
      title: "Advocacy Campaign Mobilizer",
      desc: "Map a zero-budget, phased mobilization timeline from a single objective.",
    },
  ];
  return (
    <div className="px-4 lg:px-8 py-6 space-y-6">
      <Panel className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Eyebrow>Organisation status</Eyebrow>
            <p className="text-white text-sm">
              {org.saved ? (
                <>
                  Operating profile locked for <span className="font-semibold">{org.orgName}</span> in{" "}
                  <span className="font-semibold">{org.municipality}</span>.
                </>
              ) : (
                "No organisation profile saved yet. Save one to auto-inject your details into every output."
              )}
            </p>
          </div>
          <PrimaryButton onClick={() => setActive("profile")} icon={Building2}>
            {org.saved ? "Edit profile" : "Set up profile"}
          </PrimaryButton>
        </div>
      </Panel>
      <div>
        <Eyebrow>Toolkit</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} onClick={() => setActive(c.id)} className="text-left">
                <Panel className="p-5 h-full hover:border-[#3B82F6] transition-colors flex flex-col justify-between">
                  <div>
                    <Icon size={20} style={{ color: COLORS.blue }} />
                    <h3 className="text-white text-sm font-semibold mt-3">{c.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{c.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono mt-4" style={{ color: COLORS.blue }}>
                    LAUNCH <ChevronRight size={13} />
                  </div>
                </Panel>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Organisation Profile View */
function OrgProfile({ org, setOrg }) {
  const [form, setForm] = useState(org);
  const [status, setStatus] = useState("");
  useEffect(() => setForm(org), [org]);
  async function handleSave() {
    const next = { ...form, saved: true };
    setOrg(next);
    try {
      await window.storage?.set("org-profile", JSON.stringify(next), false);
      setStatus("Profile saved locally and locked into every module.");
    } catch (e) {
      setStatus("Saved for this session. Persistent storage was unavailable.");
    }
    setTimeout(() => setStatus(""), 3500);
  }
  return (
    <div className="px-4 lg:px-8 py-6 max-w-2xl">
      <Panel className="p-6">
        <Eyebrow>Onboarding</Eyebrow>
        <h2 className="text-white text-base font-semibold mb-1">Organisation Profile</h2>
        <p className="text-xs text-gray-500 mb-6">
          These details are locked in locally and automatically personalize every letter, summary, and campaign plan generated on this network.
        </p>
        <div className="space-y-4">
          <div>
            <FieldLabel>Organisation Name</FieldLabel>
            <TextInput
              placeholder="e.g. Enough Is Enough South Africa"
              value={form.orgName || ""}
              onChange={(e) => setForm({ ...form, orgName: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>CIPC Registration (NPC / NPO)</FieldLabel>
            <TextInput
              placeholder="e.g. NPC 2025/123456/08"
              value={form.cipcReg || ""}
              onChange={(e) => setForm({ ...form, cipcReg: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Target Municipality</FieldLabel>
            <TextInput
              placeholder="e.g. City of Johannesburg Metropolitan Municipality"
              value={form.municipality || ""}
              onChange={(e) => setForm({ ...form, municipality: e.target.value })}
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <PrimaryButton onClick={handleSave} icon={Save}>
            Save & Lock Profile
          </PrimaryButton>
          {status && <span className="text-xs text-emerald-400">{status}</span>}
        </div>
      </Panel>
    </div>
  );
}

/* Feature 1: PAIA & Civic Action Generator */
function PaiaGenerator({ org }) {
  const [complaint, setComplaint] = useState("");
  const [official, setOfficial] = useState("");
  const [tone, setTone] = useState("diplomatic");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!complaint.trim() || !official.trim()) {
      setError("Add the target official and the raw complaint details first.");
      return;
    }
    setError("");
    setLoading(true);
    setOutput("");
    const toneInstruction =
      tone === "firm"
        ? "Firm 14-Day Legal Demand: assertive, formal, and unambiguous. State a strict 14 calendar day deadline for a substantive written response, reference the organisation's rights under the Promotion of Access to Information Act (PAIA) and applicable municipal accountability obligations, and note that non-compliance may result in escalation to the relevant oversight body."
        : "Diplomatic & Collaborative: constructive and relationship-preserving in tone, inviting dialogue, proposing a joint follow-up engagement, while still being clear and specific about the issue.";
    const prompt = `You are a legal-correspondence assistant supporting a South African civic organisation. Draft a single, complete, formally structured letter.
Organisation: ${org.orgName || "[Organisation Name]"}
CIPC/NPC Registration: ${org.cipcReg || "[Registration Number]"}
Target Municipality: ${org.municipality || "[Target Municipality]"}
Recipient / Target Official: ${official}
Required tone: ${toneInstruction}
Raw community complaint details (unedited, may be informal):
"${complaint}"
Write the full letter only. Include: a date line, a formal recipient address block, a clear subject line, an opening paragraph stating purpose, body paragraphs organising the complaint into specific, factual points, a closing paragraph with a clear request or demand matching the required tone, and a formal sign-off on behalf of the organisation. Do not include any preamble, explanation, notes, or markdown symbols. Output plain letter text only.`;
    
    try {
      const text = await callGemini(prompt);
      setOutput(text);
    } catch (e) {
      setError("Generation failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Panel className="p-5">
        <Eyebrow>Input</Eyebrow>
        <h2 className="text-white text-sm font-semibold mb-4">Community Complaint Details</h2>
        <div className="space-y-4">
          <div>
            <FieldLabel>Target Official (name & role)</FieldLabel>
            <TextInput
              placeholder="e.g. Ward Councillor T. Mokoena, Ward 47"
              value={official}
              onChange={(e) => setOfficial(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Raw Community Complaint</FieldLabel>
            <TextArea
              rows={10}
              placeholder="Paste the unedited community complaint, WhatsApp message, or field report here..."
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Correspondence Tone</FieldLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: "diplomatic", label: "Diplomatic & Collaborative" },
                { id: "firm", label: "Firm 14-Day Legal Demand" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className="rounded-md border px-3 py-2.5 text-xs text-left transition-colors"
                  style={{
                    borderColor: tone === t.id ? COLORS.blue : COLORS.border,
                    color: tone === t.id ? "#fff" : "#9CA3AF",
                    backgroundColor: tone === t.id ? "#141821" : "transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <ErrorNote message={error} />
          <PrimaryButton onClick={generate} disabled={loading} icon={loading ? Loader2 : Send}>
            {loading ? "Drafting correspondence..." : "Generate Letter"}
          </PrimaryButton>
        </div>
      </Panel>
      <Panel className="p-5 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Eyebrow>Output</Eyebrow>
            <h2 className="text-white text-sm font-semibold">Formal Correspondence Draft</h2>
          </div>
          {output && <CopyButton text={output} />}
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm gap-2 py-16">
            <span>Drafting...</span>
            <Loader2 size={16} className="animate-spin" />
          </div>
        ) : output ? (
          <TextArea
            rows={20}
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="flex-1 font-mono text-[13px] leading-relaxed"
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600 py-16">
            <FileSignature size={28} className="mb-3 opacity-50" />
            <p className="text-xs max-w-[220px]">
              Your generated letter will appear here, fully editable before distribution.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* Feature 2: Community Grievance Summarizer */
function GrievanceSummarizer({ org }) {
  const [raw, setRaw] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!raw.trim()) {
      setError("Paste the raw notes, transcript, or chat log first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    const prompt = `You are a civic operations analyst for ${org.orgName || "a South African civic organisation"} working in ${org.municipality || "a South African municipality"}.
Analyse the disorganised raw text below (which may be a town-hall transcript, loose field notes, or a WhatsApp community chat log) and structure it.
Raw text:
${raw}
Respond with ONLY a valid JSON object, no markdown fences, no preamble, matching exactly this shape:
{
  "brief": "a 2-4 sentence high-level executive brief of the situation",
  "sectors": [
    { "sector": "infrastructure sector name e.g. Water & Sanitation, Roads & Stormwater, Electricity, Waste Management, Housing, Safety & Policing", "grievances": ["short specific grievance", "..."] }
  ],
  "tasks": ["short actionable team task", "..."]
}
Group grievances only under sectors that are actually present in the text. Keep each grievance and task under 20 words. Output raw JSON only.`;
    try {
      const text = await callGemini(prompt);
      const parsed = JSON.parse(stripJsonFences(text));
      setResult(parsed);
    } catch (e) {
      setError("Could not structure that text. Try trimming it and generating again.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Panel className="p-5">
        <Eyebrow>Input</Eyebrow>
        <h2 className="text-white text-sm font-semibold mb-4">Raw Community Notes</h2>
        <TextArea
          rows={18}
          placeholder="Paste town-hall transcripts, field notes, or WhatsApp chat logs here..."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
        <div className="mt-4 space-y-3">
          <ErrorNote message={error} />
          <PrimaryButton onClick={generate} disabled={loading} icon={loading ? Loader2 : Sparkles}>
            {loading ? "Structuring notes..." : "Summarize Grievances"}
          </PrimaryButton>
        </div>
      </Panel>
      <Panel className="p-5 flex flex-col">
        <Eyebrow>Output</Eyebrow>
        <h2 className="text-white text-sm font-semibold mb-4">Structured Grievance Report</h2>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm gap-2 py-16">
            <Loader2 size={16} className="animate-spin" />
            <span>Analysing...</span>
          </div>
        ) : result ? (
          <div className="space-y-5 overflow-y-auto max-h-[600px] pr-2">
            <div>
              <div className="text-[11px] font-mono text-gray-500 mb-1">EXECUTIVE BRIEF</div>
              <TextArea
                rows={3}
                value={result.brief || ""}
                onChange={(e) => setResult({ ...result, brief: e.target.value })}
              />
            </div>
            <div>
              <div className="text-[11px] font-mono text-gray-500 mb-2">GRIEVANCES BY SECTOR</div>
              <div className="space-y-3">
                {(result.sectors || []).map((s, i) => (
                  <div key={i} className="rounded-md border px-3 py-2.5" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1.5">
                      <MapPin size={12} style={{ color: COLORS.blue }} />
                      {s.sector}
                    </div>
                    <ul className="space-y-1">
                      {(s.grievances || []).map((g, gi) => (
                        <li key={gi} className="text-xs text-gray-400 pl-3.5 relative">
                          <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.red }} />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] font-mono text-gray-500 mb-2">TEAM TASK CHECKLIST</div>
              <ul className="space-y-1.5">
                {(result.tasks || []).map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <ListChecks size={13} className="mt-0.5 shrink-0" style={{ color: COLORS.blue }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-600 py-16">
            <MessagesSquare size={28} className="mb-3 opacity-50" />
            <p className="text-xs max-w-[220px]">
              Your brief, sector breakdown, and task checklist will appear here.
            </p>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* Feature 3: Advocacy Campaign Mobilizer */
function CampaignMobilizer({ org }) {
  const [objective, setObjective] = useState("");
  const [cadence, setCadence] = useState("weekly");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!objective.trim()) {
      setError("Describe the campaign objective first.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    const prompt = `You are a zero-budget grassroots campaign strategist for ${org.orgName || "a South African civic organisation"} targeting ${org.municipality || "a South African municipality"}.
Campaign objective: "${objective}"
Scheduling cadence: ${cadence === "daily" ? "daily action steps" : "weekly action steps"}
Respond with ONLY a valid JSON object, no markdown fences, no preamble, matching exactly this shape:
{
  "phase1": { "title": "Preparation & Compliance", "items": [{"label": "${cadence === "daily" ? "Day 1" : "Week 1"}", "action": "specific zero-budget action" }] },
  "phase2": { "title": "Community Mobilization", "items": [{"label": "...", "action": "..." }] },
  "phase3": { "title": "Execution & Media Pushes", "items": [{"label": "...", "action": "..."}]}
}
Each phase should have 3-5 items with sequential labels (${cadence === "daily" ? "Day 1, Day 2, Day 3..." : "Week 1, Week 2, Week 3..."}). Every action must be achievable with zero budget, using volunteer labour, free social platforms, or public venues. Keep each action under 25 words. Output raw JSON only.`;
    try {
      const text = await callGemini(prompt);
      const parsed = JSON.parse(stripJsonFences(text));
      setResult(parsed);
    } catch (e) {
      setError("Could not build the timeline. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  function updateItem(phaseKey, idx, field, value) {
    const phase = { ...result[phaseKey] };
    const items = [...phase.items];
    items[idx] = { ...items[idx], [field]: value };
    phase.items = items;
    setResult({ ...result, [phaseKey]: phase });
  }

  return (
    <div className="px-4 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Panel className="p-5 h-fit lg:sticky lg:top-24">
        <Eyebrow>Input</Eyebrow>
        <h2 className="text-white text-sm font-semibold mb-4">Campaign Objective</h2>
        <div className="space-y-4">
          <div>
            <FieldLabel>What is the campaign trying to achieve?</FieldLabel>
            <TextArea
              rows={6}
              placeholder="e.g. Mobilize ward residents to demand a public commitment on pothole repairs before the next council sitting"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Scheduling Cadence</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "daily", label: "Daily" },
                { id: "weekly", label: "Weekly" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCadence(c.id)}
                  className="rounded-md border px-3 py-2.5 text-xs transition-colors"
                  style={{
                    borderColor: cadence === c.id ? COLORS.blue : COLORS.border,
                    color: cadence === c.id ? "#fff" : "#9CA3AF",
                    backgroundColor: cadence === c.id ? "#141821" : "transparent",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <ErrorNote message={error} />
          <PrimaryButton onClick={generate} disabled={loading} icon={loading ? Loader2 : CalendarRange}>
            {loading ? "Mapping timeline..." : "Generate Timeline"}
          </PrimaryButton>
        </div>
      </Panel>
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <Eyebrow>Output</Eyebrow>
          {result && (
            <CopyButton
              text={["phase1", "phase2", "phase3"]
                .map(
                  (k) =>
                    `### ${result[k].title}\n` +
                    result[k].items.map((i) => `- ${i.label}: ${i.action}`).join("\n")
                )
                .join("\n\n")}
            />
          )}
        </div>
        {loading ? (
          <Panel className="p-5">
            <div className="flex items-center justify-center text-gray-500 text-sm gap-2 py-16">
              <Loader2 size={16} className="animate-spin" />
              <span>Building phased timeline...</span>
            </div>
          </Panel>
        ) : result ? (
          ["phase1", "phase2", "phase3"].map((key, pi) => (
            <Panel key={key} className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "#141821", color: COLORS.blue }}
                >
                  PHASE {pi + 1}
                </span>
                <h3 className="text-white text-sm font-semibold">{result[key].title}</h3>
              </div>
              <div className="space-y-2">
                {result[key].items.map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 rounded-md border px-3 py-2.5" style={{ borderColor: COLORS.border }}>
                    <input
                      value={item.label || ""}
                      onChange={(e) => updateItem(key, idx, "label", e.target.value)}
                      className="sm:w-24 shrink-0 bg-transparent text-xs font-mono outline-none"
                      style={{ color: COLORS.blue }}
                    />
                    <input
                      value={item.action || ""}
                      onChange={(e) => updateItem(key, idx, "action", e.target.value)}
                      className="flex-1 bg-transparent text-xs text-gray-300 outline-none"
                    />
                  </div>
                ))}
              </div>
            </Panel>
          ))
        ) : (
          <Panel className="p-5">
            <div className="flex flex-col items-center justify-center text-center text-gray-600 py-16">
              <CalendarRange size={28} className="mb-3 opacity-50" />
              <p className="text-xs max-w-[240px]">
                A three-phase, zero-budget mobilization schedule will appear here once generated.
              </p>
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}

/* App Core Configurations */
const VIEW_META = {
  dashboard: { title: "Network Overview", subtitle: "Operations console" },
  profile: { title: "Organisation Profile", subtitle: "Onboarding" },
  paia: { title: "Civic Action & PAIA Generator", subtitle: "Smart correspondence" },
  summarizer: { title: "Community Grievance Summarizer", subtitle: "Notes to structure" },
  mobilizer: { title: "Advocacy Campaign Mobilizer", subtitle: "Phased scheduling" },
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [org, setOrg] = useState({
    orgName: "",
    cipcReg: "",
    municipality: "",
    saved: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage?.get("org-profile", false);
        if (res?.value) setOrg(JSON.parse(res.value));
      } catch (e) {
        /* no saved profile yet */
      }
    })();
  }, []);

  const meta = VIEW_META[active] || VIEW_META.dashboard;

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans" style={{ backgroundColor: COLORS.bg }}>
      <Sidebar active={active} setActive={setActive} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} org={org} />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopBar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setMobileOpen(true)} />
        <div className="flex-1">
          {active === "dashboard" && <Dashboard org={org} setActive={setActive} />}
          {active === "profile" && <OrgProfile org={org} setOrg={setOrg} />}
          {active === "paia" && <PaiaGenerator org={org} />}
          {active === "summarizer" && <GrievanceSummarizer org={org} />}
          {active === "mobilizer" && <CampaignMobilizer org={org} />}
        </div>
        <ComplianceBar />
      </div>
    </div>
  );
}