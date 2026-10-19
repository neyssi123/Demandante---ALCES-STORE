
const facas = JSON.parse(localStorage.getItem("facas")) || [

    {
        nome: "Faca Imperial Damasco",
        preco: "R$ 59,99",
        imagem: "imagenes/faca 2.jpeg",
        descricao: "Faca artesanal com lâmina em aço damasco e cabo azul."
    },

    {
        nome: "Faca Black Damasco",
        preco: "R$ 68,99",
        imagem: "imagenes/faca 3.jpeg",
        descricao: "Faca de lâmina escura com acabamento sofisticado."
    },

    {
        nome: "Faca Premium",
        preco: "R$ 89,99",
        imagem: "imagenes/faca 4.jpeg",
        descricao: "Faca com lâmina ampla e acabamento polido."
    },

    {
        nome: "Faca Santoku Artesanal",
        preco: "R$ 49,99",
        imagem: "imagenes/faca 5.jpeg",
        descricao: "Faca Santoku com lâmina larga e cabo artesanal."
    }

];

const lista = document.querySelector("#lista-facas");

function mostrarFacas() {

    lista.innerHTML = "";

    facas.forEach(function(faca) {

        lista.innerHTML += `
            <article class="card">
                <img src="${faca.imagem}" alt="${faca.nome}">
                <h3>${faca.nome}</h3>
                <p>${faca.descricao}</p>
                <strong>${faca.preco}</strong>
            </article>
        `;

    });

}

mostrarFacas();

document.querySelector("#botao-admin").addEventListener("click", function() {

    let usuario = prompt("Usuário:");
    let senha = prompt("Senha:");

    if (usuario === "admin" && senha === "admin") {
        document.querySelector("#painel-admin").style.display = "block";
    } else {
        alert("Usuário ou senha incorretos!");
    }

});

document.querySelector("#form-faca").addEventListener("submit", function(evento) {

    evento.preventDefault();

    let arquivo = document.querySelector("#imagem").files[0];

    let leitor = new FileReader();

    leitor.onload = function() {

        let novaFaca = {
            nome: document.querySelector("#nome").value,
            descricao: document.querySelector("#descricao").value,
            preco: "R$ " + document.querySelector("#preco").value,
            imagem: leitor.result
        };

        facas.push(novaFaca);

        localStorage.setItem("facas", JSON.stringify(facas));

        mostrarFacas();

        document.querySelector("#form-faca").reset();

        alert("Faca cadastrada!");

    };

    leitor.readAsDataURL(arquivo);

});
