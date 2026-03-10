import type {
  ClientFields,
  ClientRecord,
  CompanyProfile,
  ImportSummary,
  ReceiptDraft,
  ReceiptRecord,
  ServicePreset
} from "@/lib/types";

export const STORAGE_KEYS = {
  company: "alfombra_company_profile",
  clients: "alfombra_client_registry",
  receipts: "alfombra_receipt_registry",
  sequence: "alfombra_receipt_sequence",
  preferences: "alfombra_app_preferences"
} as const;

export const COMPANY_FIELDS = [
  "companyName",
  "companyTaxId",
  "companyPhone",
  "companyEmail",
  "companyAddress",
  "companyResponsible",
  "companyStamp",
  "companyStampDataUrl",
  "companyLogoDataUrl",
  "companySignatureDataUrl"
] as const;

export const CLIENT_FIELDS = [
  "clientFirstName",
  "clientLastName",
  "clientPhone",
  "clientEmail",
  "clientAddress",
  "clientCity",
  "clientPostalCode"
] as const;

export const RUG_FIELDS = [
  "rugType",
  "rugSize",
  "rugColor",
  "rugCondition",
  "rugNotes"
] as const;

export const SERVICE_FIELDS = ["estimatedValue", "serviceNotes"] as const;

export const RECEIPT_META_FIELDS = [
  "receiptNumber",
  "pickupDate",
  "deliveryDate",
  "handoverDate"
] as const;

export const DELIVERY_FIELDS = [
  "handoverDate",
  "deliveryReceivedBy",
  "deliveryCondition",
  "deliveryNotes",
  "deliveryClientSignatureDataUrl",
  "deliveryCompanySignatureDataUrl"
] as const;

export const CLIENT_PRESET_FIELDS = [
  "rugType",
  "rugSize",
  "rugColor",
  "rugCondition",
  "rugNotes",
  "estimatedValue",
  "serviceNotes"
] as const;

export const RECEIPT_FIELDS = [
  "clientFirstName",
  "clientLastName",
  "clientPhone",
  "clientEmail",
  "clientAddress",
  "clientCity",
  "clientPostalCode",
  "rugType",
  "rugSize",
  "rugColor",
  "rugCondition",
  "rugNotes",
  "estimatedValue",
  "serviceNotes",
  "receiptNumber",
  "pickupDate",
  "deliveryDate",
  "clientSignatureDataUrl",
  "companySignatureDataUrl",
  "handoverDate",
  "deliveryReceivedBy",
  "deliveryCondition",
  "deliveryNotes",
  "deliveryClientSignatureDataUrl",
  "deliveryCompanySignatureDataUrl"
] as const;

export const DEFAULT_COMPANY: CompanyProfile = {
  companyName: "Su empresa",
  companyTaxId: "NIF / identificacion",
  companyPhone: "Telefono",
  companyEmail: "Email",
  companyAddress: "Direccion de la empresa",
  companyResponsible: "Responsable",
  companyStamp: "Sello oficial",
  companyStampDataUrl: "",
  companyLogoDataUrl: "",
  companySignatureDataUrl: ""
};

function cleanString(value: unknown) {
  return String(value ?? "").trim();
}

function createEmptyStringRecord<const T extends readonly string[]>(fieldNames: T) {
  const next = {} as Record<T[number], string>;

  fieldNames.forEach((fieldName) => {
    next[fieldName as T[number]] = "";
  });

  return next;
}

export function loadJSON<T>(key: string, fallback: T, storage?: Storage | null) {
  if (!storage) {
    return fallback;
  }

  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function loadSequence(storage?: Storage | null) {
  if (!storage) {
    return 0;
  }

  const raw = Number(storage.getItem(STORAGE_KEYS.sequence) || "0");
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
}

export function pickFields<const K extends readonly string[]>(
  source: Partial<Record<K[number], unknown>> | null | undefined,
  fieldNames: K
) {
  const input = (source ?? {}) as Record<string, unknown>;
  const entries = fieldNames.map((fieldName) => [fieldName, cleanString(input[fieldName])] as const);
  return Object.fromEntries(entries) as Record<K[number], string>;
}

export function normalizeCompany(company?: Partial<CompanyProfile> | null): CompanyProfile {
  return COMPANY_FIELDS.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = cleanString(company?.[fieldName]) || DEFAULT_COMPANY[fieldName];
    return accumulator;
  }, { ...DEFAULT_COMPANY });
}

