async function aplicarPermissoesUsuario() {
    const loading = document.getElementById("loading-screen");
    if (loading) loading.style.display = 'flex';

    const gruposJson = localStorage.getItem('grupos_usuario');
    if (!gruposJson) {
        console.warn('Nenhum grupo encontrado no localStorage.');
        if (loading) loading.style.display = 'none';
        return;
    }

    const grupos = JSON.parse(gruposJson);

    const codTela = window.codTelaAtual 
        || document.querySelector('meta[name="codTela"]')?.content 
        || document.body.getAttribute('data-cod-tela') 
        || 'SEM_COD_TELA';


    try {
        const res = await fetch(`/api/permissoesUsuario?cod_tela=${encodeURIComponent(codTela)}&grupos=${grupos.join(',')}`);
        const permissoes = await res.json();

        if (!Array.isArray(permissoes)) {
            console.warn('Resposta de permissões não é um array:', permissoes);
            if (loading) loading.style.display = 'none';
            return;
        }

        permissoes.forEach(p => {
            const elemento = document.getElementById(p.elemento_html);
            if (elemento) {
                if (p.permissao === 'show') {
                    elemento.style.display = 'block';
                } else {
                }
            } else {
                console.warn(`Elemento não encontrado na página: ${p.elemento_html}`);
            }
        });

    } catch (error) {
        console.error('Erro ao aplicar permissões:', error);
    } finally {
        if (loading) loading.style.display = 'none';
    }
}
    window.addEventListener("load", aplicarPermissoesUsuario);

