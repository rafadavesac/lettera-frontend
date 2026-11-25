# Lettera

Aplicativo mobile de e-commerce de livros, feito em React Native com Expo. O diferencial é o **kit surpresa por gênero**: a pessoa escolhe um gênero (por exemplo, Kit Terror), compra sem saber quais títulos vêm na caixa e descobre os livros sorteados só depois da compra, em uma tela de revelação.

Este repositório contém o **front-end**. O back-end (microsserviços em Java com Spring Boot) fica em outro repositório, [EmillyLautert/microservices-java](https://github.com/EmillyLautert/microservices-java), e é consumido por meio de um API Gateway.

## Funcionalidades

**Comprador**
- Busca por título ou autor e filtro por categoria
- Detalhe do livro e do kit surpresa
- Carrinho (vive no app; o back-end recebe os itens só no checkout)
- Resumo do pedido, confirmação e **revelação dos livros sorteados**
- Histórico de compras e detalhe de cada pedido

**Vendedor**
- Meus produtos: lista com busca, cadastro, edição e exclusão com confirmação
- Formulário de livro ou kit, com validação por campo (no kit, o título é gerado pelo back-end a partir da categoria)
- Upload de imagem do produto (galeria do aparelho, com prévia)
- Vendas: total vendido e histórico por item, com seletor de mês

**Acesso**
- Login e cadastro (o cadastro cria compradores; o vendedor já vem cadastrado no back-end)
- Sessão guardada de forma segura (JWT no `expo-secure-store`) e saída automática quando o token expira (o token vale 24 horas)

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | React Native 0.88 e Expo SDK 58 (JavaScript, sem TypeScript) |
| Navegação | React Navigation 7 (abas e pilhas) |
| HTTP | Axios, com interceptors para o token e para o formato de erro |
| Armazenamento seguro | expo-secure-store |
| Imagens | expo-image-picker |
| Fontes e ícones | Playfair Display e Inter (Google Fonts), @expo/vector-icons |
| Qualidade | Jest (jest-expo) e ESLint (eslint-config-expo) |

## Como rodar

**Pré-requisitos:** Node.js, npm, o app **Expo Go** no celular (celular e computador na mesma rede Wi-Fi) e o **back-end rodando** (veja o passo 1).

### 1. Subir o back-end

O back-end roda inteiro em Docker Compose (Docker Desktop instalado). Resumo, a partir da raiz do repositório [microservices-java](https://github.com/EmillyLautert/microservices-java):

```bash
cp .env.example docker/.env        # preencha todos os valores
docker compose -f docker/docker-compose.yml up --build -d
curl http://localhost:8080/actuator/health   # {"status":"UP"} quando estiver pronto
```

A primeira subida leva vários minutos. O passo a passo completo, as regras do `.env` e a solução de problemas estão no README do back-end. O Gateway fica na porta **8080**.

Contas iniciais (a senha de cada uma vem do `docker/.env` do back-end):

| Perfil | E-mail | Senha |
|---|---|---|
| Vendedor | `admin@admin.dev` (ou o valor de `LETTERA_ADMIN_EMAIL`) | `LETTERA_ADMIN_PASSWORD` |
| Comprador de demonstração | `comprador@teste.com` | `LETTERA_DEMO_BUYER_PASSWORD` |

### 2. Subir o app

```bash
git clone https://github.com/rafadavesac/lettera-frontend.git
cd lettera-frontend
npm install
npx expo start -c
```

Leia o QR code com o Expo Go.

**Endereço do back-end:** o app descobre sozinho o IP do computador a partir do servidor Expo (modo LAN), então não há IP para editar. Se o Docker rodar em outro computador ou se você usar o modo túnel do Expo, crie um arquivo `.env.local` com `EXPO_PUBLIC_API_HOST=<IP do computador>`. Se o app mostrar "Não foi possível conectar ao servidor", confira se o celular está na mesma rede, se o back-end está `healthy` e se o firewall do computador libera a porta 8080.

### Fonte de dados: API real ou mock

A flag `USE_MOCK_API`, em `src/config/api.js`, escolhe de onde vêm os dados do catálogo, dos pedidos e do vendedor:

| Valor | Comportamento |
|---|---|
| `false` (padrão atual) | API real, via gateway. Exige o back-end rodando. |
| `true` | Dados de exemplo em memória, sem depender dos serviços de produtos e pedidos. Um produto criado, editado ou excluído pelo vendedor aparece também na visão do comprador. Os dados voltam ao início ao recarregar o app. Útil para demonstrar o app sem o back-end completo. |

O **login e o cadastro sempre usam o back-end real** (auth-api), em qualquer valor da flag.

## Testes e qualidade

```bash
npm test        # Jest: regras do carrinho (cartReducer e totais), 8 testes
npm run lint    # ESLint com a configuração oficial do Expo
```

## Arquitetura

O código é organizado em camadas, e cada tela conversa só com hooks. Para cada recurso, o serviço depende de uma "fonte" (mock ou API) atrás da mesma interface, e é um único arquivo (`index.js` da pasta) que escolhe qual fonte usar.

```
tela  ->  hook  ->  service  ->  fonte (mock ou API)  ->  mapper
```

```
src/
├── components/   componentes pequenos e reutilizáveis (cards, linhas, campos, diálogos)
├── config/       endereço do back-end e a flag USE_MOCK_API
├── context/      estado global (autenticação, carrinho) e regras puras do carrinho
├── hooks/        useAsyncData (leituras), useAsyncAction (escritas) e hooks por recurso
├── navigation/   abas do comprador e do vendedor, pilhas e nomes de rotas (routes.js)
├── screens/
│   ├── auth/     login e cadastro
│   ├── buyer/    telas do comprador
│   └── seller/   telas do vendedor
├── services/
│   ├── api.js          cliente HTTP (token e erros padronizados)
│   ├── authService.js  login e cadastro
│   ├── products/       catálogo (leitura), categorias, store mock compartilhado
│   ├── orders/         pedidos do comprador
│   └── seller/         escrita no catálogo, upload de imagem e vendas
├── theme/        cores, fontes, espaçamentos e sombras
└── utils/        formatação, validações, regras do formulário de produto, períodos,
                  sorteios, URL de imagem, seletor de imagem
```

**Navegação:** sem sessão, Login e Cadastro. O comprador vê as abas Início, Kits, Carrinho, Pedidos e Perfil, e o vendedor vê Meus produtos, Vendas e Perfil. Cada aba do fluxo de compra tem sua própria pilha de telas.

**Princípios aplicados**
- **SOLID:** responsabilidade única por arquivo; serviços dependem de uma interface de fonte (injeção de dependência), então trocar mock por API não muda telas nem hooks.
- **Mappers:** os nomes de campo do contrato da API ficam concentrados em arquivos de mapper, e as telas usam um formato próprio.
- **Estados de tela:** toda tela com dados trata carregamento, erro (com "tentar novamente") e vazio.
- **Tratamento de erros:** o cliente HTTP converte qualquer falha em `{ status, message, isNetworkError }`, com tempo limite de 10 s (30 s no envio de imagem), e um 401 em requisição autenticada encerra a sessão.
- **Big O:** operações não triviais (filtro e busca em listas, ordenação, total do carrinho) têm a complexidade comentada no código.

## Contrato com o back-end

Todas as rotas passam pelo gateway (porta 8080). As rotas com `/ws/` são protegidas e exclusivas do vendedor, e as de `/orders` são exclusivas do comprador.

| Método | Rota | Perfil |
|---|---|---|
| POST | `/auth/signin`, `/auth/signup` | Público |
| GET | `/products?category=&type=&search=&page=&size=` | Público |
| GET | `/products/{id}` | Público |
| GET | `/categories` | Público |
| GET | `/images/{arquivo}` (capas; o produto traz o caminho no campo `image`) | Público |
| POST, PUT, DELETE | `/ws/products` e `/ws/products/{id}` | Vendedor |
| POST | `/ws/products/{id}/image` (multipart, campo `file`, devolve o produto atualizado) | Vendedor |
| POST | `/orders` | Comprador |
| GET | `/orders/me` (lista simples) e `/orders/{id}` (detalhe, só do dono) | Comprador |
| GET | `/ws/orders/sales?period=AAAA-MM` | Vendedor |

**Convenções:** datas em ISO-8601, valores em BRL como número, listagem do catálogo paginada (o app pede uma página de até 50 itens) e erros em **texto simples**, exibidos direto na tela. Códigos usados: `400` dados inválidos, `401` credenciais incorretas ou token inválido, `403` perfil sem permissão, `404` não encontrado, `409` conflito (e-mail já cadastrado ou livros insuficientes para o kit) e `503` catálogo indisponível durante a compra.

**Regras do back-end e como o app as trata**

| Assunto | Back-end | App |
|---|---|---|
| Senha | 8 a 72 caracteres | Valida o mínimo de 8 |
| Quantidade por item | 1 a 50 | Limita a 20 por item |
| Kit | `bookCount` de 1 a 5; o título é gerado como `Kit <categoria>` | Sempre envia 3 livros e deixa o back gerar o título |
| Imagem de capa | JPG, PNG ou WebP, até 5 MB | Aceita JPG e PNG, até 5 MB, e confere antes de enviar |
| Pedido | Aceita só `productId` e `quantity`, calcula os totais e devolve os livros sorteados em `drawnBooks` | Mostra uma "caixa" por unidade de kit na revelação |
| Vendas | Aceita também `type` (`ALL`, `BOOK` ou `KIT`) | Usa só o filtro `period` |

Dados iniciais do back-end: 15 livros e 5 kits, nos gêneros Terror, Fantasia, Romance, Ficção científica e Suspense. Para comprar kits, a categoria precisa ter livros suficientes (kit de 3 livros × 2 unidades exige 6 livros distintos na categoria; senão a compra retorna `409`).

## Padrão de commits

Commits semânticos no formato `tipo: descrição curta`, com os tipos `feat`, `fix`, `docs`, `chore`, `refactor` e `test`.

## Estado do projeto

- Telas do comprador e do vendedor concluídas, com `USE_MOCK_API = false` e o contrato ajustado ao back-end (pedidos com `drawnBooks`, vendas em `sales[].items[]`, categorias em `GET /categories`, imagens por caminho relativo).
- Funcionam sem o back-end de produtos e pedidos no modo mock (`USE_MOCK_API = true`).
- Fora do escopo: pagamento, endereço de entrega, assinaturas e personalização por preferências de leitura.