export function buildEmptyPreset(): ServicePreset {
  return createEmptyStringRecord(CLIENT_PRESET_FIELDS) as ServicePreset;
}

export function createEmptyClientData(): ClientFields {
  return createEmptyStringRecord(CLIENT_FIELDS) as ClientFields;
}

export function createEmptyReceiptDraft(): ReceiptDraft {
  return createEmptyStringRecord(RECEIPT_FIELDS) as ReceiptDraft;
}

export function createEmptyClientRecord(): ClientRecord {
  return {
    ...createEmptyClientData(),
    id: "",
    createdAt: "",
    updatedAt: "",
    servicePreset: buildEmptyPreset()
  };
}

export function createEmptyReceiptRecord(): ReceiptRecord {
  return {
    ...createEmptyReceiptDraft(),
    id: "",
    updatedAt: "",
    company: normalizeCompany(DEFAULT_COMPANY)
  };
}

export function normalizePreset(preset?: Partial<ServicePreset> | null): ServicePreset {
  return CLIENT_PRESET_FIELDS.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = cleanString(preset?.[fieldName]);
    return accumulator;
  }, buildEmptyPreset());
}

export function normalizeClientRecord(client?: Partial<ClientRecord> | null): ClientRecord {
  const normalized = createEmptyClientRecord();

  CLIENT_FIELDS.forEach((fieldName) => {
    normalized[fieldName] = cleanString(client?.[fieldName]);
  });

  normalized.id = cleanString(client?.id) || createId();
  normalized.createdAt = cleanString(client?.createdAt) || new Date().toISOString();
  normalized.updatedAt =
    cleanString(client?.updatedAt) || normalized.createdAt || new Date().toISOString();
  normalized.servicePreset = normalizePreset(client?.servicePreset);

  return normalized;
}

export function normalizeReceiptDraft(receipt?: Partial<ReceiptDraft> | null): ReceiptDraft {
  return RECEIPT_FIELDS.reduce((accumulator, fieldName) => {
    accumulator[fieldName] = cleanString(receipt?.[fieldName]);
    return accumulator;
  }, createEmptyReceiptDraft());
}

export function normalizeReceiptRecord(receipt?: Partial<ReceiptRecord> | null): ReceiptRecord {
  const normalized = createEmptyReceiptRecord();

  RECEIPT_FIELDS.forEach((fieldName) => {
    normalized[fieldName] = cleanString(receipt?.[fieldName]);
  });

  normalized.id = cleanString(receipt?.id) || createId();
  normalized.updatedAt = cleanString(receipt?.updatedAt) || new Date().toISOString();
  normalized.company = normalizeCompany(receipt?.company);

  return normalized;
}

export function normalizeClients(clients: unknown): ClientRecord[] {
  return Array.isArray(clients) ? clients.map((client) => normalizeClientRecord(client)) : [];
}

export function normalizeReceipts(receipts: unknown): ReceiptRecord[] {
  return Array.isArray(receipts) ? receipts.map((receipt) => normalizeReceiptRecord(receipt)) : [];
}

export function hasAnyField(record: Record<string, unknown> | null | undefined) {
  return Object.values(record ?? {}).some((value) => Boolean(cleanString(value)));
}

export function hasClientIdentity(record: Partial<ClientFields> | Partial<ReceiptDraft>) {
  return Boolean(
    cleanString(record.clientFirstName) ||
      cleanString(record.clientLastName) ||
      cleanString(record.clientPhone) ||
      cleanString(record.clientEmail)
  );
}

