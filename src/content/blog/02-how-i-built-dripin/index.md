---
title: "How I Built an AI Wardrobe App That Extracts Clothes From Photos"
description: "The technical story behind dripin — from Gemini vision to a full Go + React Native stack."
date: "03/14/2026"
draft: true
---

I take a photo of my outfit in the morning. My app looks at it and says: "that's a navy crewneck, dark jeans, white sneakers." It catalogs each item, tracks what I've worn, and the next day tells me what to wear based on the weather and what's been sitting in my closet too long.

That's [dripin](https://dripin.app). Here's how I built it.

## The idea

Most wardrobe apps make you photograph each item individually. Shirt on a hanger, pants laid flat, shoes from above. Nobody does this. It's tedious, and the app dies after 3 days because you uploaded 4 items and got bored.

My approach: **one photo of your full outfit → AI extracts every item automatically.** You get dressed, take a mirror selfie, and your entire wardrobe builds itself over time.

The competitor in this space is [Alta](https://altadaily.com) ($11M seed, backed by LVMH). They do per-item photos. I think that's the wrong UX.

## The stack

I wanted to build something production-grade, not a weekend hack. Here's what I landed on:

**Backend: Go**
- Chose Go over Python for the API because I wanted something fast, typed, and easy to deploy as a single binary
- PostgreSQL for structured data (users, items, outfits, wear history)
- MinIO for image storage (S3-compatible, self-hosted on my Oracle Free Tier server)
- Clean architecture: `internal/` with handlers, services, repositories

**Frontend: React Native + Expo**
- Cross-platform from day one. I use an iPhone, my friends have Android
- Expo Router for file-based navigation
- i18n support (French + English) from the start — learned the hard way that retrofitting translations is painful

**AI: Google Gemini**
- Gemini Pro Vision for the core feature: analyzing outfit photos
- The prompt engineering took longer than the code. Getting Gemini to consistently output structured JSON with item descriptions, colors, categories, and style tags required ~20 iterations
- Function calling for the AI stylist chat — it can query your wardrobe and suggest specific items you own

## The hardest part: extraction quality

Getting an AI to look at a photo and say "there are 4 items here" is easy. Getting it to:

1. **Correctly segment** overlapping items (jacket over shirt)
2. **Generate useful descriptions** (not just "blue top" but "navy cotton crewneck, relaxed fit")
3. **Assign consistent tags** across photos (so filtering actually works)
4. **Handle bad lighting, mirrors, busy backgrounds**

...took weeks of prompt iteration. The key insight: **few-shot examples in the system prompt.** I feed Gemini 3-4 example outfit photos with the exact JSON structure I expect, and accuracy went from ~60% to ~90%.

## The architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│  React Native│───→│   Go API     │───→│  PostgreSQL  │
│  (Expo)      │    │  (net/http)  │    │             │
└─────────────┘    └──────┬───────┘    └─────────────┘
                          │
                    ┌─────┴──────┐
                    │   Gemini   │    ┌─────────────┐
                    │   Vision   │    │   MinIO      │
                    └────────────┘    │  (images)    │
                                      └─────────────┘
```

The flow when you snap an outfit:
1. Photo uploads to MinIO via the Go API
2. Go sends the image to Gemini with the extraction prompt
3. Gemini returns structured JSON: items, descriptions, colors, tags
4. Each item gets stored in PostgreSQL linked to the outfit
5. Frontend displays the extracted items for review/edit
6. Over time, the wear history builds up → recommendations improve

## What I'd do differently

**Start with the recommendation engine earlier.** I spent too long on the extraction and not enough on the "so what?" — the daily outfit suggestion is what makes people come back, not the catalog.

**Use a queue for AI processing.** Right now, extraction is synchronous. User waits 3-5 seconds while Gemini thinks. Should be: upload → immediate response → notification when extraction is done.

**Test with real users sooner.** I built for months before showing anyone. Classic builder mistake. The first friend who tried it said "cool but how do I delete an item?" — a feature I hadn't built because I never needed it myself.

## What's next

- TestFlight beta with friends and family
- Weather-based recommendations (already have the data, need to wire it up)
- Shopping suggestions: "you wear a lot of navy — here's a sale on navy items nearby"
- App Store launch

If you want early access, check [dripin.app](https://dripin.app) or hit me up on [X](https://x.com/eliebrosset).

---

*This is part of a series about building AI products as a solo developer. Next up: how I handle the economics of running Gemini API calls at scale without going broke.*
