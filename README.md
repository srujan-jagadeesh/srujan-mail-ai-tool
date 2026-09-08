# srujan mail ai tool v1.0 ✉️✨

A lightweight, high-performance Chrome Extension (Manifest V3) that integrates Google's Gemini AI directly inside Gmail compose windows. Automatically extract thread context, draft intelligent replies, and refine responses with customized tone adjustments.

---

## ✨ Features

- 🧠 **Context-Aware AI Replies:** Analyzes prior email thread history (`div.a3s`, `div.gmail_quote`) to construct tailored draft responses.
- 🎛️ **Interactive Refine Menu:** Floating, draggable control box attached to Gmail compose windows.
- ⚡ **Quick-Action Chips:** 
  - `⚡ Shorten`: Make the draft concise and direct.
  - `👔 Formal`: Rewrite in a polite, professional tone.
  - `📝 Expand`: Elaborate with additional context.
  - `🔄 Re-draft`: Generate a completely fresh response.
  - `⛔ don't click`: Interactive donation modal with UPI QR code.
- 💬 **Custom AI Instructions:** Type custom natural language prompts to tweak drafts on the fly.
- 🔑 **Smart API Key Management:** Saves your Gemini API key locally; seamlessly hides the configuration input box and provides a **🔑 Change API Key** option in the extension popup.
- 📱 **Mobile & Desktop UPI Payments:** Dynamic QR code generation for GPay, PhonePe, and Paytm.

---

## 📁 Project Structure

```text
├── manifest.json          # Manifest V3 extension configuration
├── content.js             # Gmail DOM observer, UI injection, and Gemini API caller
├── popup.html             # Popup menu markup with dark mode UI
├── popup.js               # Local storage API key handler and payment triggers
├── profile.jpg            # Profile avatar for donation UI
└── icon.png               # Extension branding icon

# 🚀 Installation Guide

Follow these steps to install and set up **srujan mail ai tool v1.0** on Google Chrome.

---

## 📋 Prerequisites

- **Google Chrome** (or any Chromium-based browser like Brave or Microsoft Edge)
- A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

## 🛠️ Step-by-Step Installation

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local computer:

```bash
git clone [https://github.com/srujan-jagadeesh/srujan-mail-ai-tool.git](https://github.com/srujan-jagadeesh/srujan-mail-ai-tool.git)
cd srujan-mail-ai-tool

Step 2: Open Chrome Extensions Page
Open Google Chrome and navigate to the extensions management page by entering this URL in your address bar:

Plaintext
chrome://extensions/
Step 3: Enable Developer Mode
Locate the Developer mode toggle switch in the top-right corner of the Extensions page and turn it ON.

Step 4: Load the Extension
Click the Load unpacked button located in the top-left corner.

Select the srujan-mail-ai-tool directory folder (the folder containing manifest.json).

The srujan mail ai tool extension will now be active in Chrome.

🔑 Setup & Verification
Obtain a free Gemini API key from Google AI Studio.

Click the srujan mail ai tool icon in your Chrome extension toolbar.

Paste your Gemini API key into the input field and click code.

Open Gmail and click Reply on any email thread.

Verify that the ✨ AI Reply button appears next to Gmail's Send button.
