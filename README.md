# Lettera

Aplicativo mobile de e-commerce de livros, feito em React Native com Expo. O diferencial é o **kit surpresa por gênero**: a pessoa escolhe um gênero (por exemplo, Kit Terror com 2 livros), compra sem saber quais títulos vêm na caixa e descobre os livros sorteados só depois da compra, em uma tela de revelação.

Este repositório contém o **front-end**. O back-end (microsserviços em Java) fica em um repositório separado e é consumido por meio de um API Gateway.

## Funcionalidades

**Comprador**
- Busca por título ou autor e filtro por categoria
- Detalhe do livro e do kit surpresa
- Carrinho (vive no app; o back-end recebe os itens só no checkout)
- Resumo do pedido, confirmação e **revelação dos livros sorteados**
- Histórico de compras e detalhe de cada pedido

**Vendedor**
- Meus produtos: lista com busca, cadastro, edição e exclusão com confirmação
- Formulário de livro ou kit, com validação por campo
- Upload de imagem do produto (galeria do aparelho, com prévia)
- Vendas: total vendido e histórico por item

**Acesso**
- Login e cadastro (o cadastro cria compradores; o vendedor já vem cadastrado no back-end)
- Sessão guardada de forma segura (JWT no `expo-secure-store`) e saída automática quando o token expira

## Tecnologias

| Área | Tecnologia |
|---|---|
| Framework | React Native 0.88 e Expo SDK 58 (JavaScript, sem TypeScript) |
| Navegação | React Navigation 7 (abas e pilhas) |
| HTTP | Axios, com interceptors para o token e para o formato de erro |
| Armazenamento seguro | expo-secure-store |
| Imagens | expo-image-picker |
| Fontes e ícones | Playfair Display e Inter (Google Fonts), @expo/vector-icons |

## Como rodar

**Pré-requisitos:** Node.js, npm e o app **Expo Go** no celular (celular e computador na mesma rede Wi-Fi).

```bash
git clone https://github.com/rafadavesac/lettera-frontend.git
cd lettera-frontend
npm install
```

1. Abra `src/config/api.js` e coloque em `API_HOST` o IP do computador que roda o back-end (no Windows, o "Endereço IPv4" do Wi-Fi em `ipconfig`).
2. Inicie o projeto:

```bash
npx expo start -c
```

3. Leia o QR code com o Expo Go.

### Fonte de dados: mock ou API real

A flag `USE_MOCK_API`, em `src/config/api.js`, escolhe de onde vêm os dados do catálogo, dos pedidos e do vendedor:

| Valor | Comportamento |
|---|---|
| `true` | Dados de exemplo em memória, sem depender dos serviços de produtos e pedidos. Um produto criado, editado ou excluído pelo vendedor aparece também na visão do comprador. Os dados voltam ao início ao recarregar o app. |
| `false` | API real, via gateway. |

O **login e o cadastro sempre usam o back-end real** (auth-api), em qualquer valor da flag.

## Arquitetura

O código é organizado em camadas, e cada tela conversa só com hooks. Para cada recurso, o serviço depende de uma "fonte" (mock ou API) atrás da mesma interface, e é um único arquivo (`index.js` da pasta) que escolhe qual fonte usar.

```
tela  ->  hook  ->  service  ->  fonte (mock ou API)  ->  mapper
```

```
src/
├── components/   componentes pequenos e reutilizáveis (cards, linhas, campos, diálogos)
├── config/       endereço do back-end e a flag USE_MOCK_API
├── context/      estado global (autenticação, carrinho)
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
├── theme/        cores, fontes e espaçamentos
└── utils/        formatação, validações, URL de imagem, seletor de imagem
```

**Princípios aplicados**
- **SOLID:** responsabilidade única por arquivo; serviços dependem de uma interface de fonte (injeção de dependência), então trocar mock por API não muda telas nem hooks.
- **Mappers:** os nomes de campo do contrato da API ficam concentrados em arquivos de mapper, e as telas usam um formato próprio.
- **Estados de tela:** toda tela com dados trata carregamento, erro (com "tentar novamente") e vazio.
- **Big O:** operações não triviais (filtro e busca em listas, ordenação, total do carrinho) têm a complexidade comentada no código.

## Contrato com o back-end

Todas as rotas passam pelo gateway (porta 8080). As rotas com `/ws/` são protegidas e exclusivas do vendedor.

| Método | Rota | Perfil |
|---|---|---|
| POST | `/auth/signin`, `/auth/signup` | Público |
| GET | `/products?category=&type=&search=` | Todos |
| GET | `/products/{id}` | Todos |
| POST, PUT, DELETE | `/ws/products` e `/ws/products/{id}` | Vendedor |
| POST | `/ws/products/{id}/image` (multipart, devolve o produto atualizado) | Vendedor |
| POST | `/orders` | Comprador |
| GET | `/orders/me` e `/orders/{id}` | Comprador |
| GET | `/ws/orders/sales` | Vendedor |

Convenções: datas em ISO-8601, valores em BRL como número e erros no formato do auth-api (400, 401, 403, 404 e 409).

**Pontos a confirmar na integração:** o nome do campo multipart do upload, os tipos e o tamanho máximo aceitos (hoje assumidos como `file`, JPG/PNG/WebP e 5 MB, isolados em `src/services/seller/uploadConfig.js`) e o corpo exato de `POST` e `PUT /ws/products` (isolado em `src/services/seller/sellerProductMapper.js`).

## Padrão de commits

Commits semânticos no formato `tipo: descrição curta`, com os tipos `feat`, `fix`, `docs`, `chore`, `refactor` e `test`.

## Estado do projeto

- Telas do comprador e do vendedor concluídas e testadas com dados de exemplo (`USE_MOCK_API = true`).
- Pendente: integração com o back-end real (upload de imagem, CRUD do vendedor e permissões das rotas `/ws/**`).
- Fora do escopo: assinaturas e personalização por preferências.