export function formatDateForInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDate(rawValue: string) {
  if (!rawValue) {
    return "";
  }

  const [year, month, day] = String(rawValue).split("-");
  if (!year || !month || !day) {
    return String(rawValue);
  }

  return `${day}/${month}/${year}`;
}

export function formatClientName(record: Partial<ClientFields>) {
  return joinNonEmpty([record.clientFirstName, record.clientLastName], " ");
}

export function splitFullName(rawName: string) {
  const cleaned = cleanString(rawName).replace(/\s+/g, " ");
  if (!cleaned) {
    return { clientFirstName: "", clientLastName: "" };
  }

  if (cleaned.includes(",")) {
    const parts = cleaned
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      clientFirstName: parts[1] || "",
      clientLastName: parts[0] || ""
    };
  }

  const parts = cleaned.split(" ");
  if (parts.length === 1) {
    return { clientFirstName: parts[0], clientLastName: "" };
  }

  return {
    clientFirstName: parts.slice(0, -1).join(" "),
    clientLastName: parts[parts.length - 1]
  };
}

export function joinNonEmpty(values: Array<string | undefined>, separator: string) {
  return values.filter(Boolean).join(separator);
}

export function joinUnique(values: Array<string | undefined>, separator: string) {
  const unique: string[] = [];

  values.forEach((value) => {
    const cleanValue = cleanString(value);
    if (!cleanValue) {
      return;
    }

    const normalized = normalizeIdentityText(cleanValue);
    if (!unique.some((item) => normalizeIdentityText(item) === normalized)) {
      unique.push(cleanValue);
    }
  });

  return unique.join(separator);
}

