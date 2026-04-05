---
# =============================================================================
# PORTFOLIO.md — Converso AI (ai-chatbot-saas)
# =============================================================================

portfolio_enabled: true
portfolio_priority: 2
portfolio_featured: true
portfolio_last_reviewed: "2026-04-05"

title: "Converso AI — Bilingual AI Front Desk & Sales Assistant"
tagline: "Multi-tenant SaaS platform for deploying bilingual AI chatbots that capture leads, answer from verified knowledge, and hand off to live agents"
slug: "converso-ai-chatbot-saas"

category: "AI Automation"
target_audience: "Service businesses in bilingual markets (Mexico/US) needing 24/7 AI customer engagement"
tags:
  - "saas"
  - "chatbot"
  - "multi-tenant"
  - "ai"
  - "rag"
  - "bilingual"
  - "stripe"
  - "nextjs"
  - "whatsapp"

thumbnail: "https://raw.githubusercontent.com/RCushmaniii/ai-chatbot-saas/main/public/images/demo-thumbnail.png"
hero_images:
  - "https://raw.githubusercontent.com/RCushmaniii/ai-chatbot-saas/main/public/images/demo-thumbnail.png"
demo_video_url: ""

live_url: "https://soyconverso.com"
case_study_url: ""

problem_solved: |
  Service businesses in bilingual markets lose leads outside business hours, can't afford
  24/7 bilingual receptionists, and generic chatbots hallucinate answers because they don't
  know the business. Existing solutions require technical expertise, lack native bilingual
  support, or charge enterprise prices.

key_outcomes:
  - "RAG architecture ensures every answer traces to verified business content — zero hallucination"
  - "Native bilingual (EN/ES) detection from first message, maintained throughout conversation"
  - "Visual playbook builder for scripting conversation flows without code"
  - "One-tag embeddable widget deployable on any website"
  - "Multi-tenant SaaS with full data isolation, RBAC, and Stripe billing"
  - "WhatsApp channel support via Vercel Chat SDK for Mexico market"
  - "Production-grade observability: Sentry, Vercel Analytics, distributed rate limiting"

tech_stack:
  - "Next.js 16"
  - "TypeScript 5.8"
  - "React 19"
  - "PostgreSQL + pgvector"
  - "Drizzle ORM"
  - "Vercel AI SDK 5.0"
  - "OpenAI GPT-4o"
  - "Clerk Auth"
  - "Stripe Billing"
  - "Upstash Redis"
  - "Sentry"
  - "React Flow"
  - "Playwright"
  - "Vercel"

complexity: "Production"

---

## Overview

Converso AI is a multi-tenant SaaS platform that lets service businesses deploy bilingual AI chatbots backed by their own knowledge base. Each tenant gets a fully branded assistant that answers questions from verified content, captures leads, runs scripted conversation flows, and hands off to live agents — all manageable by a non-technical business owner through a self-service admin dashboard.

## The Challenge

Service businesses in the Mexico/US corridor face a triple bind:

- **Lead loss** — inquiries that arrive outside business hours go unanswered and never convert
- **Language gap** — customers expect native-quality service in their preferred language, but bilingual staffing is expensive
- **Trust deficit** — generic chatbots hallucinate answers about the business, eroding credibility

Existing solutions fail on at least one axis: they require developer setup, produce translation-artifact responses, or price out small businesses.

## The Solution

**Deterministic RAG** retrieves relevant knowledge chunks before the LLM call and injects them as system context. Every answer traces back to uploaded content — website scrapes, PDFs, or manual entries. Source URLs are automatically attributed.

**Native bilingual design** detects the user's language from their first message and maintains it through the entire conversation. System prompts, starter questions, and playbook flows all support dual-language configuration.

**Visual playbook builder** (React Flow) lets business owners design multi-step conversation flows with conditional branching, data capture, and live agent handoff — without writing code.

**One-tag embed widget** drops onto any website. Appearance, behavior, and starter questions are configured from the admin panel.

**Admin dashboard** provides knowledge ingestion (website scraping, file uploads, manual entry), lead management with contact scoring, live chat queues with agent routing, and Stripe-powered billing with usage metering.

## Technical Highlights

- **Multi-tenant isolation** — every DB query scopes to `businessId`; knowledge, conversations, settings, and billing are fully isolated
- **pgvector HNSW indexes** for sub-linear cosine similarity search across knowledge bases
- **Streaming AI responses** via Vercel AI SDK 5.0 with real-time token delivery
- **RBAC** — owner/admin/member roles enforced at every API route via `requirePermission()` middleware
- **Security headers** — CSP, HSTS, X-Frame-Options, Permissions-Policy applied at the edge via Next.js 16 proxy
- **Sentry monitoring** — client, server, and edge runtime error tracking with source map uploads
- **Upstash Redis rate limiting** — distributed sliding-window limiter across Vercel serverless instances
- **Runtime env validation** — Zod schema validates all required vars at startup, fails fast in production
- **Playwright E2E tests** — 12 test suites covering chat, onboarding, admin APIs, embed widget, and cross-tenant isolation
- **Bundle optimization** — admin content lazy-loaded via `next/dynamic`, presentational components converted to server components
- **WhatsApp channel** — multi-channel support via Vercel Chat SDK, strategic differentiator for Mexico market

## Results

| Capability | Implementation |
|------------|---------------|
| Knowledge ingestion | Website scraping, PDF/DOCX/CSV upload, manual entry |
| Vector search | pgvector with HNSW indexes, cosine similarity |
| Conversation flows | Visual playbook builder with 7 node types |
| Lead management | Contact scoring, activity tracking, CSV import/export |
| Live chat | Agent queue with priority routing and AI summaries |
| Billing | Stripe subscriptions with usage-based metering |
| Widget | One-tag embed with configurable appearance |
| Multi-channel | WhatsApp via Vercel Chat SDK |
| Monitoring | Sentry + Vercel Analytics + Speed Insights |
| Rate limiting | Upstash Redis distributed limiter |
