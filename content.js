const STYLES_ID = "sloppedin-styles";
const LAUNCHER_ID = "sloppedin-launcher";
const MODAL_ID = "sloppedin-modal";
const OVERLAY_ID = "sloppedin-overlay";
const DRAFT_ID = "sloppedin-draft";
const GENERATE_ID = "sloppedin-generate";
const META_ID = "sloppedin-meta";
const ERROR_ID = "sloppedin-error";
const SLIDE_IN_CLASS = "sloppedin-visible";
const DEFAULT_PLACEHOLDER = "Write here...";

const INLINE_STYLES = `
  #${LAUNCHER_ID} {
    position: fixed;
    right: 48px;
    bottom: 104px;
    z-index: 2147483643;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(10, 102, 194, 0.18);
    border-radius: 999px;
    background: linear-gradient(180deg, #ffffff 0%, #f7f9fb 100%);
    color: #0a66c2;
    box-shadow: 0 16px 36px rgba(18, 35, 52, 0.16);
    cursor: pointer;
    font: 600 14px/1 "Segoe UI", Arial, sans-serif;
    padding: 12px 16px;
    transition: transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
  }

  #${LAUNCHER_ID}:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 42px rgba(18, 35, 52, 0.2);
    background: #ffffff;
  }

  #${OVERLAY_ID} {
    position: fixed;
    inset: 0;
    z-index: 2147483644;
    background: rgba(0, 0, 0, 0.36);
    opacity: 0;
    pointer-events: none;
    transition: opacity 160ms ease;
  }

  #${OVERLAY_ID}.${SLIDE_IN_CLASS} {
    opacity: 1;
    pointer-events: auto;
  }

  #${MODAL_ID} {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2147483645;
    width: min(640px, calc(100vw - 32px));
    max-height: calc(100vh - 48px);
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
    color: #1f1f1f;
    font-family: "Segoe UI", Arial, sans-serif;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transform: translate(-50%, -46%) scale(0.98);
    transition: opacity 160ms ease, transform 160ms ease;
  }

  #${MODAL_ID}.${SLIDE_IN_CLASS} {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%) scale(1);
  }

  .sloppedin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px 14px;
    border-bottom: 1px solid #e9e5df;
  }

  .sloppedin-title {
    font-size: 16px;
    font-weight: 600;
  }

  .sloppedin-subtitle {
    margin-top: 2px;
    font-size: 12px;
    color: #666666;
  }

  .sloppedin-close {
    border: 0;
    background: transparent;
    color: #666666;
    cursor: pointer;
    font-size: 24px;
    line-height: 1;
    padding: 2px 4px;
  }

  .sloppedin-body {
    padding: 18px 20px 16px;
    overflow: auto;
  }

  .sloppedin-textarea {
    width: 100%;
    min-height: 320px;
    max-height: calc(100vh - 240px);
    resize: none;
    overflow: hidden;
    border: 0;
    outline: none;
    background: transparent;
    color: #1f1f1f;
    font: 400 15px/1.45 "Segoe UI", Arial, sans-serif;
    padding: 0;
  }

  .sloppedin-textarea::placeholder {
    color: #6f6f6f;
  }

  .sloppedin-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 20px 18px;
    border-top: 1px solid #e9e5df;
    background: #fff;
  }

  .sloppedin-meta {
    font-size: 12px;
    color: #666666;
  }

  .sloppedin-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .sloppedin-primary {
    border-radius: 999px;
    border: 0;
    background: #0a66c2;
    color: #ffffff;
    cursor: pointer;
    font: 600 14px/1 "Segoe UI", Arial, sans-serif;
    padding: 10px 16px;
    transition: transform 120ms ease, opacity 120ms ease;
  }

  .sloppedin-primary:hover {
    transform: translateY(-1px);
  }

  .sloppedin-primary:disabled {
    cursor: wait;
    opacity: 0.7;
    transform: none;
  }

  .sloppedin-error {
    margin-top: 10px;
    color: #b42318;
    font-size: 12px;
  }
`;

boot();

function boot() {
  injectStyles();
  ensureLauncher();
  ensureModal();
}

