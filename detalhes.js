
let facas = JSON.parse(localStorage.getItem("facas")) || [];

let parametros = new URLSearchParams(window.location.search);
let id = parametros.get("id");

let faca = facas.find(function(item) {
    return String(item.id) === id;
});

let adminAtivo = sessionStorage.getItem("adminAtivo") === "true";

const painel = document.querySelector("#painel-admin");
const formulario = document.querySelector("#form-editar");

function mostrarDetalhes() {
    if (!faca) {
        document.querySelector("main").innerHTML =
            "<h2>Produto não encontrado.</h2>";
        return;
    }

    document.querySelector("#imagem-produto").src = faca.imagem;
    document.querySelector("#nome-produto").textContent = faca.nome;
    document.querySelector("#descricao-produto").textContent = faca.descricao;
    document.querySelector("#preco-produto").textContent = faca.preco;

    let estado = document.querySelector("#estado-estoque");

    if (faca.estoque) {
        estado.textContent = "✓ Em estoque";
        estado.className = "em-estoque";
    } else {
        estado.textContent = "✕ Sem estoque";
        estado.className = "sem-estoque";
    }
}

function mostrarFormulario() {
    if (!adminAtivo || !faca) {
        painel.style.display = "none";
        return;
    }

    painel.style.display = "block";

    document.querySelector("#nome").value = faca.nome;
    document.querySelector("#descricao").value = faca.descricao;

    document.querySelector("#preco").value =
        faca.preco.replace("R$ ", "").replace(",", ".");

    document.querySelector("#estoque").checked = faca.estoque;
}

document.querySelector("#botao-admin").addEventListener("click", function() {
    if (adminAtivo) {
        adminAtivo = false;
        sessionStorage.removeItem("adminAtivo");

        painel.style.display = "none";

        this.textContent = "Admin";
        return;
    }

    let usuario = prompt("Usuário:");
    let senha = prompt("Senha:");

    if (usuario === "admin" && senha === "admin") {
        adminAtivo = true;
        sessionStorage.setItem("adminAtivo", "true");

        mostrarFormulario();

        this.textContent = "Sair do Admin";
    } else {
        alert("Usuário ou senha incorretos!");
    }
});

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    if (!adminAtivo || !faca) {
        return;
    }

    let arquivo = document.querySelector("#imagem").files[0];

    function salvarProduto(imagem) {
        faca.nome = document.querySelector("#nome").value;
        faca.descricao = document.querySelector("#descricao").value;

        faca.preco = "R$ " + Number(document.querySelector("#preco").value)
            .toFixed(2).replace(".", ",");

        faca.imagem = imagem;

        faca.estoque = document.querySelector("#estoque").checked;

        localStorage.setItem("facas", JSON.stringify(facas));

        mostrarDetalhes();

        alert("Produto atualizado com sucesso!");
    }

    if (arquivo) {
        let leitor = new FileReader();

        leitor.onload = function() {
            salvarProduto(leitor.result);
        };

        leitor.readAsDataURL(arquivo);
    } else {
        salvarProduto(faca.imagem);
    }
});

mostrarDetalhes();
mostrarFormulario();

if (adminAtivo) {
    document.querySelector("#botao-admin").textContent = "Sair do Admin";
}
