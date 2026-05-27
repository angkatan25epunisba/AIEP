/* ═══════════════════════════════════════════
   VELARIS.AI — Private Intelligence Suite
   script.js
═══════════════════════════════════════════ */

// ══════════════════════════════════════════
// ⚙️  CONFIGURATION — EDIT THESE VALUES
// ══════════════════════════════════════════

const CONFIG = {
  // 🔑 PASSWORD — Change this to your own private access key
  // This is a simple client-side gate. For production, use a real auth system.
  PASSWORD: "velaris2025",

  // 🤖 ANTHROPIC API KEY
  // Replace with your actual key from: https://console.anthropic.com/
  // Format: "sk-ant-api03-..."
  API_KEY: "YOUR_ANTHROPIC_API_KEY_HERE",

  // 🧠 MODEL — Claude model to use
  // Available: claude-sonnet-4-20250514 (recommended), claude-haiku-4-5-20251001 (faster)
  MODEL: "claude-sonnet-4-20250514",

  // ⏱️  Fake delay (ms) for dramatic effect on loading — set to 0 to disable
  DRAMA_DELAY: 800,
};

// ══════════════════════════════════════════
// 🔐 LOCK SCREEN
// ══════════════════════════════════════════

function checkPassword() {
  const input = document.getElementById("passInput").value;
  const errorEl = document.getElementById("lockError");

  if (input === CONFIG.PASSWORD) {
    errorEl.textContent = "";
    errorEl.classList.remove("visible");
    triggerAccessGranted();
  } else {
    errorEl.textContent = "⬡ Access Denied — Invalid Credentials";
    errorEl.classList.add("visible");
    const card = document.querySelector(".lock-card");
    card.style.animation = "none";
    card.offsetHeight; // reflow
    card.style.animation = "shake 0.4s ease";
    // Add shake keyframe dynamically if not already present
    if (!document.getElementById("shakeStyle")) {
      const style = document.createElement("style");
      style.id = "shakeStyle";
      style.textContent = `@keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-8px); }
        40% { transform: translateX(8px); }
        60% { transform: translateX(-5px); }
        80% { transform: translateX(5px); }
      }`;
      document.head.appendChild(style);
    }
    document.getElementById("passInput").value = "";
  }
}

// Enter key support
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("passInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkPassword();
  });
});

// ══════════════════════════════════════════
// 🎬 ACCESS GRANTED ANIMATION
// ══════════════════════════════════════════

function triggerAccessGranted() {
  const lockScreen = document.getElementById("lockScreen");
  const overlay = document.getElementById("accessOverlay");

  // Play access tone
  playAccessSound();

  // Fade lock screen
  lockScreen.style.transition = "opacity 0.5s";
  lockScreen.style.opacity = "0";
  setTimeout(() => lockScreen.classList.add("hidden"), 500);

  // Show overlay
  overlay.classList.remove("hidden");

  const lines = ["al1", "al2", "al3", "al4"];
  const delays = [200, 700, 1200, 1700];

  lines.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id).classList.add("show");
    }, delays[i]);
  });

  // ACCESS GRANTED text
  setTimeout(() => {
    document.getElementById("accessGrantedText").classList.add("show");
  }, 2400);

  // AI Core Ready
  setTimeout(() => {
    document.getElementById("aiCoreReady").classList.add("show");
  }, 2800);

  // Transition to main app
  setTimeout(() => {
    overlay.style.transition = "opacity 0.6s";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.classList.add("hidden");
      document.getElementById("mainApp").classList.remove("hidden");
    }, 600);
  }, 3600);
}

// ══════════════════════════════════════════
// 🔔 SOUND EFFECTS (Web Audio API)
// ══════════════════════════════════════════

function playAccessSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const playTone = (freq, start, dur, type = "sine", vol = 0.08) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };

    // Ascending elegant tones
    playTone(440, 0,    0.3, "sine", 0.06);
    playTone(554, 0.25, 0.3, "sine", 0.06);
    playTone(659, 0.5,  0.3, "sine", 0.06);
    playTone(880, 0.75, 0.6, "sine", 0.07);
  } catch (e) {
    // Sound not available — silent graceful fail
  }
}

function playAnalyzeSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine"; osc.frequency.value = 523;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
    osc.start(); osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
}

// ══════════════════════════════════════════
// 🗂️  TAB SYSTEM
// ══════════════════════════════════════════

