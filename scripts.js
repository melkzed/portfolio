document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card-video-container");

    cards.forEach(card => {
        const video = card.querySelector("video");

        card.addEventListener("mouseover", () => {
            video.style.display = "block";
            video.play();
        });

        card.addEventListener("mouseout", () => {
            video.pause();
            video.currentTime = 0;
            video.style.display = "none";
        });
    });
});


function enviarWhats(event) {
    event.preventDefault()

    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const telefone = '5581994616516'

    const texto = `Olá! Me chamo ${nome}, ${mensagem}`
    const msgFormatada = encodeURIComponent(texto)

    const url = `https://wa.me/${telefone}?text=${msgFormatada}`

    window.open(url, '_blank')
}