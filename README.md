# InvoiceGen - Professional Invoice Generator

A free, professional invoice generator with premium features. Built with Next.js, Tailwind CSS, and Stripe for payments.

## Features

### Free Tier
- Unlimited invoice creation
- PDF download
- Multiple currencies (USD, EUR, GBP, CAD, AUD, INR, JPY)
- Save invoices locally
- Professional templates

### Premium Tier ($4.99/month)
- Custom accent colors
- Add your business logo
- Remove InvoiceGen branding
- Priority support

## Quick Start (Run Locally)

### Prerequisites
- Node.js 18+ installed on your computer
- A Stripe account (for payments)

### Step 1: Install Dependencies

Open a terminal/command prompt in this folder and run:

```bash
npm install
```

### Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` with your Stripe keys:
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your Publishable key and Secret key

### Step 3: Set Up Stripe Product

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Name: "InvoiceGen Premium"
4. Price: $4.99, Recurring (Monthly)
5. Click "Save product"
6. Copy the Price ID (starts with `price_`)
7. Add it to your `.env.local` as `STRIPE_PRICE_ID`

### Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Deploy to Production (Vercel - FREE)

### Step 1: Create a Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

### Step 2: Push Code to GitHub

1. Create a new repository on GitHub
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/invoice-generator.git
   git push -u origin main
   ```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key
   - `STRIPE_SECRET_KEY` = your Stripe secret key
   - `STRIPE_PRICE_ID` = your Stripe price ID
   - `NEXT_PUBLIC_DOMAIN` = your Vercel URL (e.g., https://invoice-generator.vercel.app)
4. Click "Deploy"

### Step 4: Set Up Stripe Webhook (For Production)

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://your-vercel-url.vercel.app/api/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the Webhook Secret
6. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy

### Step 5: Get a Custom Domain (Optional)

1. Buy a domain from Namecheap, Google Domains, or similar (~$12/year)
2. In Vercel, go to your project settings → Domains
3. Add your custom domain and follow the DNS instructions

---

## Marketing Strategy to Reach $2000/month

### Target: 400 premium subscribers at $4.99/month

### SEO (Free, Long-term)
1. Target keywords: "free invoice generator", "invoice maker", "invoice template"
2. Add a blog with articles like:
   - "How to Create a Professional Invoice"
   - "Invoice Templates for Freelancers"
   - "Best Practices for Getting Paid Faster"

### Launch Platforms (Free)
1. **Product Hunt** - Submit on a Tuesday at 12:01 AM PT
2. **Hacker News** - Show HN post
3. **Reddit** - r/SideProject, r/Entrepreneur, r/freelance
4. **Indie Hackers** - Share your journey
5. **Twitter/X** - Build in public

### Partnerships
1. Reach out to freelancer communities
2. Partner with accounting software
3. Guest posts on small business blogs

### Paid Ads (Once Profitable)
1. Google Ads targeting "invoice generator"
2. Facebook Ads targeting freelancers

---

## Revenue Projections

| Month | Subscribers | MRR |
|-------|-------------|-----|
| 1 | 20 | $100 |
| 2 | 50 | $250 |
| 3 | 100 | $500 |
| 6 | 250 | $1,250 |
| 12 | 400+ | $2,000+ |

---

## Support

For issues or questions, open an issue on GitHub.

## License

MIT License - feel free to modify and use commercially.
