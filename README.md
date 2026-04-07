# ZapLink

**Live demo:** https://zaplink.vercel.app

Gasless onchain payment links powered by [Starkzap](https://docs.starknet.io/build/starkzap/overview) on Starknet.

---

## Overview

ZapLink lets anyone create a shareable payment request link in under 30 seconds. The recipient pays instantly with just their email — no wallet setup, no gas fees, no crypto knowledge required.

## Problem

Sending crypto to someone who isn't already set up is painful. They need a wallet, gas tokens, and technical knowledge just to receive a payment. ZapLink removes every one of those barriers.

## How It Works

1. Creator signs in with email via Privy
2. Sets amount, token, note, and optional expiry
3. Gets a unique shareable link and QR code
4. Recipient opens the link, signs in with email, clicks Pay
5. Payment executes gaslessly via AVNU Paymaster
6. Both parties see confirmed transaction on Starkscan

## Features

- **Email login** — No seed phrases, no wallet downloads
- **Gasless payments** — AVNU Paymaster covers all gas fees
- **Any token** — USDC, STRK, or ETH
- **Auto-swap** — Recipient pays in any token, creator receives requested token
- **Split links** — Multiple people pay one request
- **Link expiry** — Set deadlines of 24h, 3d, 7d, or never
- **QR codes** — Downloadable QR for every link
- **Dashboard** — Track all links, statuses, and earnings

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | CSS Modules |
| Auth + Wallets | Privy |
| Blockchain | Starknet via Starkzap SDK |
| Gasless | AVNU Paymaster |
| Database | Neon (PostgreSQL) |
| Deployment | Vercel |

## Security

- API keys are server-side only — never exposed in the browser
- Privy signing proxied through serverless functions
- AVNU Paymaster API key proxied server-side
- Content Security Policy headers set in `vercel.json`
- Input validation on all API routes
- No private keys in frontend code

## Getting Started

```bash
git clone https://github.com/yourusername/zaplink
cd zaplink
npm install
cp .env.example .env
# Fill in your keys in .env
npm run dev
Environment Variables
VITE_PRIVY_APP_ID=        # From dashboard.privy.io
PRIVY_APP_SECRET=         # From dashboard.privy.io
DATABASE_URL=             # From console.neon.tech
VITE_STARKNET_NETWORK=sepolia
STARKNET_RPC_URL=https://free-rpc.nethermind.io/sepolia-juno
Project Structure
zaplink/
├── src/
│   ├── components/        # UI components by feature
│   ├── pages/             # Route-level page components
│   ├── services/          # External API calls
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── styles/            # Global CSS
├── api/
│   ├── links/             # Link CRUD endpoints
│   ├── wallet/            # Privy signing proxy
│   └── paymaster/         # AVNU proxy
└── public/
Known Limitations
Sepolia testnet only in current version
Split payments track count only, not individual payer amounts
Swap preview is estimated, final rate confirmed at execution