export function normalizeIdentityText(value: string | undefined) {
  return cleanString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizePhone(value: string | undefined) {
  return cleanString(value).replace(/[^\d]/g, "");
}

export function truncateLabel(value: string | undefined, maxLength: number) {
  const text = cleanString(value);
  if (text.length <= maxLength) {
    return text || "sin seleccion";
  }

  return `${text.slice(0, maxLength - 1)}...`;
}

export function isSameClientRecord(
  firstRecord: Partial<ClientFields>,
  secondRecord: Partial<ClientFields>
) {
  const firstPhone = normalizePhone(firstRecord.clientPhone);
  const secondPhone = normalizePhone(secondRecord.clientPhone);
  if (firstPhone && secondPhone && firstPhone === secondPhone) {
    return true;
  }

  const firstEmail = normalizeIdentityText(firstRecord.clientEmail);
  const secondEmail = normalizeIdentityText(secondRecord.clientEmail);
  if (firstEmail && secondEmail && firstEmail === secondEmail) {
    return true;
  }

  const firstName = normalizeIdentityText(formatClientName(firstRecord));
  const secondName = normalizeIdentityText(formatClientName(secondRecord));
  const firstAddress = normalizeIdentityText(firstRecord.clientAddress);
  const secondAddress = normalizeIdentityText(secondRecord.clientAddress);
  const firstCity = normalizeIdentityText(firstRecord.clientCity);
  const secondCity = normalizeIdentityText(secondRecord.clientCity);

  return Boolean(
    firstName &&
      secondName &&
      firstName === secondName &&
      ((firstAddress && secondAddress && firstAddress === secondAddress) ||
        (firstCity && secondCity && firstCity === secondCity))
  );
}

export function countReceiptsForClient(receipts: ReceiptRecord[], client: ClientRecord) {
  return receipts.filter((receipt) => isSameClientRecord(client, receipt)).length;
}

export function findLatestReceiptForClient(receipts: ReceiptRecord[], client: ClientRecord) {
  return (
    [...receipts]
      .filter((receipt) => isSameClientRecord(client, receipt))
      .sort((first, second) => +new Date(second.updatedAt) - +new Date(first.updatedAt))[0] ?? null
  );
}

export function findMatchingClient(clients: ClientRecord[], receiptLike: Partial<ClientFields>) {
  return clients.find((client) => isSameClientRecord(client, receiptLike)) ?? null;
}

export function findMatchingClientIndex(
  clients: ClientRecord[],
  candidate: Partial<ClientFields>,
  ignoreClientId?: string | null
) {
  return clients.findIndex((client) => {
    if (ignoreClientId && client.id === ignoreClientId) {
      return false;
    }

    return isSameClientRecord(client, candidate);
  });
}

export function matchesClientSearch(client: ClientRecord, search: string) {
  if (!search) {
    return true;
  }

  const haystack = normalizeIdentityText(
    [
      client.clientFirstName,
      client.clientLastName,
      client.clientPhone,
      client.clientEmail,
      client.clientAddress,
      client.clientCity,
      client.clientPostalCode
    ].join(" ")
  );

  return haystack.includes(search);
}

export function formatReceiptNumber(sequence: number, referenceDate = new Date()) {
  const prefix = [
    referenceDate.getFullYear(),
    String(referenceDate.getMonth() + 1).padStart(2, "0"),
    String(referenceDate.getDate()).padStart(2, "0")
  ].join("");

  return `RC-${prefix}-${String(sequence).padStart(3, "0")}`;
}

export function peekNextReceiptNumber(sequence: number) {
  return formatReceiptNumber(sequence + 1);
}

export function consumeNextReceiptNumber(sequence: number) {
  const nextSequence = sequence + 1;
  return {
    nextSequence,
    receiptNumber: formatReceiptNumber(nextSequence)
  };
}

export function syncSequenceWithNumber(currentSequence: number, receiptNumber: string) {
  const match = cleanString(receiptNumber).match(/-(\d{3,})$/);
  if (!match) {
    return currentSequence;
  }

  const numericPart = Number(match[1]);
  return numericPart > currentSequence ? numericPart : currentSequence;
}

export function buildSelectionLabel(options: {
  selectedReceiptId: string | null;
  selectedClientId: string | null;
  clients: ClientRecord[];
  receipts: ReceiptRecord[];
}) {
  if (options.selectedReceiptId) {
    const receipt = options.receipts.find((item) => item.id === options.selectedReceiptId);
    return truncateLabel(receipt?.receiptNumber || "recibo activo", 18);
  }

  if (options.selectedClientId) {
    const client = options.clients.find((item) => item.id === options.selectedClientId);
    return truncateLabel(formatClientName(client || {}) || "cliente activo", 18);
  }

  return "sin seleccion";
}

type DelimitedEntry = {
  rawKey: string;
  key: string;
  value: string;
};

export function parseContactFile(rawText: string, fileName: string) {
  const text = stripBom(String(rawText || "")).trim();
  if (!text) {
    return [];
  }

  if (fileName.toLowerCase().endsWith(".vcf") || /BEGIN:VCARD/i.test(text)) {
    return parseVCardContacts(text);
  }

  return parseDelimitedContacts(text);
}

export function parseVCardContacts(text: string) {
  const unfolded = unfoldVCardText(text);
  const cards = unfolded.match(/BEGIN:VCARD[\s\S]*?END:VCARD/gi) || [];

  return cards
    .map((cardText) => parseSingleVCard(cardText))
    .filter((contact) => hasClientIdentity(contact) || contact.clientAddress);
}

export function parseSingleVCard(cardText: string) {
  const lines = cardText.split(/\r?\n/);
  const contact = createEmptyClientData();
  let fullName = "";

  for (const line of lines) {
    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) {
      continue;
    }

    const meta = line.slice(0, separatorIndex);
    const rawValue = line.slice(separatorIndex + 1);
    const upperMeta = meta.toUpperCase();
    const value = decodeVCardValue(meta, rawValue);

    if (!value || upperMeta === "BEGIN" || upperMeta === "END" || upperMeta === "VERSION") {
      continue;
    }

    if (upperMeta === "N" || upperMeta.startsWith("N;")) {
      const parts = value.split(";");
      contact.clientLastName = contact.clientLastName || cleanString(parts[0]);
      contact.clientFirstName = contact.clientFirstName || cleanString(parts[1]);
      continue;
    }

    if (upperMeta === "FN" || upperMeta.startsWith("FN;")) {
      fullName = fullName || value;
      continue;
    }

    if (upperMeta.includes("TEL") && !contact.clientPhone) {
      contact.clientPhone = value;
      continue;
    }

    if (upperMeta.includes("EMAIL") && !contact.clientEmail) {
      contact.clientEmail = value;
      continue;
    }

    if (upperMeta.includes("ADR") && !contact.clientAddress) {
      const parsedAddress = parseVCardAddress(value);
      contact.clientAddress = parsedAddress.clientAddress;
      contact.clientCity = parsedAddress.clientCity;
      contact.clientPostalCode = parsedAddress.clientPostalCode;
      continue;
    }

    if (upperMeta.includes("LABEL") && !contact.clientAddress) {
      contact.clientAddress = value.replace(/\s+/g, " ").trim();
    }
  }

  if (!contact.clientFirstName && !contact.clientLastName && fullName) {
    const nameParts = splitFullName(fullName);
    contact.clientFirstName = nameParts.clientFirstName;
    contact.clientLastName = nameParts.clientLastName;
  }

  return contact;
}

