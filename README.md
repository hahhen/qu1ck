## QU1CK – PROJETO PRÁTICO

## ARTHUR MARTINS PEREIRA

## 1. INTRODUÇÃO

O projeto trata-se de um chatbot criado através da plataforma Dify.ai que é capaz de
compreender pedidos de pizza feitos pelos usuários e comunicar-se com um servidor
back-end Next.js a fim de inserir os pedidos num banco de dados PostgreSQL e
realizar o controle de estoque. Além do chatbot, há também um wesite que permite
facilmente a consulta de estoque e de pedidos realizados.

Repositório: https://github.com/hahhen/qu1ck

Chatbot: https://udify.app/chat/D7CWMZZtYiXBQjhF

Website: https://qu1ck.vercel.app/pedidos

## 2. ARQUITETURA E STACK DO PROJETO

O chatbot é feito através da plataforma **Dify.ai** , utilizando majoritariamente o modelo
**chat-gpt-4o-mini** para os processos de LLMs.

O website é feito com **Next.js**. Seu back-end, o servidor com que o chatbot e o front-
end se comunicam, é feito utilizando **Route Handlers** para manusear as requisições
HTTP. A comunicação do servidor com o banco de dados é feita através da biblioteca
**@supabase/ssr**.

O banco de dados serverless PostgreSQL é criado através do **Supabase** , seguindo o
modelo de banco de dados abaixo:


```
Figura 1 : Modelo de banco de dados
```
O front-end do website é feito utilizando **Tailwind** e **Shadcn/ui** para a estilização e
componentes, respectivamente. Também são utilizadas as bibliotecas **Jotai** , **React
Virtuoso** e **Day.js** para gerenciamento de estado global, renderização virtualizada de
listas e formatação de datas, respectivamente.

## 3. FUNCIONAMENTO E WORKFLOW DO CHATBOT

## 3.1 FUNCIONAMENTO GERAL

O funcionamento do chatbot se dá de acordo com os diagramas de caso de uso e
contexto abaixo:


_Figura 2 : Diagrama de caso de uso do chatbot_


```
Figura 3 : Diagrama de contexto do chatbot
```
O usuário, ao iniciar a conversa, pode escrever “Começar pedido” e receber as
informações das pizzas disponíveis. Ao enviar um número, ele seleciona a pizza e
recebe a confirmação de sua seleção. Entre selecionar a pizza e confirmar o pedido,
ele pode adicionar acompanhamentos, adicionais ou retirar ingredientes apenas
comunicando-se com o chatbot.

## 3.2. FUNCIONAMENTO POR FLUXO DE TRABALHO

## 3.2.1. COMEÇAR PEDIDO

```
Figura 4 : Fluxo de trabalho 1. (Começar pedido)
```

Ao enviar “começar pedido” ou “Começar pedido”, o chatbot lista as pizzas disponíveis
através de uma resposta predefinida.

## 3.2.2. SELECIONAR PIZZA

```
Figura 5 : Fluxo de trabalho 2.1. (Selecionar pizza)
```
Quando o usuário digita um número ou digita o nome de alguma das pizzas
disponíveis, a LLM recupera através de seu **conhecimento** os ingredientes da pizza
selecionada. Em seguida, ele descreve os ingredientes para o usuário e informa a
possibilidade de adição de acompanhamentos, adicionais ou a exclusão de algum
ingrediente.

```
Figura 6 : Fluxo de trabalho 2.2. (Selecionar pizza)
```
Em seguida, de maneira oculta, LLMs atribuem valores às **variáveis de conversação**
selected_pizza, ingredients_selected_pizza e limpa as variáveis selected_optout,
selected_extra e selected_side.

## 3.2.3. ADICIONAR ACOMPANHAMENTO

```
Figura 7 : Fluxo de trabalho 3. (Adicionar acompanhamento)
```

O **classificador de perguntas** classifica se, ao usuário pedir algum acompanhamento,
foi especificado algum. Se não, é retornada uma mensagem predifinida listando os
acompanhamentos disponíveis.

```
Figura 8 : Fluxo de trabalho 4. (Adicionar acompanhamento)
```
Se sim, uma LLM verifica se o acompanhamento escolhido pelo usuário está
disponível. Se sim, é retornada uma mensagem de sucesso predefinida e uma LLM
armazena o acompanhamento escolhido na variável seleted_side. Caso não esteja
disponível, é retornada uma mensagem predefinida que lista os acompanhamentos
disponíveis.

## 3.2.4. ADICIONAR ADICIONAL

```
Figura 9 : Fluxo de trabalho 5. (Adicionar adicional)
```
O **classificador de perguntas** classifica se, ao usuário pedir algum adicional, foi
especificado algum. Se não, inicia-se o fluxo de trabalho. Primeiramente, é verificado
se a variável selected_pizza não está vazia. Se estiver, é retornada uma mensagem
predefinida. Se não estiver, é feita uma recuperação de conhecimentos das
quantidades adicionais (as quantidades a mais que serão adicionadas de cada


ingrediente) e são retornadas ao cliente. O cliente só pode escolher adicionais de
ingredientes que já existem em sua pizza.

```
Figura 10 : Fluxo de trabalho 6. (Adicionar adicional)
```
Caso um adicional esteja especificado, é verificado se a variável selected_pizza não
está vazia. Se estiver, é retornada uma mensagem predefinida e nada é feito. Se não
estiver, é feita uma verificação por LLM se o adicional requisitado pelo usuário faz
parte de sua pizza. Se não, é retornada uma mensagem de LLM explicando que o
ingrediente adicional precisa fazer parte de sua pizza. Se sim, é retornada uma
mensagem de confirmação predefinida e atribuindo o adicional escolhido à variável
selected_extra.

