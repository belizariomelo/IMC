const form = document.querySelector("#form-adiciona");
const mensagem = document.querySelector("#mensagem");
const tabela = document.querySelector("#tabela-pacientes");
const ulErros = document.querySelector("#mensagens-erro");
const inputNome = document.querySelector("#nome");
const inputPeso = document.querySelector("#peso");
const inputAltura = document.querySelector("#altura");
const inputGordura = document.querySelector("#gordura");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!inputPeso.value || !inputAltura.value) return;
  if (
    isNaN(inputPeso.value) ||
    isNaN(inputAltura.value) ||
    inputPeso.value <= 0 ||
    inputAltura.value <= 0
  )
    return;
  const paciente = {
    nome: inputNome.value,
    peso: inputPeso.value,
    altura: inputAltura.value,
    gordura: inputGordura.value,
    imc: calculaImc(inputPeso.value, inputAltura.value).toFixed(2),
  };
  adicionaPacienteNaTabela(paciente);
  form.reset();
  mensagem.textContent = "";
});

function calculaImc(peso, altura) {
  return peso / altura ** 2;
}

function adicionaPacienteNaTabela(paciente) {
  const erros = [];
  if (!validaPeso(paciente.peso)) {
    erros.push("*Peso inválido*");
    mostraErro(inputPeso, erros[0]);
  }
  if (!validaAltura(paciente.altura)) {
    erros.push("*Altura inválida*");
    mostraErro(inputAltura, erros[0]);
  }
  if (erros.length > 0) {
    exibeMensagensDeErro(erros);
    return;
  }
  tabela.appendChild(montaTr(paciente));
}

function validaPeso(peso) {
  return peso >= 0 && peso <= 250;
}

function validaAltura(altura) {
  return altura >= 0 && altura <= 2.7;
}

function exibeMensagensDeErro(erros) {
  ulErros.innerHTML = erros.map((erro) => `<li>${erro}</li>`).join("");
}

function mostraErro(campo, mensagem) {
  const divErro = campo.parentElement.querySelector(".erro");
  if (divErro) campo.parentElement.removeChild(divErro);
  const div = document.createElement("div");
  div.classList.add("erro");
  div.textContent = mensagem;
  campo.parentElement.appendChild(div);
}

function montaTr(paciente) {
  const pacienteTr = document.createElement("tr");
  pacienteTr.classList.add("paciente");
  pacienteTr.innerHTML = `
    <td class="info-nome">${paciente.nome}</td>
    <td class="info-peso">${paciente.peso}</td>
    <td class="info-altura">${paciente.altura}</td>
    <td class="info-gordura">${paciente.gordura}</td>
    <td class="info-imc">${paciente.imc}</td>
  `;
  return pacienteTr;
}
function removePaciente(event) {
  const linhaPaciente = event.target.parentNode;
  linhaPaciente.classList.add("animate__animated", "animate__fadeOut");
  setTimeout(() => {
    linhaPaciente.remove();
    salvaPacientes(); // adicionado para atualizar o Local Storage
  }, 220);
}

tabela.addEventListener("dblclick", removePaciente);
inputPeso.addEventListener("blur", () => {
  if (!validaPeso(inputPeso.value)) {
    mostraErro(inputPeso, "*Peso inválido*");
  } else {
    const divErro = inputPeso.parentElement.querySelector(".erro");
    if (divErro) divErro.remove();
  }
});

inputAltura.addEventListener("blur", () => {
  if (!validaAltura(inputAltura.value)) {
    mostraErro(inputAltura, "*Altura inválida*");
  } else {
    const divErro = inputAltura.parentElement.querySelector(".erro");
    if (divErro) divErro.remove();
  }
});
function carregaPacientes() {
  const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
  pacientes.forEach((paciente) => {
    adicionaPacienteNaTabela(paciente);
  });
}
carregaPacientes();
function adicionaPacienteNaTabela(paciente) {
  //...
  tabela.appendChild(montaTr(paciente));
  salvaPacientes();
}

function salvaPacientes() {
  const pacientes = [...tabela.querySelectorAll(".paciente")].map((tr) => ({
    nome: tr.querySelector(".info-nome").textContent,
    peso: tr.querySelector(".info-peso").textContent,
    altura: tr.querySelector(".info-altura").textContent,
    gordura: tr.querySelector(".info-gordura").textContent,
    imc: tr.querySelector(".info-imc").textContent,
  }));
  localStorage.setItem("pacientes", JSON.stringify(pacientes));
}
const doubleTapDelay = 300;
let lastTapTime = 0;
let tappedTwice = false;

tabela.addEventListener("touchend", (event) => {
  const now = new Date().getTime();

  if (lastTapTime !== 0 && now - lastTapTime < doubleTapDelay) {
    // detectou um duplo toque
    tappedTwice = true;

    // verifique se o elemento tocado é uma linha da tabela
    const linhaPaciente = event.target.closest("tr");
    if (linhaPaciente) {
      linhaPaciente.classList.add("animate__animated", "animate__fadeOut");
      setTimeout(() => {
        linhaPaciente.remove();
        salvaPacientes();
      }, 220);
    }
  }

  lastTapTime = now;

  setTimeout(() => {
    // se o usuário não tocou duas vezes, remove a classe de animação
    if (!tappedTwice) {
      const linhaPaciente = event.target.closest("tr");
      if (linhaPaciente) {
        linhaPaciente.classList.remove("animate__animated", "animate__fadeOut");
      }
    }

    tappedTwice = false;
  }, doubleTapDelay);
});

tabela.addEventListener("touchstart", (event) => {
  // não faça nada aqui, o toque duplo é detectado no touchend
});
