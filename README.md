# Portfólio

Portfólio pessoal em forma de mapa de RPG. Cada lugar do mapa é um projeto; o
viajante anda pelas estradas até ele e o painel do projeto abre. Há também um
modo lista com o mesmo conteúdo.

## Rodar

```bash
nvm use
yarn
yarn dev
```

## Antes de publicar

```bash
yarn lint && yarn test && yarn build && yarn leak-check
```

`yarn leak-check` procura termos proibidos em `src/`, `public/`, `dist/` e nos
scripts. A lista de termos fica fora do repositório
(`~/.config/portfolio-denylist.txt`, ou `DENYLIST=caminho`), porque a própria
lista nomearia o que não pode vazar.

## Conteúdo

- `src/content/projects.ts`: todos os projetos, em português e inglês.
- `src/content/character.ts`: dados pessoais. Campo vazio não aparece na página.
- `public/media/`: só mídia revisada. `scripts/prepare-media.py` copia dos
  repositórios dos projetos, regrava (sem metadados) e recorta o que precisa.

## Mapa

O mundo é desenhado por código (`src/map/terrain.ts`) em 320×180 pixels e
ampliado sem suavização. Os lugares e as estradas ficam em `src/map/graph.ts`.
