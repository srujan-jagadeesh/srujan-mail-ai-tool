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

🚀 Installation
Clone or Download:
Clone this repository or download it as a .ZIP file and extract it.

Bash
git clone [https://github.com/YOUR_USERNAME/srujan-mail-ai-tool.git](https://github.com/YOUR_USERNAME/srujan-mail-ai-tool.git)
Open Chrome Extensions:
Open Google Chrome and navigate to:

Plaintext
chrome://extensions/
Enable Developer Mode:
Toggle on Developer mode in the top-right corner.

Load Unpacked Extension:
Click Load unpacked in the top-left corner and select the project folder containing manifest.json.

🔑 Setup & Usage
Obtain a free Gemini API key from Google AI Studio.

Click the srujan mail ai tool icon in your Chrome toolbar.

Paste your Gemini API key into the input field and click code.

Open Gmail and click Reply on any message.

Click the ✨ AI Reply button next to Gmail's Send button to generate a draft.

Use the floating popup to shorten, formalize, expand, or customize the draft.

🛠️ Tech Stack
Platform: Chrome Extension Manifest V3

Language: JavaScript (ES6+ Vanilla), HTML5, CSS3

AI Model: Google Gemini API (gemini-3.6-flash)

API Requests: Fetch API with dynamic context extraction

Payment API: QR Server API (upi://pay protocol integration)

☕ Support Development
If you find this tool helpful, consider supporting the developer:

UPI ID: srujansrujan128-1@oksbi

Supported Apps: Google Pay, PhonePe, Paytm

📄 License
This project is open-source and available under the MIT License.
