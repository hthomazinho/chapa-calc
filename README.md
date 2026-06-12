# Chapa Calc - App de Cálculo de Chapas com Descontos

Sistema web para cálculo automático de descontos em chapas metálicas com dobras, geração de PDFs técnicos e gestão de formatos.

## 🎯 Funcionalidades

- **Cadastro de Chapas**: Tipos (Preta/Galvanizada) com espessuras variáveis
- **Cadastro de Formatos**: Criar e salvar formatos (calha, caixa, cone, etc) com fotos
- **Busca Inteligente**: Localizar formatos por tipo
- **Cálculo Automático**: Descontos por dobra = espessura × quantidade de dobras
- **Geração de PDF**:
  - Sem dobra: Medidas simples de corte
  - Com dobra: Desenho técnico + descontos + graus + linhas de dobra
- **Painel Admin**: Gestão completa de chapas e formatos

## 📋 Stack

- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **PDF**: PDFKit

## 🚀 Começando

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 📄 Licença

MIT
