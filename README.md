# 🏆 BetArena — Plataforma Acadêmica de Apostas Esportivas

> Projeto Final — Disciplina de Frontend  
> Finalidade exclusivamente acadêmica. Todos os valores, saldos, apostas, prêmios e bônus são fictícios.

---

## 👥 Integrantes

- Lucas Cassiano e Vitor Leal

---

## 📋 Descrição Geral

O **BetArena** é uma aplicação web de apostas esportivas fictícias desenvolvida em React. A plataforma simula o funcionamento de uma casa de apostas, com dois perfis de usuário:

- **Administrador** — cadastra partidas, controla a abertura e o encerramento das apostas e informa o resultado dos eventos.
- **Cliente/Jogador** — visualiza os eventos disponíveis, realiza apostas fictícias, acompanha seu saldo e consulta seu histórico de apostas.

---

## ⭐ Funcionalidades Extras

### Minha funcionalidade — Página de Regulamento
Tela dedicada com as regras de uso da plataforma, explicando como funcionam as apostas, as odds, os resultados e os bônus fictícios. Possui rota própria (`/regulamento`), está acessível a todos os usuários logados e é vinculada diretamente nos dashboards do cliente e do administrador.

### Funcionalidade da dupla — Painel Estatístico do Administrador
Painel exclusivo para administradores com estatísticas gerais da plataforma: total de eventos cadastrados, apostas realizadas, clientes ativos e volume total apostado. Consome dados diretamente da API (JSON Server).

---

## 📐 Regras de Negócio

- Somente usuários cadastrados podem acessar as áreas internas da plataforma.
- O acesso é controlado por perfil: clientes não acessam rotas de administrador e vice-versa.
- Um cliente precisa ter saldo para realizar apostas.
- A odd de cada aposta é gerada aleatoriamente no momento da escolha (entre 1,50 e 5,00).
- Um evento só aparece como "aberto" se a data de abertura das apostas já passou e a partida ainda não começou.
- O administrador deve fechar o evento antes de gerar o resultado.
- O resultado é sorteado aleatoriamente entre os dois times.
- Clientes que acertaram o vencedor recebem automaticamente o prêmio (`valor apostado × odd`).
- O ranking classifica os jogadores pelo total de prêmios acumulados em apostas resolvidas.
- Os bônus do pódio (🥇 R$500 / 🥈 R$250 / 🥉 R$100) são exclusivamente fictícios e informativos.
- Email e CPF devem ser únicos por perfil (cliente ou administrador).

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 19 | Interface e componentes |
| React Router DOM 7 | Navegação e rotas protegidas |
| React Hooks | `useState`, `useEffect`, `useContext`, `useNavigate`, `useLocation` |
| Context API | Gerenciamento global de autenticação (`AuthContext`) |
| JSON Server 0.17 | API REST simulada |
| Vite 8 | Bundler e servidor de desenvolvimento |
| CSS customizado | Estilização com variáveis CSS, dark mode e responsividade |
| fetch API | Consumo da API simulada |
| concurrently | Execução paralela de Vite + JSON Server |
| GitHub | Versionamento de código |

---

## ▶️ Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm 9+

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd fe-final-bets-main

