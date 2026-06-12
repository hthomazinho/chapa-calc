# Backend - Chapa Calc

## Instalação

```bash
npm install
```

## Variáveis de Ambiente

Crie um arquivo `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/chapa_calc
PORT=3000
NODE_ENV=development
JWT_SECRET=seu_secret_aqui
UPLOAD_DIR=./uploads
```

## Executar

```bash
npm run dev
```

## Estrutura

- `src/index.ts` - Entry point
- `src/database/` - Conexão e schema
- `src/routes/` - Rotas da API
- `src/utils/` - Funções auxiliares
