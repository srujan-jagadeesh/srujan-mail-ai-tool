function extractEmailThreadContext() {
  const emailBodies = document.querySelectorAll("div.a3s, div.gmail_quote");
  let threadText = "";
  emailBodies.forEach((el, index) => {
    const text = el.innerText.trim();
    if (text) {
      threadText += `--- Message ${index + 1} ---\n` + text + "\n\n";
    }
  });
  return threadText || "No prior email thread found.";
}

function cleanModelOutput(text) {
  return text
    .replace(/(?:###\s*)?Option\s*\d+:?[\s\S]*?(?=\n\n|\n>|\n[A-Z]|$)/gi, '')
    .replace(/\*\*Subject:\*\*.*?\n/gi, '')
    .replace(/Subject:.*?\n/gi, '')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s?/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/---/g, '')
    .trim();
}

async function callGemini(apiKey, promptPayload) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptPayload }] }]
      })
    }
  );

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.error?.message || "API Request failed");
  }
  const text = resData.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No text generated.");
  return cleanModelOutput(text);
}

function injectAiButton() {
  const sendButtons = document.querySelectorAll(
    'div[role="button"][aria-label*="Send"], .aoO, div[data-tooltip*="Send"]'
  );

  sendButtons.forEach((sendBtn) => {
    const targetParent = sendBtn.closest('.gU') || sendBtn.closest('td') || sendBtn.parentElement;
    
    if (!targetParent || targetParent.querySelector(".gemini-ai-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "gemini-ai-wrapper";
    wrapper.dataset.hasGenerated = "false";
    wrapper.style.cssText = "position: relative; display: inline-flex; align-items: center; margin-left: 10px; vertical-align: middle;";

    const aiBtn = document.createElement("button");
    aiBtn.className = "gemini-ai-draft-btn";
    aiBtn.innerText = "✨ AI Reply";
    aiBtn.type = "button";
    aiBtn.style.cssText = `
      background-color: #0b57d0;
      color: #ffffff;
      border: none;
      border-radius: 18px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      white-space: nowrap;
    `;

    // Floating Refine Menu
    const menu = document.createElement("div");
    menu.className = "gemini-refine-menu";
    menu.style.cssText = `
      display: none;
      position: absolute;
      bottom: 42px;
      left: 0;
      background: #ffffff;
      border: 1px solid #dadce0;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      padding: 10px 12px 12px 12px;
      width: 320px;
      z-index: 9999;
      font-family: Roboto, sans-serif;
    `;

    menu.innerHTML = `
      <div class="gemini-drag-header" style="display: flex; justify-content: space-between; align-items: center; cursor: move; padding-bottom: 6px; margin-bottom: 8px; border-bottom: 1px solid #f1f3f4; user-select: none;">
        <span style="font-size: 12px; font-weight: 600; color: #3c4043;">✨ Refine Draft</span>
        <div style="display: flex; gap: 4px; align-items: center;">
          <button class="gemini-min-btn" title="Minimize/Expand" style="background: none; border: none; cursor: pointer; font-size: 14px; color: #5f6368; padding: 0 4px; line-height: 1;">−</button>
          <button class="gemini-close-btn" title="Close" style="background: none; border: none; cursor: pointer; font-size: 12px; color: #5f6368; padding: 0 4px; line-height: 1;">✕</button>
        </div>
      </div>
      <div class="gemini-menu-body">
        <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px;">
          <button class="gemini-chip" data-action="Shorten">⚡ Shorten</button>
          <button class="gemini-chip" data-action="Formalize">👔 Formal</button>
          <button class="gemini-chip" data-action="Elaborate">📝 Expand</button>
          <button class="gemini-chip" data-action="Retry">🔄 Re-draft</button>
          <button class="gemini-chip gemini-dont-click-btn" style="background: #fce8e6; color: #d93025; border-color: #fad2cf; font-weight: 600;">⛔ don't click</button>
        </div>
        <div style="display: flex; gap: 6px;">
          <input type="text" class="gemini-custom-input" placeholder="e.g. make it shorter & friendlier..." style="flex: 1; padding: 6px 8px; font-size: 12px; border: 1px solid #dadce0; border-radius: 6px; outline: none;">
          <button class="gemini-apply-btn" style="background: #0b57d0; color: white; border: none; padding: 6px 10px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;">Apply</button>
        </div>
      </div>
    `;

    if (!document.getElementById("gemini-extension-style")) {
      const style = document.createElement("style");
      style.id = "gemini-extension-style";
      style.textContent = `
        .gemini-chip {
          background: #f1f3f4;
          border: 1px solid #dadce0;
          border-radius: 14px;
          padding: 4px 10px;
          font-size: 11px;
          cursor: pointer;
          color: #3c4043;
          font-weight: 500;
          transition: background 0.2s;
        }
        .gemini-chip:hover {
          background: #e8eaed;
        }
      `;
      document.head.appendChild(style);
    }

    wrapper.appendChild(aiBtn);
    wrapper.appendChild(menu);
    targetParent.appendChild(wrapper);

    // Draggable Window Handler
    const header = menu.querySelector(".gemini-drag-header");
    let isDragging = false;
    let currentX = 0, currentY = 0, initialX = 0, initialY = 0;

    header.addEventListener("mousedown", (e) => {
      if (e.target.closest("button")) return;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        menu.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Minimize & Close Handlers
    const minBtn = menu.querySelector(".gemini-min-btn");
    const closeBtn = menu.querySelector(".gemini-close-btn");
    const menuBody = menu.querySelector(".gemini-menu-body");

    minBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menuBody.style.display === "none") {
        menuBody.style.display = "block";
        minBtn.innerText = "−";
      } else {
        menuBody.style.display = "none";
        minBtn.innerText = "□";
      }
    });

    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.style.display = "none";
    });

    // "don't click" In-Page Donation Modal Handler (Without Yellow Button)
    const dontClickBtn = menu.querySelector(".gemini-dont-click-btn");
    dontClickBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const upiUrl = "upi://pay?pa=srujansrujan128-1@oksbi&pn=Srujan&am=12&cu=INR&tn=Buy%20me%20a%20coffee";
      let overlay = document.getElementById("srujan-qr-overlay");

      if (!overlay) {
        const profileImgUrl = chrome.runtime.getURL("profile.jpg");

        overlay = document.createElement("div");
        overlay.id = "srujan-qr-overlay";
        overlay.style.cssText = `
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 999999;
        `;

        overlay.innerHTML = `
          <div style="background: #1e293b; color: #f8fafc; padding: 20px; border-radius: 16px; text-align: center; width: 300px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative; border: 1px solid rgba(255,255,255,0.1);">
            <button id="close-qr-overlay" style="position: absolute; top: 12px; right: 14px; background: none; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; line-height: 1;">✕</button>
            
            <!-- Centered Profile Image -->
            <img src="${profileImgUrl}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2.5px solid #ffdd00; margin: 0 auto 10px auto; display: block;" />
            
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 700; color: #ffffff;">Buy Me a Coffee ☕</h3>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: #94a3b8; line-height: 1.3;">Support the development of srujan mail ai tool!</p>

            <!-- Dashed Divider -->
            <div style="border-top: 1px dashed rgba(255, 255, 255, 0.15); margin-bottom: 16px;"></div>

            <!-- QR Code -->
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}" style="width: 160px; height: 160px; border-radius: 12px; border: 3px solid #ffffff; margin: 0 auto; display: block;" />
            
            <div style="margin-top: 10px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
              Scan via GPay / PhonePe / Paytm<br>
              <b style="color: #60a5fa; font-size: 11px;">srujansrujan128-1@oksbi</b>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);

        overlay.querySelector("#close-qr-overlay").addEventListener("click", () => overlay.remove());
        overlay.addEventListener("click", (evt) => {
          if (evt.target === overlay) overlay.remove();
        });
      }
    });

    // Generation / Refinement Execution
    const runGeneration = async (refineInstruction = null) => {
      const composeBox = sendBtn.closest('div[role="dialog"], div.nH, div.aDH, form') || document;
      const activeTextarea = composeBox.querySelector('div[role="textbox"]');

      if (!activeTextarea) {
        alert("Could not find the email text body.");
        return;
      }

      aiBtn.innerText = "✨ Drafting...";
      aiBtn.disabled = true;

      const currentText = activeTextarea.innerText.trim();
      const emailContext = extractEmailThreadContext();

      chrome.storage.local.get(["geminiApiKey"], async (data) => {
        const apiKey = data.geminiApiKey;
        if (!apiKey) {
          alert("Please click the extension icon in Chrome and set your Gemini API key first.");
          aiBtn.innerText = wrapper.dataset.hasGenerated === "true" ? "✨ Refine AI" : "✨ AI Reply";
          aiBtn.disabled = false;
          return;
        }

        let promptPayload = "";

        if (refineInstruction) {
          promptPayload = `You are an email writing assistant inside Gmail.
Modify the existing email draft strictly according to this instruction: "${refineInstruction}".

EXISTING DRAFT:
${currentText}

EMAIL THREAD CONTEXT:
${emailContext}

STRICT FORMATTING RULES:
- Output ONLY the modified plain text email body ready to send.
- Do NOT include Markdown (no ###, **, >) or Subject headers.`;
        } else {
          promptPayload = `You are an email writing assistant inside Gmail.
Draft ONLY the final body text of ONE clean, professional email reply.

${currentText ? `USER'S INITIAL INPUT / INSTRUCTIONS: "${currentText}"` : ""}

EMAIL THREAD CONTEXT:
${emailContext}

STRICT FORMATTING RULES:
- Output ONLY the plain text email response ready to send.
- Do NOT include Markdown formatting (no ###, **, >) or Subject headers.`;
        }

        try {
          const draftText = await callGemini(apiKey, promptPayload);
          activeTextarea.innerHTML = draftText.replace(/\n/g, '<br>');
          activeTextarea.dispatchEvent(new Event("input", { bubbles: true }));

          wrapper.dataset.hasGenerated = "true";
          aiBtn.innerText = "✨ Refine AI";
          menu.style.display = "block";
          menuBody.style.display = "block";
          minBtn.innerText = "−";
        } catch (err) {
          alert("Error: " + err.message);
          aiBtn.innerText = wrapper.dataset.hasGenerated === "true" ? "✨ Refine AI" : "✨ AI Reply";
        } finally {
          aiBtn.disabled = false;
        }
      });
    };

    aiBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (wrapper.dataset.hasGenerated === "true") {
        menu.style.display = menu.style.display === "block" ? "none" : "block";
      } else {
        runGeneration(null);
      }
    });

    menu.querySelectorAll(".gemini-chip:not(.gemini-dont-click-btn)").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = chip.getAttribute("data-action");
        let instruction = action;
        if (action === "Shorten") instruction = "Make the draft significantly shorter, concise, and direct.";
        if (action === "Formalize") instruction = "Rewrite to sound highly professional, polite, and formal.";
        if (action === "Elaborate") instruction = "Expand on the draft with extra polite context and detailed sentences.";
        if (action === "Retry") instruction = "Generate a completely fresh alternate response.";

        runGeneration(instruction);
      });
    });

    const applyBtn = menu.querySelector(".gemini-apply-btn");
    const customInput = menu.querySelector(".gemini-custom-input");

    const handleCustomRefine = (e) => {
      e.stopPropagation();
      const val = customInput.value.trim();
      if (val) {
        runGeneration(val);
        customInput.value = "";
      }
    };

    applyBtn.addEventListener("click", handleCustomRefine);
    customInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleCustomRefine(e);
    });
  });
}

// Observe Gmail DOM updates
const observer = new MutationObserver(() => injectAiButton());
observer.observe(document.body, { childList: true, subtree: true });

// Initial injection execution
injectAiButton();