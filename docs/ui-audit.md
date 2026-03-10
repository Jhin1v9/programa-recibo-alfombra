# UI Audit

Fecha: 10/03/2026

## Hallazgos revisados

- Navegacion lateral con badges numericos `01..06` en lugar de iconos.
  Estado: corregido.
  Accion: se restauraron iconos propios por seccion en `components/app-shell.tsx`.

- Home y shell mobile demasiado altos para una app operativa.
  Estado: corregido.
  Accion: se compactaron el bloque superior y la navegacion mobile, con rejilla `3x2`, tarjetas mas cortas y menos texto redundante.

- Modal de firma con `Guardar firma` cortado en pantallas bajas.
  Estado: corregido.
  Accion: scroll interno, footer seguro para `safe-area` y canvas mas contenido en `components/signature-capture-dialog.tsx`.

- Barras fijas mobile tapadas por el navegador del telefono.
  Estado: corregido.
  Accion: se anadieron clases `mobile-safe-dock` y `mobile-safe-footer` en `app/globals.css`.

- Dashboard mobile demasiado largo y con informacion de poco valor inmediato.
  Estado: corregido.
  Accion: se ocultaron bloques secundarios en mobile y se compactaron cabeceras/tarjetas.

- Cabeceras de pagina demasiado grandes, con apariencia de landing.
  Estado: corregido.
  Accion: `PageIntro` y `SectionCard` se hicieron mas compactos en `components/workspace-ui.tsx`.

## Auditoria automatica

- Lighthouse `/`
  - performance: 0.43
  - accessibility: 0.93
  - best-practices: 1.00

- Lighthouse `/recibos/pdf`
  - performance: 0.40
  - accessibility: 0.93
  - best-practices: 1.00

## Nota

- El nodo oculto `receipt-export-host` aparece fuera del viewport por diseno. Se usa para generar el PDF y no representa un overflow visual real de la app.
