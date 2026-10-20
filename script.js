// ==UserScript==
// @name        KhanBypass
// @namespace   jhonasplaygame2606-art
// @match       *://*.khanacademy.org/*
// @grant       none
// @version     3.5
// @author      jhonasplaygame2606-art
// @description Bypass de UI + Forçar Resposta Correta
// @run-at      document-start
// ==/UserScript==

(function () {
  "use strict";

  // 1. FORÇAR RESPOSTA CORRETA (A FUNÇÃO PRINCIPAL)
  const og_stringify = JSON.stringify;
  JSON.stringify = (obj) => {
    try {
      if (obj && obj.operationName === "attemptProblem") {
        if (obj.variables && obj.variables.input) {
          // Força o Khan a aceitar a resposta como correta
          obj.variables.input.completed = true;
          if (obj.variables.input.status) obj.variables.input.status = "correct";
          console.log("[KB] Resposta interceptada e forçada para CORRETA!");
        }
      }
    } catch (e) {}
    return og_stringify(obj);
  };

  // 2. TROCA O LOGO (VISUAL)
  function applyLogoSpoof() {
    if (!document.head) return;
    const svg = document.querySelector("header svg[aria-label]") || document.querySelector("svg._1rt6g9t");
    if (!svg || svg.dataset.kbSpoofed) return;
    
    let originalColor = "#444";
    const fillPath = svg.querySelector("path[fill]");
    if (fillPath) originalColor = fillPath.getAttribute("fill") || originalColor;
    
    svg.querySelectorAll("path").forEach((p) => { p.style.visibility = "hidden"; });
    
    const newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newText.textContent = "@MZZVXM";
    newText.setAttribute("x", "33"); newText.setAttribute("y", "20");
    newText.setAttribute("font-family", "Arial, sans-serif");
    newText.setAttribute("font-weight", "bold"); newText.setAttribute("font-size", "20px");
    newText.setAttribute("fill", originalColor);
    
    svg.appendChild(newText);
    svg.dataset.kbSpoofed = "true";
  }

  // 3. OBSERVER (PARA APLICAR O LOGO QUANDO A PÁGINA MUDAR)
  function startObserver() {
    if (!document.body) return setTimeout(startObserver, 50);
    let timer;
    new MutationObserver((changes) => {
      if (!changes.some((c) => c.type === "childList")) return;
      clearTimeout(timer);
      timer = setTimeout(applyLogoSpoof, 80);
    }).observe(document.body, { childList: true, subtree: true });
    applyLogoSpoof();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }
})();
