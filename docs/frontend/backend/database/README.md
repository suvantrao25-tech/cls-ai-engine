# CLS AI Engine - Database

This folder contains the **data architecture and database design** for CLS AI Engine.

It defines how all system data is stored, structured, and accessed.

---

## Purpose

The database layer stores all critical information required by the system, including:

- AI generated content
- Projects and workflows
- Affiliate links
- User activity
- Analytics data
- Publishing history

It acts as the **memory system** of CLS AI Engine.

---

## Core Data Entities

### 1. Projects
Stores all user-created content projects.

- Project ID
- Tool Name / URL
- Category
- Status (Draft / Processing / Published)
- Created At

---

### 2. Content
Stores AI-generated content outputs.

- Content ID
- Project ID
- SEO Title
- Meta Description
- Full Article
- Keywords
- Slug
- Status

---

### 3. Affiliate Links
Stores monetization data.

- Tool Name
- Affiliate URL
- Network (InVideo, Make, etc.)
- Conversion Tracking (optional)

---

### 4. Users (Future SaaS)
For multi-user system.

- User ID
- Name
- Email
- Plan Type
- Usage Limits

---

### 5. Analytics
Stores performance data.

- Content ID
- Page Views
- Clicks
- CTR
- Ranking Position
- Revenue Estimate

---

### 6. Publishing Logs
Tracks where content is published.

- Content ID
- Platform (WordPress, Facebook, etc.)
- Status
- Timestamp

---

## Database Schema (Conceptual)

```text id="dbschema1"
Users
  └── Projects
        └── Content
              ├── Affiliate Links
              ├── Analytics
              └── Publishing Logs
