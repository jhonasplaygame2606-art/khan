// ==UserScript==
// @name         Khan Hackademy
// @namespace    https://thetridentguy.com
// @version      1.0
// @description  Força a conclusão de exercícios no Khan Academy.
// @author       TheTridentGuy
// @match        *://*.khanacademy.org/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const og_stringify = JSON.stringify;

    JSON.stringify = (obj) => {
        if (!obj) {
            return og_stringify(obj);
        }

        if (obj.operationName == "attemptProblem") {
            console.log("[Khan Hackademy] Interceptando tentativa...");

            if (obj.variables && obj.variables.input) {
                // A MÁGICA: Força a conclusão da tentativa
                // O script original verifica o attemptNumber para tentar avançar
                if (obj.variables.input.attemptNumber == 1) {
                    console.log("[Khan Hackademy] Forçando resposta correta...");
                    // Força o status para correto. Alguns servidores esperam 'completed' ou 'status'.
                    obj.variables.input.completed = true;
                    // Tenta garantir que o status seja 'correct'
                    if (obj.variables.input.status) {
                        obj.variables.input.status = "correct";
                    }
                }
            }
        }

        return og_stringify(obj);
    };

    // Pequena alteração visual (opcional, mas ajuda a saber que rodou)
    setInterval(() => {
        try {
            let header = document.querySelector("[data-testid='header-logo']");
            if (header && !header.dataset.hacked) {
                header.innerHTML = "<span style='font-size: x-large; font-weight: bold; color: #00ff88;'>HACKED</span>";
                header.dataset.hacked = "true";
            }
        } catch (e) {
            // Ignora erros se o header não existir
        }
    }, 1000);

})();
