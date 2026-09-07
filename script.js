// Plexudo AI Smart Text Utility - script.js

// DOM Elements
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const loadingOverlay = document.getElementById("loadingOverlay");
const toastMessage = document.getElementById("toastMessage");
const btnCopy = document.getElementById("btnCopy");
const btnClear = document.getElementById("btnClear");
const btnPaste = document.getElementById("btnPaste");
const btnSample = document.getElementById("btnSample");
const btnApplyAsInput = document.getElementById("btnApplyAsInput");
const outputStats = document.getElementById("outputStats");
const aiModelBadge = document.getElementById("aiModelBadge");

// Stats Elements
const statWords = document.getElementById("statWords");
const statChars = document.getElementById("statChars");
const statCharsNoSpaces = document.getElementById("statCharsNoSpaces");
const statSentences = document.getElementById("statSentences");
const statParagraphs = document.getElementById("statParagraphs");
const statReadingTime = document.getElementById("statReadingTime");

// Update Metrics in Real Time
function updateMetrics() {
  const text = inputText.value || "";

  // Characters
  const charCount = text.length;
  const noSpacesCount = text.replace(/\s/g, "").length;

  // Words
  const trimmed = text.trim();
  const wordsArray = trimmed ? trimmed.split(/\s+/) : [];
  const wordCount = wordsArray.length;

  // Sentences
  const sentences = trimmed ? trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0) : [];
  const sentenceCount = sentences.length;

  // Paragraphs
  const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0) : [];
  const paragraphCount = paragraphs.length;

  // Reading Time (Average 200 words/minute)
  const seconds = Math.ceil((wordCount / 200) * 60);
  let readTime = "0s";
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const remSec = seconds % 60;
    readTime = `${mins}m ${remSec}s`;
  } else if (seconds > 0) {
    readTime = `${seconds}s`;
  }

  // Update DOM
  statWords.textContent = wordCount.toLocaleString();
  statChars.textContent = charCount.toLocaleString();
  statCharsNoSpaces.textContent = noSpacesCount.toLocaleString();
  statSentences.textContent = sentenceCount.toLocaleString();
  statParagraphs.textContent = paragraphCount.toLocaleString();
  statReadingTime.textContent = readTime;
}

inputText.addEventListener("input", updateMetrics);

// 1. Browser-based Text Transformations
document.querySelectorAll(".tool-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action");
    const original = inputText.value;
    if (!original.trim()) {
      showToast("Please enter some text first!", true);
      return;
    }

    let transformed = "";

    switch (action) {
      case "uppercase":
        transformed = original.toUpperCase();
        break;
      case "lowercase":
        transformed = original.toLowerCase();
        break;
      case "titlecase":
        transformed = original.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case "sentencecase":
        transformed = original
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "camelcase":
        transformed = original
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase());
        break;
      case "clean_spaces":
        transformed = original.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim();
        break;
      case "reverse":
        transformed = original.split("").reverse().join("");
        break;
      default:
        transformed = original;
    }

    setResult(transformed);
    showToast("Transformed successfully!");
  });
});

// 2. Fancy Font Generator (Unicode Maps)
const unicodeMaps = {
  gothic: {
    // Fraktur / Gothic
    A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ", I: "ℑ",
    J: "𝔍", K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ",
    S: "𝔖", T: "𝔗", U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ",
    a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥", i: "𝔦",
    j: "𝔧", k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯",
    s: "𝔰", t: "𝔱", u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
  },
  bold_sans: {
    A: "𝘼", B: "𝘽", C: "𝘾", D: "𝘿", E: "𝙀", F: "𝙁", G: "𝙂", H: "𝙃", I: "𝙄",
    J: "𝙅", K: "𝙆", L: "𝙇", M: "𝙈", N: "𝙉", O: "𝙊", P: "𝙋", Q: "𝙌", R: "𝙍",
    S: "𝙎", T: "𝙏", U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", Y: "𝙔", Z: "𝙕",
    a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", g: "𝙜", h: "𝙝", i: "𝙞",
    j: "𝙟", k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧",
    s: "𝙨", t: "𝙩", u: "𝙪", v: "𝙫", w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯",
  },
  script: {
    A: "𝒜", B: "ℬ", C: "𝒞", D: "𝒟", E: "ℰ", F: "ℱ", G: "𝒢", H: "ℋ", I: "ℐ",
    J: "𝒥", K: "𝒦", L: "ℒ", M: "ℳ", N: "𝒩", O: "𝒪", P: "𝒫", Q: "𝒬", R: "ℛ",
    S: "𝒮", T: "𝒯", U: "𝒰", V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵",
    a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "ℯ", f: "𝒻", g: "ℊ", h: "𝒽", i: "𝒾",
    j: "𝒿", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃", o: "ℴ", p: "𝓅", q: "𝓆", r: "𝓇",
    s: "𝓈", t: "𝓉", u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
  },
  circled: {
    A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ",
    J: "Ⓙ", K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ",
    S: "Ⓢ", T: "Ⓣ", U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ",
    a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ",
    j: "ⓙ", k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ",
    s: "ⓢ", t: "ⓣ", u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ",
  },
  double_struck: {
    A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼", F: "𝔽", G: "𝔾", H: "ℍ", I: "𝕀",
    J: "𝕁", K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ", O: "𝕆", P: "ℙ", Q: "ℚ", R: "ℝ",
    S: "𝕊", T: "𝕋", U: "𝕌", V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐", Z: "ℤ",
    a: "𝕒", b: "𝕓", c: "𝕔", d: "𝕕", e: "𝕖", f: "𝕗", g: "𝕘", h: "𝕙", i: "𝕚",
    j: "𝕛", k: "𝕜", l: "𝕝", m: "𝕞", n: "𝕟", o: "𝕠", p: "𝕡", q: "𝕢", r: "𝕣",
    s: "𝕤", t: "𝕥", u: "𝕦", v: "𝕧", w: "𝕨", x: "𝕩", y: "𝕪", z: "𝕫",
  },
};

