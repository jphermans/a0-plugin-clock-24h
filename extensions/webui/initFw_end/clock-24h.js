/**
 * 24H Clock Plugin — clock_24h
 *
 * Uses a MutationObserver on #time-date to reformat the 12h AM/PM time
 * written by index.js::updateUserTime() into 24-hour format.
 * Runs as an initFw_end JS extension so it is guaranteed to execute.
 */

export default async function clock24h(ctx) {
  function format24h() {
    const el = document.getElementById('time-date');
    if (!el) return;

    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const s = now.getSeconds().toString().padStart(2, '0');

    const dateOpts = { year: 'numeric', month: 'short', day: 'numeric' };
    const dateStr = now.toLocaleDateString(undefined, dateOpts);

    el.innerHTML = h + ':' + m + ':' + s + '<br><span id="user-date">' + dateStr + '</span>';
  }

  function waitForElement() {
    const el = document.getElementById('time-date');
    if (!el) {
      // Element not yet in DOM — retry
      requestAnimationFrame(waitForElement);
      return;
    }

    // Convert immediately
    format24h();

    // Observe: every time index.js writes 12h HTML, we overwrite with 24h
    const observer = new MutationObserver(() => {
      observer.disconnect(); // prevent re-entry while we write
      format24h();
      observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(el, { childList: true, subtree: true, characterData: true });
  }

  // Start watching — the #time-date element appears after chat-top component loads
  waitForElement();
}
