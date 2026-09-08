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
