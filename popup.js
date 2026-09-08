document.addEventListener("DOMContentLoaded", () => {
  const configBox = document.getElementById("configBox");
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");
  const changeKeyBtn = document.getElementById("changeKeyBtn");

  const payBtn = document.getElementById("payBtn");
  const qrBox = document.getElementById("qrBox");
  const qrCodeImg = document.getElementById("qrCodeImg");

  // Initial Key Check
  chrome.storage.local.get(["geminiApiKey"], (data) => {
    if (data.geminiApiKey) {
      // Key exists: hide key box, show "Change API Key" button
      configBox.style.display = "none";
      changeKeyBtn.style.display = "block";
      apiKeyInput.value = data.geminiApiKey;
    } else {
      // First time setup: show key box, hide "Change API Key" button
      configBox.style.display = "block";
      changeKeyBtn.style.display = "none";
    }
  });

  // Save/Update Key Handler
  saveBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      status.textContent = "Enter a valid key";
      status.style.color = "#f87171";
      return;
    }

    chrome.storage.local.set({ geminiApiKey: key }, () => {
      status.textContent = "Saved!";
      status.style.color = "#4ade80";

      setTimeout(() => {
        status.textContent = "";
        configBox.style.display = "none";
        changeKeyBtn.style.display = "block";
      }, 500);
    });
  });

  // Reveal Key Box when "Change API Key" is clicked
  changeKeyBtn.addEventListener("click", () => {
    configBox.style.display = "block";
    changeKeyBtn.style.display = "none";
    apiKeyInput.focus();
  });

  // Buy Me a Coffee Button Handler
  const UPI_ID = "srujansrujan128-1@oksbi";
  const NAME = "Srujan";
  const AMOUNT = "12";
  const NOTE = "Buy me a coffee";

  const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(NAME)}&am=${encodeURIComponent(AMOUNT)}&cu=INR&tn=${encodeURIComponent(NOTE)}`;
  const qrCodeApi = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  payBtn.addEventListener("click", () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = upiUrl;
    } else {
      qrCodeImg.src = qrCodeApi;
      qrBox.style.display = "block";
    }
  });
});