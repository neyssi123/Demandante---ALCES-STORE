const facas = [

    {
        nome: "Faca Imperial Damasco",
        preco: "R$ 59,99",
        imagem: "imagenes/faca 2.jpeg",
        descricao: "Faca artesanal com lâmina em aço damasco e acabamento exclusivo. Possui cabo azul e suporte de madeira, combinando resistência e elegância."
    },

    {
        nome: "Faca Black Damasco",
        preco: "R$ 68,99",
        imagem: "imagenes/faca 3.jpeg",
        descricao: "Faca de lâmina escura com padrão em aço damasco e acabamento sofisticado. Seu design moderno proporciona um visual marcante e elegante."
    },

    {
        nome: "Faca Premium",
        preco: "R$ 89,99",
        imagem: "imagenes/faca 4.jpeg",
        descricao: "Faca com lâmina ampla e acabamento polido, oferecendo um design único para a cozinha."
    },

    {
        nome: "Faca Santoku Artesanal",
        preco: "R$ 49,99",
        imagem: "imagenes/faca 5.jpeg",
        descricao: "Faca Santoku com lâmina larga e furos que ajudam a reduzir a aderência dos alimentos. Possui cabo artesanal com detalhes em madeira e resina."
    }

];


const lista = document.querySelector("#lista-facas");


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