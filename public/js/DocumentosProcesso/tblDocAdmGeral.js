document.addEventListener("DOMContentLoaded", () => {
    carregarDocumentos();

    async function carregarDocumentos() {
        const loadingScreen = document.getElementById('loading-screen');
        const tbody = document.getElementById('table-body-documentos');

        try {
            loadingScreen.style.display = 'flex';

            const response = await fetch("/InfoDocumentosProcessos?processo_responsavel=ctAdmGeral");
            if (!response.ok) throw new Error("Erro ao buscar documentos.");

            const resultado = await response.json();
            const documentos = resultado.dados || [];

            preencherTabela(documentos);
        } catch (error) {
            console.error("Erro ao carregar documentos:", error.message);
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Erro ao carregar documentos</td></tr>`;
        } finally {
            loadingScreen.style.display = 'none';
        }
    }

    function preencherTabela(documentos) {
        const tbody = document.getElementById("table-body-documentos");
        tbody.innerHTML = '';

        if (documentos.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Nenhum documento encontrado</td></tr>`;
            return;
        }

        documentos.forEach(doc => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td class="td-nome" style="cursor: pointer;">${doc.nome_documento || '—'}</td>
                <td class="td-revisao" style="cursor: pointer; text-align: center;">${doc.revisao || '—'}</td>
                <td style="display: none;">${doc.tipo_documento || ''}</td>
                <td class="colunaEdit" style="text-align: center; display: none;">
                    <img class="icone-editar" src="/images/ico_adm.png" title="Editar" style="width: 20px; cursor: pointer;">
                </td>
                <td class="colunaExcluir" style="text-align: center; display: none;">
                    <img class="icone-excluir" src="/images/LIXEIRAPNG.png" title="Excluir" style="width: 20px; cursor: pointer;">
                </td>
            `;

            tbody.appendChild(row);

            row.querySelector('.td-nome').addEventListener('click', () => {
                if (doc.link_acesso) window.open(doc.link_acesso, '_blank');
            });

            row.querySelector('.td-revisao').addEventListener('click', () => {
                if (doc.link_acesso) window.open(doc.link_acesso, '_blank');
            });

            row.querySelector('.icone-editar').addEventListener('click', (e) => {
                e.stopPropagation();
                localStorage.setItem("id_documento_edicao", doc.id);

                const url = new URL('/Html/NovoDocumento/EditDocProcesso.html', window.location.origin);
                url.searchParams.set('nome', doc.nome_documento || '');
                url.searchParams.set('revisao', doc.revisao || '');
                url.searchParams.set('tipo', doc.tipo_documento || '');
                url.searchParams.set('link', doc.link_acesso || '');

                window.open(url.toString(), 'EditarDocumento', 'width=450,height=210,toolbar=no,location=no,menubar=no,scrollbars=no,resizable=no');
            });

            row.querySelector('.icone-excluir').addEventListener('click', (e) => {
                e.stopPropagation();
                removerDocumento(doc.id, row);
            });
        });

        // Exibe colunas apenas se for autorizado
        const user = JSON.parse(localStorage.getItem('user'));
        const podeEditar = user && ["Igor Botini", "Ronaldo Xavier", "Brendon Rodrigues"].includes(user.nome_user);

        if (podeEditar) {
            document.querySelectorAll('.colunaEdit').forEach(el => el.style.display = '');
            document.querySelectorAll('.colunaExcluir').forEach(el => el.style.display = '');
        }
    }
});


// Função para excluir o documento via API
function removerDocumento(id, rowElement) {
    const loadingScreen = document.getElementById("loading-screen");

    if (!id) {
        alert("ID do documento não informado.");
        return;
    }

    const confirmar = confirm("Deseja realmente excluir este documento?");
    if (!confirmar) return;

    if (loadingScreen) loadingScreen.style.display = "flex"; // mostra a tela de loading

    fetch(`/RemoverDocumentoProcesso?id=${id}`, {
        method: "DELETE"
    })
    .then(response => response.json().then(data => ({ status: response.status, data })))
    .then(({ status, data }) => {
        if (loadingScreen) loadingScreen.style.display = "none"; // oculta o loading

        if (status === 200) {
            alert(data.message || "Documento excluído com sucesso!");
            if (rowElement && rowElement.remove) rowElement.remove(); // remove a linha visualmente
        } else {
            alert(data.message || "Erro ao excluir documento.");
        }
    })
    .catch(error => {
        if (loadingScreen) loadingScreen.style.display = "none"; // oculta o loading mesmo com erro
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir documento.");
    });
}