function injectStyles() {
  if (document.getElementById(STYLES_ID)) {
    return;
  }

  const style = document.createElement("style");
  style.id = STYLES_ID;
  style.textContent = INLINE_STYLES;
  document.head.appendChild(style);
}

function ensureLauncher() {
  if (document.getElementById(LAUNCHER_ID)) {
    return;
  }

  const button = document.createElement("button");
  button.id = LAUNCHER_ID;
  button.type = "button";
  button.textContent = "SloppedIn";
  button.addEventListener("click", openModal);
  document.body.appendChild(button);
}

function ensureModal() {
  if (document.getElementById(MODAL_ID)) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.addEventListener("click", closeModal);

  const modal = document.createElement("section");
  modal.id = MODAL_ID;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="sloppedin-header">
      <div>
        <div class="sloppedin-title">SloppedIn</div>
        <div class="sloppedin-subtitle">Write whatever bs is on your mind and see it turn into an unbearable LinkedIn post.</div>
      </div>
      <button type="button" class="sloppedin-close" aria-label="Close">&times;</button>
    </div>
    <div class="sloppedin-body">
      <textarea class="sloppedin-textarea" id="${DRAFT_ID}" placeholder="${DEFAULT_PLACEHOLDER}"></textarea>
      <div class="sloppedin-error" id="${ERROR_ID}" hidden></div>
    </div>
    <div class="sloppedin-footer">
      <div class="sloppedin-meta" id="${META_ID}">0 characters</div>
      <div class="sloppedin-actions">
        <button type="button" class="sloppedin-primary" id="${GENERATE_ID}">Slop It</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  modal.querySelector(".sloppedin-close").addEventListener("click", closeModal);
  modal.querySelector(`#${GENERATE_ID}`).addEventListener("click", handleGenerate);
  modal.querySelector(`#${DRAFT_ID}`).addEventListener("input", handleDraftInput);
}

function openModal() {
  document.getElementById(OVERLAY_ID).classList.add(SLIDE_IN_CLASS);
  document.getElementById(MODAL_ID).classList.add(SLIDE_IN_CLASS);
  const textarea = document.getElementById(DRAFT_ID);
  autoResizeTextarea(textarea);
  textarea.focus();
}

function closeModal() {
  document.getElementById(OVERLAY_ID).classList.remove(SLIDE_IN_CLASS);
  document.getElementById(MODAL_ID).classList.remove(SLIDE_IN_CLASS);
  clearError();
}

async function handleGenerate() {
  const textarea = document.getElementById(DRAFT_ID);
  const draft = textarea.value.trim();

  if (!draft) {
    showError("Write something first so SloppedIn has material to work with :|");
    return;
  }

  clearError();
  setGeneratingState(true);

  try {
    const response = await chrome.runtime.sendMessage({
      type: "SLOP_IT",
      text: draft
    });

    if (!response?.success || !response.generatedText) {
      throw new Error(response?.error || "Unable to generate post.");
    }

    textarea.value = response.generatedText;
    updateMeta();
    autoResizeTextarea(textarea);
  } catch (error) {
    console.error("SloppedIn content error:", error);
    showError(error.message || "Something went wrong while generating the post.");
  } finally {
    setGeneratingState(false);
  }
}

function setGeneratingState(isLoading) {
  const generateButton = document.getElementById(GENERATE_ID);
  generateButton.disabled = isLoading;
  generateButton.textContent = isLoading ? "Slopping..." : "Slop It";
}

function updateMeta() {
  const textarea = document.getElementById(DRAFT_ID);
  document.getElementById(META_ID).textContent = `${textarea.value.trim().length} characters`;
}

function handleDraftInput(event) {
  updateMeta();
  autoResizeTextarea(event.target);
}

function autoResizeTextarea(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${Math.min(textarea.scrollHeight, window.innerHeight - 240)}px`;
}

function showError(message) {
  const errorNode = document.getElementById(ERROR_ID);
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  const errorNode = document.getElementById(ERROR_ID);
  errorNode.hidden = true;
  errorNode.textContent = "";
}
