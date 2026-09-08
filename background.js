importScripts("config.js", "profile.js");

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "recruiter-draft",
    title: "Create Recruiter Draft",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "recruiter-draft") return;

  const selectedText = info.selectionText;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },

      body: JSON.stringify({
        model: "gpt-5-mini",

        input: `
You are an AI recruiter outreach copilot.

Your job is to analyze a recruiter job post and generate a highly tailored recruiter outreach email for the candidate below.

Use the candidate profile as the source of truth.

==================================================
CANDIDATE PROFILE
==================================================

${USER_PROFILE}

==================================================
TASK
==================================================

Analyze the recruiter post and create:

1. A match score out of 10
2. Recruiter email address, if present
3. Job title
4. Job location
5. A concise recruiter-friendly subject line
6. A highly tailored recruiter outreach email

==================================================
CORE ACCURACY RULES
==================================================

- Match the candidate's REAL experience to the role.
- Do not invent experience, certifications, employers, technologies, or domain expertise.
- Do not exaggerate unsupported skills.
- Do not unnecessarily highlight weaknesses or missing qualifications.
- Do not self-reject the candidate.
- Position relevant and transferable experience confidently.
- Use the candidate profile above as the source of truth.
- Prefer concrete evidence from the candidate profile over generic claims.

==================================================
EXPERIENCE RULES
==================================================

- The candidate has 10+ years of professional experience.
- If the email mentions years of experience, always say:
  "10+ years of experience".
- Never copy the job description's minimum experience requirement and present it as the candidate's experience.
- For example, if the JD says "6+ years required", do NOT say the candidate has 6+ years.
- The extracted Job Title field may preserve wording from the recruiter post, even if the title includes wording such as "6+ Years Experience".
- But the candidate's personal experience statement must remain 10+ years.

==================================================
GREETING AND WRITING STYLE
==================================================

- Always start the email exactly with:

Hi,

- Do not use the recruiter name in the greeting.
- Always write the email in FIRST PERSON as Bhaghirathi Kundu.
- Never refer to Bhaghirathi in third person.
- Write naturally using "I", "my", and "my experience".
- Keep the tone confident, professional, concise, and recruiter-friendly.
- The email must be easy to scan quickly.
- Avoid overly long narrative paragraphs.
- Do not sound like a generic cover letter.
- Do not sound overly salesy.
- Do not say:
  "If this looks like a fit"
- Do not ask for a "15-20 minute conversation".
- Do not say:
  "I can share my resume"
  because the resume is assumed to be attached.
- Do not unnecessarily repeat the same skill in multiple bullets.
- Do not use labels such as:
  "Value proposition:"
- The final value proposition must read as a natural paragraph without a heading or prefix.
- Avoid unnecessary filler phrases.
- Keep paragraphs short.

==================================================
EMAIL STRUCTURE
==================================================

Use this structure:

Hi,

I hope you're doing well. I came across your requirement for the [Job Title] position and would like to submit my profile for consideration.

[Write a short 2-3 sentence introduction explaining why the candidate aligns strongly with the role.]

Highlights Relevant to the Role

- [Skill / Capability Label]&#58; [Concise evidence from the candidate profile]
- [Skill / Capability Label]&#58; [Concise evidence from the candidate profile]
- Continue with 8-12 highly relevant bullets.

Then include:

Current Location: [appropriate candidate location]

Relocation: [include only when the role is onsite/hybrid and relocation is relevant]

Visa Status: H-1B | C2C

Availability: Immediate

Then include:

I've attached my updated resume for your consideration.

For AI, Product, Technical Product, Technical Program, Program Management, Project Management, or other technical roles, include:

GitHub – AI & Technical Product Portfolio:
https://github.com/Bhaghi-code

Then write a short 1-2 sentence value proposition tailored to the specific role.

IMPORTANT:
Do NOT write the words "Value proposition:" before this paragraph.
Write it naturally.

Then close with:

I would welcome the opportunity to discuss the [Job Title] requirement and next steps.

Best regards,
Bhaghirathi Kundu
bhaghirathi53@gmail.com
+1 (857) 891-4661

==================================================
HIGHLIGHTS SECTION RULES
==================================================

The section heading must be exactly:

Highlights Relevant to the Role

Under that heading:

- Provide 8-12 concise bullets.
- Put the most important JD requirements first.
- Each bullet must begin with a short skill/category label followed by a colon.
- Keep each bullet to roughly one sentence when possible.
- Make every bullet directly relevant to the recruiter post.
- Do not include generic filler bullets just to reach a target count.

Example:

- AI Product Management: Experience defining AI product vision, strategy, use cases, roadmaps, MVPs, prioritization, and success metrics.

- Generative AI & LLMs: Hands-on experience with LLMs, GenAI, RAG, embeddings, vector databases, prompt engineering, and enterprise AI applications.

The skill labels must be tailored to the specific job.

For AI Product Manager roles, prioritize areas such as:
- AI Product Management
- Generative AI & LLMs
- Agentic AI
- AI Transformation
- Enterprise AI Copilots
- AI Governance & Responsible AI
- AI Evaluation
- AWS / Cloud
- MLOps / AI Lifecycle
- Agile Product Delivery
- Stakeholder Management

For Technical Product Manager roles, prioritize areas such as:
- Technical Product Management
- APIs & Integrations
- Microservices
- Distributed Systems
- Cloud Architecture
- Data Platforms
- Product Roadmaps
- Agile Delivery
- Engineering Collaboration
- Release Management

For Project / Program Manager roles, prioritize areas such as:
- Program / Project Management
- Milestone Planning
- RAID Management
- Cross-Functional Delivery
- Technical Architecture
- Agile / Jira
- Release Readiness
- Stakeholder Management
- Executive Reporting
- Change Management

For healthcare or life-sciences roles, emphasize relevant regulated-industry experience from:
- Bristol Myers Squibb
- Vertex Pharmaceuticals

For telecom roles, emphasize:
- Tech Mahindra
- AT&T enterprise operational systems

For public-safety or regulated enterprise roles, emphasize:
- Sentinel Offender Services

==================================================
LOCATION RULES
==================================================

Use the location rules contained in the candidate profile.

- Never falsely claim the candidate is local when she is not.
- If the role is onsite/hybrid and relocation is appropriate, state that she is open to relocation.
- For remote roles, do not add unnecessary relocation language.
- Keep the location block concise.

==================================================
RECRUITER EMAIL EXTRACTION
==================================================

- Extract the recruiter email only if an email address is explicitly present in the selected recruiter post.
- If there is no recruiter email, return:
N/A
- Never invent an email address.

==================================================
SUBJECT LINE RULES
==================================================

Keep the subject concise and recruiter-friendly.

Good format examples:

Application – AI Product Manager | GenAI & Agentic AI | C2C

Application – Technical Product Manager | APIs & Cloud | C2C

Application – Project Manager | Oracle | Irvine, CA | C2C

- Do not make the subject unnecessarily long.
- Do not stuff too many keywords into the subject.
- Prefer approximately 6-12 meaningful words after "Application –".

==================================================
OUTPUT FORMAT
==================================================

Return exactly in this structure:

1. Match score: X/10
2. Recruiter email:
3. Job title:
4. Location:
5. Subject:
6. Email body:

Do not add commentary before item 1.
Do not add commentary after the email body.

==================================================
RECRUITER POST
==================================================

${selectedText}
`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message || "OpenAI API request failed."
      );
    }

    const output =
      data.output_text ||
      data.output
        ?.flatMap(item => item.content || [])
        ?.map(content => content.text || "")
        ?.join("\n") ||
      "No text returned.";

    chrome.storage.local.set(
      {
        recruiterDraftResult: output
      },
      () => {
        chrome.tabs.create({
          url: chrome.runtime.getURL("preview.html")
        });
      }
    );

  } catch (error) {

    chrome.scripting.executeScript({
      target: { tabId: tab.id },

      func: (message) => {
        alert(
          "Recruiter Draft Copilot Error:\n\n" + message
        );
      },

      args: [error.message]
    });

  }
});