// ==UserScript==
// @name        Khan Hackademy
// @namespace   https://thetridentguy.com
// @version     1.0
// @description Força a conclusão de exercícios no Khan Academy.
// @author      TheTridentGuy (adaptado)
// @match       *://*.khanacademy.org/*
// @grant       none
// @run-at      document-end
// ==/UserScript==

(() => {
    const fetch_lag = 500;
    const exec_lag = 500;
    const og_stringify = JSON.stringify;
    const $ = (...args) => { return document.querySelector(...args) };

    JSON.stringify = (obj) => {
        if (!obj) { return og_stringify(obj); }

        if (obj.operationName == "attemptProblem") {
            console.log("[KH] Interceptando tentativa...");
            console.log("[KH] Dados capturados:", obj);

            // Força a conclusão
            obj.variables.input.completed = true;
            console.log("[KH] Resposta forçada para CORRETA.");

            // Se for a primeira tentativa, tenta avançar para a próxima questão
            if (obj.variables.input.attemptNumber == 1) {
                setTimeout(() => {
                    console.log("[KH] Tentando avançar para a próxima questão...");
                    const skipBtn = $("[data-testid='exercise-skip-button']");
                    const nextBtn = $("[data-testid='exercise-next-question']");
                    
                    if (skipBtn) skipBtn.click();
                    if (nextBtn) nextBtn.click();
                }, exec_lag);
            }
        }

        return og_stringify(obj);
    };

    // Muda o logo (visual) para saber que rodou
    setInterval(() => {
        try {
            let header = $("[data-testid='header-logo']");
            if (header) {
                header.innerHTML = "<span style='font-size: x-large; font-weight: bold;'>Khan Hackademy</span>";
            }
        } catch (e) {
            // Ignora se o header não existir
        }
    }, 500);

})();
