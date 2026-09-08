# Recruiter Draft Copilot

A human-in-the-loop AI workflow that turns recruiter job posts into tailored Gmail drafts using a Chrome Extension, OpenAI, OAuth 2.0, and the Gmail API.

---

## Why I Built This

During my job search, I noticed a repetitive workflow:

1. Find a recruiter post on LinkedIn
2. Copy the job description
3. Paste it into ChatGPT
4. Ask for a tailored outreach email
5. Copy the response
6. Open Gmail
7. Add the recruiter email
8. Add a subject line
9. Attach the appropriate resume
10. Send

None of these steps was difficult on its own.

But repeating them across multiple recruiter posts created unnecessary friction.

So I asked a simple product question:

> **What is the smallest AI workflow I can build that removes repetitive work without removing human judgment?**

That became **Recruiter Draft Copilot**.

---

## Product Goal

Reduce the manual effort required to create personalized recruiter outreach while keeping the user in control of the final application.

The system automates:

- Recruiter post extraction
- Recruiter email extraction
- Role and location identification
- Candidate-to-job matching
- Tailored email generation
- Subject-line generation
- Recruiter-friendly email formatting
- Gmail draft creation

The user still decides:

- Which recruiter post to act on
- Whether the generated draft is appropriate
- Which resume version to attach
- Whether to send the email

This human-in-the-loop boundary was intentional.

---

## User Workflow

```text
LinkedIn recruiter post
        ↓
User highlights relevant text
        ↓
Chrome Extension
        ↓
OpenAI API
        ↓
Candidate profile grounding
        ↓
Role match + tailored outreach
        ↓
Human preview
        ↓
Google OAuth 2.0
        ↓
Gmail API
        ↓
Rich-text Gmail draft
        ↓
User attaches resume
        ↓
User sends
```

---

## How It Works

### 1. Chrome Extension

The extension adds a context-menu action:

**Create Recruiter Draft**

The user highlights a recruiter post on LinkedIn and triggers the extension.

Only the text explicitly selected by the user is processed.

This avoids unnecessary background scraping and keeps the user in control of the workflow.

---

### 2. Candidate Profile Grounding

The application uses a locally stored candidate profile containing information such as:

- Work experience
- Product and program management skills
- Technical skills
- AI / GenAI capabilities
- Relevant projects
- Work authorization
- Location rules
- Recruiter email preferences

This profile acts as the source of truth for generation.

The model is explicitly instructed not to invent unsupported experience.

---

### 3. OpenAI Integration

The selected recruiter post and candidate profile are sent to the OpenAI API.

The model generates:

- Match score
- Recruiter email
- Job title
- Location
- Subject line
- Tailored recruiter email

The prompt also includes rules for:

- Experience accuracy
- JD-specific positioning
- Location handling
- Recruiter-friendly structure
- Avoiding unnecessary self-rejection
- Concise, scannable writing
- Role-specific skill prioritization

---

### 4. Preview Layer

Before anything is created in Gmail, the user sees a preview containing:

- Match score
- Recruiter email
- Job title
- Location
- Subject
- Full email body

This is the human-review checkpoint.

The user can validate the output before moving forward.

---

### 5. Google OAuth 2.0

The extension authenticates with Google using OAuth 2.0.

The user explicitly authorizes Gmail access.

The application also verifies the authenticated Gmail account before creating the draft.

This prevents the extension from accidentally creating recruiter outreach from the wrong signed-in Google account.

---

### 6. Gmail API

After user approval, the extension creates a real Gmail draft using the Gmail API.

The email body is converted to HTML to improve recruiter readability through:

- Bold section headings
- Bold skill labels
- Structured bullets
- Clean spacing
- Clickable GitHub links
- Professional signature formatting

The system does **not** automatically send the email.

The user attaches the correct resume and presses **Send** manually.

---

## Example Email Structure

The generated recruiter outreach follows a scannable format similar to:

```text
Hi,

I hope you're doing well. I came across your requirement for the
AI Product Manager position and would like to submit my profile
for consideration.

[Short role-specific introduction]

Highlights Relevant to the Role

- AI Product Management: ...
- Generative AI & LLMs: ...
- Agentic AI: ...
- AI Governance: ...
- AWS / Cloud: ...
- Agile Product Delivery: ...
- Stakeholder Management: ...

Current Location: ...
Relocation: ...
Visa Status: ...
Availability: ...

I've attached my updated resume for your consideration.

GitHub – AI & Technical Product Portfolio:
...

[Short value proposition]

I would welcome the opportunity to discuss the requirement
and next steps.

Best regards,
Candidate Name
```

