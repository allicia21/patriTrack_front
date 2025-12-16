# patriTrack_front
projeto front end para integrar com uma aplicação web em python para gerenciamento de patrimonios.

## Como executar

Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.



## NOVO ARQUIVO

# PatriTrack - Frontend

Interface web para gerenciamento de patrimônios, desenvolvida em HTML, CSS e JavaScript puro.

## 🚀 Como executar com Docker

### Pré-requisitos
- Docker instalado
- Docker Compose instalado
- **Backend rodando** (ver repositório do backend)

### Passos para execução

1. **Clone o repositório**
```bash
git clone <seu-repositorio-frontend>
cd <nome-do-repositorio>
```

2. **Build da imagem Docker**
```bash
docker-compose build
```

3. **Iniciar o container**
```bash
docker-compose up -d
```

4. **Verificar se está rodando**
```bash
docker-compose ps
```

5. **Acessar a aplicação**
- Frontend: http://localhost

### Comandos úteis

**Ver logs:**
```bash
docker-compose logs -f
```

**Parar o container:**
```bash
docker-compose down
```

**Recriar o container:**
```bash
docker-compose up -d --force-recreate
```

## 📦 Estrutura do Projeto
```
frontend/
├── index.html            # Página principal
├── styles.css           # Estilos CSS
├── scripts.js           # Lógica JavaScript
├── Dockerfile           # Configuração Docker
├── docker-compose.yml   # Orquestração Docker
└── nginx.conf           # Configuração Nginx
```

## 🔧 Configuração do Backend

⚠️ **IMPORTANTE**: O frontend faz chamadas para o backend em `http://127.0.0.1:5000`

### Certifique-se de que o backend está rodando

Execute o backend primeiro:
```bash
cd ../backend/
docker-compose up -d
```

Depois execute o frontend:
```bash
cd ../frontend/
docker-compose up -d
```

## 🎨 Funcionalidades

- ✅ Cadastro de patrimônios
- ✅ Listagem de patrimônios
- ✅ Exclusão de patrimônios
- ✅ Categorização (Móvel, Imóvel, Informática, Veículos)
- ✅ Status de situação (Novo, Usado, Reformado)
- ✅ Interface responsiva

## 📝 Notas para Avaliadores

- O container nginx serve os arquivos estáticos na porta 80
- O frontend se comunica com o backend via chamadas REST
- **IMPORTANTE**: Certifique-se de que o backend está rodando antes de usar o frontend
- Caso o backend não responda, verifique se está acessível em `http://localhost:5000`
- O nginx está configurado com cache e compressão gzip para melhor performance

## 🐛 Troubleshooting

**Erro de CORS:**
- Verifique se o backend está com CORS habilitado (já configurado no app.py)

**Frontend não carrega os dados:**
- Verifique se o backend está rodando: `curl http://localhost:5000/buscarPatrimonios`
- Veja o console do navegador (F12) para erros JavaScript

**Porta 80 já em uso:**
- Pare outros serviços na porta 80 ou altere a porta no docker-compose.yml:
```yaml
ports:
  - "8080:80"  # Usa porta 8080 ao invés de 80
```

## 📞 Testando a Integração

1. Abra o frontend: http://localhost
2. Adicione um patrimônio usando o formulário
3. Verifique se aparece na lista abaixo
4. Teste a exclusão clicando no X

Se tudo funcionar corretamente, você verá alertas de confirmação e a lista atualizada automaticamente!