# Instale as dependências
npm install
```

### Executar a aplicação

```bash
npm run dev
```

Esse comando sobe **as duas partes ao mesmo tempo**:

| Serviço | URL |
|---|---|
| Aplicação React (front-end) | http://localhost:5173 |
| API simulada (JSON Server) | http://localhost:3001 |

Deixe o comando rodando e acesse **http://localhost:5173** no navegador.

> Os dados ficam salvos no arquivo `db.json`. Tudo que for cadastrado é persistido lá.

### Executar apenas o JSON Server

```bash
npm run server
```

---

## 🔐 Usuários de Teste

Como o `db.json` começa vazio, crie os usuários pelo próprio sistema:

| Perfil | Como criar | Rota de acesso |
|---|---|---|
| Cliente | Botão "Cadastrar" na tela inicial | http://localhost:5173/ |
| Administrador | Acessar diretamente a rota de cadastro | http://localhost:5173/admin/cadastro |

> Após criar os usuários, use http://localhost:5173/ para login de cliente e http://localhost:5173/admin/login para login de administrador.

---

## 🗺️ Principais Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Tela inicial — escolha entre Jogador e Administrador |
| `/auth` | Público | Login e cadastro de clientes |
| `/admin/login` | Público | Login e cadastro de administrador (tela unificada) |
| `/cliente/dashboard` | 🔒 Cliente | Dashboard do jogador |
| `/profile` | 🔒 Cliente | Perfil do cliente |
| `/admin/dashboard` | 🔒 Admin | Dashboard e gerenciamento de eventos |
| `/admin/profile` | 🔒 Admin | Perfil do administrador |
| `/ranking` | 🔒 Logado | Ranking e premiação fictícia |
| `/regulamento` | 🔒 Logado | Regulamento da plataforma |

> 🔒 Rotas protegidas: redireciona para `/` se não estiver logado, ou para o dashboard correto se o perfil não bater.

---

## 🃏 Como Usar — Passo a Passo

### Fluxo do Cliente

1. Acesse http://localhost:5173/ e clique em **Entrar** ou **Criar conta** no card **Sou Jogador**.
2. Preencha nome, data de nascimento, CPF, e-mail e senha. Faça login.
3. No dashboard, clique em **Adicionar saldo** para colocar créditos fictícios.
4. Em **Eventos abertos**, escolha um jogo e clique no time em que deseja apostar.
5. A odd é exibida — informe o valor da aposta e confirme.
6. Acompanhe suas apostas em **Minhas Apostas**.
7. Veja a classificação geral em **🏆 Ranking**.
8. Consulte as regras em **📋 Regulamento**.

### Fluxo do Administrador

1. Acesse http://localhost:5173/ e clique em **Entrar** ou **Criar conta** no card **Sou Administrador**.
2. Faça login ou cadastre-se na tela de administrador.
3. No dashboard, crie um evento: selecione os dois times, a data/hora da partida e a abertura das apostas.
   - **Dica:** para testar rápido, coloque a abertura das apostas no passado e a partida um pouco à frente.
4. Quando quiser encerrar: clique em **Fechar para apostas**.
5. Clique em **Gerar resultado** para sortear o vencedor e pagar os ganhadores automaticamente.

---

## 📁 Estrutura do Projeto

```
src/
├── assets/              # Imagens e ícones
├── components/
│   ├── ApostaItem.jsx         # Item do histórico de apostas (reutilizável)
│   ├── EventoCardAdmin.jsx    # Card de evento para o admin (reutilizável)
│   ├── EventoCardCliente.jsx  # Card de evento com fluxo de aposta (reutilizável)
│   ├── Navbar.jsx             # Barra de navegação (reutilizável)
│   └── ProtectedRoute.jsx     # Controle de acesso por perfil
├── context/
│   └── AuthContext.jsx        # Context API — autenticação global
├── data/
│   └── clubes.json            # 12 times brasileiros (estático)
├── pages/
│   ├── Home.jsx               # Tela inicial
│   ├── Auth.jsx               # Login/cadastro do cliente
│   ├── ClienteDashboard.jsx   # Dashboard do jogador
│   ├── ProfileCliente.jsx     # Perfil do cliente
│   ├── AdminCadastro.jsx      # Cadastro de administrador
│   ├── AdminLogin.jsx         # Login de administrador
│   ├── AdminDashboard.jsx     # Dashboard e CRUD de eventos
│   ├── ProfileAdmin.jsx       # Perfil do administrador
│   ├── Ranking.jsx            # Ranking e premiação fictícia
│   └── Regulamento.jsx        # Regulamento da plataforma (funcionalidade extra)
├── App.jsx              # Configuração de rotas
├── App.css              # Estilos globais com responsividade
├── main.jsx             # Ponto de entrada (com AuthProvider)
└── index.css            # Variáveis CSS e reset
db.json                  # Banco de dados simulado (JSON Server)
```

---

## 📊 Divisão de Tarefas

| Tarefa | Responsável |
|---|---|
| Estrutura base do projeto (Vite + React Router) | Cassiano |
| Autenticação (login/cadastro cliente e admin) | Cassiano |
| Dashboard e CRUD de eventos (Admin) | Cassiano |
| Dashboard do cliente e fluxo de apostas | Cassiano |
| Context API e controle de acesso por perfil | Cassiano |
| Componentes reutilizáveis (Navbar, EventoCard, ApostaItem) | Cassiano |
| Ranking e premiação fictícia | Cassiano |
| Página de regulamento (funcionalidade extra) | Cassiano |
| Painel estatístico do administrador (funcionalidade extra) | Dupla |
| README e documentação | Cassiano / Dupla |

---

## 🖼️ Principais Telas

### Tela Inicial (`/`)
Dois cards distintos — **Jogador** (⚽) e **Administrador** (🛡️) — cada um com botões de entrar e criar conta. Deixa claro qual perfil o usuário está acessando sem depender de URLs ocultas.

### Dashboard do Cliente (`/cliente/dashboard`)
Exibe saldo atual, eventos abertos para apostar, histórico de apostas com resultados e links para ranking e regulamento.

### Dashboard do Administrador (`/admin/dashboard`)
Formulário de criação/edição de eventos, listagem de todos os eventos do admin com controles para fechar apostas e gerar resultado.

### Ranking (`/ranking`)
Pódio com os 3 melhores jogadores (🥇🥈🥉), títulos e bônus fictícios. Tabela completa com total ganho, apostas realizadas, acertos e taxa de acerto. O usuário logado é destacado na listagem.

### Regulamento (`/regulamento`)
Página com 6 seções de regras cobrindo cadastro, saldo fictício, apostas, encerramento de eventos, ranking/premiação e responsabilidade acadêmica.

---

## 🔧 Dificuldades Encontradas

- Gerenciamento de estado entre páginas sem Context API (resolvido com a implementação do `AuthContext`).
- Controle da janela de tempo dos eventos (filtrar eventos abertos considerando `inicioApostas` e `dataHoraPartida`).
- Sincronização do saldo do cliente após apostas e resultados.
- Extração de componentes reutilizáveis mantendo o fluxo de dados correto entre pai e filho.

---

## 🚀 Melhorias Futuras

- Persistência de sessão via `localStorage` (hoje recarregar a página desloga o usuário).
- Hash de senha antes de salvar no `db.json`.
- Odds fixas por evento (iguais para todos os apostadores).
- Modal para adicionar saldo (substituir o `prompt()` nativo).
- Filtro e busca nos eventos.
- Notificações ao receber resultado de aposta.
- Verificação de idade mínima no cadastro.
