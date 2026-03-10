import type { AppLanguage } from "@/lib/types";

type TranslationMap = Record<string, string>;

const translations: Record<AppLanguage, TranslationMap> = {
  es: {},
  ca: {},
  en: {}
};

Object.assign(translations.es, {
  "nav.home": "Inicio",
  "nav.homeNote": "Panel general",
  "nav.company": "Empresa",
  "nav.companyNote": "Datos de la marca",
  "nav.clients": "Clientes",
  "nav.clientsNote": "Agenda e importacion",
  "nav.receipts": "Recibos",
  "nav.receiptsNote": "Servicio y vista previa",
  "nav.settings": "Configuracion",
  "nav.settingsNote": "Idioma y preferencias",
  "sidebar.workspace": "Workspace",
  "sidebar.description": "Navegacion limpia por contexto: empresa, clientes, recibos y ajustes.",
  "sidebar.state": "Estado",
  "sidebar.clients": "clientes",
  "sidebar.receipts": "recibos",
  "sidebar.selected": "seleccionado",
  "sidebar.nextNumber": "Proximo numero",
  "sidebar.idle": "sin actividad",
  "dashboard.eyebrow": "Panel principal",
  "dashboard.title": "Contexto rapido y siguientes acciones",
  "dashboard.description":
    "La portada se mantiene ligera: muestra el estado actual, accesos rapidos y actividad reciente.",
  "dashboard.manageClients": "Gestionar clientes",
  "dashboard.openReceipts": "Abrir recibos",
  "dashboard.clientsSaved": "clientes guardados",
  "dashboard.receiptsSaved": "recibos guardados",
  "dashboard.currentState": "estado actual",
  "dashboard.nextNumber": "proximo numero",
  "dashboard.quickAccess": "Acceso rapido",
  "dashboard.mainFlows": "Flujos principales",
  "dashboard.newBlankReceipt": "Nuevo recibo en blanco",
  "dashboard.suggestNumber": "Sugerir numero",
  "dashboard.companyTitle": "Empresa",
  "dashboard.companyText":
    "Actualiza la identidad, el contacto y los datos usados en nuevos recibos.",
  "dashboard.companyAction": "Abrir empresa",
  "dashboard.clientsTitle": "Clientes",
  "dashboard.clientsText":
    "Importa contactos, edita fichas y prepara repeticiones por historial.",
  "dashboard.clientsAction": "Abrir clientes",
  "dashboard.receiptsTitle": "Recibos",
  "dashboard.receiptsText":
    "Gestiona el servicio, el numero y el PDF sin salir del flujo operativo.",
  "dashboard.receiptsAction": "Abrir recibos",
  "dashboard.context": "Contexto",
  "dashboard.currentSelection": "Seleccion actual",
  "dashboard.activeClient": "Cliente activo",
  "dashboard.clientNoName": "Cliente sin nombre",
  "dashboard.noPhone": "Sin telefono",
  "dashboard.noEmail": "Sin email",
  "dashboard.noClientSelected": "Ningun cliente seleccionado",
  "dashboard.pickClient": "Elige un cliente en la pagina de clientes.",
  "dashboard.activeReceipt": "Recibo activo",
  "dashboard.noNumber": "Sin numero",
  "dashboard.noType": "Tipo sin definir",
  "dashboard.noReceiptSelected": "Ningun recibo seleccionado",
  "dashboard.pickReceipt": "Abre un recibo o crea uno nuevo en la pagina de recibos.",
  "dashboard.utility": "Utilidad",
  "dashboard.whatNext": "Que hacer ahora",
  "dashboard.setupBrand": "Si aun no configuraste la empresa",
  "dashboard.setupBrandText":
    "Pasa por Empresa para guardar nombre, contacto y responsable usados en todos los recibos.",
  "dashboard.newClient": "Si el cliente es nuevo",
  "dashboard.newClientText":
    "Importa la agenda o crea el cliente manualmente antes de abrir un recibo.",
  "dashboard.recurringService": "Si el servicio es recurrente",
  "dashboard.recurringServiceText":
    "Usa plantillas y repeticion del ultimo servicio para evitar rellenar todo otra vez.",
  "dashboard.recent": "Actividad reciente",
  "dashboard.latestClients": "Ultimos clientes",
  "dashboard.emptyClientsTitle": "Agenda vacia",
  "dashboard.emptyClientsText": "Todavia no hay clientes guardados.",
  "dashboard.noCity": "Sin ciudad",
  "dashboard.latestReceipts": "Ultimos recibos",
  "dashboard.emptyReceiptsTitle": "Historial vacio",
  "dashboard.emptyReceiptsText": "Todavia no hay recibos guardados.",
  "dashboard.clientUndefined": "Cliente no definido",
  "company.eyebrow": "Empresa",
  "company.title": "Identidad de la empresa en su propia pagina",
  "company.description":
    "Aqui se guardan los datos institucionales usados en los recibos: contacto, direccion, responsable y sello.",
  "company.save": "Guardar empresa",
  "company.form": "Formulario",
  "company.officialData": "Datos oficiales",
  "company.summary": "Resumen",
  "company.quickView": "Vista rapida",
  "company.current": "Actual",
  "company.name": "Nombre de la empresa",
  "company.namePlaceholder": "Ej.: Alfombra Premium",
  "company.taxId": "NIF / identificacion",
  "company.taxIdPlaceholder": "Ej.: B12345678",
  "company.phone": "Telefono",
  "company.email": "Email",
  "company.address": "Direccion",
  "company.addressPlaceholder": "Calle, numero, ciudad",
  "company.responsible": "Responsable",
  "company.responsiblePlaceholder": "Nombre del responsable",
  "company.stamp": "Sello / carimbo",
  "company.stampPlaceholder": "Ej.: Sello oficial"
});

