# WhatsApp Business Setup Guide for INZAG ETS

A comprehensive, step-by-step guide for setting up WhatsApp Business to engage African businesses seeking European government-backed equipment financing.

---

## Table of Contents

1. [WhatsApp Business App Setup (Free, Immediate)](#1-whatsapp-business-app-setup-free-immediate)
2. [Auto-Reply Configuration](#2-auto-reply-configuration)
3. [Recommended Next Step: WATI for Automated Flows](#3-recommended-next-step-wati-wateam-for-automated-flows)
4. [Conversation Flows (for WATI or Similar)](#4-conversation-flows-for-wati-or-similar)
5. [Template Messages for API Approval](#5-template-messages-for-api-approval)
6. [CRM Integration Approach](#6-crm-integration-approach)
7. [Cost Estimate](#7-cost-estimate)

---

## 1. WhatsApp Business App Setup (Free, Immediate)

### Step 1: Download and Install

1. Download **WhatsApp Business** (not regular WhatsApp) from the Google Play Store or Apple App Store.
2. Use a dedicated business phone number for INZAG ETS. Do not use a personal number.
3. Verify the phone number via SMS or phone call.

### Step 2: Set Up the Business Profile

Navigate to **Settings > Business tools > Business profile** and fill in the following:

| Field              | Value                                                                 |
|--------------------|-----------------------------------------------------------------------|
| **Business Name**  | INZAG ETS                                                             |
| **Category**       | Financial Services (or Business Service)                              |
| **Description**    | We help African businesses access European government-backed equipment financing (ECA financing) at 4-7% interest rates. Mining, construction, manufacturing, energy, and logistics equipment from European manufacturers with 5-8 year repayment terms and only 15% down payment. |
| **Address**        | Taunusstraße 5, 65183 Wiesbaden, Germany                              |
| **Email**          | ETS@INZAG.de                                                          |
| **Website**        | *(Enter the INZAG ETS website URL when available)*                    |

### Step 3: Set Business Hours

Navigate to **Settings > Business tools > Business profile > Business hours**:

- **Monday to Friday:** 9:00 AM - 6:00 PM (CET, Frankfurt time)
- **Saturday:** Closed (or 10:00 AM - 2:00 PM if weekend support is planned)
- **Sunday:** Closed

### Step 4: Add a Catalog (Optional but Recommended)

Create catalog entries for key service offerings:

1. **ECA Equipment Financing** - Government-backed financing at 4-7% interest rates
2. **Financing Readiness Assessment** - Free assessment of your eligibility
3. **Savings Comparison Report** - See how much you save vs. local bank rates

---

## 2. Auto-Reply Configuration

### Greeting Message

Navigate to **Settings > Business tools > Greeting message** and enable it.

**Send to:** Everyone
**Message:**

```
Welcome to INZAG ETS!

European equipment financing for African businesses — government-backed, 4-7% rates, 5-8 year terms, only 15% down.

How can we help?
1 - Check if you qualify
2 - See interest rates & terms
3 - Learn how it works
4 - Talk to our team

Just reply with a number or type your question!
```

### Away Message

Navigate to **Settings > Business tools > Away message** and enable it.

**Schedule:** Outside of business hours
**Message:**

```
Thanks for reaching out to INZAG ETS. We're currently away but will respond within 1 business day. For urgent inquiries, email ETS@INZAG.de
```

### Quick Replies

Navigate to **Settings > Business tools > Quick replies** and create the following. Each quick reply is triggered by typing `/` followed by the shortcut keyword.

#### /qualify

```
To qualify for ECA financing, you typically need: 5+ years in operation, $20M+ annual revenue, hard currency income, and equipment needs of $2-15M from European manufacturers.

Want us to run a quick eligibility check? Just share:
1. Your company name and country
2. Industry/sector
3. Years in operation
4. Approximate annual revenue
5. What equipment you need
```

#### /rates

```
ECA-backed financing offers 4-7% interest rates with 5-8 year terms and only 15% down payment, compared to 10-30% rates from local African banks.

Example: On a $5M equipment purchase, you could save $200K-$500K+ per year compared to local bank financing.

Would you like a personalized savings estimate?
```

#### /process

```
Our process:

1) Tell us your needs - What equipment, which manufacturer, how much
2) We source & structure - We find the best ECA program and European bank
3) ECA guarantees the loan - Government export credit agency backs the deal
4) European bank funds it - You get low interest rates (4-7%)
5) Equipment delivered - Directly from the European manufacturer

Timeline: 6-12 months from start to equipment delivery.

Ready to get started? Tell us about your equipment needs.
```

#### /sectors

```
We finance equipment for:

- Mining - Drilling rigs, excavators, processing plants
- Construction - Cranes, earthmoving, concrete plants
- Manufacturing - Production lines, CNC machines, packaging
- Energy & Utilities - Generators, turbines, transformers, solar
- Logistics & Transport - Trucks, port equipment, rail

Which sector is your business in?
```

#### /contact

```
Email: ETS@INZAG.de
Phone: +49 611 950014 66
Location: Taunusstraße 5, 65183 Wiesbaden, Germany
Hours: Mon-Fri, 9 AM - 6 PM CET

We typically respond within 1-2 business days.

You can also email us directly for detailed inquiries or to send documents.
```

---

## 3. Recommended Next Step: WATI (wa.team) for Automated Flows

### What Is WATI?

WATI is a WhatsApp Business API provider that lets you build automated chatbot flows, send broadcast messages, manage a shared team inbox, and integrate with CRMs. It sits on top of the official WhatsApp Business API (Meta Cloud API) and provides a no-code interface for building conversation automations.

### Why WATI?

- **No-code chatbot builder** - Create conversation flows without writing code
- **Broadcast messages** - Send approved template messages to segmented contact lists
- **Team inbox** - Multiple team members can respond from the same WhatsApp number
- **CRM integration** - Connect to HubSpot, Salesforce, Google Sheets, and more
- **Analytics** - Track response rates, conversation metrics, and agent performance

### Cost

| Plan         | Price          | Key Features                                      |
|--------------|----------------|---------------------------------------------------|
| **Starter**  | ~$40-50/month  | 1,000 conversations/month, basic chatbot, 5 users |
| **Pro**      | ~$100/month    | 5,000 conversations/month, advanced flows, API    |

The **Starter plan** is sufficient to begin with and covers the expected initial volume.

### Setup Steps

1. **Sign up at [wa.team](https://www.wati.io/)** - Create an account and choose the Starter plan.
2. **Connect your WhatsApp number** - WATI will guide you through connecting a phone number via the Meta Business Suite. Note: this number cannot simultaneously be used on the WhatsApp Business app. You will need to migrate the number or use a separate one.
3. **Verify your Meta Business account** - Meta requires business verification (business documents, website, etc.). This can take 1-7 days.
4. **Set up your profile** - Configure the same business profile details as listed in Section 1.
5. **Build conversation flows** - Use the no-code flow builder to create the flows described in Section 4.
6. **Submit template messages** - Submit the templates in Section 5 for Meta approval (usually approved within 24 hours).
7. **Connect CRM** - Integrate with HubSpot (see Section 6).
8. **Test thoroughly** - Send test messages, walk through every flow, and verify CRM data capture.

---

## 4. Conversation Flows (for WATI or Similar)

### Flow 1: Welcome Flow

This mirrors the website chatbot experience.

```
[User sends first message]
    |
    v
BOT: "Welcome to INZAG ETS! We help African businesses access European
      government-backed equipment financing at 4-7% interest rates.

      What would you like to do?
      1. Learn about ECA financing
      2. Check if I qualify
      3. Get a savings estimate
      4. Talk to someone"
    |
    +--> [1] Learn about ECA financing
    |        BOT: Sends /rates and /process quick reply content
    |        BOT: "Would you like to check if you qualify?"
    |             [Yes] --> Go to Qualification Flow
    |             [No]  --> "No problem! Feel free to reach out anytime."
    |
    +--> [2] Check if I qualify --> Go to Qualification Flow
    |
    +--> [3] Get a savings estimate
    |        BOT: "To prepare a savings estimate, please share:
    |              - Equipment type and approximate value
    |              - Your country
    |              - Current financing rate (if known)
    |              We'll send you a comparison within 2 business days."
    |        --> Capture responses --> Tag as "Calculator Request" in CRM
    |
    +--> [4] Talk to someone --> Go to Human Handoff Flow
```

### Flow 2: Qualification Flow

This mirrors the readiness assessment on the website.

```
BOT: "Let's check your eligibility. I'll ask a few quick questions."
    |
    v
BOT: "What is your company name?"
    --> [Capture: company_name]
    |
    v
BOT: "Which country are you based in?"
    --> [Capture: country]
    |
    v
BOT: "What industry/sector are you in?
      1. Mining
      2. Construction
      3. Manufacturing
      4. Energy & Utilities
      5. Logistics & Transport
      6. Other"
    --> [Capture: sector]
    |
    v
BOT: "How many years has your company been in operation?
      1. Less than 5 years
      2. 5-10 years
      3. 10-20 years
      4. 20+ years"
    --> [Capture: years_in_operation]
    |
    v
BOT: "What is your approximate annual revenue?
      1. Under $10M
      2. $10M - $20M
      3. $20M - $50M
      4. $50M - $100M
      5. Over $100M"
    --> [Capture: annual_revenue]
    |
    v
BOT: "Does your company earn income in hard currencies (USD, EUR, GBP)?
      1. Yes, primarily
      2. Yes, partially
      3. No"
    --> [Capture: hard_currency]
    |
    v
BOT: "What equipment do you need, and what is the approximate value?"
    --> [Capture: equipment_needs]
    |
    v
[Evaluate Responses]
    |
    +--> [Strong Fit: 5+ years, $20M+ revenue, hard currency, $2-15M equipment]
    |    BOT: "Great news! Based on your answers, you appear to be a
    |          STRONG fit for ECA financing. A member of our team will
    |          reach out within 1-2 business days to discuss next steps.
    |          Please share your email so we can send you more details."
    |    --> Capture email --> Create CRM lead (stage: Qualified)
    |
    +--> [Moderate Fit: some criteria met]
    |    BOT: "Based on your answers, there may be ECA financing options
    |          available to you. Our team will review your profile and
    |          reach out within 2 business days. Please share your email."
    |    --> Capture email --> Create CRM lead (stage: Assessment Needed)
    |
    +--> [Weak Fit: most criteria not met]
         BOT: "Based on your answers, standard ECA financing may not be
               the best fit right now. However, there may be other options.
               Would you like us to review your situation?
               1. Yes, please review
               2. No, thank you"
         --> [Yes] Capture email --> Create CRM lead (stage: Inquiry)
         --> [No] "Thank you for your interest! Feel free to reach out
                   anytime as your business grows."
```

### Flow 3: Calculator Request Flow

```
BOT: "I can help you estimate your savings with ECA financing."
    |
    v
BOT: "What type of equipment are you looking to finance?"
    --> [Capture: equipment_type]
    |
    v
BOT: "What is the estimated equipment cost (in USD)?"
    --> [Capture: equipment_cost]
    |
    v
BOT: "What interest rate does your local bank typically offer?"
    --> [Capture: local_rate] (or "I'm not sure")
    |
    v
BOT: "What repayment term are you looking for?
      1. 5 years
      2. 7 years
      3. 8 years
      4. Not sure"
    --> [Capture: term]
    |
    v
BOT: "Thanks! Here's a rough estimate:

      Equipment cost: $[equipment_cost]
      ECA rate: ~5.5% (indicative)
      Local bank rate: ~[local_rate or 18]%
      Term: [term] years

      Estimated annual savings: $[calculated_savings]

      Want a detailed, personalized comparison? Share your email
      and we'll send you a full report within 2 business days."
    --> Capture email --> Create CRM lead (stage: Calculator Request)
```

### Flow 4: Human Handoff Flow

```
BOT: "I'll connect you with a member of our team."
    |
    v
BOT: "To help us prepare, could you briefly describe your inquiry?"
    --> [Capture: inquiry_description]
    |
    v
BOT: "What is your preferred name and email?"
    --> [Capture: name, email]
    |
    v
BOT: "Thank you, [name]. A team member will respond within
      1-2 business days during our hours (Mon-Fri, 9 AM - 6 PM CET).
      For urgent matters, email ETS@INZAG.de directly."
    |
    v
[Assign conversation to team agent in WATI inbox]
[Create/update CRM lead]
```

---

## 5. Template Messages for API Approval

Template messages are pre-approved message formats required by Meta for sending outbound messages to users outside the 24-hour conversation window. These must be submitted through WATI (or your API provider) and approved by Meta before use.

### Template 1: Follow-Up After Initial Assessment

**Template Name:** `follow_up_assessment`
**Category:** Marketing
**Language:** English

```
Hi {{1}}, thank you for your interest in INZAG ETS equipment financing. Based on our initial assessment, your {{2}} project in {{3}} looks like a {{4}} fit for ECA financing. Would you like to schedule a call to discuss next steps?

Reply YES to schedule or NO if you're not interested at this time.
```

**Variable Mapping:**
- `{{1}}` - Contact first name
- `{{2}}` - Equipment type or project description (e.g., "mining equipment")
- `{{3}}` - Country (e.g., "Ghana")
- `{{4}}` - Fit level (e.g., "strong", "good", "promising")

**Example:**
> Hi James, thank you for your interest in INZAG ETS equipment financing. Based on our initial assessment, your mining equipment project in Ghana looks like a strong fit for ECA financing. Would you like to schedule a call to discuss next steps?

---

### Template 2: Savings Comparison

**Template Name:** `savings_comparison`
**Category:** Marketing
**Language:** English

```
Hi {{1}}, we've prepared a preliminary financing comparison for your {{2}} equipment purchase. Estimated monthly savings: {{3}} compared to local bank rates. Reply YES to receive the full breakdown.
```

**Variable Mapping:**
- `{{1}}` - Contact first name
- `{{2}}` - Equipment type (e.g., "construction")
- `{{3}}` - Estimated monthly savings (e.g., "$18,500/month")

**Example:**
> Hi Amina, we've prepared a preliminary financing comparison for your construction equipment purchase. Estimated monthly savings: $18,500/month compared to local bank rates. Reply YES to receive the full breakdown.

---

### Template 3: Follow-Up Reminder

**Template Name:** `followup_reminder`
**Category:** Marketing
**Language:** English

```
Hi {{1}}, just following up on our conversation about ECA financing for your {{2}} project. We're here to answer any questions. Reply to continue or call us at [phone].
```

**Variable Mapping:**
- `{{1}}` - Contact first name
- `{{2}}` - Project description (e.g., "manufacturing line")

**Example:**
> Hi David, just following up on our conversation about ECA financing for your manufacturing line project. We're here to answer any questions. Reply to continue or call us at [phone].

---

### Tips for Template Approval

- Keep messages professional and concise.
- Always include an opt-out option (e.g., "Reply STOP to unsubscribe").
- Avoid overly promotional language; focus on providing value.
- Meta typically reviews templates within 24 hours.
- If rejected, revise the wording and resubmit. Common rejection reasons: too promotional, missing opt-out, or variable misuse.

---

## 6. CRM Integration Approach

### Recommended CRM: HubSpot Free

HubSpot's free CRM is recommended for starting out because:

- **Free forever** for core CRM features (contacts, deals, pipeline)
- **WATI integration** is available natively or via Zapier/Make
- **Email tracking** and basic reporting included
- **Scales up** to paid plans as INZAG ETS grows

### Setup Steps

1. **Create a free HubSpot account** at [hubspot.com](https://www.hubspot.com/).
2. **Configure the deal pipeline** with these stages:

| Stage            | Description                                                  |
|------------------|--------------------------------------------------------------|
| **Inquiry**      | Initial contact received via WhatsApp, email, or website     |
| **Qualification**| Basic eligibility questions answered; assessing fit           |
| **Assessment**   | Detailed review of company financials and equipment needs     |
| **Structuring**  | Identifying the right ECA program, bank, and deal structure   |
| **Approval**     | ECA and bank approval process underway                       |
| **Funded**       | Deal approved and funds disbursed; equipment in delivery      |

3. **Create custom contact properties:**
   - Company Name
   - Country
   - Sector (Mining, Construction, Manufacturing, Energy, Logistics)
   - Years in Operation
   - Annual Revenue Range
   - Hard Currency Income (Yes/No/Partial)
   - Equipment Needs (text)
   - Equipment Value (currency)
   - Lead Source (WhatsApp, Website, Email, Referral)
   - WhatsApp Number

4. **Connect WATI to HubSpot:**
   - In WATI, go to **Integrations > HubSpot** and follow the connection steps.
   - Alternatively, use **Zapier** or **Make (Integromat)** to create automations:
     - Trigger: New contact in WATI
     - Action: Create/update contact in HubSpot
     - Trigger: Qualification flow completed in WATI
     - Action: Create deal in HubSpot pipeline at the appropriate stage

5. **Set up lead capture rules:**
   - Every WhatsApp conversation that captures an email or company name should create a HubSpot contact.
   - Completed qualification flows should create a deal at the appropriate stage.
   - Tag contacts with their lead source as "WhatsApp."

### Lead Flow Summary

```
WhatsApp Message
    --> WATI captures conversation data
    --> WATI sends data to HubSpot via integration
    --> HubSpot creates/updates contact
    --> HubSpot creates deal at appropriate pipeline stage
    --> Team member receives notification to follow up
```

---

## 7. Cost Estimate

### Monthly Costs

| Item                        | Cost          | Notes                                     |
|-----------------------------|---------------|-------------------------------------------|
| WhatsApp Business App       | **Free**      | Immediate setup, no API features          |
| WATI Starter Plan           | **~$40-50/mo**| Chatbot flows, broadcasts, team inbox     |
| HubSpot Free CRM            | **Free**      | Contacts, deals, pipeline, basic reports  |
| Zapier Free Plan (if needed)| **Free**      | 100 tasks/month for WATI-HubSpot sync     |
| **Total to start**          | **~$40-50/mo**|                                           |

### Optional Future Additions

| Item                        | Cost            | When to Add                                |
|-----------------------------|-----------------|--------------------------------------------|
| WATI Pro Plan               | ~$100/month     | When exceeding 1,000 conversations/month   |
| HubSpot Starter             | ~$20/month      | When needing email sequences or more reports|
| Zapier Starter              | ~$20/month      | When needing more than 100 automations/month|
| Dedicated phone line        | ~$10-20/month   | If a separate number is needed for WhatsApp |

### Scaling Note

The free and starter tools listed above should comfortably handle the first 50-100 leads per month. As volume grows, upgrade WATI and HubSpot plans accordingly. The total cost should remain well under $200/month even at moderate scale.

---

## Quick Start Checklist

- [ ] Download WhatsApp Business app and register the business number
- [ ] Complete the business profile (name, description, hours, email)
- [ ] Set up the greeting message
- [ ] Set up the away message
- [ ] Create all five quick replies (/qualify, /rates, /process, /sectors, /contact)
- [ ] Sign up for HubSpot Free CRM and configure the pipeline
- [ ] Sign up for WATI Starter plan
- [ ] Connect the WhatsApp number to WATI
- [ ] Build the four conversation flows in WATI
- [ ] Submit the three template messages for Meta approval
- [ ] Connect WATI to HubSpot
- [ ] Test all flows end-to-end
- [ ] Go live and begin engaging leads
