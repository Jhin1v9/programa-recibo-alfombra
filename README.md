# Recibos Alfombra Studio

Aplicacion moderna con `Next.js 16`, `React 19`, `TypeScript` y `Tailwind CSS 4` para:

- importar contactos en `VCF`, `CSV` y `TSV`;
- guardar empresa, clientes y recibos en `localStorage`;
- reutilizar plantillas por cliente;
- repetir el ultimo servicio sin rellenarlo todo otra vez;
- generar recibos listos para imprimir en `A4` o guardar como PDF;
- trabajar por secciones separadas: `Inicio`, `Empresa`, `Clientes`, `Recibos` y `Configuracion`.

## Funciones

- importacion de contactos en `VCF`, `CSV` y `TSV`;
- alta manual y busqueda de clientes;
- plantillas por cliente para servicios recurrentes;
- historial de recibos con duplicacion rapida;
- vista previa lista para impresion en `A4`;
- configuracion de idioma con `Castellano`, `Catala` y `English`;
- despliegue simple en `Vercel`.

## Stack

- `Next.js 16` con App Router
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `React Compiler` ativado em `next.config.ts`

## Como ejecutar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run audit
npm run build
npm run start
npm run check
```

## Auditoria con SitePulse

Configs listas para rutas criticas:

- `sitepulse.audit.desktop.json`
- `sitepulse.audit.mobile.json`

Ejemplos desde el repo `sitepulse-qa`:

```bash
npm --prefix qa run audit:cmd -- --config "C:\Users\Administrador\Documents\programa-recibo-alfombra\sitepulse.audit.desktop.json" --base-url "https://programa-recibo-alfombra.vercel.app" --no-server
npm --prefix qa run audit:cmd:mobile -- --config "C:\Users\Administrador\Documents\programa-recibo-alfombra\sitepulse.audit.mobile.json" --base-url "https://programa-recibo-alfombra.vercel.app" --no-server
```

Rotas cobertas por defecto:

- `/`
- `/empresa`
- `/clientes`
- `/recibos`
- `/entrega`
- `/configuracion`

## Deploy en Vercel

- La app ya esta en `Next.js`, asi que Vercel detecta el proyecto automaticamente.
- No hace falta `vercel.json` para el flujo actual.
- Antes de publicar, ejecuta:

```bash
npm run lint
npm run build
```

## Datos

- Se conservan las `localStorage keys` principales de la version anterior.
- Si ya existen clientes y recibos guardados en el navegador, la nueva interfaz reutiliza esos datos.
- En Vercel los datos siguen siendo locales al navegador del usuario; para compartir entre dispositivos hara falta backend o base de datos.

## Notas

- La app usa menu lateral con paginas dedicadas para ordenar el flujo.
- La vista previa del recibo mantiene formato imprimible.
- El boton `Imprimir / PDF` usa el dialogo nativo del navegador.
- `npm run check` ejecuta la validacion principal antes de publicar o subir a Vercel.