Object.assign(translations.es, {
  "clients.eyebrow": "Clientes",
  "clients.title": "Agenda organizada y lista para recurrencia",
  "clients.description":
    "La pagina de clientes concentra importacion, alta manual, busqueda, plantillas y repeticion del ultimo servicio.",
  "clients.import": "Importacion",
  "clients.importTitle": "Contactos del movil",
  "clients.importChip": "VCF / CSV / TSV",
  "clients.importText":
    "Acepta exportaciones de iPhone, Android, Google Contacts y hojas comunes.",
  "clients.selectFiles": "Seleccionar archivos",
  "clients.noFiles": "Ningun archivo seleccionado.",
  "clients.filesSelected": "{count} archivos seleccionados",
  "clients.importAction": "Importar contactos",
  "clients.importingAction": "Importando...",
  "clients.importWaiting": "Esperando importacion.",
  "clients.importPick": "Selecciona al menos un archivo.",
  "clients.importing": "Importando contactos...",
  "clients.importDone": "Importacion completada.",
  "clients.edit": "Edicion",
  "clients.selectedTitle": "Cliente seleccionado",
  "clients.saveClient": "Guardar cliente",
  "clients.clearClient": "Limpiar cliente",
  "clients.newReceipt": "Nuevo recibo de este cliente",
  "clients.repeatService": "Repetir ultimo servicio",
  "clients.saveTemplate": "Guardar plantilla del cliente",
  "clients.applyTemplate": "Aplicar plantilla guardada",
  "clients.registry": "Agenda",
  "clients.savedTitle": "Clientes guardados",
  "clients.removeSelected": "Eliminar seleccionado",
  "clients.search": "Buscar cliente",
  "clients.searchPlaceholder": "Nombre, telefono, email o ciudad",
  "clients.emptyFilter": "No hay clientes guardados para este filtro.",
  "clients.templateChip": "Plantilla",
  "clients.receiptsCount": "{count} recibos",
  "clients.noAddress": "Sin direccion",
  "clients.lastService": "Ultimo servicio",
  "clients.noHistory": "Sin historial",
  "clients.use": "Usar",
  "clients.repeat": "Repetir",
  "clients.summary": "Resumen",
  "clients.currentClient": "Cliente actual",
  "clients.active": "Activo",
  "clients.noModel": "Sin plantilla",
  "clients.modelSaved": "Guardada",
  "clients.noSelected": "Ningun cliente seleccionado.",
  "clients.firstName": "Nombre",
  "clients.lastName": "Apellido",
  "clients.phone": "Telefono",
  "clients.email": "Email",
  "clients.address": "Direccion",
  "clients.city": "Ciudad",
  "clients.postalCode": "Codigo postal",
  "receipts.eyebrow": "Recibos",
  "receipts.title": "Edicion del servicio, historial y vista A4",
  "receipts.description":
    "La pagina de recibos queda centrada en la operacion: articulo, fechas, valor, duplicacion e impresion.",
  "receipts.save": "Guardar recibo",
  "receipts.print": "Imprimir / PDF",
  "receipts.context": "Contexto",
  "receipts.linkedClient": "Cliente vinculado al recibo",
  "receipts.current": "Actual",
  "receipts.noClientMessage":
    "Ningun cliente seleccionado. Abre un cliente en la pagina de clientes o carga un recibo del historial.",
  "receipts.rugDetails": "Detalles del articulo",
  "receipts.rugTitle": "Alfombra / tapete",
  "receipts.serviceChip": "Servicio",
  "receipts.internal": "Control interno",
  "receipts.serviceReceipt": "Servicio y recibo",
  "receipts.newNumber": "Nuevo numero",
  "receipts.newBlank": "Nuevo recibo en blanco",
  "receipts.suggestedNumber": "Numero sugerido ahora",
  "receipts.history": "Historial",
  "receipts.savedTitle": "Recibos guardados",
  "receipts.empty": "Todavia no hay recibos guardados.",
  "receipts.pickup": "Recogida",
  "receipts.noMeasure": "Sin medida definida",
  "receipts.open": "Abrir",
  "receipts.duplicate": "Duplicar",
  "receipts.printNote": "Pagina preparada en formato A4 para imprimir o guardar como PDF.",
  "receipts.rugType": "Tipo",
  "receipts.rugTypePlaceholder": "Persa, moderno, lana, etc.",
  "receipts.rugSize": "Tamano",
  "receipts.rugSizePlaceholder": "Ej.: 200 x 300 cm",
  "receipts.rugColor": "Color / descripcion",
  "receipts.rugColorPlaceholder": "Beige, azul, estampado...",
  "receipts.rugCondition": "Estado al recoger",
  "receipts.rugConditionPlaceholder": "Buen estado, manchas, olor, etc.",
  "receipts.rugNotes": "Observaciones del articulo",
  "receipts.rugNotesPlaceholder": "Flecos sueltos, marcas, puntos de atencion...",
  "receipts.receiptNumber": "Recibo n.o",
  "receipts.receiptNumberPlaceholder": "Automatico",
  "receipts.pickupDate": "Fecha de recogida",
  "receipts.deliveryDate": "Entrega prevista",
  "receipts.estimatedValue": "Valor estimado",
  "receipts.estimatedValuePlaceholder": "Ej.: 85,00 EUR",
  "receipts.serviceNotes": "Observaciones del servicio",
  "receipts.serviceNotesPlaceholder":
    "Instrucciones adicionales, plazo, detalles de contacto..."
});

