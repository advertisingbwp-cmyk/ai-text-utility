// This document never reads the parent. Only fixed availability messages leave it.
(() => {
  const format = document.documentElement.dataset.format;
  let finished = false;
  const finish = status => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    clearInterval(poll);
    observer.disconnect();
    // No tool data, cookie values or arbitrary payloads. Parent verifies origin AND source.
    parent.postMessage({ type: "ad-frame-status", format, status }, "*");
  };
  const hasContent = () => {
    const native = document.getElementById("container-8aca604b8b2ab0a3b2106d4958e02b1d");
    const container = format === "native" ? native : document.body;
    if (!container) return false;
    const inspect = (root, depth = 0) => {
      if (root.querySelector("a[href] img, a[href] video")) return true;
      // Native creatives use CSS backgrounds with empty overlay anchors.
      if (root.querySelector("a[href]") && [...root.querySelectorAll("div,a")].some(element =>
        getComputedStyle(element).backgroundImage !== "none")) return true;
      if (depth >= 3) return false;
      return [...root.querySelectorAll("iframe")].some(frame => {
        try { return frame.contentDocument ? inspect(frame.contentDocument, depth + 1) : /^https?:/.test(frame.src); }
        catch { return /^https?:/.test(frame.src); }
      });
    };
    return inspect(container);
  };
  const observer = new MutationObserver(() => { if (hasContent()) finish("ready"); });
  const timer = setTimeout(() => finish(hasContent() ? "ready" : "unavailable"), 12_000);
  const poll = setInterval(() => { if (hasContent()) finish("ready"); }, 250);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("error", event => {
    if (event.target instanceof HTMLScriptElement && event.target.id === "ad-provider") finish("unavailable");
  }, true);
})();
