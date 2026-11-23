let parametros = new URLSearchParams(window.location.search);
let id = parametros.get("id");

let facas = JSON.parse(localStorage.getItem("facas")) || [];
let faca = facas.find(function(item) {
    return String(item.id) === id;
});

let imagemSelecionada = 0;

const imagemPrincipal = document.querySelector("#imagem-principal");
const miniaturas = document.querySelector("#miniaturas");

if (!faca) {
    document.querySelector(".detalhes-container").innerHTML =
        "<h2>Produto não encontrado.</h2>";
} else {
    if (!Array.isArray(faca.imagens)) {
        faca.imagens = faca.imagem ? [faca.imagem] : [];
    }

    document.querySelector("#nome").textContent = faca.nome;
    document.querySelector("#descricao").textContent = faca.descricao;
    document.querySelector("#preco").textContent = faca.preco;

    atualizarEstoque();
    mostrarImagens();

    if (sessionStorage.getItem("adminAtivo") === "true") {
        document.querySelector("#area-admin").style.display = "block";
    }
}

function atualizarEstoque() {
    let estoque = document.querySelector("#estoque");

    if (faca.estoque) {
        estoque.textContent = "✓ Em estoque";
        estoque.className = "em-estoque";
    } else {
        estoque.textContent = "✕ Sem estoque";
        estoque.className = "sem-estoque";
    }
}

function mostrarImagens() {
    miniaturas.innerHTML = "";

    if (faca.imagens.length === 0) {
        imagemPrincipal.src = "";
        return;
    }

    if (imagemSelecionada >= faca.imagens.length) {
        imagemSelecionada = 0;
    }

    imagemPrincipal.src = faca.imagens[imagemSelecionada];

    faca.imagens.forEach(function(imagem, indice) {
        let miniatura = document.createElement("img");

        miniatura.src = imagem;
        miniatura.alt = faca.nome;
        
        if (indice === imagemSelecionada) {
            miniatura.classList.add("selecionada");
        }

        miniatura.addEventListener("click", function() {
            imagemSelecionada = indice;
            mostrarImagens();
        });

        miniaturas.appendChild(miniatura);
    });
}

document.querySelector("#botao-adicionar").addEventListener("click", function() {
    if (sessionStorage.getItem("adminAtivo") !== "true") {
        return;
    }

    let arquivos = document.querySelector("#novas-imagens").files;
    let mensagem = document.querySelector("#mensagem-admin");

    if (arquivos.length === 0) {
        mensagem.textContent = "Selecione pelo menos uma imagem.";
        return;
    }

    let leituras = Array.from(arquivos).map(function(arquivo) {
        return new Promise(function(resolve, reject) {
            let leitor = new FileReader();

            leitor.onload = function() {
                resolve(leitor.result);
            };

            leitor.onerror = reject;
            leitor.readAsDataURL(arquivo);
        });
    });

    Promise.all(leituras).then(function(imagens) {
        faca.imagens.push(...imagens);

        localStorage.setItem("facas", JSON.stringify(facas));

        imagemSelecionada = faca.imagens.length - imagens.length;
        mostrarImagens();

        document.querySelector("#novas-imagens").value = "";
        mensagem.textContent = "Imagens adicionadas com sucesso!";
    }).catch(function() {
        mensagem.textContent = "Erro ao carregar as imagens.";
    });
});
