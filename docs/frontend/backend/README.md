# CLS AI Engine - Backend

This folder contains the **core backend system** of CLS AI Engine.

It is responsible for handling:
- AI processing
- Workflow orchestration
- API management
- Content generation logic
- Integrations (WordPress, n8n, Social Media, Analytics)

---

## Purpose

The backend acts as the **engine layer** that connects:

User Input → AI Models → Automation Workflows → Publishing Systems

It processes all requests coming from the frontend and returns structured outputs.

---

## Core Responsibilities

### 1. AI Content Generation
- Generate SEO blog articles
- Create product reviews
- Write affiliate content
- Generate social media posts

### 2. AI Agent System
- Research Agent
- SEO Optimization Agent
- Content Writer Agent
- Affiliate Link Agent
- Image Prompt Agent
- Publisher Agent
- Analytics Agent

---

### 3. Workflow Management
- Manage multi-step AI pipelines
- Handle task sequencing
- Retry failed operations
- Optimize response flow

---

### 4. API Layer
- REST APIs for frontend communication
- Webhook endpoints for n8n
- Integration APIs for external services

---

## System Flow

```text id="clsbkflow1"
Frontend Request
      ↓
Backend API (CLS Engine)
      ↓
AI Orchestrator
      ↓
Agent Pipeline:
   ├── Research Agent
   ├── SEO Agent
   ├── Writer Agent
   ├── Affiliate Agent
   ├── Image Agent
      ↓
Output Formatter
      ↓
WordPress / Social Media / Database