Object.assign(translations.es, {
  "settings.eyebrow": "Configuracion",
  "settings.title": "Preferencias del espacio de trabajo",
  "settings.description":
    "Ajusta el idioma de la interfaz y deja la aplicacion lista para trabajar en Espana o con otros equipos.",
  "settings.language": "Idioma",
  "settings.languageTitle": "Idioma de la interfaz",
  "settings.languageText":
    "El cambio se guarda en este navegador y se aplica a la navegacion, formularios y vista previa.",
  "settings.languageActive": "Activo",
  "settings.languageAction": "Usar este idioma",
  "settings.notes": "Operacion",
  "settings.notesTitle": "Notas practicas",
  "settings.notesOne": "La aplicacion queda lista para desplegarse en Vercel sin configuracion adicional.",
  "settings.notesTwo":
    "Los datos siguen guardados en el navegador del usuario hasta conectar un backend.",
  "settings.notesThree": "Castellano es el idioma inicial para el uso diario en Espana.",
  "language.es": "Castellano",
  "language.ca": "Catala",
  "language.en": "English",
  "preview.headerEyebrow": "Recibo de recogida y custodia",
  "preview.headerText": "Limpieza profesional de alfombras, tapetes y recogidas con custodia.",
  "preview.confirmation":
    "Por el presente documento, {company} confirma que la alfombra descrita en este recibo fue recogida en las instalaciones del cliente y permanece bajo custodia temporal para limpieza, tratamiento y manipulacion profesional.",
  "preview.metaReceipt": "Recibo n.o",
  "preview.metaDate": "Fecha",
  "preview.clientBlock": "Datos del cliente",
  "preview.clientChip": "Identificacion",
  "preview.fullName": "Nombre completo",
  "preview.clientNameFallback": "Nombre del cliente",
  "preview.phoneFallback": "Telefono",
  "preview.emailFallback": "Email",
  "preview.addressFallback": "Direccion del cliente",
  "preview.cityPostalFallback": "Ciudad / Codigo postal",
  "preview.cityPostal": "Ciudad / C.P.",
  "preview.rugBlock": "Informacion de la alfombra",
  "preview.rugChip": "Articulo recogido",
  "preview.rugTypeFallback": "Tipo de alfombra",
  "preview.rugSizeFallback": "Medidas del articulo",
  "preview.rugColorFallback": "Descripcion visual",
  "preview.rugConditionFallback": "Estado observado",
  "preview.noExtraNotes": "Sin observaciones adicionales.",
  "preview.serviceBlock": "Control del servicio",
  "preview.serviceChip": "Seguimiento",
  "preview.valueFallback": "Por definir",
  "preview.signatures": "Confirmacion y firmas",
  "preview.signaturesChip": "Validacion",
  "preview.clientSignature": "Firma del cliente",
  "preview.companySignature": "Firma de la empresa",
  "preview.signatureClientFallback": "Nombre y firma",
  "preview.signatureCompanyFallback": "Responsable / firma",
  "preview.stamp": "Sello / carimbo",
  "preview.stampFallback": "Espacio reservado para el sello de la empresa",
  "preview.footer":
    "Este recibo acredita la recogida de la alfombra por el prestador indicado y debe conservarse por el cliente hasta la devolucion del articulo.",
  "preview.footerIssuedBy": "Documento emitido por {company}.",
  "selection.activeReceipt": "recibo activo",
  "selection.activeClient": "cliente activo",
  "selection.none": "sin seleccion",
  "feedback.companySaved": "Datos de la empresa guardados.",
  "feedback.clientRequired":
    "Rellena al menos nombre, telefono o email para guardar el cliente.",
  "feedback.clientUpdated": "Cliente actualizado.",
  "feedback.clientSaved": "Cliente guardado.",
  "feedback.selectClientDelete": "Selecciona un cliente para eliminar.",
  "feedback.clientDeleted": "Cliente eliminado.",
  "feedback.clientCleared": "Campos del cliente limpiados.",
  "feedback.newReceiptPrepared": "Nuevo recibo en blanco preparado.",
  "feedback.clientLoaded": "Cliente cargado: {name}.",
  "feedback.selectClientNewReceipt": "Selecciona un cliente para iniciar un nuevo recibo.",
  "feedback.newReceiptForClient": "Nuevo recibo preparado para {name}.",
  "feedback.newReceiptWithTemplate":
    "Nuevo recibo preparado para {name} con plantilla guardada.",
  "feedback.selectClientRepeat": "Selecciona un cliente para repetir el servicio.",
  "feedback.latestServiceRepeated": "Ultimo servicio repetido para {name}.",
  "feedback.templateAppliedFromHistory":
    "Cliente sin historial. Plantilla guardada aplicada para {name}.",
  "feedback.noHistoryNoTemplate": "Este cliente todavia no tiene historial ni plantilla guardada.",
  "feedback.selectClientSaveTemplate": "Selecciona un cliente para guardar la plantilla.",
  "feedback.templateNeedFields":
    "Rellena al menos un campo del articulo o del servicio antes de guardar la plantilla.",
  "feedback.templateSaved": "Plantilla guardada para {name}.",
  "feedback.selectClientApplyTemplate": "Selecciona un cliente para aplicar la plantilla.",
  "feedback.clientNoTemplate": "Este cliente todavia no tiene plantilla guardada.",
  "feedback.templateApplied": "Plantilla aplicada para {name}.",
  "feedback.receiptNeedClient": "El recibo necesita un cliente identificado.",
  "feedback.receiptUpdated": "Recibo actualizado.",
  "feedback.receiptSaved": "Recibo guardado.",
  "feedback.selectReceiptDelete": "Selecciona un recibo para eliminar.",
  "feedback.receiptDeleted": "Recibo eliminado.",
  "feedback.receiptNumberUpdated": "Numero sugerido actualizado.",
  "feedback.receiptLoaded": "Recibo cargado: {number}.",
  "feedback.receiptDuplicated": "Nuevo recibo creado a partir de {number}.",
  "feedback.importPickFile": "Selecciona al menos un archivo para importar.",
  "feedback.importSummary": "Importacion completada: {added} nuevos, {updated} actualizados.{failed}",
  "feedback.importFailed": " {count} archivo(s) fallaron."
});