---

## Why Human-in-the-Loop?

I deliberately chose not to automate the final Send action.

Recruiter outreach contains contextual decisions that an AI system may not fully understand:

- A recruiter may have special submission instructions
- A role may have a strict location requirement
- Different opportunities may require different resume versions
- The generated message may require a small edit
- Sending an incorrect application has a real-world consequence

So the product boundary became:

> **AI prepares. Human reviews and sends.**

For me, this was one of the most important product decisions in the project.

---

## Tech Stack

- JavaScript
- Chrome Extension Manifest V3
- OpenAI API
- Gmail API
- Google OAuth 2.0
- HTML / CSS
- Chrome Storage API
- Gmail MIME / HTML email formatting

---

## Architecture

```text
┌──────────────────────────┐
│ LinkedIn Recruiter Post  │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ User Highlights Text     │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Chrome Extension         │
│ Context Menu             │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ OpenAI API               │
│                         │
│ Recruiter Post           │
│ + Candidate Profile      │
│ + Prompt Rules           │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ AI Output                │
│                         │
│ Match Score              │
│ Recruiter Email          │
│ Job Title                │
│ Location                 │
│ Subject                  │
│ Email Body               │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Human Preview            │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Google OAuth 2.0         │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ Gmail API                │
│ Creates Rich Draft       │
└─────────────┬────────────┘
              │
              ▼
┌──────────────────────────┐
│ User Attaches Resume     │
│ + Reviews Draft          │
│ + Sends                  │
└──────────────────────────┘
```

---

## Key Product Decisions

### 1. Selected Text Instead of Automated LinkedIn Scraping

The extension processes only the recruiter post that the user explicitly highlights.

Why:

- Keeps user intent explicit
- Reduces unnecessary automation
- Avoids processing irrelevant feed content
- Creates a simple and understandable interaction model

---

### 2. Candidate Profile Grounding

A generic LLM prompt produced generic recruiter outreach.

Adding a structured candidate profile significantly improved:

- Relevance
- Accuracy
- Consistency
- Role positioning

It also provided a clear source of truth for the model.

---

### 3. Preview Before Gmail

The system does not immediately create or send an email after generation.

The user first reviews:

- Match score
- Role
- Recruiter email
- Subject
- Draft

This gives the user a clear opportunity to catch errors.

---

### 4. Gmail Draft Instead of Auto-Send

I intentionally automated draft creation rather than sending.

The highest-consequence action remains manual.

This makes the system useful without turning it into an uncontrolled application bot.

---

### 5. Narrow Gmail Permission

The Gmail integration uses OAuth rather than storing Gmail passwords.

The app requests Gmail access required for draft creation rather than treating Gmail credentials as application data.

---

### 6. Private Local Candidate Profile

The actual candidate profile and API key are intentionally excluded from the public repository.

The public repo contains example configuration files instead.

---

## Security & Privacy

Sensitive files are excluded from Git through `.gitignore`.

The public repository does **not** contain:

- OpenAI API keys
- Personal candidate profile
- Downloaded Google credential files
- Environment secrets

Instead, the repository contains:

```text
config.example.js
profile.example.js
```

Users create their own local versions:

```text
config.js
profile.js
```

---

## Project Structure

```text
recruiter-draft-copilot/
│
├── background.js
├── manifest.json
├── preview.html
├── preview.js
│
├── config.example.js
├── profile.example.js
│
├── .gitignore
├── .gitattributes
│
└── README.md
```

Local-only files excluded from Git:

