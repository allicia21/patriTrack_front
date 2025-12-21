# PatriTrack - Frontend

Aplicação web para gerenciamento de patrimônios e ativos, desenvolvida com HTML5, CSS3 e JavaScript puro.

## 🚀 Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização e responsividade
- **JavaScript ES6** - Lógica e interação
- **Nginx** - Servidor web
- **Docker** - Containerização

## 📋 Funcionalidades

- ✅ Cadastro de patrimônios com categorias (Móvel, Imóvel, Informática, Veículos)
- ✅ Listagem dinâmica de patrimônios cadastrados
- ✅ Exclusão de patrimônios
- ✅ **Busca de CEP automática** (apenas para imóveis)
- ✅ Integração com API ViaCEP via backend
- ✅ Interface responsiva (desktop, tablet, mobile)
- ✅ Validações de formulário
- ✅ Feedback visual ao usuário (alertas)

## 📁 Estrutura do Projeto
```
frontend/
├── index.html          # Página principal
├── styles.css          # Estilos e responsividade
├── scripts.js          # Lógica JavaScript
├── Dockerfile          # Configuração Docker
├── nginx.conf          # Configuração do servidor Nginx
└── README.md           # Este arquivo
```

## 🐳 Como Executar com Docker

### Pré-requisitos

- Docker instalado ([Download aqui](https://www.docker.com/))
- **Backend rodando** em http://localhost:5000

---

### ⚠️ IMPORTANTE

Este projeto **NÃO possui docker-compose.yml** próprio.  

Existem duas formas de executá-lo:

1. **Via docker-compose do backend** (Recomendado - mais fácil)
2. **Manualmente** (para desenvolvimento ou teste isolado)

---

## 🚀 Opção 1: Execução via Backend (Recomendado)

O frontend é gerenciado pelo `docker-compose.yml` do backend.

### Passo 1: Build da imagem do frontend
# Entre na pasta do frontend
cd C:\caminho\para\PatriTrack_Front

# Build da imagem
docker build -t patritrack-frontend:latest .

**Exemplo:**
  cd C:\MVP_SPRINT.01\PatriTrack_Front
  docker build -t patritrack-frontend:latest .


### Passo 2: Execute o docker-compose do backend
  Leia o arquivo README.md do projeto PatriTrack para subir a aplicação

### Passo 3: Acessar

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/openapi

---

## 🛠️ Opção 2: Execução Manual (Desenvolvimento)

Para rodar apenas o frontend isoladamente:

### Build da imagem
cd C:\caminho\para\PatriTrack_Front
docker build -t patritrack-frontend:latest .


### Executar o container
docker run -d \
  --name patritrack-frontend \
  -p 80:80 \
  --restart unless-stopped \
  patritrack-frontend:latest


### Acessar

abra o aquivo index.html direto no navegador

### Parar e remover
docker stop patritrack-frontend
docker rm patritrack-frontend

---

## 🔄 Atualizando Após Alterações

### Se você editou o código do frontend:
# 1. Rebuild da imagem
docker build -t patritrack-frontend:latest .

# 2. Se estiver usando via docker-compose do backend:
docker-compose up -d --force-recreate frontend

# 3. Se estiver rodando manualmente:
docker stop patritrack-frontend
docker rm patritrack-frontend
docker run -d --name patritrack-frontend -p 80:80 patritrack-frontend:latest

---

## 🔧 Comandos Úteis

### Ver logs
# Se executado via compose do backend
docker-compose logs -f frontend

# Se executado manualmente
docker logs -f patritrack-frontend

### Verificar status
# Via compose do backend
docker-compose ps

# Manualmente
docker ps | grep patritrack-frontend

### Parar
# Via compose do backend
docker-compose down

# Manualmente
docker stop patritrack-frontend
docker rm patritrack-frontend

---

## 🎨 Funcionalidades Detalhadas

### 1. Cadastro de Patrimônios

- **Campos obrigatórios**: Nome, Descrição, Categoria, Situação
- **Categorias disponíveis**:
  - Móvel
  - Imóvel (com campo CEP)
  - Informática
  - Veículos

**Validações:**
- ✅ Todos os campos são obrigatórios
- ✅ CEP obrigatório e validado (8 dígitos) para imóveis
- ✅ Mensagens de erro claras

### 2. Busca de CEP (Imóveis)

**Fluxo:**
1. Selecione categoria: **Imóvel**
2. Campo CEP aparece automaticamente
3. Digite o CEP (com ou sem formatação): `01310100` ou `01310-100`
4. Clique em **🔍 Buscar CEP**
5. Sistema consulta o backend → backend consulta ViaCEP
6. Informações aparecem: Endereço, Bairro, Cidade/UF

**Características:**
- Campo CEP **só aparece** para categoria Imóvel
- Formatação automática (remove hífen/pontos)
- Validação de 8 dígitos
- Exibição em card verde abaixo do formulário

### 3. Listagem de Patrimônios

- **Carregamento automático** ao abrir a página
- Botão **🔄 Atualizar Lista** para recarregar manualmente
- Exibe todos os patrimônios cadastrados
- Colunas: Nome, Descrição, Categoria, Situação, CEP, Ações
- Categoria convertida de número para texto legível

### 4. Exclusão de Patrimônios

- Botão **×** em cada linha da tabela
- Confirmação antes de excluir
- Remoção imediata da interface
- Sincronização com backend

### 5. Responsividade

**Desktop (>1024px):**
- Layout otimizado em duas colunas
- Formulário com campos em grid
- Tabela completa visível

**Tablet (768px - 1024px):**
- Layout adaptado
- Formulário em coluna única
- Tabela com scroll horizontal

**Mobile (<768px):**
- Layout vertical
- Campos empilhados
- Botões full-width
- Tabela com scroll horizontal
- Banner com altura reduzida

---

## 🔗 Integração com Backend

### Endpoints Utilizados

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/buscarPatrimonios` | GET | Lista todos os patrimônios |
| `/cadastrarPatrimonio` | POST | Cadastra novo patrimônio |
| `/deletePatrimonio?nome={nome}` | DELETE | Remove patrimônio |
| `/buscarCep?cep={cep}` | GET | Consulta CEP via ViaCEP |

### Base URL
```javascript
const BASE_URL = 'http://127.0.0.1:5000';
```

### Formato de Requisições

**Cadastrar Patrimônio:**
```javascript
POST /cadastrarPatrimonio
Content-Type: multipart/form-data

{
  nome: "Notebook Dell",
  descricao: "Notebook para desenvolvimento",
  categoria: "3",
  situacao: "Novo",
  cep: "01310100"  // opcional, apenas para imóveis
}
```

**Buscar CEP:**
```javascript
GET /buscarCep?cep=01310100
```

### Formato de Respostas

**Lista de Patrimônios:**
```json
{
  "buscarPatrimonios": [
    {
      "id": 1,
      "nome": "Notebook Dell",
      "descricao": "Notebook para desenvolvimento",
      "categoria": 3,
      "situacao": "Novo",
      "cep": null
    }
  ]
}
```

**Busca de CEP:**
```json
{
  "cep": "01310-100",
  "endereco": "Avenida Paulista",
  "complemento": "até 610 - lado par",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "ddd": "11"
}
```

---

## 🐛 Troubleshooting

### Porta 80 já em uso

**Solução 1: Descobrir o que está usando**
# Windows
netstat -ano | findstr :80

# Parar o serviço ou processo

**Solução 2: Usar outra porta**
docker run -d --name patritrack-frontend -p 8080:80 patritrack-frontend:latest

Depois acesse: http://localhost:8080


### Frontend não carrega dados do backend

**1. Verifique se o backend está rodando:**
curl http://localhost:5000/buscarPatrimonios


**2. Abra o Console do navegador (F12):**
- Vá na aba **Console**
- Procure por erros em vermelho
- Verifique mensagens de CORS

**3. Verifique os logs do frontend:**
docker logs patritrack-frontend

---

### Erro de CORS

O backend **deve** ter CORS habilitado:
```python
from flask_cors import CORS
CORS(app)
```

Isso já está configurado no backend, mas se persistir:
- Verifique se o backend realmente está rodando
- Teste o endpoint diretamente: `curl http://localhost:5000/buscarPatrimonios`

---

### Busca de CEP não funciona

**1. Verifique se o endpoint existe no backend:**
```bash
curl "http://localhost:5000/buscarCep?cep=01310100"
```

**2. Se retornar 404:**
- O backend não tem o endpoint `/buscarCep` implementado
- Verifique se você adicionou o código no `app.py`

**3. Se retornar erro 400/500:**
- Veja os logs do backend: `docker-compose logs -f backend`

---

### Imagem não existe ao rodar docker-compose

**Erro:**
```
Error: No such image: patritrack-frontend:latest
```

**Solução:**
Você precisa fazer o build da imagem primeiro:
```bash
cd C:\MVP_SPRINT.01\PatriTrack_Front
docker build -t patritrack-frontend:latest .
```

---

### Container não inicia

**Ver logs detalhados:**
```bash
docker logs patritrack-frontend
```

**Verificar se tem erro no Nginx:**
```bash
docker exec patritrack-frontend nginx -t
```

---

## 🎯 Validações Implementadas

| Campo | Validação |
|-------|-----------|
| Nome | Obrigatório, texto não vazio |
| Descrição | Obrigatório, texto não vazio |
| Categoria | Obrigatório, deve selecionar uma opção |
| Situação | Obrigatório, deve selecionar uma opção |
| CEP | Obrigatório para Imóveis, exatamente 8 dígitos numéricos |

**Mensagens de erro:**
- "Digite o nome do patrimônio!"
- "Digite a descrição!"
- "Selecione a categoria!"
- "Selecione a situação!"
- "Para imóveis, é necessário informar um CEP válido!"
- "CEP inválido! Digite 8 dígitos."

---

## 📊 Mapeamento de Categorias

O backend armazena categorias como números, o frontend converte para texto:
```javascript
1 → "Móvel"
2 → "Imóvel"
3 → "Informática"
4 → "Veículos"
```

---

## 🌐 Tecnologias do Container

- **Imagem base**: `nginx:alpine`
- **Tamanho da imagem**: ~23MB (muito leve!)
- **Porta exposta**: 80
- **Servidor web**: Nginx 1.25+
- **Recursos**: 
  - Compressão gzip
  - Cache de arquivos estáticos (1 ano)
  - Logs de acesso e erro

---

## 📝 Configuração do Nginx

### Otimizações Implementadas
```nginx
# Compressão gzip para melhor performance
gzip on;
gzip_types text/plain text/css text/javascript application/javascript;

# Cache de arquivos estáticos
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Headers de segurança
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
```

---

## 📋 Checklist para Avaliadores

### Estrutura e Configuração
- [ ] Projeto possui apenas Dockerfile (sem docker-compose.yml próprio)
- [ ] Arquivo nginx.conf configurado corretamente
- [ ] Arquivos estáticos (HTML, CSS, JS) presentes

### Execução
- [ ] Imagem pode ser buildada com sucesso
- [ ] Container inicia sem erros
- [ ] Acessível em http://localhost

### Funcionalidades
- [ ] Interface carrega corretamente
- [ ] Formulário de cadastro funciona
- [ ] Campo CEP aparece apenas para Imóveis
- [ ] Busca de CEP retorna endereço correto
- [ ] Listagem de patrimônios funciona
- [ ] Botão "Atualizar Lista" funciona
- [ ] Exclusão de patrimônios funciona
- [ ] Validações de formulário funcionam

### Responsividade
- [ ] Layout funciona em desktop
- [ ] Layout funciona em tablet
- [ ] Layout funciona em mobile
- [ ] Tabela tem scroll horizontal em telas pequenas

### Integração
- [ ] Comunicação com backend OK
- [ ] Sem erros de CORS
- [ ] Todos os endpoints funcionando

---

## 🔄 Fluxo Completo de Execução

### Para Avaliadores - Passo a Passo
```bash
# 1. Clone o frontend
git clone <url-frontend> PatriTrack_Front
cd PatriTrack_Front

# 2. Build da imagem
docker build -t patritrack-frontend:latest .

# 3. Clone o backend (em outro terminal ou pasta)
git clone <url-backend> PatriTrack
cd PatriTrack

# 4. Suba tudo via docker-compose do backend
docker-compose up -d

# 5. Verifique
docker ps
# Deve mostrar patritrack-backend e patritrack-frontend

# 6. Acesse
# Frontend: http://localhost
# Backend: http://localhost:5000
# Swagger: http://localhost:5000/openapi

# 7. Teste a aplicação
# - Cadastre um patrimônio
# - Teste busca de CEP (categoria Imóvel)
# - Atualize a lista
# - Delete um item

# 8. Para parar
cd PatriTrack
docker-compose down
```

---

## 📄 Licença

Este projeto foi desenvolvido como parte de avaliação acadêmica.

---

## 🆘 Suporte

### Em caso de dúvidas:

1. **Verifique se o backend está rodando**
```bash
   curl http://localhost:5000/buscarPatrimonios
```

2. **Abra o Console do navegador (F12)**
   - Veja se há erros JavaScript
   - Verifique se as requisições estão sendo feitas

3. **Verifique os logs do container**
```bash
   docker logs patritrack-frontend
```

4. **Teste os endpoints do backend diretamente**
   - Swagger UI: http://localhost:5000/openapi
   - curl: `curl http://localhost:5000/buscarPatrimonios`

---

## 🎓 Arquitetura da Solução
```
┌─────────────────────────────────────────┐
│  Backend (docker-compose.yml)           │
│  ┌──────────────┐   ┌──────────────┐   │
│  │   Backend    │   │   Frontend   │   │
│  │   (Flask)    │◄──┤   (Nginx)    │   │
│  │   :5000      │   │   :80        │   │
│  └──────┬───────┘   └──────────────┘   │
│         │                                │
│         ├─► SQLite                       │
│         └─► ViaCEP API                   │
└─────────────────────────────────────────┘

Repositórios separados:
├── PatriTrack/          (Backend)
└── PatriTrack_Front/    (Frontend)
```

**Características:**
- ✅ Repositórios independentes
- ✅ Frontend gerenciado pelo compose do backend
- ✅ Comunicação via localhost (host network)
- ✅ Um comando sobe ambos: `docker-compose up -d`