## 3.2.5. RETIRAR INGREDIENTE

```
Figura 11 : Fluxo de trabalho 7. (Retirar ingrediente)
```
O usuário envia qual ingrediente gostaria de retirar. De maneira similar ao fluxo de
trabalho 6, é verificado se a variável selected_pizza não está vazia. Se estiver, é
retornada uma mensagem predefinid. Se não estiver, é feita uma verificação por LLM
se o ingrediente a ser retirado faz parte de sua pizza. Se não, é retornada uma
mensagem de LLM explicando que o ingrediente precisa fazer parte de sua pizza,
listando os ingredientes da pizza. Se sim, é retornada uma mensagem de confirmação
predefinida e atribuindo o adicional escolhido à variável selected_optout. Se o usuário
não especificar o ingrediente, esse fluxo de trabalho também é acionado.


## 3.2.6. VISUALIZAR PEDIDO

```
Figura 12 : Fluxo de trabalho 8 (Visualizar pedido)
```
Se o usuário digitar “Pedido”, o fluxo de trabalho é acionado. Se selected_pizza estiver
vazio, é retornada uma mensagem predefinida. Caso não esteja, a LLM descreve a
pizza selecionada e, se houver, os adicionais, acompanhamentos e ingredientes
retirados pelo cliente.

## 3.2.7. OUTROS ASSUNTOS

```
Figura 13 : Fluxo de trabalho 9 (Outros assuntos)
```
Caso o usuário envie alguma requisição não relacionada a nenhuma das classes do
**classificador de pergunta** , é retornada uma mensagem predefinida.

## 3.2.8 CONFIRMAR PEDIDO

Este é o mais extenso fluxo de trabalho.

```
Figura 14 : Fluxo de trabalho 10.1. (Confirmar pedido)
```

Primeiramente, é atribuído à variável confirmed_pizza o valor selected_pizza,
recuperado o conhecimento sobre a pizza confirmada e repetido o nome da pizza e
ingredientes pelo LLM 6. Após isso, é feita outra recuperação de conhecimento
baseada na saída do LLM 6. No LLM 4, é produzido um JSON que inclui num array
um objeto contendo o nome do ingrediente e a quantidade utilizada baseado nos
ingredientes padrões da pizza e nos adicionais, acompanhamentos e ingredientes
excluídos, se existirem.

```
Figura 15 : Fluxo de trabalho 10.2. (Confirmar pedido)
```
A saída da LLM 4 é armazenada na variável pre_ingredients. Baseado na variável, a
LLM 7 repete todos os ingredientes inclusos, recuperando as informações dos ids dos
ingredientes. A LLM 5 substitui os nomes dos ingredientes do JSON produzido pela
LLM 4 pelos respectivos IDs. Após isso, esse novo JSON é atribuído a request_body.

```
Figura 16 : Fluxo de trabalho 10.3. (Confirmar pedido)
```
É feita uma requisição para o servidor Next.js na rota de disponibilidade. É retornado
um objeto informando se não há ingredientes necessários. Se verdadeiro, é retornada
uma mensagem predefinida. Se nada for retornado ou houver um erro, outra
mensagem predefinida é retornada. Se falso, é feita outra requisição com o mesmo
JSON para a rota de pedido. Se for bem sucedido, é retornado a confirmação pelo
LLM. Se houver algum erro, é retornada uma mensagem predefinida.

## 4. FUNCIONAMENTO DO WEBSITE


O funcionamento do chatbot se dá de acordo com os diagramas de caso de uso e
contexto abaixo:

```
Figura 17 : Diagrama de caso de uso do website
```
```
Figura 18 : Diagrama de contexto do website
```
O website possui 5 rotas de API: /api/consulta_estoque, /api/consulta_pedidos,
/api/disponibilidade, /api/pedido e /api/notificacoes. Também possi 2 rotas acessáveis
para os usuários: / e /pedidos.

## 4.1 ROTAS DE API


## 4.1.1. CONSULTA_ESTOQUE

Retorna todos os itens do estoque com todas as colunas. Utilizado para listar os
ingredientes disponíveis na página inicial.

## 4.1.2. CONSULTA_PEDIDOS

De forma similar, retorna todos os itens da tabela pedido. Utilizado para listar todos os
pedidos feitos na página /pedidos.

## 4.1.3. DISPONIBILIDADE

Recebe a requisição POST com o array de ingredientes e suas quantidades utilizadas.
Mapeia-o e verifica se todos os ingredientes possuem a quantidade necessária para
o pedido. Retorna notEnoughIngredients, que é falso se houver a quantidade
necessária de todos os itens para o pedido.

## 4.1.4. PEDIDO

Recebe a requisição POST com o array de ingredientes e suas quantidades utilizadas.
Mapeia-o e insere o pedido no banco de dados e atualiza o estoque. Caso algum
ingrediente esteja acabando, insere uma notificação na tabela notificacao.

## 4.1.5. NOTIFICACOES

Retorna todas as linhas da tabela notificacao. Utilizado para exibir as notificações no
front-end.

## 4.2. ROTAS FRONT-END

## 4.2.1. PÁGINA INICIAL

Na página inicial, são listados todos os ingredientes numa tabela, que possui as
colunas relevantes para o gerente da tabela estoque.


## 4.2.2. PEDIDOS

Na página pedido, de maneira similar, são listados todos os pedidos cadastrados no
banco de dados numa tabela.


