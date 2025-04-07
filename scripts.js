/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const inputCategoria = document.getElementById('newCategoria').value;

const getList = async () => {
  let url = 'http://127.0.0.1:5000/buscarPatrimonios';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.buscarPatrimonios.forEach(item => insertList(item.nome, item.descricao, item.categoria, item.situacao))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputPatrimonio, inputDescricao, inputCategoria, inputSituacao) => {
  const formData = new FormData();
  formData.append('nome', inputPatrimonio);
  formData.append('descricao', inputDescricao);
  formData.append('categoria', inputCategoria);
  formData.append('situacao', inputSituacao);

  let url = 'http://127.0.0.1:5000/cadastrarPatrimonio';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  for (let i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      console.log(nomeItem)
      if (confirm("Deseja realmente excluir este item?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/deletePatrimonio?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputPatrimonio = document.getElementById("newInput").value;
  let inputDescricao = document.getElementById("newDescricao").value;
  let inputCategoria = document.getElementById("newCategoria").value;
  let inputSituacao = document.getElementById("newSituacao").value;

  if (inputPatrimonio === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputCategoria)) {
    alert("Categoria precisam ser números!");
  } else {
    insertList(inputPatrimonio, inputDescricao, inputCategoria, inputSituacao)
    postItem(inputPatrimonio, inputDescricao, inputCategoria, inputSituacao)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
let itemCount = 0;

const insertList = (namePatrimonio, descricao, categoria, situacao) => {
  const item = [namePatrimonio, descricao, categoria, situacao];
  const table = document.getElementById('myTable');

  // Se tiver 5 ou mais linhas (além do cabeçalho), limpa a tabela
  if (itemCount > 5) {
    while (table.rows.length > 1) {
      table.deleteRow(1); // Mantém o cabeçalho (linha 0)
    }
    itemCount = 0; // Reinicia o contador
  }

  const row = table.insertRow();
  for (let i = 0; i < item.length; i++) {
    const cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertButton(row.insertCell(-1));

  document.getElementById("newInput").value = "";
  document.getElementById("newDescricao").value = "";
  document.getElementById("newCategoria").value = "";
  document.getElementById("newSituacao").value = "";

  itemCount++; // Incrementa ao final

  removeElement();
};