document.querySelectorAll(".font-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const fontType = btn.getAttribute("data-font");
    const map = unicodeMaps[fontType];
    const original = inputText.value;

    if (!original.trim()) {
      showToast("Please enter text to convert to fancy font!", true);
      return;
    }

    if (!map) return;

    const converted = original
      .split("")
      .map((char) => map[char] || char)
      .join("");

    setResult(converted);
    showToast("Fancy font generated!");
  });
});

// 3. Experiential Labs AI Magic Caller
document.querySelectorAll(".ai-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const action = btn.getAttribute("data-ai");
    const text = inputText.value;

    if (!text || !text.trim()) {
      showToast("Please enter some text for the AI to process!", true);
      inputText.focus();
      return;
    }

    // UI Loading state
    loadingOverlay.classList.remove("hidden");
    btn.classList.add("opacity-50", "pointer-events-none");

    try {
      const response = await fetch("/api/ai-magic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process with AI");
      }

      setResult(data.result);
      if (data.model && aiModelBadge) {
        aiModelBadge.textContent = data.model;
      }
      showToast("AI Processing Complete!");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to connect to AI API", true);
    } finally {
      loadingOverlay.classList.add("hidden");
      btn.classList.remove("opacity-50", "pointer-events-none");
    }
  });
});

// Set result and update helper stats
function setResult(text) {
  outputText.value = text;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  outputStats.textContent = `${words} words`;
  btnApplyAsInput.classList.remove("hidden");
}

// Copy to Clipboard
btnCopy.addEventListener("click", () => {
  const textToCopy = outputText.value || inputText.value;
  if (!textToCopy) {
    showToast("Nothing to copy!", true);
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("Copied to clipboard!");
  });
});

// Use Result as Input
btnApplyAsInput.addEventListener("click", () => {
  if (outputText.value) {
    inputText.value = outputText.value;
    updateMetrics();
    showToast("Applied to input!");
  }
});

// Paste from Clipboard
btnPaste.addEventListener("click", async () => {
  try {
    const clip = await navigator.clipboard.readText();
    if (clip) {
      inputText.value = clip;
      updateMetrics();
      showToast("Pasted from clipboard!");
    }
  } catch (e) {
    showToast("Please allow clipboard permissions or paste manually (Ctrl+V)", true);
  }
});

// Clear Text
btnClear.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  btnApplyAsInput.classList.add("hidden");
  outputStats.textContent = "0 words";
  updateMetrics();
  showToast("Cleared!");
});

// Sample Text
btnSample.addEventListener("click", () => {
  inputText.value =
    "Artificial intelligence is rapidly transforming the modern digital workplace. " +
    "However, many professionals struggle with written communication, grammar consistency, and adapting their tone for different audiences. " +
    "Using smart text utilities allows writers to convert formats, audit word counts, and polish sentences in seconds.";
  updateMetrics();
  showToast("Sample text loaded!");
});

// Toast notification helper
let toastTimeout;
function showToast(msg, isError = false) {
  clearTimeout(toastTimeout);
  toastMessage.textContent = msg;
  toastMessage.className = `text-xs font-semibold transition-opacity duration-300 ${
    isError ? "text-rose-400" : "text-emerald-400"
  } opacity-100`;

  toastTimeout = setTimeout(() => {
    toastMessage.className = "text-xs font-semibold opacity-0 transition-opacity duration-300";
  }, 2500);
}

// Modal Controllers
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("hidden");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
}

// Close modal on Escape or Backdrop click
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll("[id$='Modal']").forEach((m) => m.classList.add("hidden"));
  }
});

document.querySelectorAll("[id$='Modal']").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

// Theme Toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  themeToggle.innerHTML = isDark
    ? '<i class="ph ph-moon text-lg"></i>'
    : '<i class="ph ph-sun text-lg"></i>';
});

// Initial calculation on load
updateMetrics();
