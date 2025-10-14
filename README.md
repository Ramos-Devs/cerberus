# Initial Config
---

1. Update packages


## Scripts disponibles

- `pnpm dev`  
Ejecuta el proyecto en modo desarrollo con `tsx watch`.

- `pnpm start`  
Ejecuta el proyecto compilado desde la carpeta `dist`.

- `pnpm prepare`  
Prepara Husky para pre-commits.

- `pnpm test`  
Ejecuta los test con jest.

---

## Linter y Formateo

### Verificar estilo y errores

`pnpm exec eslint src --ext .ts`
`pnpm exec prettier --check "src/**/*.{ts,tsx,js,json}"`

### Corregir automáticamente

`pnpm exec prettier --write "src/**/*.{ts,tsx,js,json}"`
`pnpm exec eslint src --ext .ts --fix`
