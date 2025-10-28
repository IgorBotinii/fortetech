function aplicarPermissoesTela(codTelaAtual) {
    try {
        // Recupera permissões do localStorage
        const permissoes = JSON.parse(localStorage.getItem("permissoes_usuario")) || [];

        if (!permissoes.length) {
            console.warn("⚠️ Nenhuma permissão encontrada no localStorage.");
            return;
        }

        console.log("🔎 Aplicando permissões para a tela:", codTelaAtual);

        // Filtra apenas as permissões da tela atual
        const permissoesTela = permissoes.filter(p => p.cod_tela === codTelaAtual);

        if (permissoesTela.length === 0) {
            console.warn("⚠️ Nenhuma permissão específica para esta tela.");
            return;
        }

        // Percorre cada permissão e aplica a visibilidade conforme necessário
        permissoesTela.forEach(perm => {
            const elemento = document.getElementById(perm.elemento);

            if (elemento) {
                if (perm.permissao === "show") {
                    elemento.style.display = ""; // mostra
                } else if (perm.permissao === "hide") {
                    elemento.style.display = "none"; // esconde
                } else if (perm.permissao === "disabled") {
                    elemento.disabled = true; // desativa
                }
            } else {
                console.log(`⚠️ Elemento '${perm.elemento}' não encontrado na tela.`);
            }
        });

        console.log("✅ Permissões aplicadas com sucesso!");
    } catch (err) {
        console.error("❌ Erro ao aplicar permissões:", err);
    }
}


