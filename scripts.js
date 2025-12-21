/*
  --------------------------------------------------------------------------------------
  Variáveis globais para armazenar dados do CEP
  --------------------------------------------------------------------------------------
*/
let dadosCep = {
  endereco: '',
  bairro: '',
  cidade: '',
  estado: ''
};

/*
  --------------------------------------------------------------------------------------
  Função para mostrar/esconder campo CEP baseado na categoria
  --------------------------------------------------------------------------------------
*/
const toggleCepField = () => {
  const categoria = document.getElementById('newCategoria').value;
  const cepContainer = document.getElementById('cepContainer');
  const cepInfo = document.getElementById('cepInfo');
  
  // Mostra campo CEP apenas se categoria = 2 (Imovel)
  if (categoria === '2') {
    cepContainer.style.display = 'flex';
  } else {
    cepContainer.style.display = 'none';
    cepInfo.style.display = 'none';
    document.getElementById('newCep').value = '';
    dadosCep = { endereco: '', bairro: '', cidade: '', estado: '' };
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para buscar CEP na API externa via backend
  --------------------------------------------------------------------------------------
*/
const buscarCep = async () => {
  const inputCep = document.getElementById('newCep').value.replace(/\D/g, '');
  
  if (!inputCep || inputCep.length !== 8) {
    alert('CEP inválido! Digite 8 dígitos.');
    return;
  }

  try {
    const response = await fetch(`http://127.0.0.1:5000/buscarCep?cep=${inputCep}`);
    const data = await response.json();

    if (response.ok) {
      // Armazena dados do CEP
      dadosCep = {
        endereco: data.endereco || '',
        bairro: data.bairro || '',
        cidade: data.cidade || '',
        estado: data.estado || ''
      };

      // Exibe informações na tela
      document.getElementById('endereco').textContent = `${data.endereco}, ${data.complemento || ''}`;
      document.getElementById('bairro').textContent = data.bairro;
      document.getElementById('cidade').textContent = `${data.cidade}/${data.estado}`;
      document.getElementById('cepInfo').style.display = 'block';

      alert('CEP encontrado com sucesso!');
    } else {
      alert(data.message || 'CEP não encontrado!');
      dadosCep = { endereco: '', bairro: '', cidade: '', estado: '' };
      document.getElementById('cepInfo').style.display = 'none';
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    alert('Erro ao consultar CEP. Verifique se o backend está rodando.');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/buscarPatrimonios';
  
  console.log('🔄 Iniciando busca de patrimônios...');
  
  try {
    const response = await fetch(url, { method: 'get' });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    const data = await response.json();
    
    console.log('📦 Dados recebidos:', data);
    console.log('📦 Tipo:', typeof data);
    console.log('📦 Keys:', Object.keys(data));
    
    // Limpa a tabela antes de preencher
    const table = document.getElementById('myTable');
    const tbody = table.querySelector('tbody');
    
    if (!tbody) {
      console.error('❌ Tbody não encontrado!');
      alert('Erro: estrutura da tabela inválida');
      return;
    }
    
    // Limpa tbody
    tbody.innerHTML = '';
    console.log('🧹 Tabela limpa');
    
    // Tenta encontrar os patrimônios em diferentes estruturas
    let patrimonios = null;
    
    if (data.buscarPatrimonios) {
      patrimonios = data.buscarPatrimonios;
      console.log('✅ Encontrado em data.buscarPatrimonios');
    } else if (data.patrimonios) {
      patrimonios = data.patrimonios;
      console.log('✅ Encontrado em data.patrimonios');
    } else if (Array.isArray(data)) {
      patrimonios = data;
      console.log('✅ Data é um array direto');
    } else {
      console.error('❌ Estrutura de dados não reconhecida:', data);
    }
    
    console.log('📋 Patrimônios:', patrimonios);
    console.log('📊 Quantidade:', patrimonios ? patrimonios.length : 0);
    
    if (patrimonios && Array.isArray(patrimonios) && patrimonios.length > 0) {
      console.log('🔄 Inserindo patrimônios na tabela...');
      
      patrimonios.forEach((item, index) => {
        console.log(`  ${index + 1}. Inserindo:`, item);
        insertList(
          item.nome, 
          item.descricao, 
          item.categoria, 
          item.situacao,
          item.cep || '-'
        );
      });
      
      console.log('✅ Patrimônios inseridos com sucesso!');
      alert(`✅ ${patrimonios.length} patrimônio(s) carregado(s)!`);
    } else {
      console.warn('⚠️ Nenhum patrimônio encontrado');
      alert('⚠️ Nenhum patrimônio cadastrado ainda.');
    }
  } catch (error) {
    console.error('❌ Erro ao buscar patrimônios:', error);
    console.error('Stack trace:', error.stack);
    alert('❌ Erro ao buscar patrimônios. Abra o console (F12) para mais detalhes.');
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para converter número da categoria em texto
  --------------------------------------------------------------------------------------
*/
const getCategoriaTexto = (categoria) => {
  const categorias = {
    1: 'Movel',
    2: 'Imovel',
    3: 'Informatica',
    4: 'Veiculos'
  };
  return categorias[categoria] || 'Desconhecida';
}

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputPatrimonio, inputDescricao, inputCategoria, inputSituacao, inputCep) => {
  const formData = new FormData();
  formData.append('nome', inputPatrimonio);
  formData.append('descricao', inputDescricao);
  formData.append('categoria', inputCategoria);
  formData.append('situacao', inputSituacao);
  
  // Adiciona CEP apenas se for imóvel e tiver CEP
  if (inputCategoria === '2' && inputCep) {
    formData.append('cep', inputCep);
  }

  let url = 'http://127.0.0.1:5000/cadastrarPatrimonio';
  
  try {
    const response = await fetch(url, {
      method: 'post',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.message || 'Erro ao cadastrar patrimônio');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Erro ao cadastrar patrimônio');
  }
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
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML;
      
      if (confirm("Deseja realmente excluir este item?")) {
        div.remove();
        deleteItem(nomeItem);
        alert("Removido!");
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
  let url = 'http://127.0.0.1:5000/deletePatrimonio?nome=' + item;
  
  fetch(url, { method: 'delete' })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputPatrimonio = document.getElementById("newInput").value;
  let inputDescricao = document.getElementById("newDescricao").value;
  let inputCategoria = document.getElementById("newCategoria").value;
  let inputSituacao = document.getElementById("newSituacao").value;
  let inputCep = document.getElementById("newCep").value.replace(/\D/g, '');

  // Validações
  if (inputPatrimonio === '') {
    alert("Digite o nome do patrimônio!");
    return;
  }
  
  if (inputDescricao === '') {
    alert("Digite a descrição!");
    return;
  }
  
  if (inputCategoria === '') {
    alert("Selecione a categoria!");
    return;
  }
  
  if (inputSituacao === '') {
    alert("Selecione a situação!");
    return;
  }

  // Se for imóvel, valida CEP
  if (inputCategoria === '2') {
    if (!inputCep || inputCep.length !== 8) {
      alert("Para imóveis, é necessário informar um CEP válido!");
      return;
    }
  }

  // Adiciona na tabela e envia para o backend
  insertList(inputPatrimonio, inputDescricao, inputCategoria, inputSituacao, inputCep || '-');
  postItem(inputPatrimonio, inputDescricao, inputCategoria, inputSituacao, inputCep);
  
  alert("Item adicionado!");
  
  // Limpa os campos
  document.getElementById("newInput").value = "";
  document.getElementById("newDescricao").value = "";
  document.getElementById("newCategoria").value = "";
  document.getElementById("newSituacao").value = "";
  document.getElementById("newCep").value = "";
  document.getElementById("cepInfo").style.display = "none";
  document.getElementById("cepContainer").style.display = "none";
  dadosCep = { endereco: '', bairro: '', cidade: '', estado: '' };
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (namePatrimonio, descricao, categoria, situacao, cep) => {
  console.log('➕ insertList chamado com:', {namePatrimonio, descricao, categoria, situacao, cep});
  
  const categoriaTexto = getCategoriaTexto(categoria);
  console.log('  Categoria convertida:', categoriaTexto);
  
  const item = [
    namePatrimonio, 
    descricao, 
    categoriaTexto, 
    situacao, 
    cep || '-'
  ];
  
  const table = document.getElementById('myTable');
  const tbody = table.querySelector('tbody');
  
  if (!tbody) {
    console.error('❌ Tbody não encontrado na insertList!');
    return;
  }
  
  const row = tbody.insertRow();
  
  for (let i = 0; i < item.length; i++) {
    const cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertButton(row.insertCell(-1));
  
  console.log('  ✅ Item inserido na tabela');
  
  removeElement();
}

/*
  --------------------------------------------------------------------------------------
  Carrega a lista ao iniciar a página
  --------------------------------------------------------------------------------------
*/
window.onload = () => {
  getList();
}