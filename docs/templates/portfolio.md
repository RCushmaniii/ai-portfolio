---
# =============================================================================
# PORTFOLIO.md — Project Portfolio Metadata
# =============================================================================
# This file defines how this project appears in the CushLabs.ai portfolio.
# Place at repository root. The sync script reads this file automatically.
# =============================================================================

# === DISPLAY CONTROL ===
# These fields control whether and how the project appears in the portfolio

portfolio_enabled: true           # Set to false to hide from portfolio
portfolio_priority: 5             # 1-10, lower = higher priority (1 shows first)
portfolio_featured: false         # true = show "Featured" badge, appears in highlights
portfolio_last_reviewed: "2024-12-27"  # YYYY-MM-DD, when you last updated this file

# === IDENTITY ===
# Core identification for the project

title: "Project Title"            # Display name (max 100 chars)
tagline: "One-line description of what this does and why it matters"  # Max 200 chars
slug: "project-slug"              # URL-safe identifier (lowercase, hyphens only)
                                  # Used in: /portfolio/project-slug

# === CATEGORIZATION ===
# How the project is classified and filtered

category: "AI Automation"         # One of: AI Automation | Templates | Tools | Client Work
target_audience: "Who benefits from this"  # e.g., "SMB Customer Success Leaders"
tags:                             # Searchable tags (max 10)
  - "tag1"
  - "tag2"
  - "tag3"

# === VISUAL ASSETS ===
# Images and video for portfolio display

thumbnail: ""                     # URL to card thumbnail (16:9 ratio, ~400x225)
                                  # Leave empty to use fallback image

hero_images:                      # Screenshots for detail page carousel (max 10)
  - ""                            # Full URLs to images
  # - "https://example.com/screenshot-2.png"
  # - "https://example.com/screenshot-3.png"

demo_video_url: ""                # YouTube or Loom embed URL (optional)
                                  # e.g., "https://www.youtube.com/embed/VIDEO_ID"

# === LINKS ===
# External resources

live_url: ""                      # Production URL where project can be demoed
                                  # e.g., "https://demo.cushlabs.ai/project"

case_study_url: ""                # Link to detailed write-up (optional)
                                  # e.g., "https://cushlabs.ai/blog/case-study-xyz"

# === BUSINESS VALUE ===
# What problem does this solve? (This is what clients care about most)

problem_solved: |
  Describe the specific problem this project solves. 
  Focus on pain points and business impact, not technical details.
  Keep under 500 characters.

key_outcomes:                     # Bullet points of value delivered (max 10)
  - "Outcome 1 - be specific and measurable if possible"
  - "Outcome 2"
  - "Outcome 3"

# === TECHNICAL ===
# Stack and complexity for technical reviewers

tech_stack:                       # Technologies used (max 20, most important first)
  - "Next.js 14"
  - "TypeScript"
  - "Tailwind CSS"
  # Add more as needed

complexity: "Production"          # One of: MVP | Production | Enterprise
                                  # MVP = proof of concept
                                  # Production = deployed, production-ready
                                  # Enterprise = multi-tenant, scalable

---

## Overview

Write 2-3 paragraphs describing what this project is and why it exists. Focus on the business purpose rather than technical implementation. This is the first thing visitors read after clicking through from the portfolio grid.

Think about:
- What does it do from a user's perspective?
- Why was it built?
- What makes it valuable?

## The Challenge

Describe the problem space in more detail. What pain points exist? Who experiences them? What was the status quo before this solution?

This section builds empathy and helps readers understand why the project matters.

## The Solution

Explain how the application addresses the challenge. Walk through the user experience. What does someone actually do with this tool?

Avoid technical jargon here—this section is for anyone evaluating your work, not just engineers.

## Technical Highlights

For technical reviewers (engineers, CTOs), briefly highlight interesting implementation details:

- **Architecture:** Key architectural decisions and why they were made
- **Performance:** Any notable optimizations
- **Integrations:** Third-party services or APIs used
- **Patterns:** Design patterns or techniques worth noting

Keep this scannable—bullet points work well.

## Results

If available, share outcomes:

- Metrics (response time improvements, cost savings, user growth)
- Testimonials or feedback
- Lessons learned

If this is a portfolio/demo project, describe potential impact or what success would look like for a real deployment.

---

<!-- 
TIPS FOR A STRONG PORTFOLIO ENTRY:

1. THUMBNAIL: Use a clean screenshot of the main interface. 
   Crop to 16:9 ratio. Avoid cluttered or dark images.

2. HERO IMAGES: Include 3-5 screenshots showing:
   - Main dashboard/interface
   - Key feature in action
   - Mobile view (if applicable)
   - Admin/config panel (if applicable)

3. TAGLINE: Make it outcome-focused, not feature-focused.
   ❌ "A chatbot built with React and OpenAI"
   ✅ "Reduce support tickets by 40% with 24/7 AI responses"

4. PROBLEM_SOLVED: Be specific about the pain.
   ❌ "Helps with customer support"
   ✅ "SMBs waste 20+ hours/week answering the same 50 questions"

5. KEY_OUTCOMES: Quantify when possible.
   ❌ "Faster responses"
   ✅ "Average response time under 2 seconds"

6. TECH_STACK: Order by importance/relevance to the project.
   Lead with the main framework, then supporting tools.

7. BODY CONTENT: Write for a technical founder who has 2 minutes.
   They want to know: Does this person solve real problems?
-->
