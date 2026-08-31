# Quantum’27 — UI Frontend

A UI-first React + TypeScript + Vite implementation for the Quantum’27 intra-department fest at Kongu Engineering College.

## Run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Routes

Public: `/`, `/schedule`, `/events`, `/events/:slug`, `/register/:slug`, `/register/success`

Hidden admin: `/admin-login`, `/admin`, `/admin/registrations`, `/admin/events`, `/admin/evaluation`, `/admin/exports`

## Backend status

This package intentionally uses mock/static services. Google Apps Script, Google Sheets, Supabase, real authentication, duplicate-registration checks, Excel generation and the exact event PDF export are **not connected yet**.

## Assets

`public/assets/campus-hero.png` is the supplied college image. `public/assets/kec-logo.png` is a temporary cropped logo asset made from the supplied reference image; replace it with the higher-resolution KEC logo already uploaded in your Antigravity project before final deployment.

## Content status

Common rules and the supplied Vox Pop – Debate details are reflected. Missing event-specific details remain clearly marked/configurable and should be updated when the remaining PDFs are supplied.
