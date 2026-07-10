# Keka Services

Internal tools platform built with React + Vite.

## Services

- **Invoice Generator** — create and download professional invoices as PDF
- **QR Code Generator** — generate QR codes and download as PNG, JPEG, or PDF

## Stack

- React + Vite
- react-router-dom
- html2pdf.js, qrcode

## Run

```bash
npm install
npm run dev
```

## Adding services

1. Add the service in `src/data/navigation.js`
2. Create a page in `src/pages/`
3. Register the route in `src/App.jsx`
4. Add translations in `src/i18n/translations/`

## Adding invoice clients

Edit `src/data/clients.js` and add entries to the `clients` array.
