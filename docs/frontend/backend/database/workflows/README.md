# CLS AI Engine - Workflows

This folder contains the **automation workflows** that power CLS AI Engine.

It defines how tasks move from input → AI processing → publishing → analytics.

These workflows will primarily be executed using **n8n (or similar automation tools)**.

---

## Purpose

The workflow system automates the entire content lifecycle:

- Content research
- SEO generation
- Article writing
- Affiliate insertion
- Image generation prompts
- WordPress publishing
- Social media distribution
- Analytics tracking

---

## Core Concept

Each workflow is a **step-by-step automation pipeline**.

> Input → AI Processing → Output → Distribution → Feedback Loop

---

## Main Workflows

---

### 1. Content Generation Workflow

```text id="wf1"
Trigger: New Tool / URL Input
      ↓
Fetch Data (API / Scraping / AI)
      ↓
Research Agent
      ↓
SEO Agent
      ↓
Writer Agent
      ↓
Affiliate Link Injector
      ↓
Output Formatter
      ↓
Send to WordPress Draft
