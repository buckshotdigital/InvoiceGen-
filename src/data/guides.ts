export interface GuideSection {
  title: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Guide {
  slug: string;
  title: string;
  industry: string;
  description: string;
  keywords: string[];
  publishedDate: string;
  excerpt: string;
  sections: GuideSection[];
  faqs: FAQItem[];
}

export const guides: Guide[] = [
  {
    slug: 'freelance-developer',
    title: 'Complete Invoice Guide for Freelance Developers',
    industry: 'Software Development',
    description:
      'A comprehensive guide to invoicing as a freelance developer, including project-based billing, hourly rates, retainer models, and best practices for tech industry invoicing.',
    excerpt:
      'Learn how to create professional invoices as a freelance developer with best practices for hourly, project-based, and retainer billing models.',
    keywords: [
      'freelance developer invoice template',
      'how to invoice as a developer',
      'freelance web developer invoice',
      'developer invoice format',
      'tech freelancer billing',
    ],
    publishedDate: '2026-01-14',
    sections: [
      {
        title: 'Understanding Developer Billing Models',
        content: `As a freelance developer, you have multiple ways to bill clients depending on the project scope and your business model. The three main approaches are hourly billing, fixed-price projects, and retainer agreements. Hourly billing works best for ongoing support, maintenance, and variable-scope projects where you can't predict total hours upfront. Fixed-price projects are ideal when scope is clearly defined—you estimate the work, quote a total price, and deliver on that estimate. Retainer agreements provide predictable monthly income and are perfect for clients needing ongoing development support. Many successful developers use a combination of all three depending on client needs. The key is choosing a model that aligns with your costs and risk tolerance.`,
      },
      {
        title: 'Hourly Rate Best Practices',
        content: `Pricing your hourly rate requires understanding your market, experience level, and operating costs. Junior developers (0-2 years experience) typically charge $25-50/hour, mid-level developers $50-100/hour, and senior developers $100-200+/hour. Your rate should cover not just billable hours but also non-billable time (admin, marketing, learning) and taxes. When invoicing hourly work, always include a time tracking method. Document the specific tasks completed, frameworks used, and outcomes delivered. Break down hours by project or feature, not just "development work." This transparency builds client trust and creates a paper trail for disputes. Use time tracking software like Toggl, Harvest, or Clockify to log hours consistently, then reference these logs on your invoice.`,
      },
      {
        title: 'Fixed-Price Project Invoicing',
        content: `Fixed-price projects require careful estimation and scope definition before invoicing. Create a detailed Statement of Work (SOW) that outlines deliverables, timeline, and revisions included. Many developers invoice 50% upfront as a deposit, 25% at project midpoint, and 25% upon completion. This protects your cash flow and ensures client commitment. Always specify what's included in the quoted price and what costs extra (additional revisions, scope creep, rush fees). Invoice immediately when each milestone is completed rather than waiting until the end. This keeps cash flowing and demonstrates progress. Include a "revision policy" on your invoices—something like "Two rounds of revisions included; additional revisions billed at $X/hour." This prevents unlimited revision requests that erode your profit margin.`,
      },
      {
        title: 'Retainer Agreement Invoicing',
        content: `Retainer agreements provide consistent monthly income and should include clear service expectations. Typical retainer packages include: 20 hours/month ($2,000-4,000), 40 hours/month ($4,000-8,000), or unlimited support tiers ($5,000-15,000/month). Define what's included: bug fixes, feature requests, support response time, and hosting/infrastructure support. Invoice on the same date each month (e.g., 1st of month) to make client budgeting predictable. Include a summary of work completed in the previous month so clients see the value delivered. If a client uses fewer hours than contracted, specify whether unused hours roll over or are forfeited. For unlimited retainers, include monthly reports showing time spent and work completed to justify the investment.`,
      },
      {
        title: 'Invoice Line Items for Developers',
        content: `Clear, detailed line items help clients understand what they're paying for and reduce payment disputes. Instead of just "web development - $5,000," break it down: "Custom WordPress Theme Development (80 hours @ $75/hr) - $6,000" or "React Frontend Build (40 hours) - $4,000" or "Testing & QA (8 hours) - $600." Include specific technologies used when relevant: "Vue.js component library setup," "Postgres database design," "AWS Lambda function development." For retainers, list specific projects completed: "Fixed critical security vulnerability," "Implemented new user authentication," "Optimized database queries (30% performance improvement)." Quantify impact when possible—"improved page load speed from 3.2s to 1.1s" or "reduced API response time by 45%." This demonstrates value beyond hours spent.`,
      },
      {
        title: 'Payment Terms & Deposit Policies',
        content: `Establish clear payment terms to maintain healthy cash flow. Recommended developer payment terms are NET 15 or NET 30 (payment due within 15-30 days). Longer terms like NET 60 or NET 90 strain small businesses, so negotiate shorter periods when possible. For upfront deposits: require 25-50% for fixed projects to secure the work, and 100% upfront for very small jobs (under $500). Set clear payment methods: bank transfer, PayPal, Stripe, or check. Specify late payment fees—most developers charge 1.5% monthly interest or $0.50 per day on overdue invoices. Include a "Payment due by [DATE]" prominently on your invoice. For retainers, require payment upfront before the month starts. Consider auto-draft agreements for monthly clients to ensure consistent payment.`,
      },
      {
        title: 'Tax Considerations for Developer Invoices',
        content: `Your invoice should include your tax identification information. In the US, include your EIN (Employer Identification Number) or SSN if you're self-employed. Some clients request tax information before payment. For international clients, you may need to include VAT numbers if applicable. If you operate as an LLC, corporation, or sole proprietor, clearly identify your business structure. Keep detailed records of all invoices for tax deduction purposes. As a freelance developer, you can deduct business expenses including software subscriptions, computer equipment (depreciated), home office expenses, professional development, health insurance, and business mileage. If a client doesn't pay within 90 days, the IRS allows you to write off bad debts on your taxes. Consult a tax professional to ensure you're claiming all eligible deductions—this could save $3,000-10,000+ annually depending on your income level.`,
      },
    ],
    faqs: [
      {
        question: 'What payment method should I offer clients?',
        answer:
          'Offer multiple payment methods for convenience: bank transfer (ACH), PayPal, Stripe, Square, and check. Bank transfer is fastest and cheapest (free for you). PayPal/Stripe charge 2-3% fees but are convenient for clients. Always require payment in your currency to avoid exchange rate risk.',
      },
      {
        question: 'How do I invoice international clients?',
        answer:
          'For international invoicing, include SWIFT/IBAN banking details for wire transfers. PayPal and Stripe handle multi-currency payments automatically. Know the VAT rules: many countries require invoicing non-residents without VAT. Include your tax ID and specify whether prices are inclusive or exclusive of taxes. Research the specific country's invoicing requirements.',
      },
      {
        question: 'Should I invoice for time spent in meetings?',
        answer:
          'Yes, billable meetings should be tracked and invoiced. Include "discovery meeting (1 hour)," "project kickoff (2 hours)," "client feedback review (30 minutes)" as line items. Limit unbillable time to initial consultations only. Clarify your policy upfront in contracts.',
      },
      {
        question: 'How do I handle scope creep on invoices?',
        answer:
          'Document scope in your initial SOW. When clients request additional work, create a change order or supplemental invoice. Never silently absorb extra work—communicate: "This is outside the original scope. I can deliver it for an additional $X." This protects profitability and sets expectations.',
      },
      {
        question: 'What should I do if a client disputes an invoice?',
        answer:
          'Have detailed documentation: time tracking records, change orders, email approvals, GitHub commits showing work completed. Review the contract and SOW. Offer to discuss specific line items. If the dispute is about work quality, offer to revise within your revision policy. Never pay back on disputed invoices unless clearly at fault.',
      },
      {
        question: 'How often should I send invoices?',
        answer:
          'For hourly work: weekly or bi-weekly. For projects: at agreed milestones (50/25/25 split is common). For retainers: monthly on the same date. Never wait until the end of a long project to invoice—send invoices regularly to maintain cash flow.',
      },
    ],
  },
  {
    slug: 'contractor',
    title: 'Contractor Invoice Guide: Best Practices & Requirements',
    industry: 'Construction & Services',
    description:
      'Essential invoicing guide for contractors covering progress billing, retention amounts, lien waivers, and state-specific requirements for construction invoices.',
    excerpt:
      'Master contractor invoicing with guides on progress billing, retention, lien waivers, and state-specific legal requirements.',
    keywords: [
      'contractor invoice requirements',
      'construction invoice template',
      'contractor billing best practices',
      'lien waiver invoice',
      'progress billing invoice',
    ],
    publishedDate: '2026-01-14',
    sections: [
      {
        title: 'Progress Billing for Construction Projects',
        content: `Progress billing is the standard for construction contracts, allowing contractors to invoice as work is completed rather than waiting until project completion. Create a project timeline breaking work into phases: site preparation, foundation, framing, mechanical/electrical, finishing, and closeout. Invoice 15-25% upon contract signing, then equal portions as each phase completes. For example, on a 12-month $500,000 project: invoice $50,000 upfront, then $37,500-50,000 monthly as work progresses. Each invoice should detail completed work, materials delivered, labor hours by trade, and percentage of project completion. Many construction contracts specify payment within 7-10 days of invoice for prompt payment. Include supporting documentation: photos of completed work, material receipts, lien waivers from subcontractors, and inspections completed.`,
      },
      {
        title: 'Retention Amounts & Final Billing',
        content: `Retention is a standard construction practice where the property owner or general contractor withholds 5-10% of each invoice payment until project completion. A contractor might invoice $100,000 but only receive $95,000, with the $5,000 held as security. Retention amounts are typically released 30-45 days after project completion upon final inspection approval. Your invoice should clearly show: "Invoice Amount: $100,000 / Retention (10%): -$10,000 / Amount Due: $90,000." For your cash flow planning, budget accordingly—don't count retention funds until actually received. Track retention in a separate account. Include a "Retention Schedule" on long projects showing when and how much will be released. Final billing occurs after all punch-list items are completed, final inspections pass, and all subcontractors are paid. Submit a "Final Invoice" marked clearly with the Contractor's sworn statement confirming all bills are paid.`,
      },
      {
        title: 'Lien Waivers & Legal Requirements',
        content: `Before releasing final payment, many property owners require a "Lien Waiver" from you confirming you've paid all subcontractors and material suppliers. A conditional lien waiver is issued when payment is contingent on funds being received; unconditional is issued once paid. Your invoicing process should require: (1) Conditional lien waivers from all subcontractors before you invoice, (2) Your conditional lien waiver to the property owner when you invoice, (3) Unconditional lien waivers once everyone is paid. Each state has specific lien waiver requirements—some require specific wording, all must protect subcontractors. Never sign a lien waiver without actually being paid. Include with every invoice a statement like: "Payment of this invoice is subject to receipt of conditional lien waivers from all subcontractors and material suppliers." This protects your business and ensures compliance.`,
      },
      {
        title: 'Required Invoice Information for Contractors',
        content: `Construction invoices must include specific information for legal and contractual purposes. Required information: (1) Your business name, address, contractor license number, and tax ID; (2) Project name and address; (3) Contract reference number; (4) Invoice number and date; (5) Invoice period covered; (6) Detailed breakdown by trade (framing, electrical, plumbing, HVAC); (7) Labor hours and rates, material costs, equipment rentals; (8) Progress percentage (e.g., "40% of total project complete"); (9) Signed retainage statement; (10) Payment terms and due date. Include supporting documents: Change orders for any extra work, approved by property owner before invoicing. Permit and inspection photos. Proof of insurance (liability and workers comp). Material invoices for significant purchases.`,
      },
      {
        title: 'Change Orders & Cost Overruns',
        content: `Never invoice for additional work without a signed change order. When clients request work beyond the original contract: (1) Document the request in writing (email), (2) Estimate the additional cost with breakdown (materials, labor hours, equipment), (3) Send a formal Change Order form for approval and signature before proceeding, (4) Invoice the change order amount as a separate line item on your regular progress invoices. Example: "Change Order #3: Additional Drywall for Master Bedroom (approved 1/10/26) - $3,500." Never absorb cost overruns—this erodes profit on already thin margins. Track actual costs vs. estimates. If materials cost more than quoted, communicate immediately: "Material prices increased $200/unit, requiring an additional $1,200 for this project." Delays also justify cost increases: "Weather delays of 2 weeks require extension of labor ($4,000) and equipment rental ($1,500)." Including these in invoices with supporting documentation protects your business.`,
      },
      {
        title: 'Payment Terms for Contractors',
        content: `Standard payment terms in construction are NET 7 (payment due within 7 days) or NET 10, with some projects allowing NET 15. Anything longer strains cash flow for materials and labor. Your contract should specify: "Payment due within 7 days of invoice receipt." Include in every invoice: a clear due date (e.g., "Due by January 15, 2026"), late payment fees (e.g., "1.5% monthly interest on amounts unpaid after due date"), and payment method accepted (check, bank transfer, credit card). For large projects, consider requiring a deposit before starting: 10-25% of project cost to secure materials. Some contractors also require deposits from property owners to ensure they can pay as the project progresses. Late payments are common in construction—consider hiring a construction accountant to track receivables and send payment reminders. Document all payment agreements in writing.`,
      },
    ],
    faqs: [
      {
        question: 'When should I submit invoices during a project?',
        answer:
          'Submit progress invoices monthly or at agreed project milestones. For fast-moving projects (weeks long), invoice weekly. Always invoice before major holidays and before you need materials purchased. This keeps project cash flow positive and ensures clients budget accordingly.',
      },
      {
        question: 'What is a contract retention percentage?',
        answer:
          'Retention is typically 5% on private projects and 10% on public/government projects. It\'s withheld from each invoice and released 30-45 days after project completion. Budget for this in your project cash flow—don\'t count retention funds when estimating income.',
      },
      {
        question: 'How do I invoice for subcontractors I hired?',
        answer:
          'Get invoices from subcontractors, verify work completed, obtain their lien waiver, then include those costs on your invoice to the property owner. Show: "Labor - Electrical Subcontractor: $8,000 (Lien waiver attached)." Always require conditional lien waivers from subs before you invoice.',
      },
      {
        question: 'What happens if I don\'t get a lien waiver?',
        answer:
          'Without a lien waiver, the property owner could claim a mechanic\'s lien on the property if you or your subcontractors aren\'t paid. This affects their ability to sell/refinance. Require lien waivers in every contract. If a subcontractor won\'t sign, don\'t proceed—they\'re a payment risk.',
      },
      {
        question: 'How do I handle disputed invoices on construction projects?',
        answer:
          'Document everything: photos of work, inspection reports, change orders signed by the property owner. If a client disputes quality, offer to remedy per contract terms. If they dispute pricing, refer to the signed contract and any change orders. Never give discounts on disputes—either the work meets contract specs or you fix it.',
      },
    ],
  },
  {
    slug: 'consultant',
    title: 'Consulting Invoice Guide: Retainers, Fees & Best Practices',
    industry: 'Consulting & Advisory',
    description:
      'Complete guide to invoicing consulting services including retainer billing, value-based pricing, statement of work integration, and professional invoice standards.',
    excerpt:
      'Professional invoicing guide for consultants covering retainer models, value-based pricing, SOW references, and client management best practices.',
    keywords: [
      'consulting invoice template',
      'how to invoice consulting services',
      'consultant retainer invoice',
      'consulting fee invoice',
      'professional services invoice',
    ],
    publishedDate: '2026-01-14',
    sections: [
      {
        title: 'Retainer vs. Project-Based Consulting Fees',
        content: `Consulting services are typically billed either as retainers (monthly ongoing support) or project-based fees (one-time engagements). Retainer consulting works for clients needing ongoing strategy, research, or advisory services: "Retained for 20 hours/month of strategic consulting at $200/hour = $4,000/month." Invoice the retainer amount on the first of each month before services are rendered. Document what's included in the retainer: strategy sessions, market research, report preparation, email/phone support. Project-based consulting is for finite engagements: 6-week market analysis ($15,000), organizational restructuring ($25,000), marketing strategy ($10,000). Invoice milestones: 33% upon engagement, 33% at midpoint, 34% upon completion. The key difference: retainers provide predictable income but require clear scope boundaries; projects have defined start/end dates but less recurring revenue.`,
      },
      {
        title: 'Value-Based Pricing for Consultants',
        content: `High-level consultants often use value-based pricing instead of hourly rates. Instead of billing "50 hours @ $250/hour," price based on client value received. For example: "Strategic market analysis expected to generate $500,000+ new revenue = $25,000 consulting fee." This rewards consultants for impact delivered, not hours spent. To implement: (1) Define the problem and potential impact upfront in your Statement of Work, (2) Quote a fixed price based on expected value delivered, (3) Get client agreement before starting work. Example invoice line: "Merger integration strategy and implementation planning (Expected 20% efficiency improvement in combined operations) - $50,000." Value-based pricing works best when you have relevant case studies showing past client results. It requires confidence in your expertise but can yield higher earnings than hourly billing for experienced consultants.`,
      },
      {
        title: 'Statement of Work Integration in Invoicing',
        content: `Every consulting engagement should have a signed Statement of Work (SOW) before you invoice. Your invoice should reference the SOW: "Invoice #3, Project X, Statement of Work dated January 1, 2026." The SOW specifies deliverables, timeline, exclusions, and payment terms. When you invoice, reference specific deliverables completed: "Phase 1 complete: Market analysis, competitive landscape report, and recommendations document delivered 2/15/26 - $8,000." This connects invoice to contracted deliverables. If a client disputes an invoice, the SOW clarifies what's included/excluded. Include in your invoice footer: "This invoice is submitted in accordance with Statement of Work signed [date]. See SOW for full engagement scope." Many consultants use milestone-based invoicing: invoice when each SOW deliverable is completed. This keeps work on track and cash flowing—never wait until the end of a 6-month project to invoice.`,
      },
      {
        title: 'Consulting Invoice Components',
        content: `Professional consulting invoices include specific components: (1) Your credentials/expertise: list relevant experience, certifications, or expertise being provided; (2) Engagement overview: brief description of the consulting work; (3) Deliverables completed: specific work products delivered in this billing period; (4) Time/effort: if hourly, show hours and hourly rate; if value-based, show value delivered; (5) Expenses: any reimbursable expenses (travel, research tools, deliverables production); (6) SOW reference: link to the signed Statement of Work; (7) Invoice total and payment terms; (8) Supporting materials: attach executive summary of findings, research reports, strategic recommendations. High-end consulting invoices also include: (a) Risk mitigation strategies implemented, (b) Projected ROI/impact of recommendations, (c) Client testimonials or case study results. This demonstrates value beyond hours spent.`,
      },
      {
        title: 'Managing Scope Creep in Consulting Invoices',
        content: `Scope creep—clients asking for work beyond the SOW—erodes consulting margins. Every request beyond the original scope becomes an additional invoice. When a client asks for unexpected work: (1) Acknowledge the request positively: "Great idea to expand the competitive analysis," (2) Assess the additional effort: "This will require 10 additional hours of research and analysis," (3) Quote the additional cost: "I can deliver this expanded analysis for an additional $3,500," (4) Get approval before proceeding: "Please reply confirming approval to proceed at $3,500." Create additional line items on your invoice: "Scope Addition: Extended competitive intelligence (approved 2/20/26) - $3,500." Many consultants also include a "revision limit" on deliverables: "Three rounds of revisions to strategic recommendations included; additional revisions $250/hour." This protects your margins and keeps clients realistic about scope.`,
      },
      {
        title: 'Payment Terms & Collections for Consultants',
        content: `Standard consulting payment terms are NET 30 (payment due 30 days after invoice) for retainers and milestone projects. For multi-month engagements, consider NET 15 or payment upfront. Larger consulting firms often require: 50% deposit upon engagement, 25% at midpoint, 25% upon completion. Always specify payment terms on your invoice: "Payment due by March 15, 2026." Include late payment terms: "Invoices unpaid after 30 days will accrue interest at 1.5% monthly." Send payment reminders: "Friendly reminder: Invoice #5 dated February 10 is now due. Please arrange payment." If a consulting client has cash flow issues, negotiate: "I can offer a 3% discount if paid within 10 days, or invoice in smaller biweekly installments." Track receivables—unpaid invoices after 90 days should be escalated with a formal demand letter or turn over to collections. Many consultants require credit card information from corporate clients to ensure payment.`,
      },
    ],
    faqs: [
      {
        question: 'How do I invoice ongoing retainer clients?',
        answer:
          'Invoice retainer amounts monthly on the same date (e.g., 1st of month) before services are rendered. Include a brief summary of expected activities: strategy sessions, research, reporting. Upon month-end, include a "Services delivered" section showing what was completed. This transparency justifies the monthly cost and helps clients see value.',
      },
      {
        question: 'Should I invoice for meetings with clients?',
        answer:
          'Yes, for project-based work, bill discovery/kickoff meetings. For retainers, meetings are included in the monthly fee. Include "Initial discovery meeting (2 hours)," "Stakeholder interviews (3 hours)," "Strategy session (1 hour)" as line items on project invoices. Establish a policy: "Initial consultation free, project meetings billed at $X/hour."',
      },
      {
        question: 'How do I invoice if a project takes longer than estimated?',
        answer:
          'For fixed-price projects, you absorb overruns (this is why estimation is critical). For hourly billing, invoice actual hours worked. If significant delays occur due to client delays, change the terms: "Project timeline has extended due to delayed client feedback. Additional invoice for 15 extension hours @ $250/hour - $3,750." Get agreement before proceeding.',
      },
      {
        question: 'What should I do if a client wants to negotiate the invoice?',
        answer:
          'Have documentation: time records, scope agreement (SOW), change orders. Review what\'s being questioned. If work quality is disputed, offer revisions per SOW. If they disagree with pricing, refer to the signed SOW. Don\'t discount consulting work—it cheapens your expertise. Stand firm on pricing unless they identify a clear error or undelivered scope.',
      },
      {
        question: 'How do I handle a client canceling mid-engagement?',
        answer:
          'Your SOW should specify cancellation terms, e.g., "Cancellation within 30 days of work start: full engagement fee due. Within 60 days: 75% due." Invoice for work completed to date plus any non-refundable components (deposits, expenses paid). Communicate in writing why the cancellation fee applies per your SOW.',
      },
    ],
  },
  {
    slug: 'creative',
    title: 'Creative Professional Invoice Guide: Designers, Photographers & More',
    industry: 'Creative Services',
    description:
      'Invoicing guide for creative professionals including usage rights, revision tracking, kill fees, copyright language, and industry-specific best practices.',
    excerpt:
      'Invoice guide for designers, photographers, and creative professionals with templates, usage rights, copyright language, and revision tracking.',
    keywords: [
      'designer invoice template',
      'photographer invoice guide',
      'freelance designer invoice',
      'creative professional invoice',
      'usage rights invoice',
    ],
    publishedDate: '2026-01-14',
    sections: [
      {
        title: 'Creative Service Pricing & Deliverables',
        content: `Creative services encompass design, photography, copywriting, illustration, video production, and other artistic work. Pricing typically includes: project fee for creation, usage rights for the deliverables, and revision limits. Example breakdown: "Logo Design Package: Concept development, 3 concept options, revisions, final files (AI, PNG, PDF) = $2,500." Include all file formats clients need. For designers: invoice separate line items for design concepts, revision rounds, and final file production. "Concept development (unlimited options) - $800 / Client revisions (2 rounds included) - $400 / Final file preparation (web, print, social formats) - $300 / Total: $1,500." For photographers: invoice based on shooting time, number of edited photos, and usage rights. "Product photography session (4 hours) - $2,000 / Edited photos (40 images) - included / Commercial usage rights - $1,500 / Total: $3,500." Always define what's included vs. extra charges.`,
      },
      {
        title: 'Usage Rights & Copyright Licensing',
        content: `A critical element of creative invoices is specifying usage rights. Your invoice should state who owns the copyright and how the client can use deliverables. Example: "Usage Rights: Client receives non-exclusive, perpetual license to use designs for the contracted project. Designer retains copyright and portfolio usage rights." Specify limitations: Can they modify the work? Resell the designs? Use across multiple projects? Typical models: (1) Exclusive rights: Client owns everything, $5,000-20,000 premium, (2) Non-exclusive: You sell similar designs to others, standard pricing, (3) Limited use: Client can use for one project only, $2,000-5,000, (4) Portfolio use: You retain rights to show work in portfolio/case studies. Always invoice separately for copyright transfer if client requests full ownership: "Intellectual property/copyright transfer: $3,000 additional." This protects your business—clients can't claim your work or resell it without paying. Include in invoice footer: "All deliverables © [Your Name]. Client licensed for [specific use]. Modification without written permission prohibited."`,
      },
      {
        title: 'Revision Tracking & Kill Fees',
        content: `Creative projects require managing revision expectations to protect profitability. Define revision limits in your invoice: "Service includes 2 rounds of revisions to logo designs. Additional revisions charged at $150/hour." A revision round = client feedback compiled into one revision cycle; multiple design rounds are separate. Track revisions carefully: Date sent, revision #, feedback received, hours to implement. Bill beyond limits: "Client requested 4th revision round (outside included 2 rounds) - 5 hours @ $150/hr = $750." Also define a "kill fee"—compensation if client cancels mid-project. Standard: 50% if canceled before starting work, 75% if started, 100% if substantial progress made. Invoice kill fees clearly: "Project cancellation fee (50% of agreed $5,000) = $2,500." Include in contract/invoice: "Cancellation after work begins subject to kill fee per revision limits." This compensates you for lost time and protects cash flow for speculative creative work.`,
      },
      {
        title: 'File Deliverables & Format Specifications',
        content: `Specify exact file formats clients receive to avoid disputes. Designer invoice example: "Design deliverables: (1) Adobe Illustrator native file (editable), (2) High-resolution PDF for print (300 DPI), (3) Web-optimized PNG/JPG (72 DPI), (4) Social media crop variations, (5) Source files organized." Some designers limit to web formats only: "Deliverables provided in JPG and PNG only. Client can use Figma link for review but doesn't receive native design files." Photographer invoice example: "Deliverables: (1) 40 edited photographs (JPEG high-resolution), (2) Selects provided in web-optimized format, (3) Lightroom presets applied, (4) RAW files provided if requested (+$500)." Specify limitations: "Files provided as-is. Client responsible for image storage and backup." State whether you'll revise files later: "Client may request file adjustments within 30 days; after 30 days, revisions billed at $75/hour." Always retain source/working files for your own records and portfolio purposes.`,
      },
      {
        title: 'Creative Service Invoice Elements',
        content: `Effective creative invoices include: (1) Project description: "Brand identity package including logo, color palette, typography guide," (2) Deliverables checklist: list every file/output provided, (3) Revision history: show rounds of revision and dates completed, (4) Usage rights statement: specify copyright and usage terms, (5) Timeline: dates of concept, revision, and final delivery, (6) Payment breakdown: concept fee, revision fees, file prep fees separately, (7) Kill fee policy: what applies if client cancels, (8) File retention policy: how long you keep working files, (9) Support period: whether client gets post-delivery revisions/support. High-end creative invoices also include: project impact (where designs will be used), expected reach (print run, website traffic), and case study permission ("May we use this work in our portfolio?"). This demonstrates value and builds your case studies.`,
      },
      {
        title: 'Payment & Terms for Creative Work',
        content: `Creative services payment should be structured as: 50% deposit upon project kickoff, 50% upon completion/approval. This minimizes risk—clients are more likely to approve work when they've already paid half. For larger projects: 30% upfront, 40% at midpoint, 30% upon delivery. Include in invoice: "Payment terms: 50% deposit due upon project start, 50% upon final delivery. Deposits are non-refundable. Final files delivered upon receipt of payment." Payment method: specify whether you accept checks, bank transfers, PayPal, credit cards. For international clients, use PayPal, Stripe, or Wise for currency conversion. Late payment terms: "Invoices unpaid after 30 days will incur late fees of 1.5% monthly interest." Many creative professionals suspend work if deposits aren't received: "Project work begins upon receipt of deposit." This ensures serious commitment from clients.`,
      },
    ],
    faqs: [
      {
        question: 'Who owns the copyright to creative work I produce?',
        answer:
          'Unless you explicitly transfer copyright to the client (for additional fee), you retain copyright. The client receives a license to use the work. Your invoice should state: "Designer retains copyright. Client licensed for contracted project use." If client wants full ownership, add $2,000-5,000 to your price and state: "Full copyright transferred to client upon payment."',
      },
      {
        question: 'How do I handle a client that wants unlimited revisions?',
        answer:
          'State revision limits clearly in contract/invoice: "Two revision rounds included." After that: "Additional revisions billed at $X/hour." Track revision requests by date. If client isn\'t happy with the concept direction after 2 rounds, discuss pivoting: "Would you like to continue refining this concept or explore a different direction? Concept changes require additional fees."',
      },
      {
        question: 'What if a client wants to modify the design after I deliver it?',
        answer:
          'Include a post-delivery revision window: "Client may request revisions within 30 days of final delivery. After 30 days, modifications billed at $X/hour." Specify what "modification" means: changing colors, text, layout = billable. Provide RAW files if requested, but clearly: "Client assumes responsibility for edits. Designer not liable for modified work."',
      },
      {
        question: 'Should I invoice for consultation before starting design?',
        answer:
          'Yes, include consultation/discovery in your project fee. List "Discovery consultation (2 hours): included" or "Project fee includes 2 hours discovery consultation." If client wants extensive pre-project consulting, charge separately: "Brand strategy consulting (10 hours @ $150/hr) = $1,500, separate from design."',
      },
      {
        question: 'How do I invoice if a client uses my design for something different than agreed?',
        answer:
          'Your invoice should specify usage terms. If they use designs beyond the agreed scope, send an additional invoice: "Additional usage rights - corporate vehicle wraps (originally invoiced for web only) = $2,000." Include a "usage audit" clause in your contract allowing you to verify uses and invoice accordingly.',
      },
      {
        question: 'What if a client asks for a "spec" design without commitment?',
        answer:
          'Never do spec work (speculative design without payment commitment). Require a contract and deposit upfront. If they\'re unsure about your style, offer: "Discovery consultation ($500) includes 3 concept sketches to show you my approach. Deposit toward full project fee if proceeding." Protect your time—speculative work benefits clients, not you.',
      },
    ],
  },
  {
    slug: 'agency',
    title: 'Agency Invoice Guide: Blended Rates, Pass-Through Costs & Billing',
    industry: 'Marketing & Agencies',
    description:
      'Comprehensive invoicing guide for digital agencies and creative agencies covering blended rates, media buying, pass-through costs, and WIP tracking.',
    excerpt:
      'Invoicing best practices for agencies including blended rates, media buying, pass-through costs, client reporting, and WIP tracking.',
    keywords: [
      'marketing agency invoice',
      'agency billing best practices',
      'media agency invoice template',
      'blended rate invoice',
      'agency retainer invoice',
    ],
    publishedDate: '2026-01-14',
    sections: [
      {
        title: 'Agency Retainer Structures & Invoicing',
        content: `Agency retainers are typically monthly engagements structured around team resources allocated to the client. Example: "$8,000/month retainer includes: 1 account manager (40 hours), 1 designer (20 hours), developer support (10 hours/month)." This tells clients exactly what resources they're paying for. Retainer line items: "Strategic planning & account management - $4,000 / Creative development & design - $3,000 / Technical & development support - $1,000 / Total monthly retainer: $8,000." Invoice retainers on the 1st of each month before services are rendered. Include a detailed breakdown of work completed in the previous month, showing the value delivered (designs created, content published, analytics improvements). This justifies the monthly spend and builds client retention. Tiered retainers work well: Bronze ($3,000), Silver ($8,000), Gold ($15,000+) allowing clients to choose resource allocation.`,
      },
      {
        title: 'Blended Rate Invoicing',
        content: `Blended rates combine different team member hourly costs into one rate for simplicity. Example: Instead of invoicing "Senior Strategist @ $200/hr + Designer @ $125/hr + Coordinator @ $75/hr," you invoice "Agency Services @ $150/hr blended." This hides cost variations and gives clients a single rate. When invoicing blended rates: show total hours worked, blended rate, and total cost. "Agency services: 120 hours @ $150/hour blended = $18,000." Blended rates work best when you're confident about team time allocation. If a client questions the rate, you can justify: "Rate includes senior expertise, junior support, and project management overhead." Many agencies blend rates per service type: "Strategic consulting - $200/hr blended" vs. "Execution services - $125/hr blended." This allows flexibility while maintaining simplicity.`,
      },
      {
        title: 'Media Buying & Pass-Through Costs',
        content: `Agencies managing media buys (ads, sponsored content, media placement) invoice differently from services. Your invoice includes: (1) Media spend: actual cost of media purchased, (2) Agency commission: percentage markup (15-20% standard), (3) Management fees: cost to manage campaigns. Example: "Facebook ad spend: $50,000 / Agency commission (15%): $7,500 / Campaign management (included): $2,000 / Total invoice: $59,500." Some agencies use monthly flat management fees instead of percentage: "Ad spend: $50,000 / Campaign management fee (flat): $2,500 / Total: $52,500." Pass-through costs include: production costs (video, photography), software subscriptions, research tools, third-party services. "Production: Custom video shoot - $5,000 / Photography: $2,000 / Design revisions beyond included: $1,500 / Total pass-throughs: $8,500." Always get client approval before incurring pass-through costs. Invoice media separately from services to show the breakdown clearly.`,
      },
      {
        title: 'Work-In-Progress (WIP) Tracking & Invoicing',
        content: `Agencies must track WIP (work billed but not yet complete) to manage cash flow and project status. Create a WIP summary showing: project, billable hours to date, hours billed, hours remaining. Example: "Project X Status: 80 hours budgeted, 45 hours completed (56%), 45 hours billed to date, 35 hours remaining unbilled." Invoice progressively as milestones are hit, not waiting until project end. Milestone invoicing: "Phase 1 complete (Strategy & planning): 30 hours @ $150 = $4,500." "Phase 2 in progress (Design): 25 of 40 hours complete. Progress invoice: 25 hours @ $150 = $3,750." This keeps cash flowing and prevents large invoices at the end. Include in invoices a "Project Status" summary showing percentage complete, budget vs. actual hours, remaining work. This transparency prevents surprises when final invoices come.`,
      },
      {
        title: 'Client Reporting & Invoice Transparency',
        content: `High-value clients expect detailed reporting with invoices. Include: (1) Services delivered: list campaigns launched, content created, reports generated, (2) Key metrics: traffic, conversions, engagement, ROI, (3) Team activity: hours by function (strategy, execution, reporting), (4) Budget vs. actual: how you spent the allocated budget, (5) Recommendations: next steps and optimizations. Monthly reporting templates: "Social media management: 15 posts published, 25,000 impressions, 1,200 engagements / Paid advertising: $12,000 spent, 2,400 clicks, $5 cost per click / Reporting & strategy: 4 hours included / Total this month: $4,200." Attach supporting documents: analytics screenshots, campaign performance, content calendar, A/B test results. This justifies your fees and builds client confidence. High-performing agencies include case study results: "Converted 3 website visitors to leads (higher than 0.5% industry average) through optimized landing page testing."`,
      },
      {
        title: 'Service Scope & Hourly Overages',
        content: `Retainer agreements specify what's included. Extra work beyond scope is billed as overages. Example: "Included: 40 hours strategy/planning, 20 hours design, 10 hours development per month. Beyond this: $150/hour overage rate." If a client demands additional work mid-month, document it: "Client requested additional social media content (2 additional posts beyond 10 included) - 4 hours @ $150 = $600 overage." Track carefully to avoid giving away work. Send alerts when client approaches budget limits: "You've used 38 of 40 planning hours this month. Remaining budget: 2 hours planning, 20 hours design." This prevents surprise overages and gives clients choice: reduce scope, expand retainer, or pay overages. Some agencies implement "rollover hours" policies: unused hours roll to next month or are lost. Specify in contract: "Unused hours do not roll over. Client responsible for requesting services within allocated hours."`,
      },
      {
        title: 'Retainer Adjustments & Scope Creep Management',
        content: `As client needs change, retainers need adjusting. When a client consistently uses hours beyond allocation, propose a retainer increase: "Your current $8,000 retainer includes 60 hours/month. You've been using 75 hours. Would you like to upgrade to $10,000 (90 hours) to better accommodate your needs?" Always put scope changes in writing. When a client requests new services mid-retainer: "Your retainer doesn't include video production. Would you like to add a video specialist (15 hours/month) for an additional $2,000/month?" Scope creep is managed by: (1) tracking hours meticulously, (2) alerting clients to budget depletion, (3) proposing retainer upgrades proactively. Never silently absorb extra work—it compounds month to month, ultimately costing the agency thousands in uncompensated work. Include in contracts: "Scope additions require written amendment to retainer agreement and approval before proceeding."`,
      },
    ],
    faqs: [
      {
        question: 'How should I invoice if a project finishes early or late?',
        answer:
          'For projects paid by hours, invoice actual hours used. If finished early, you invoice less (client benefits from efficiency). If running late, you absorb cost unless due to client delays. For fixed-price projects, you absorb all overruns. For retainers, hours roll forward/backward: if client uses 70 of 80 hours one month, 10 hours carry to next month.',
      },
      {
        question: 'What if a client disputes media spending?',
        answer:
          'Provide receipts for all media purchases. Screenshot platform reports showing exact spend. Include: what platforms were used, audience targeting, bid amounts, performance results. Show why spending increased if questioned: "CPM doubled due to iOS privacy changes requiring higher bids to reach target audience." Transparency prevents disputes.',
      },
      {
        question: 'How do I handle freelancers/vendors I use for clients?',
        answer:
          'Invoice vendor costs as pass-throughs. Get client approval before engaging: "Videographer for shoot: $2,500 (approved 1/15/26)." Include vendor invoice with your invoice to client. Mark clearly: "Pass-through cost: Freelance videographer - $2,500 + Agency management fee (15%): $375 = $2,875." This shows transparency and justifies markups.',
      },
      {
        question: 'Should I invoice for strategy that doesn\'t result in sales?',
        answer:
          'Absolutely. You bill for your strategic thinking and execution, not guaranteed results. Your invoice shows what you did: "Campaign planning, audience research, creative development, media placement, performance monitoring - $5,000." Results depend on market conditions, product quality, budget. Unsuccessful campaigns teach clients valuable lessons worth documenting.',
      },
      {
        question: 'How do I invoice if a client fires me mid-project?',
        answer:
          'Your contract should specify termination fees. Example: "If terminated before project completion, client owes: full payment for completed work + 25% kill fee on remaining work." Invoice for work completed: "Work delivered to date: Strategy ($2,000), 50% design ($1,500) + Termination fee (25% of remaining $4,000) = $1,000 / Total: $4,500."',
      },
      {
        question: 'Can I invoice for staff training on agency tools?',
        answer:
          'Yes, if your contract includes "onboarding and training." Invoice separately if not included: "Client training on platform (3 hours @ $150/hr) = $450." Include knowledge transfer: documentation, recorded training, templates provided. Training can be recurring: "Quarterly platform training and updates - $750/quarter included."',
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getAllGuides(): Guide[] {
  return guides;
}