Object.assign(translations.ca, {
  "nav.home": "Inici",
  "nav.homeNote": "Panell general",
  "nav.company": "Empresa",
  "nav.companyNote": "Dades de marca",
  "nav.clients": "Clients",
  "nav.clientsNote": "Agenda i importacio",
  "nav.receipts": "Rebuts",
  "nav.receiptsNote": "Servei i vista previa",
  "nav.settings": "Configuracio",
  "nav.settingsNote": "Idioma i preferencies",
  "sidebar.state": "Estat",
  "sidebar.clients": "clients",
  "sidebar.receipts": "rebuts",
  "sidebar.selected": "seleccionat",
  "sidebar.nextNumber": "Proper numero",
  "sidebar.idle": "sense activitat",
  "settings.eyebrow": "Configuracio",
  "settings.title": "Preferencies de l'espai de treball",
  "settings.description":
    "Ajusta l'idioma de la interfície i deixa l'aplicacio preparada per treballar a Espanya o amb altres equips.",
  "settings.language": "Idioma",
  "settings.languageTitle": "Idioma de la interfície",
  "settings.languageText":
    "El canvi es guarda en aquest navegador i s'aplica a la navegacio, formularis i vista previa.",
  "settings.languageActive": "Actiu",
  "settings.languageAction": "Fer servir aquest idioma",
  "settings.notes": "Operacio",
  "settings.notesTitle": "Notes practiques",
  "settings.notesOne": "L'aplicacio queda llesta per desplegar-se a Vercel sense configuracio addicional.",
  "settings.notesTwo":
    "Les dades continuen guardades al navegador de l'usuari fins que hi hagi backend.",
  "settings.notesThree": "Castellano es l'idioma inicial per al treball diari a Espanya.",
  "language.es": "Castellano",
  "language.ca": "Catala",
  "language.en": "English"
});

