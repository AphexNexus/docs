(() => {
  // <stdin>
  (async function() {
    "use strict";
    if (!document.querySelector(".mermaid")) return;
    const block = document.querySelector(
      'script[type="application/json"][data-docsy-plugin="mermaid"]'
    );
    if (!block) return;
    const isDark = () => document.documentElement.dataset.bsTheme === "dark";
    const renderedDark = isDark();
    new MutationObserver(() => {
      if (isDark() !== renderedDark) location.reload();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme"]
    });
    try {
      const config = JSON.parse(block.textContent);
      const { default: mermaid } = await import(config.url);
      const settings = { ...config.options ?? {}, startOnLoad: false };
      if (renderedDark) settings.theme = "dark";
      mermaid.initialize(settings);
      if (document.readyState !== "complete") {
        await new Promise(
          (resolve) => window.addEventListener("load", resolve, { once: true })
        );
      }
      await mermaid.run();
    } catch (err) {
      console.error("Mermaid failed to render", err);
    }
  })();
})();