export function parseDelimitedContacts(text: string) {
  const delimiter = detectDelimiter(text);
  const rows = parseSeparatedValues(text, delimiter);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => cleanString(header));

  return rows
    .slice(1)
    .map((row) => mapDelimitedRowToContact(headers, row))
    .filter((contact) => hasClientIdentity(contact) || contact.clientAddress);
}

export function mapDelimitedRowToContact(headers: string[], row: string[]) {
  const entries: DelimitedEntry[] = headers.map((header, index) => ({
    rawKey: header,
    key: normalizeIdentityText(header),
    value: cleanString(row[index])
  }));

  const contact = createEmptyClientData();
  const fullName =
    findEntryValue(entries, {
      exact: ["full name", "display name", "contact name", "nome completo", "nombre completo"],
      includes: ["full name", "display name", "contact name", "nome completo", "nombre completo"]
    }) ||
    findEntryValue(entries, {
      exact: ["name", "nome", "nombre"],
      includes: []
    });

  contact.clientFirstName = findEntryValue(entries, {
    exact: ["first name", "given name", "firstname", "givenname", "nome proprio"],
    includes: ["first name", "given name"]
  });

  contact.clientLastName = findEntryValue(entries, {
    exact: [
      "last name",
      "family name",
      "lastname",
      "familyname",
      "surname",
      "sobrenome",
      "apellido"
    ],
    includes: ["last name", "family name", "surname", "sobrenome", "apellido"]
  });

  if (!contact.clientFirstName && !contact.clientLastName && fullName) {
    const nameParts = splitFullName(fullName);
    contact.clientFirstName = nameParts.clientFirstName;
    contact.clientLastName = nameParts.clientLastName;
  }

  contact.clientPhone = findEntryValue(entries, {
    includes: ["phone", "mobile", "telephone", "tel", "whatsapp", "cell", "telemovel", "movil"],
    excludes: ["type", "label"]
  });

  contact.clientEmail = findEntryValue(entries, {
    includes: ["email", "e mail", "mail"],
    excludes: ["type", "label"]
  });

  const rawAddress = findEntryValue(entries, {
    includes: ["address", "street", "morada", "endereco", "road", "logradouro"],
    excludes: ["type", "label"]
  });

  const city = findEntryValue(entries, {
    includes: ["city", "locality", "cidade", "town", "municipio"]
  });

  const postalCode = findEntryValue(entries, {
    includes: ["postal", "zip", "postcode", "codigo", "cep"]
  });

  const country = findEntryValue(entries, {
    includes: ["country", "pais"]
  });

  contact.clientCity = city;
  contact.clientPostalCode = postalCode;
  contact.clientAddress = joinUnique([rawAddress, city, postalCode, country], ", ");

  return contact;
}

