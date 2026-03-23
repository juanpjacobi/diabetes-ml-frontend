# Diabetes Prediction Frontend

Angular 19 frontend for the multiclass diabetes prediction app. Connects to the [diabetes-ml-api](https://github.com/jokerwow/diabetes-ml-api) FastAPI backend.

---

## Overview

Single-page form that collects 11 clinical features and returns a prediction from the ML model:

| Result | Color | Meaning |
|---|---|---|
| Class 0 | Green | No diabetes |
| Class 1 | Yellow | Prediabetes / borderline |
| Class 2 | Red | Confirmed diabetes |

---

## Project structure

```
diabetes-frontend/
├── src/
│   ├── app/
│   │   ├── app.ts                    # Root component — form logic and state
│   │   ├── app.html                  # Form template
│   │   ├── app.css                   # Styles and result color classes
│   │   ├── prediction.service.ts     # HttpClient wrapper for POST /predict
│   │   ├── app.spec.ts               # Component unit tests (Karma/Jasmine)
│   │   └── prediction.service.spec.ts # Service unit tests
│   └── environments/
│       ├── environment.ts            # Dev: http://localhost:8000
│       └── environment.prod.ts       # Prod: Render API URL
└── package.json
```

---

## Setup

```bash
npm install
```

---

## Run locally

```bash
ng serve
```

App available at `http://localhost:4200`

Requires the [diabetes-ml-api](https://github.com/jokerwow/diabetes-ml-api) running on `http://localhost:8000`.

---

## Run tests

```bash
ng test
```

Or headless (CI):

```bash
ng test --watch=false --browsers=ChromeHeadless
```

---

## Build for production

```bash
ng build
```

Output in `dist/`. Deploy the contents of `dist/diabetes-frontend/browser/` to Vercel or Netlify.
