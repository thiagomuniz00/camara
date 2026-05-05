# Câmara dos Deputados – Projetos & Votações

Aplicativo Vuetify para consulta de projetos de lei e votações da Câmara dos Deputados Federal brasileira. Os dados são consumidos diretamente da [API de Dados Abertos](https://dadosabertos.camara.leg.br) da Câmara.

![Screenshot da aplicação](https://github.com/user-attachments/assets/748da616-3ab4-4fa8-8787-517c4a1c3664)

## Funcionalidades

- 🔍 **Pesquisa de Proposições** — filtre por tipo (PL, PEC, MPV…), ano e palavras-chave
- 📋 **Detalhe da Proposição** — ementa completa, situação atual, regime, link para inteiro teor
- 🗳️ **Votações** — lista todas as votações de uma proposição com resultado (Aprovada / Rejeitada)
- 👥 **Votos dos Deputados** — placar detalhado (Sim / Não / Abstenção) com foto, partido e UF

## Tecnologias

| Tecnologia | Versão |
|---|---|
| Vue 3 | ^3.5 |
| Vuetify 4 | ^4.0 |
| Vue Router 5 | ^5.0 |
| Axios | ^1.16 |
| Vite | ^8.0 |

## Como executar

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Estrutura do projeto

```
src/
├── main.js              # Bootstrap do app (Vue + Vuetify + Router)
├── App.vue              # Layout principal (AppBar, Drawer, Footer)
├── router/
│   └── index.js         # Rotas da aplicação
├── services/
│   └── camara.js        # Integração com a API da Câmara
└── views/
    ├── ProposicoesList.vue   # Lista/pesquisa de proposições
    ├── ProposicaoDetail.vue  # Detalhe de uma proposição + votações
    └── VotacaoDetail.vue     # Placar e votos de uma votação
```

## API utilizada

[https://dadosabertos.camara.leg.br/api/v2](https://dadosabertos.camara.leg.br/api/v2)

Endpoints consumidos:
- `GET /proposicoes` — listagem paginada com filtros
- `GET /proposicoes/{id}` — detalhe de uma proposição
- `GET /proposicoes/{id}/votacoes` — votações de uma proposição
- `GET /votacoes/{id}` — detalhe de uma votação
- `GET /votacoes/{id}/votos` — votos individuais dos deputados
- `GET /referencias/proposicoes/siglaTipo` — tipos de proposição disponíveis
