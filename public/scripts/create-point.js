function populateUFs() {
  const ufSelect = document.querySelector("select[name=uf]");

  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => {
      return res.json();
    })
    //Outra possibilidade para chamar funcção anônima que retorna um valor
    // .then(res => res.json())
    .then((states) => {
      for (const state of states) {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option> `;
      }
    });
}

populateUFs();

function getCities(event) {
  const citySelect = document.querySelector("select[name=city]");
  const stateInput = document.querySelector("input[name=state]");

  const ufValue = event.target.value;

  const indexOfSelectedState = event.target.selectedIndex;

  stateInput.value = event.target.options[indexOfSelectedState].text;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

  //As próximas duas linhas limpam o campo "Selecione a Cidade"
  //sempre que o úsuario seleciona um novo estado.
  citySelect.innerHTML = `<option value>Selecione a Cidade</option>`;
  citySelect.disabled = true;

  fetch(url)
    .then((res) => res.json())
    .then((cities) => {
      for (const city of cities) {
        citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`;
      }

      citySelect.disabled = false;
    });
}

document.querySelector("select[name=uf]").addEventListener("change", getCities);

const itemsToCollect = document.querySelectorAll(".items-grid li");

for (const item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem);
}

const collectedItems = document.querySelector("input[name=items]");

let selectedItems = [];

function handleSelectedItem(event) {
  const itemLi = event.target;
  // Add or remove one class by javascript
  itemLi.classList.toggle("selected");
  const itemId = itemLi.dataset.id;

  console.log("ITEM ID:", itemId);

  // verificar se existem itens selecionados, se sim
  // pegar os itens selecionados
  const alreadySelected = selectedItems.findIndex((item) => {
    const itemFound = item == itemId; //retorna true or fase
    return itemFound;
  });

  // se já estiver selecionado,
  if (alreadySelected >= 0) {
    // tirar da seleção
    const filteredItems = selectedItems.filter((item) => {
      const itemIsDifferent = item != itemId;
      return itemIsDifferent;
    });

    selectedItems = filteredItems;
  } else {
    // se não, add a seleção
    selectedItems.push(itemId);
  }

  console.log("selectedItems:", selectedItems);

  // atualizar o campo escondido com os itens selecionados
  collectedItems.value = selectedItems;
}
