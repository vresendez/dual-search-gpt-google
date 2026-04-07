# Dual-Search Study: Sunscreen Nanoparticle Health Risks

This application is a high-fidelity research platform designed for a controlled user study. It evaluates how different search interface paradigms (Google-style Search Results vs. ChatGPT-style Conversational AI) influence user perception and information-gathering behavior regarding the health risks of mineral nanoparticles in sunscreens.

## 🔬 Experimental Context

The experiment focuses on a specific scientific topic: **"Are nanoparticles in sunscreen (ZnO and TiO2) safe for humans and the environment?"**

To ensure a controlled environment, the application uses a fixed set of six curated research articles from diverse institutional sources, allowing researchers to measure user interactions under identical content conditions.

## 🚀 Key Features

### 1. High-Fidelity Search Interfaces
- **Google Search View**: Replicates the modern Google SERP layout, featuring:
  - **AI Overview**: A prominent, synthesized summary section with sidecard references.
  - **Rounded Search Bar**: Interactive pill-shaped header with search, mic, and camera icons.
  - **Topical Chips**: Quick filters for "Safety", "Zinc oxide", and "Environmental Impact".
  - **Authentic Search Cards**: Results include favicons, breadcrumbs, and Google-style typography.
- **ChatGPT View**: A professional conversational interface featuring:
  - **Contextual Sidebar**: Access to chat history and user profile management.
  - **Structured Responses**: AI-generated narratives with numbered headings, section dividers, and formal citations.
  - **Conversational Input**: A sleek pill-shaped input area with a model-status banner.

### 2. Institutional Article Pages
Six bespoke article layouts designed to mirror the authentic design systems of their respective institutions:
- **PubMed**: Clinical academic layout with NLM/NIH branding.
- **European Commission**: Official Europa Web design with sidebar navigation and scientific committee formatting.
- **Wikipedia**: The classic "Free Encyclopedia" aesthetic with infoboxes and serif typography.
- **The Guardian**: News-style layout with signature mastheads and yellow accents.
- **ScienceDirect**: Professional journal interface with author metadata and highlight boxes.
- **World Health Organization (WHO)**: Public health guidance format with breadcrumbs and highlight summaries.

## 🛠️ Technology Stack
- **Frontend**: React (Vite)
- **Styling**: Vanilla CSS (High-fidelity custom components)
- **Routing**: React Router (Supporting `/google`, `/chtgpt`, and `/article/:id`)
- **Data**: Controlled `searchService.js` returning curated study results.

## 📂 Project Structure
- `src/components/`: Core UI components for search views and article layouts.
- `src/services/`: The `searchService` providing fixed experimental data.
- `src/images/`: Official institutional logos and study-related assets.
- `src/index.css`: Centralized high-fidelity styling for all branding systems.

## 🏁 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
