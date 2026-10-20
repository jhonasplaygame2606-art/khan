// ==UserScript==
// @name        Khan AutoClick
// @namespace   jhonasplaygame2606-art
// @match       *://*.khanacademy.org/*
// @grant       none
// @version     1.0
// @description Clica em Verificar e Próxima automaticamente com delay seguro
// @run-at      document-idle
// ==/UserScript==

(function () {
  "use strict";
  console.log("[KB AutoClick] Script de auto-clique carregado.");

  // Tempo de espera entre os cliques (em milissegundos). 
  // 4000 = 4 segundos. Aumente se o Khan for muito rápido.
  const DELAY = 4500; 

  let isProcessing = false;

  function findAndClick(texts, selector = 'button') {
    const buttons = document.querySelectorAll(selector);
    for (const btn of buttons) {
      // Verifica se o botão está visível e não desativado
      if (btn.offsetParent === null || btn.disabled) continue;

      const content = btn.textContent.trim().toLowerCase();
      for (const t of texts) {
        if (content.includes(t.toLowerCase())) {
          console.log(`[KB AutoClick] Clicando no botão: "${btn.textContent.trim()}"`);
          btn.click();
          return true;
        }
      }
    }
    return false;
  }

  // O "Cérebro" do script: observa a tela o tempo todo
  setInterval(() => {
    if (isProcessing) return;

    // Lista de botões que ele deve clicar
    const verifyButtons = ["verificar", "check", "enviar resposta", "submit"];
    const nextButtons = ["próxima", "next", "continuar", "continue", "pular", "skip"];

    // Se encontrar o botão de Verificar, clica nele
    if (findAndClick(verifyButtons)) {
      isProcessing = true;
      // Bloqueia o script por 4.5 segundos para não clicar duas vezes
      setTimeout(() => { isProcessing = false; }, DELAY);
      return;
    }

    // Se não achou Verificar, tenta clicar no Próxima (que aparece depois do resultado)
    if (findAndClick(nextButtons)) {
      isProcessing = true;
      setTimeout(() => { isProcessing = false; }, DELAY);
      return;
    }

  }, 1500); // Verifica a tela a cada 1.5 segundos

})();
