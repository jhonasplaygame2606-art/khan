// ==UserScript==
// @name        KhanBypass
// @namespace   jhonasplaygame2606-art
// @match       *://*.khanacademy.org/*
// @grant       none
// @version     3.2
// @author      jhonasplaygame2606-art
// @icon        https://cdn.kastatic.org/images/favicon.ico
// @description Bypass de UI + Auto-complete de exercícios
// @run-at      document-start
// ==/UserScript==

(function () {
  "use strict";

  // ---------- Console seguro ----------
  const _warn = console.warn.bind(console);
  const _error = console.error.bind(console);
  console.warn = (...a) => _warn("[KB]", ...a);
  console.error = (...a) => _error("[KB]", ...a);
  window.debug = () => {};

  // ---------- 1. O CÓDIGO CENTRAL (Forçar conclusão / Resposta Correta) ----------
  const og_stringify = JSON.stringify;
  JSON.stringify = (obj) => {
    try {
      // Verifica se é um envio de resposta de exercício
      if (obj && obj.operationName === "attemptProblem") {
        if (obj.variables && obj.variables.input) {
          // Força a conclusão e o acerto
          obj.variables.input.completed = true;
          // Alguns sistemas do Khan exigem "correct: true" ou "status: correct"
          if (obj.variables.input.status) obj.variables.input.status = "correct"; 
        }
      }
    } catch (e) {
      // Ignora erros para não quebrar a página
    }
    return og_stringify(obj);
  };

  // ---------- EventEmitter ----------
  class EventEmitter {
    constructor() { this.events = {}; }
    on(event, listener) {
      (Array.isArray(event) ? event : [event]).forEach((ev) => {
        (this.events[ev] = this.events[ev] || []).push(listener);
      });
    }
    off(event, listener) {
      (Array.isArray(event) ? event : [event]).forEach((ev) => {
        if (this.events[ev]) this.events[ev] = this.events[ev].filter((l) => l !== listener);
      });
    }
    emit(event, ...args) {
      this.events[event]?.forEach((fn) => {
        try { fn(...args); } catch (e) { _error("listener erro:", e); }
      });
    }
  }
  const eventBus = new EventEmitter();

  // ---------- Notificações ----------
  function notify(msg, time = 4000) {
    const el = document.createElement("div");
    el.textContent = msg;
    Object.assign(el.style, {
      position: "fixed",
      left: "50%",
      bottom: "24px",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #72ff72, #00ff88)",
      color: "#000",
      padding: "10px 16px",
      borderRadius: "8px",
      fontWeight: "600",
      fontFamily: "system-ui, sans-serif",
      zIndex: 999999,
      boxShadow: "0 4px 20px rgba(0,0,0,.2)",
      transition: "opacity 0.3s ease"
    });
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 300);
    }, time);
  }

  // ---------- Logo Spoof ----------
  function applyLogoSpoof() {
    if (!document.head) return;

    const svg = document.querySelector("header svg[aria-label]") || document.querySelector("svg._1rt6g9t");
    if (!svg || svg.dataset.kbSpoofed) return;

    let originalColor = "#444";
    const fillPath = svg.querySelector("path[fill]");
    if (fillPath) originalColor = fillPath.getAttribute("fill") || originalColor;

    svg.querySelectorAll("path").forEach((p) => {
      p.style.visibility = "hidden";
    });

    const newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    newText.textContent = "@MZZVXM";
    newText.setAttribute("x", "33");
    newText.setAttribute("y", "20");
    newText.setAttribute("font-family", "Arial, sans-serif"); 
    newText.setAttribute("font-weight", "bold");
    newText.setAttribute("font-size", "20px");
    newText.setAttribute("fill", originalColor);

    svg.appendChild(newText);
    svg.dataset.kbSpoofed = "true";
  }

  // ---------- Observer com debounce ----------
  function startObserver() {
    if (!document.body) return setTimeout(startObserver, 50);

    let timer;
    new MutationObserver((changes) => {
      if (!changes.some((c) => c.type === "childList")) return;
      clearTimeout(timer);
      timer = setTimeout(() => eventBus.emit("domChanged"), 80);
    }).observe(document.body, { childList: true, subtree: true });

    eventBus.emit("domChanged");
  }

  eventBus.on("domChanged", () => {
    applyLogoSpoof();
  });

  // ---------- Boot ----------
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  } else {
    startObserver();
  }

  window.KhanBypass = { notify, eventBus };
})();
