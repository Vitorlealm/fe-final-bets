# fe-final-bets

## Instalar dependencias

Entre na pasta do projeto e instale as dependências:

```
cd fe-final-bets
npm install
```

## Rodar a aplicação

```
npm run dev
```

Esse comando sobe as duas partes ao mesmo tempo:

- O site (front-end) em http://localhost:5173
- A API (json-server) em http://localhost:3001

Deixe esse comando rodando e abra http://localhost:5173 no navegador.

Os dados (clientes, administradores e eventos) ficam salvos no arquivo `db.json`. Tudo que for cadastrado é gravado lá.

## Modo cliente

O cliente é quem faz apostas.

1. Abra http://localhost:5173/.
2. Clique em **Cadastrar** e crie uma conta (nome, e-mail, data de nascimento, CPF e senha). Depois clique em **Login** e entre com o e-mail e a senha.
3. Você cai no painel do cliente. Nele você tem um cabeçalho com o seu **saldo** e três botões:
   - **Adicionar saldo**: coloca dinheiro na conta (precisa de saldo para apostar).
   - **Eventos abertos**: mostra os jogos em que dá para apostar agora.
   - **Minhas Apostas**: mostra as apostas que você já fez.
4. Para apostar, vá em **Eventos abertos**, escolha em qual time você acha que vai ganhar. A **odd aparece** na tela, então você digita o valor que quer apostar e confirma. O valor é descontado do seu saldo.
5. Em **Minhas Apostas** você acompanha o resultado de cada aposta: "aguardando resultado", "ganhou" (quando você recebe o prêmio) ou "perdeu".

## Modo administrador

O administrador é quem cria e gerencia os eventos (os jogos).

As páginas do administrador são **ocultas**: não existe botão para elas na página inicial, então você precisa **digitar o endereço na barra do navegador**.

1. Rota inicial do administrador: abra http://localhost:5173/admin/cadastro para criar uma conta de administrador.
2. Depois abra http://localhost:5173/admin/login para entrar.
3. Após o login você vai para a página do administrador. Clique em **Gerenciar eventos** para abrir o painel de eventos.
4. No painel você pode:
   - **Criar um evento**: escolher os dois times, a data e hora da partida e a data e hora de abertura das apostas.
   - **Editar** ou **Excluir** um evento.
   - **Fechar para apostas**: trava o evento para que os clientes não possam mais apostar nele.
   - **Gerar resultado**: sorteia o vencedor do jogo e paga automaticamente os clientes que acertaram. Esse botão só fica habilitado depois que o evento foi fechado para apostas.

## Dica rápida

- O cliente só consegue apostar se tiver saldo (use o botão **Adicionar saldo**).
- Um evento só aparece em **Eventos abertos** quando a data de abertura das apostas já passou e ele ainda não foi fechado nem teve o resultado gerado. Para testar rápido, ao criar o evento como administrador, coloque a abertura das apostas para um horário que já passou e a partida para um horário um pouco à frente.