function switchTab(tabName, btn) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.getElementById(`tab-${tabName}`).classList.add("active");
  btn.classList.add("active");
}

// ══════════════════════════════════════════
// 🔒 LOCK / RESET SESSION
// ══════════════════════════════════════════

function lockApp() {
  document.getElementById("mainApp").classList.add("hidden");
  const lockScreen = document.getElementById("lockScreen");
  lockScreen.classList.remove("hidden");
  lockScreen.style.opacity = "0";
  lockScreen.style.transition = "opacity 0.5s";
  requestAnimationFrame(() => { lockScreen.style.opacity = "1"; });
  document.getElementById("passInput").value = "";
  // Reset access overlay for re-use
  const overlay = document.getElementById("accessOverlay");
  overlay.classList.add("hidden");
  overlay.style.opacity = "1";
  ["al1","al2","al3","al4","accessGrantedText","aiCoreReady"].forEach(id => {
    document.getElementById(id).classList.remove("show");
  });
}

// ══════════════════════════════════════════
// 🔢 WORD COUNT
// ══════════════════════════════════════════

function updateWordCount(inputId, countId) {
  const text = document.getElementById(inputId).value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  document.getElementById(countId).textContent = `${count} word${count !== 1 ? "s" : ""}`;
}

// ══════════════════════════════════════════
// ✕ CLEAR FUNCTIONS
// ══════════════════════════════════════════

function clearDetector() {
  document.getElementById("detectorInput").value = "";
  document.getElementById("detectorWordCount").textContent = "0 words";
  document.getElementById("detectorResult").classList.add("hidden");
  document.getElementById("detectorPlaceholder").style.display = "flex";
  document.getElementById("detectorCopyBtn").style.display = "none";
}

function clearHumanizer() {
  document.getElementById("humanizerInput").value = "";
  document.getElementById("humanizerWordCount").textContent = "0 words";
  document.getElementById("humanizedOutput").classList.add("hidden");
  document.getElementById("humanizerPlaceholder").style.display = "flex";
  document.getElementById("humanizerMeta").classList.add("hidden");
  document.getElementById("humanizerCopyBtn").style.display = "none";
}

// ══════════════════════════════════════════
// ⎘ COPY TO CLIPBOARD
// ══════════════════════════════════════════

function copyResult(elementId) {
  const el = document.getElementById(elementId);
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = elementId === "detectorHighlight"
      ? document.getElementById("detectorCopyBtn")
      : document.getElementById("humanizerCopyBtn");
    const original = btn.textContent;
    btn.textContent = "✓ Copied";
    btn.style.color = "#3d9970";
    setTimeout(() => { btn.textContent = original; btn.style.color = ""; }, 1500);
  });
}

// ══════════════════════════════════════════
// 🔬 AI DETECTOR
// ══════════════════════════════════════════