export function mergeImportedClients(
  existingClients: ClientRecord[],
  importedContacts: ClientFields[]
): ImportSummary {
  const nextClients = [...existingClients];
  let added = 0;
  let updated = 0;
  let skipped = 0;

  importedContacts.forEach((contact) => {
    const clientData = normalizeClientRecord({
      ...createEmptyClientRecord(),
      ...contact,
      id: createId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      servicePreset: buildEmptyPreset()
    });

    if (!hasClientIdentity(clientData) && !clientData.clientAddress) {
      skipped += 1;
      return;
    }

    const existingIndex = findMatchingClientIndex(nextClients, clientData);
    if (existingIndex >= 0) {
      const existing = nextClients[existingIndex];
      nextClients[existingIndex] = normalizeClientRecord({
        ...existing,
        ...fillMissingValues(existing, clientData),
        servicePreset: existing.servicePreset || buildEmptyPreset(),
        updatedAt: new Date().toISOString()
      });
      updated += 1;
      return;
    }

    nextClients.unshift(clientData);
    added += 1;
  });

  return { clients: nextClients, added, updated, skipped };
}

export function findEntryValue(
  entries: DelimitedEntry[],
  options: {
    exact?: string[];
    includes?: string[];
    excludes?: string[];
  }
) {
  const exact = options.exact || [];
  const includes = options.includes || [];
  const excludes = options.excludes || [];

  const match = entries.find((entry) => {
    if (!entry.value) {
      return false;
    }

    if (excludes.some((token) => entry.key.includes(token))) {
      return false;
    }

    if (exact.includes(entry.key)) {
      return true;
    }

    return includes.some((token) => entry.key.includes(token));
  });

  return match ? match.value : "";
}

export function detectDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const candidates = [",", ";", "\t"];

  return candidates
    .map((candidate) => ({
      delimiter: candidate,
      count: firstLine.split(candidate).length - 1
    }))
    .sort((first, second) => second.count - first.count)[0]?.delimiter || ",";
}

export function parseSeparatedValues(text: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        value += '"';
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (!insideQuotes && char === delimiter) {
      row.push(value);
      value = "";
      continue;
    }

    if (!insideQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((cell) => cleanString(cell)));
}

export function unfoldVCardText(text: string) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const unfolded: string[] = [];

  lines.forEach((line) => {
    if (/^[ \t]/.test(line) && unfolded.length) {
      unfolded[unfolded.length - 1] += line.slice(1);
      return;
    }

    unfolded.push(line);
  });

  return unfolded.join("\n");
}

export function decodeVCardValue(meta: string, value: string) {
  let decoded = String(value || "");

  if (/ENCODING=QUOTED-PRINTABLE/i.test(meta)) {
    decoded = decodeQuotedPrintable(decoded);
  }

  return decoded
    .replace(/\\n/gi, ", ")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

export function decodeQuotedPrintable(value: string) {
  const compact = String(value || "").replace(/=\r?\n/g, "");

  try {
    return decodeURIComponent(compact.replace(/=([A-F0-9]{2})/gi, "%$1"));
  } catch {
    return compact.replace(/=([A-F0-9]{2})/gi, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    );
  }
}

export function parseVCardAddress(value: string) {
  const parts = String(value || "").split(";");
  const street = joinNonEmpty([parts[1], parts[2]], " ").trim();
  const city = cleanString(parts[3]);
  const postalCode = cleanString(parts[5]);
  const country = cleanString(parts[6]);

  return {
    clientAddress: joinUnique([street, city, postalCode, country], ", "),
    clientCity: city,
    clientPostalCode: postalCode
  };
}

export function fillMissingValues(existing: ClientRecord, incoming: ClientRecord) {
  const merged = { ...existing };

  CLIENT_FIELDS.forEach((fieldName) => {
    if (!merged[fieldName] && incoming[fieldName]) {
      merged[fieldName] = incoming[fieldName];
    }
  });

  return merged;
}

export function stripBom(text: string) {
  return String(text || "").replace(/^\uFEFF/, "");
}

export function createId() {
  if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
