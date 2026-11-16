
let facas = JSON.parse(localStorage.getItem("facas")) || [
    {
        nome: "Faca Imperial Damasco",
        preco: "R$ 59,99",
        imagem: "imagenes/faca 2.jpeg",
        descricao: "Faca artesanal com lâmina em aço damasco e acabamento exclusivo."
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

let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

facas.forEach(function(faca) {
    if (!faca.id) {
        faca.id = Date.now() + Math.random();
    }

    if (faca.estoque === undefined) {
        faca.estoque = true;
    }
});

localStorage.setItem("facas", JSON.stringify(facas));

let adminAtivo = sessionStorage.getItem("adminAtivo") === "true";
let indiceEdicao = -1;

const lista = document.querySelector("#lista-facas");
const painel = document.querySelector("#painel-admin");
const formulario = document.querySelector("#form-faca");

if (adminAtivo) {
    painel.style.display = "block";
}

function salvarFacas() {
    localStorage.setItem("facas", JSON.stringify(facas));
}

function salvarFavoritos() {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function alternarFavorito(id) {
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(function(item) {
            return item !== id;
        });
    } else {
        favoritos.push(id);
    }

    salvarFavoritos();
    mostrarFacas();
}

function abrirDetalhes(id) {
    window.location.href = "detalhes.html?id=" + id;
}

function mostrarFacas() {
    lista.innerHTML = "";

    let produtos = [...facas];

    let pesquisa = document.querySelector("#busca").value.toLowerCase();
    let pesquisaTopo = document.querySelector("#busca-topo").value.toLowerCase();

    if (pesquisaTopo !== "") {
        pesquisa = pesquisaTopo;
    }

    let filtro = document.querySelector("#filtro").value;
    let preco = document.querySelector("#filtro-preco").value;
    let tipo = document.querySelector("#filtro-favoritos").value;

    produtos = produtos.filter(function(faca) {
        return faca.nome.toLowerCase().includes(pesquisa) ||
               faca.descricao.toLowerCase().includes(pesquisa);
    });

    produtos = produtos.filter(function(faca) {
        let valor = Number(faca.preco.replace("R$ ", "").replace(",", "."));

        if (preco === "baixo") return valor <= 50;
        if (preco === "medio") return valor > 50 && valor <= 100;
        if (preco === "alto") return valor > 100;

        return true;
    });

    if (tipo === "favoritos") {
        produtos = produtos.filter(function(faca) {
            return favoritos.includes(faca.id);
        });
    }

    produtos.sort(function(a, b) {
        let precoA = Number(a.preco.replace("R$ ", "").replace(",", "."));
        let precoB = Number(b.preco.replace("R$ ", "").replace(",", "."));

        if (filtro === "maior") return precoB - precoA;
        if (filtro === "menor") return precoA - precoB;
        if (filtro === "az") return a.nome.localeCompare(b.nome);
        if (filtro === "za") return b.nome.localeCompare(a.nome);

        return 0;
    });

    produtos.forEach(function(faca) {
        let indice = facas.indexOf(faca);
        let estaFavorito = favoritos.includes(faca.id);

        lista.innerHTML += `
            <article class="card">
                <button class="botao-favorito"
                    onclick="alternarFavorito(${faca.id})">
                    ${estaFavorito ? "♥" : "♡"}
                </button>

                <img src="${faca.imagem}" alt="${faca.nome}">
                <h3>${faca.nome}</h3>
                <p>${faca.descricao}</p>
                <strong>${faca.preco}</strong>

                <p class="${faca.estoque ? 'em-estoque' : 'sem-estoque'}">
                    ${faca.estoque ? '✓ Em estoque' : '✕ Sem estoque'}
                </p>

                <button onclick="abrirDetalhes('${faca.id}')">
                    Ver detalhes
                </button>

                ${adminAtivo ? `
                    <div class="botoes-admin">
                        <button onclick="editarFaca(${indice})">Editar</button>
                        <button onclick="eliminarFaca(${indice})">Eliminar</button>
                    </div>
                ` : ""}
            </article>
        `;
    });

    if (produtos.length === 0) {
        lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
    }
}

document.querySelector("#busca").addEventListener("input", mostrarFacas);

document.querySelector("#busca-topo").addEventListener("input", function() {
    document.querySelector("#busca").value = this.value;
    mostrarFacas();
});

document.querySelector("#busca-topo").addEventListener("keydown", function(evento) {
    if (evento.key === "Enter") {
        document.querySelector("#busca").value = this.value;
        mostrarFacas();
    }
});

document.querySelector("#botao-buscar").addEventListener("click", function() {
    document.querySelector("#busca").value =
        document.querySelector("#busca-topo").value;

    mostrarFacas();
});

document.querySelector("#filtro").addEventListener("change", mostrarFacas);
document.querySelector("#filtro-preco").addEventListener("change", mostrarFacas);
document.querySelector("#filtro-favoritos").addEventListener("change", mostrarFacas);

mostrarFacas();

document.querySelector("#botao-admin").addEventListener("click", function() {
    if (adminAtivo) {
        adminAtivo = false;
        sessionStorage.removeItem("adminAtivo");

        painel.style.display = "none";
        cancelarEdicao();
        mostrarFacas();

        return;
    }

    let usuario = prompt("Usuário:");
    let senha = prompt("Senha:");

    if (usuario === "admin" && senha === "admin") {
        adminAtivo = true;
        sessionStorage.setItem("adminAtivo", "true");

        painel.style.display = "block";
        mostrarFacas();
    } else {
        alert("Usuário ou senha incorretos!");
    }
});

function editarFaca(indice) {
    indiceEdicao = indice;

    document.querySelector("#nome").value = facas[indice].nome;
    document.querySelector("#descricao").value = facas[indice].descricao;

    document.querySelector("#preco").value =
        facas[indice].preco.replace("R$ ", "").replace(",", ".");

    document.querySelector("#titulo-formulario").textContent = "Editar faca";
    document.querySelector("#botao-salvar").textContent = "Salvar alterações";
    document.querySelector("#botao-cancelar").style.display = "block";

    document.querySelector("#imagem").required = false;

    painel.scrollIntoView({ behavior: "smooth" });
}

function eliminarFaca(indice) {
    if (confirm("Deseja realmente eliminar esta faca?")) {
        let id = facas[indice].id;

        facas.splice(indice, 1);

        favoritos = favoritos.filter(function(item) {
            return item !== id;
        });

        salvarFacas();
        salvarFavoritos();
        mostrarFacas();

        if (indiceEdicao === indice) {
            cancelarEdicao();
        }
    }
}

function cancelarEdicao() {
    indiceEdicao = -1;
    formulario.reset();

    document.querySelector("#titulo-formulario").textContent = "Cadastrar faca";
    document.querySelector("#botao-salvar").textContent = "Cadastrar";
    document.querySelector("#botao-cancelar").style.display = "none";
    document.querySelector("#imagem").required = true;
}

document.querySelector("#botao-cancelar").addEventListener("click", cancelarEdicao);

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (!adminAtivo) {
        return;
    }

    let arquivo = document.querySelector("#imagem").files[0];

    function guardarFaca(imagem) {
        let novaFaca = {
            id: indiceEdicao === -1 ? Date.now() + Math.random() : facas[indiceEdicao].id,
            nome: document.querySelector("#nome").value,
            descricao: document.querySelector("#descricao").value,
            preco: "R$ " + Number(document.querySelector("#preco").value)
                .toFixed(2).replace(".", ","),
            imagem: imagem,
            estoque: indiceEdicao === -1 ? true : facas[indiceEdicao].estoque
        };

        if (indiceEdicao === -1) {
            facas.push(novaFaca);
        } else {
            facas[indiceEdicao] = novaFaca;
        }

        salvarFacas();
        mostrarFacas();
        cancelarEdicao();

        alert("Faca salva com sucesso!");
    }

    if (arquivo) {
        let leitor = new FileReader();

        leitor.onload = function() {
            guardarFaca(leitor.result);
        };

        leitor.readAsDataURL(arquivo);
    } else if (indiceEdicao !== -1) {
        guardarFaca(facas[indiceEdicao].imagem);
    }
});
