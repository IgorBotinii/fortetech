document.addEventListener("DOMContentLoaded", async () => {
    const img = document.getElementById("imagem-aviso");

    let imagens = [];
    let index = 0;
    let autoplay;
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    // Carregar imagens
    try {
        const res = await fetch('https://fortetech.app.br/listar-avisos');
        imagens = await res.json();
        if (!imagens.length) return;

        img.src = `https://fortetech.app.br/avisos/${imagens[index]}`;
        iniciarAutoplay();
    } catch (e) {
        console.error("Erro ao carregar imagens", e);
    }

    function mostrarImagem(i) {
        index = (i + imagens.length) % imagens.length;
        img.style.transform = 'translateX(0%)';
        img.src = `https://fortetech.app.br/avisos/${imagens[index]}`;
    }

    function proximo() {
        mostrarImagem(index + 1);
    }

    function anterior() {
        mostrarImagem(index - 1);
    }

    // Autoplay
    function iniciarAutoplay() {
        autoplay = setInterval(() => proximo(), 4000);
    }

    function reiniciarAutoplay() {
        clearInterval(autoplay);
        iniciarAutoplay();
    }

    function iniciarDrag(x) {
        startX = x;
        dragging = true;
        img.classList.add("dragging");
        clearInterval(autoplay); // pausa autoplay ao arrastar
    }

    function moverDrag(x) {
        if (!dragging) return;
        currentX = x;
        const diff = currentX - startX;
        img.style.transform = `translateX(${diff}px)`;
    }

    function soltarDrag() {
        if (!dragging) return;

        const diff = currentX - startX;
        img.classList.remove("dragging");

        if (diff < -100) {
            proximo();
        } else if (diff > 100) {
            anterior();
        } else {
            img.style.transform = 'translateX(0px)'; // volta ao centro se arrasto pequeno
        }

        dragging = false;
        reiniciarAutoplay();
    }

    // Eventos mouse
    img.addEventListener("mousedown", e => iniciarDrag(e.clientX));
    window.addEventListener("mousemove", e => moverDrag(e.clientX));
    window.addEventListener("mouseup", soltarDrag);

    // Eventos touch
    img.addEventListener("touchstart", e => iniciarDrag(e.touches[0].clientX));
    img.addEventListener("touchmove", e => moverDrag(e.touches[0].clientX));
    img.addEventListener("touchend", soltarDrag);
});