```text
config.js
profile.js
```

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Bhaghi-code/recruiter-draft-copilot.git
```

---

### 2. Configure OpenAI

Copy:

```text
config.example.js
```

to:

```text
config.js
```

Add your own OpenAI API key.

Example:

```javascript
const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE";
```

Never commit your real API key.

---

### 3. Configure Candidate Profile

Copy:

```text
profile.example.js
```

to:

```text
profile.js
```

Customize it with your own:

- Experience
- Skills
- Projects
- Location
- Work authorization
- Recruiter email preferences

---

### 4. Configure Google Cloud

Create a Google Cloud project and:

1. Enable the Gmail API
2. Configure Google Auth Platform
3. Create an OAuth client for the Chrome Extension
4. Add the required Gmail scope
5. Add yourself as a test user during development
6. Add the OAuth client ID to `manifest.json`

---

### 5. Load the Extension in Chrome

Open:

```text
chrome://extensions
```

Then:

1. Enable **Developer mode**
2. Click **Load unpacked**
3. Select the project directory

---

## Current Capabilities

- Highlight recruiter posts on LinkedIn
- Trigger AI generation through a Chrome context menu
- Extract recruiter email
- Identify job title and location
- Generate a candidate-to-role match score
- Create JD-specific recruiter outreach
- Ground generation in candidate profile
- Apply location and work-authorization rules
- Preview generated output
- Authenticate with Google OAuth
- Verify the connected Gmail account
- Create rich-text Gmail drafts
- Keep final Send action manual

---

## What I Learned

### AI Value Often Comes From Workflow Compression

Every individual step in this workflow already existed.

The value came from connecting them into one coherent experience.

---

### Prompting Alone Wasn't Enough

A generic prompt generated acceptable but inconsistent outreach.

Grounding the model in a structured candidate profile materially improved the quality of the result.

---

### AI Product Quality Includes Deterministic Software

The LLM generates the content, but the rest of the experience depends on:

- Browser events
- Parsing
- Authentication
- API calls
- Error handling
- State management
- HTML email formatting

The AI model is only one component of the product.

---

### Tool Use Changes the Product

Before Gmail integration, the system generated content.

After Gmail integration, it could complete a meaningful part of the user's workflow.

That changed the product from:

**AI writer**

to:

**AI workflow copilot**

---

### Human Approval Boundaries Matter

The most important question was not:

> What can I automate?

It was:

> Where should automation stop?

Keeping resume selection and Send manual created a practical boundary between efficiency and user control.

---

### OAuth Is a Product Experience

OAuth initially looked like an implementation detail.

In practice, it affects:

- Trust
- Permissions
- Account selection
- Security
- User confidence

Authentication design is part of the user experience.

---

## Next Iterations

### Structured AI Output

The current version parses numbered model output.

A future version will use structured JSON output such as:

```json
{
  "match_score": 9,
  "recruiter_email": "recruiter@example.com",
  "job_title": "AI Product Manager",
  "location": "Atlanta, GA",
  "subject": "Application – AI Product Manager | GenAI | C2C",
  "email_body": "..."
}
```

This would make the integration more deterministic and reduce fragile text parsing.

---

### Editable Preview

Allow the user to directly modify:

- Subject
- Recruiter email
- Location
- Email body

before creating the Gmail draft.

---

### Resume Selection

Allow the user to maintain multiple resume versions and choose one directly from the workflow.

For example:

- AI Product Manager Resume
- Technical Product Manager Resume
- Program Manager Resume
- Product Owner Resume

---

### Role-Specific Prompt Profiles

Different templates could be applied automatically for:

- AI Product Manager
- Technical Product Manager
- Product Owner
- Technical Program Manager
- Project Manager

---

### Match Explainability

Instead of only:

```text
9/10
```

the system could show:

```text
Strong alignment:
✓ GenAI
✓ Product Roadmaps
✓ APIs
✓ AWS
✓ Agile

Potential gap:
△ Industry domain preference
```

---

### Product Analytics

A future version could measure:

- Drafts created
- Drafts sent
- Average draft edit rate
- Time saved
- Applications completed per session

---

## Metrics I Would Track

If this were developed beyond an MVP, I would measure:

### Efficiency

- Average time per recruiter application
- Applications completed per hour
- Time saved versus manual workflow

### AI Quality

- Recruiter email extraction accuracy
- Subject edit rate
- Email body edit rate
- Match-score usefulness

### Workflow Reliability

- Successful OpenAI request rate
- Successful OAuth authentication rate
- Successful Gmail draft creation rate

### User Control

- Percentage of drafts edited before send
- Percentage of generated drafts ultimately sent
- Reasons users discard a generated draft

---

## Product Status

**Working MVP**

The workflow has been tested end-to-end:

```text
LinkedIn selection
→ AI analysis
→ Candidate-profile grounding
→ Recruiter outreach generation
→ Human preview
→ OAuth
→ Gmail API
→ Rich-text draft
→ Resume attachment
→ Manual send
```

The extension has also been used in a real recruiter-outreach workflow rather than only as a demo prototype.

---

## Author

**Bhaghirathi Kundu**

AI Product Management | Technical Product Management | GenAI Products

GitHub:  
https://github.com/Bhaghi-code