Object.assign(translations.en, {
  "nav.home": "Home",
  "nav.homeNote": "Overview",
  "nav.company": "Company",
  "nav.companyNote": "Brand data",
  "nav.clients": "Clients",
  "nav.clientsNote": "Address book and import",
  "nav.receipts": "Receipts",
  "nav.receiptsNote": "Service and preview",
  "nav.settings": "Settings",
  "nav.settingsNote": "Language and preferences",
  "sidebar.state": "State",
  "sidebar.clients": "clients",
  "sidebar.receipts": "receipts",
  "sidebar.selected": "selected",
  "sidebar.nextNumber": "Next number",
  "sidebar.idle": "idle state",
  "settings.eyebrow": "Settings",
  "settings.title": "Workspace preferences",
  "settings.description":
    "Adjust the interface language and keep the application ready for Spain or multilingual teams.",
  "settings.language": "Language",
  "settings.languageTitle": "Interface language",
  "settings.languageText":
    "The change is saved in this browser and applied to navigation, forms and preview.",
  "settings.languageActive": "Active",
  "settings.languageAction": "Use this language",
  "settings.notes": "Operation",
  "settings.notesTitle": "Practical notes",
  "settings.notesOne": "The app is ready for Vercel deployment without extra configuration.",
  "settings.notesTwo": "Data still lives in the user's browser until a backend is connected.",
  "settings.notesThree": "Spanish is the default language for daily work in Spain.",
  "language.es": "Castellano",
  "language.ca": "Catala",
  "language.en": "English"
});

export const DEFAULT_LANGUAGE: AppLanguage = "es";

export const LANGUAGE_OPTIONS = [
  { code: "es", labelKey: "language.es" },
  { code: "ca", labelKey: "language.ca" },
  { code: "en", labelKey: "language.en" }
] as const satisfies ReadonlyArray<{ code: AppLanguage; labelKey: string }>;

export function isSupportedLanguage(value: string | null | undefined): value is AppLanguage {
  return value === "es" || value === "ca" || value === "en";
}

export function translate(
  language: AppLanguage,
  key: string,
  params?: Record<string, string | number>
) {
  const template = translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key;

  if (!params) {
    return template;
  }

  return Object.entries(params).reduce(
    (message, [paramKey, paramValue]) =>
      message.replaceAll(`{${paramKey}}`, String(paramValue)),
    template
  );
}

export function getDocumentLanguage(language: AppLanguage) {
  if (language === "ca") {
    return "ca";
  }

  if (language === "en") {
    return "en";
  }

  return "es";
}
