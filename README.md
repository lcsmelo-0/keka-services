# Keka Services

App React com ferramentas internas. Os dados ficam no `localStorage` do navegador — sem backend, banco ou login.

## Estrutura

```text
keka-services/
  frontend/   # app React + Vite
```

## Serviços

- **Invoice Generator** — invoices em PDF
- **QR Code Generator** — QR codes em PNG/JPEG/PDF, com histórico no navegador
- **String Decoder** — decode/encode de URL, Base64, Unicode e HTML
- **Todo Board** — board com drag and drop e lista
- **Links Board** — links soltos e grupos em accordion

## Setup local

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Persistência

Tarefas, links e histórico de QR codes são salvos no `localStorage` deste navegador. Limpar os dados do site apaga esses registros.

## Deploy (Vercel)

1. Importe o repositório.
2. O [`vercel.json`](vercel.json) builda o frontend e serve o SPA.

## Adicionar serviços

1. Adicione o serviço em `frontend/src/data/navigation.js`
2. Crie a página em `frontend/src/pages/`
3. Registre a rota em `frontend/src/App.jsx`
4. Adicione traduções em `frontend/src/i18n/translations/`