async function analyzeText() {
  const text = document.getElementById("detectorInput").value.trim();
  if (!text) return;

  // UI: loading state
  const btn = document.querySelector('#tab-detector .btn-primary');
  const loader = document.getElementById("analyzeLoader");
  btn.classList.add("loading");
  loader.classList.add("active");
  playAnalyzeSound();

  // Hide previous result
  document.getElementById("detectorResult").classList.add("hidden");
  document.getElementById("detectorPlaceholder").style.display = "flex";

  try {
    await new Promise(r => setTimeout(r, CONFIG.DRAMA_DELAY));

    // ── API Call ──────────────────────────────────────────────────────
    // Calls Anthropic Claude to analyze the text for AI vs human origin.
    // Returns structured JSON with ai_score, human_score, confidence, verdict, highlights.
    //
    // To swap API: replace the fetch URL and headers with your provider's format.
    // To use a different AI detector API (e.g. Originality.ai, Copyleaks):
    //   replace the entire fetch block with that provider's endpoint.
    // ─────────────────────────────────────────────────────────────────

    const systemPrompt = `You are an elite AI content detection engine. Analyze the provided text and determine the probability it was written by AI vs a human.

Return ONLY a valid JSON object with this exact structure:
{
  "ai_score": <number 0-100>,
  "human_score": <number 0-100>,
  "confidence": "<Low|Medium|High|Very High>",
  "verdict": "<AI-Generated|Likely AI|Mixed|Likely Human|Human-Written>",
  "reasoning": "<one short sentence>",
  "highlights": [
    { "text": "<exact phrase from input>", "type": "ai" },
    { "text": "<exact phrase from input>", "type": "human" }
  ]
}
ai_score + human_score should equal 100. highlights should contain 2-4 notable phrases. No markdown, no explanation — pure JSON only.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.API_KEY,           // 🔑 API key injected from CONFIG
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        max_tokens: 600,
        system: systemPrompt,
        messages: [{ role: "user", content: `Analyze this text:\n\n${text}` }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const raw = data.content[0].text.replace(/```json|```/g, "").trim();
    const result = JSON.parse(raw);

    renderDetectorResult(result, text);
    playAnalyzeSound();

  } catch (err) {
    // ── Fallback Demo Mode ──
    // If API key is not set or call fails, shows mock result for UI testing.
    console.warn("API call failed:", err.message);
    const mockResult = getMockDetectorResult(text);
    renderDetectorResult(mockResult, text);
    showApiWarning("detector");
  } finally {
    btn.classList.remove("loading");
    loader.classList.remove("active");
  }
}

function renderDetectorResult(result, originalText) {
  // Scores
  document.getElementById("aiScore").textContent = `${result.ai_score}%`;
  document.getElementById("humanScore").textContent = `${result.human_score}%`;
  document.getElementById("confidence").textContent = result.confidence;

  // Animate bars (delay so CSS transition fires)
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById("aiBar").style.width = `${result.ai_score}%`;
      document.getElementById("humanBar").style.width = `${result.human_score}%`;
    }, 100);
  });
  document.getElementById("aiBarPct").textContent = `${result.ai_score}%`;
  document.getElementById("humanBarPct").textContent = `${result.human_score}%`;

  // Verdict
  const verdictEl = document.getElementById("verdictBadge");
  verdictEl.className = "verdict-badge";
  document.getElementById("verdictText").textContent = result.verdict;

  if (result.ai_score >= 65) {
    verdictEl.classList.add("ai-verdict");
    document.getElementById("verdictIcon").textContent = "◈";
  } else if (result.ai_score <= 35) {
    verdictEl.classList.add("human-verdict");
    document.getElementById("verdictIcon").textContent = "◇";
  } else {
    verdictEl.classList.add("mixed-verdict");
    document.getElementById("verdictIcon").textContent = "◆";
  }

  // Highlighted text
  let highlightedText = originalText;
  if (result.highlights && result.highlights.length) {
    result.highlights.forEach(h => {
      const escaped = h.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const cls = h.type === "ai" ? "ai-highlight" : "human-highlight";
      highlightedText = highlightedText.replace(
        new RegExp(escaped, "gi"),
        `<span class="${cls}">$&</span>`
      );
    });
  }
  document.getElementById("detectorHighlight").innerHTML = highlightedText;

  // Show result
  document.getElementById("detectorPlaceholder").style.display = "none";
  document.getElementById("detectorResult").classList.remove("hidden");
  document.getElementById("detectorCopyBtn").style.display = "inline-flex";
}

// ══════════════════════════════════════════
// ✍️  AI HUMANIZER
// ══════════════════════════════════════════

async function humanizeText() {
  const text = document.getElementById("humanizerInput").value.trim();
  if (!text) return;

  const mode = document.querySelector('input[name="mode"]:checked').value;

  const btn = document.querySelector('#tab-humanizer .btn-primary');
  const loader = document.getElementById("humanizeLoader");
  btn.classList.add("loading");
  loader.classList.add("active");
  playAnalyzeSound();

  document.getElementById("humanizedOutput").classList.add("hidden");
  document.getElementById("humanizerPlaceholder").style.display = "flex";
  document.getElementById("humanizerMeta").classList.add("hidden");
  document.getElementById("humanizerCopyBtn").style.display = "none";

  const modeInstructions = {
    formal: "Tone: professional but warm. Think senior consultant writing a report — polished, but still human. Not robotic.",
    casual: "Tone: like texting a smart friend. Loose, real, zero corporate speak. Throw in a 'honestly' or 'tbh' if it fits.",
    smart: "Tone: sharp academic who also talks like a person. Sophisticated vocab but natural rhythm — like a PhD explaining something over coffee."
  };

  try {
    await new Promise(r => setTimeout(r, CONFIG.DRAMA_DELAY));

    // ── API Call ──────────────────────────────────────────────────────
    // Sends text to Claude to rewrite in a human-like style.
    // Mode determines the tone/style instruction passed to the model.
    //
    // To customize humanization behavior, edit the systemPrompt below.
    // ─────────────────────────────────────────────────────────────────

    const systemPrompt = `You are a human writer rewriting text to sound completely natural and undetectable by AI detectors like GPTZero, Originality.ai, and Turnitin.

${modeInstructions[mode]}

Rules:
- Vary sentence length and structure significantly
- Use first person when appropriate
- Add natural imperfections: rhetorical questions, parenthetical thoughts, subtle hedging
- Remove repetitive transitions ("Furthermore", "Additionally", "In conclusion")
- Inject personality and voice
- Preserve the core meaning and all factual content
- Return ONLY the rewritten text — no preamble, no explanation, no labels`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CONFIG.API_KEY,           // 🔑 API key injected from CONFIG
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: text }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const humanized = data.content[0].text.trim();

    renderHumanizerResult(humanized, text);
    playAnalyzeSound();

  } catch (err) {
    console.warn("API call failed:", err.message);
    const mock = getMockHumanizedText(text, mode);
    renderHumanizerResult(mock, text);
    showApiWarning("humanizer");
  } finally {
    btn.classList.remove("loading");
    loader.classList.remove("active");
  }
}

function renderHumanizerResult(humanized, originalText) {
  const outputEl = document.getElementById("humanizedOutput");
  outputEl.textContent = humanized;
  outputEl.classList.remove("hidden");

  document.getElementById("humanizerPlaceholder").style.display = "none";
  document.getElementById("humanizerCopyBtn").style.display = "inline-flex";

  // Word counts
  const origWords = originalText.trim().split(/\s+/).length;
  const outWords = humanized.trim().split(/\s+/).length;
  document.getElementById("originalWords").textContent = origWords;
  document.getElementById("outputWords").textContent = outWords;
  document.getElementById("humanizerMeta").classList.remove("hidden");
}

// ══════════════════════════════════════════
// 🧪 MOCK / FALLBACK (no API key)
// ══════════════════════════════════════════

function getMockDetectorResult(text) {
  const words = text.split(/\s+/);
  const aiScore = Math.floor(Math.random() * 40) + 55; // 55-95
  return {
    ai_score: aiScore,
    human_score: 100 - aiScore,
    confidence: "High",
    verdict: aiScore > 70 ? "AI-Generated" : "Likely AI",
    reasoning: "Uniform sentence structure and absence of natural variation detected.",
    highlights: [
      { text: words.slice(0, 4).join(" "), type: "ai" },
      { text: words.slice(Math.floor(words.length / 2), Math.floor(words.length / 2) + 4).join(" "), type: "human" }
    ]
  };
}

function getMockHumanizedText(text, mode) {
  const demos = {
    formal: "[DEMO MODE] " + text.replace(/Furthermore,?/gi, "That said,").replace(/Additionally,?/gi, "Worth noting —").replace(/In conclusion,?/gi, "To close,"),
    casual: "[DEMO MODE] " + text.replace(/\. /g, "! Well, ").replace(/Furthermore/gi, "Also").replace(/However/gi, "But"),
    smart: "[DEMO MODE] " + text.replace(/\. /g, " — which raises an interesting point. ").replace(/Furthermore/gi, "Curiously enough").replace(/Additionally/gi, "There's also")
  };
  return demos[mode] || "[DEMO MODE] " + text;
}

function showApiWarning(tab) {
  const existing = document.getElementById(`apiWarn-${tab}`);
  if (existing) return;

  const warn = document.createElement("div");
  warn.id = `apiWarn-${tab}`;
  warn.style.cssText = `
    position: fixed; bottom: 24px; right: 24px;
    background: #111115; border: 1px solid rgba(212,175,55,0.2);
    border-radius: 8px; padding: 12px 18px;
    font-size: 11px; letter-spacing: 1px;
    color: rgba(212,175,55,0.7);
    z-index: 9999;
    animation: fadeSlide 0.3s ease both;
  `;
  warn.innerHTML = `⬡ Demo mode — add your API key in <code>script.js</code> CONFIG`;
  document.body.appendChild(warn);
  setTimeout(() => warn.remove(), 5000);
}
