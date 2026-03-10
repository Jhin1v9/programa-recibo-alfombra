"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useEffectEvent,
  useState
} from "react";

import {
  buildEmptyPreset,
  buildSelectionLabel,
  CLIENT_FIELDS,
  CLIENT_PRESET_FIELDS,
  consumeNextReceiptNumber,
  createEmptyClientData,
  createEmptyReceiptDraft,
  DEFAULT_COMPANY,
  findLatestReceiptForClient,
  findMatchingClient,
  findMatchingClientIndex,
  formatClientName,
  formatDateForInput,
  hasAnyField,
  hasClientIdentity,
  loadJSON,
  loadSequence,
  mergeImportedClients,
  normalizeClients,
  normalizeCompany,
  normalizeReceiptDraft,
  normalizeReceiptRecord,
  normalizeReceipts,
  parseContactFile,
  peekNextReceiptNumber,
  pickFields,
  STORAGE_KEYS,
  syncSequenceWithNumber
} from "@/lib/receipt-core";
import type {
  ClientRecord,
  CompanyProfile,
  FeedbackState,
  ReceiptDraft,
  ReceiptRecord
} from "@/lib/types";

type PrepareOptions = {
  keepClient?: boolean;
  showMessage?: boolean;
};

type ReceiptAppContextValue = {
  hasBootstrapped: boolean;
  feedback: FeedbackState;
  dismissFeedback: () => void;
  companyForm: CompanyProfile;
  draft: ReceiptDraft;
  previewCompany: CompanyProfile;
  previewDraft: ReceiptDraft;
  clients: ClientRecord[];
  receipts: ReceiptRecord[];
  selectedClientId: string | null;
  selectedReceiptId: string | null;
  selectedClient: ClientRecord | null;
  selectedReceipt: ReceiptRecord | null;
  selectionLabel: string;
  nextReceiptSuggestion: string;
  updateCompanyField: (fieldName: keyof CompanyProfile, value: string) => void;
  updateDraftField: (fieldName: keyof ReceiptDraft, value: string) => void;
  saveCompanyProfile: () => void;
  saveClient: () => void;
  deleteSelectedClient: () => void;
  clearClientFields: () => void;
  prepareFreshReceipt: (options?: PrepareOptions) => void;
  loadClient: (clientId: string, silent?: boolean) => void;
  startNewReceiptForClient: (clientId?: string | null) => void;
  repeatLastServiceForClient: (clientId?: string | null) => void;
  saveClientTemplate: () => void;
  applyClientTemplate: (clientId?: string | null, silent?: boolean) => void;
  saveReceipt: () => void;
  deleteSelectedReceipt: () => void;
  assignNextReceiptNumber: () => void;
  loadReceipt: (receiptId: string) => void;
  duplicateReceipt: (receiptId: string) => void;
  importContacts: (files: File[]) => Promise<void>;
};

const ReceiptAppContext = createContext<ReceiptAppContextValue | null>(null);

function createFreshDraft(sequence: number, currentDraft?: ReceiptDraft, keepClient = false) {
  const clientFields = keepClient && currentDraft ? pickFields(currentDraft, CLIENT_FIELDS) : createEmptyClientData();

  return normalizeReceiptDraft({
    ...createEmptyReceiptDraft(),
    ...clientFields,
    pickupDate: formatDateForInput(new Date()),
    receiptNumber: peekNextReceiptNumber(sequence),
    deliveryDate: ""
  });
}

export function ReceiptAppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [companyForm, setCompanyForm] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const [draft, setDraft] = useState<ReceiptDraft>(createEmptyReceiptDraft());
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [sequence, setSequence] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  const clearFeedback = useEffectEvent(() => {
    setFeedback(null);
  });

  useEffect(() => {
    const storage = window.localStorage;
    const storedCompany = normalizeCompany(loadJSON(STORAGE_KEYS.company, DEFAULT_COMPANY, storage));
    const storedClients = normalizeClients(loadJSON(STORAGE_KEYS.clients, [], storage));
    const storedReceipts = normalizeReceipts(loadJSON(STORAGE_KEYS.receipts, [], storage));
    const storedSequence = loadSequence(storage);

    startTransition(() => {
      setCompanyForm(storedCompany);
      setClients(storedClients);
      setReceipts(storedReceipts);
      setSequence(storedSequence);
      setDraft(createFreshDraft(storedSequence));
      setHasBootstrapped(true);
    });
  }, []);

  useEffect(() => {
    if (!hasBootstrapped) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(clients));
  }, [clients, hasBootstrapped]);

  useEffect(() => {
    if (!hasBootstrapped) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.receipts, JSON.stringify(receipts));
  }, [receipts, hasBootstrapped]);

  useEffect(() => {
    if (!hasBootstrapped) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.sequence, String(sequence));
  }, [sequence, hasBootstrapped]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timeout = window.setTimeout(() => {
      clearFeedback();
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [feedback]);

  const previewCompany = normalizeCompany(companyForm);
  const previewDraft = normalizeReceiptDraft(draft);
  const selectedClient = clients.find((client) => client.id === selectedClientId) || null;
  const selectedReceipt = receipts.find((receipt) => receipt.id === selectedReceiptId) || null;
  const selectionLabel = buildSelectionLabel({
    selectedReceiptId,
    selectedClientId,
    clients,
    receipts
  });

  function flash(message: string, kind: "success" | "error" = "success") {
    setFeedback({ kind, message });
  }

  function dismissFeedback() {
    setFeedback(null);
  }

  function updateCompanyField(fieldName: keyof CompanyProfile, value: string) {
    setCompanyForm((current) => ({
      ...current,
      [fieldName]: value
    }));
  }

  function updateDraftField(fieldName: keyof ReceiptDraft, value: string) {
    setDraft((current) => ({
      ...current,
      [fieldName]: value
    }));
  }

  function saveCompanyProfile() {
    const nextCompany = normalizeCompany(companyForm);
    setCompanyForm(nextCompany);
    window.localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(nextCompany));
    flash("Dados da empresa guardados.");
  }

  function saveClient() {
    const clientData = pickFields(previewDraft, CLIENT_FIELDS);

    if (!hasClientIdentity(clientData)) {
      flash("Preencha pelo menos nome, telefone ou email para guardar o cliente.", "error");
      return;
    }

    const duplicateIndex = findMatchingClientIndex(clients, clientData, selectedClientId);
    const currentIndex = clients.findIndex((client) => client.id === selectedClientId);
    const targetIndex = currentIndex >= 0 ? currentIndex : duplicateIndex;
    const existingClient = targetIndex >= 0 ? clients[targetIndex] : null;
    const now = new Date().toISOString();

    const nextClient: ClientRecord = {
      ...pickFields(existingClient || {}, CLIENT_FIELDS),
      ...clientData,
      id: existingClient?.id || crypto.randomUUID(),
      createdAt: existingClient?.createdAt || now,
      updatedAt: now,
      servicePreset: existingClient?.servicePreset || buildEmptyPreset()
    };

    setClients((current) => {
      const nextClients = [...current];
      if (targetIndex >= 0) {
        nextClients[targetIndex] = nextClient;
      } else {
        nextClients.unshift(nextClient);
      }
      return nextClients;
    });

    setSelectedClientId(nextClient.id);
    setSelectedReceiptId(null);
    flash(targetIndex >= 0 ? "Cliente atualizado." : "Cliente guardado.");
  }

  function deleteSelectedClient() {
    if (!selectedClientId) {
      flash("Selecione um cliente para remover.", "error");
      return;
    }

    setClients((current) => current.filter((client) => client.id !== selectedClientId));
    setSelectedClientId(null);
    flash("Cliente removido.");
  }

  function clearClientFields() {
    setSelectedClientId(null);
    setDraft((current) => ({
      ...current,
      ...createEmptyClientData()
    }));
    flash("Campos do cliente limpos.");
  }

  function prepareFreshReceipt(options?: PrepareOptions) {
    const keepClient = options?.keepClient === true;
    const showMessage = options?.showMessage !== false;

    setSelectedReceiptId(null);
    setSelectedClientId((current) => (keepClient ? current : null));
    setDraft((current) => createFreshDraft(sequence, current, keepClient));

    if (showMessage) {
      flash("Novo recibo em branco preparado.");
    }
  }

  function loadClient(clientId: string, silent = false) {
    const client = clients.find((item) => item.id === clientId);
    if (!client) {
      return;
    }

    setSelectedClientId(client.id);
    setSelectedReceiptId(null);
    setDraft((current) =>
      normalizeReceiptDraft({
        ...current,
        ...pickFields(client, CLIENT_FIELDS)
      })
    );

    if (!silent) {
      flash(`Cliente carregado: ${formatClientName(client)}.`);
    }
  }

  function createReceiptDraftFromSource(sourceReceipt: ReceiptRecord, clientOverride?: ClientRecord | null) {
    const clientData = clientOverride || sourceReceipt;

    setSelectedReceiptId(null);
    setSelectedClientId(clientOverride?.id || null);
    setDraft(
      normalizeReceiptDraft({
        ...createFreshDraft(sequence),
        ...pickFields(clientData, CLIENT_FIELDS),
        ...pickFields(sourceReceipt, CLIENT_PRESET_FIELDS),
        deliveryDate: ""
      })
    );
  }

  function startNewReceiptForClient(clientId = selectedClientId) {
    if (!clientId) {
      flash("Selecione um cliente para iniciar um novo recibo.", "error");
      return;
    }

    const client = clients.find((item) => item.id === clientId);
    if (!client) {
      flash("Selecione um cliente para iniciar um novo recibo.", "error");
      return;
    }

    const nextDraft = normalizeReceiptDraft({
      ...createFreshDraft(sequence),
      ...pickFields(client, CLIENT_FIELDS),
      ...(hasAnyField(client.servicePreset) ? client.servicePreset : {})
    });

    setSelectedClientId(client.id);
    setSelectedReceiptId(null);
    setDraft(nextDraft);

    if (hasAnyField(client.servicePreset)) {
      flash(`Novo recibo preparado para ${formatClientName(client)} com modelo guardado.`);
      return;
    }

    flash(`Novo recibo preparado para ${formatClientName(client)}.`);
  }

  function repeatLastServiceForClient(clientId = selectedClientId) {
    if (!clientId) {
      flash("Selecione um cliente para repetir o servico.", "error");
      return;
    }

    const client = clients.find((item) => item.id === clientId);
    if (!client) {
      flash("Selecione um cliente para repetir o servico.", "error");
      return;
    }

    const latestReceipt = findLatestReceiptForClient(receipts, client);
    if (latestReceipt) {
      createReceiptDraftFromSource(latestReceipt, client);
      flash(`Ultimo servico repetido para ${formatClientName(client)}.`);
      return;
    }

    if (hasAnyField(client.servicePreset)) {
      const nextDraft = normalizeReceiptDraft({
        ...createFreshDraft(sequence),
        ...pickFields(client, CLIENT_FIELDS),
        ...client.servicePreset
      });

      setSelectedClientId(client.id);
      setSelectedReceiptId(null);
      setDraft(nextDraft);
      flash(`Cliente sem historico. Modelo guardado aplicado para ${formatClientName(client)}.`);
      return;
    }

    flash("Este cliente ainda nao tem historico nem modelo guardado.", "error");
  }

  function saveClientTemplate() {
    if (!selectedClientId) {
      flash("Selecione um cliente para guardar o modelo.", "error");
      return;
    }

    const preset = pickFields(previewDraft, CLIENT_PRESET_FIELDS);
    if (!hasAnyField(preset)) {
      flash("Preencha pelo menos um campo do artigo ou do servico antes de guardar o modelo.", "error");
      return;
    }

    setClients((current) =>
      current.map((client) =>
        client.id === selectedClientId
          ? {
              ...client,
              servicePreset: {
                ...buildEmptyPreset(),
                ...preset
              },
              updatedAt: new Date().toISOString()
            }
          : client
      )
    );

    flash(`Modelo guardado para ${formatClientName(selectedClient || {})}.`);
  }

  function applyClientTemplate(clientId = selectedClientId, silent = false) {
    if (!clientId) {
      flash("Selecione um cliente para aplicar o modelo.", "error");
      return;
    }

    const client = clients.find((item) => item.id === clientId);
    if (!client) {
      flash("Selecione um cliente para aplicar o modelo.", "error");
      return;
    }

    if (!hasAnyField(client.servicePreset)) {
      flash("Este cliente ainda nao tem modelo guardado.", "error");
      return;
    }

    setDraft((current) => ({
      ...current,
      ...client.servicePreset
    }));

    if (!silent) {
      flash(`Modelo aplicado para ${formatClientName(client)}.`);
    }
  }

  function saveReceipt() {
    const receiptDraft = normalizeReceiptDraft(draft);

    if (!hasClientIdentity(receiptDraft)) {
      flash("O recibo precisa de um cliente identificado.", "error");
      return;
    }

    const isEditing = Boolean(selectedReceiptId);
    let receiptNumber = receiptDraft.receiptNumber.trim();
    let nextSequence = sequence;

    if (!receiptNumber) {
      const nextValue = consumeNextReceiptNumber(sequence);
      nextSequence = nextValue.nextSequence;
      receiptNumber = nextValue.receiptNumber;
    } else if (!isEditing) {
      nextSequence = syncSequenceWithNumber(sequence, receiptNumber);
    }

    const now = new Date().toISOString();
    const record = normalizeReceiptRecord({
      id: selectedReceiptId || crypto.randomUUID(),
      updatedAt: now,
      company: normalizeCompany(companyForm),
      ...receiptDraft,
      receiptNumber
    });

    setDraft((current) => ({
      ...current,
      receiptNumber
    }));

    setReceipts((current) => {
      if (isEditing) {
        return current.map((receipt) => (receipt.id === record.id ? record : receipt));
      }

      return [record, ...current];
    });

    if (selectedClientId) {
      setClients((current) =>
        current.map((client) =>
          client.id === selectedClientId
            ? {
                ...client,
                updatedAt: now
              }
            : client
        )
      );
    }

    setSelectedReceiptId(record.id);
    setSequence(nextSequence);
    flash(isEditing ? "Recibo atualizado." : "Recibo guardado.");
  }

  function deleteSelectedReceipt() {
    if (!selectedReceiptId) {
      flash("Selecione um recibo para remover.", "error");
      return;
    }

    setReceipts((current) => current.filter((receipt) => receipt.id !== selectedReceiptId));
    setSelectedReceiptId(null);
    setSelectedClientId(null);
    setDraft(createFreshDraft(sequence));
    flash("Recibo removido.");
  }

  function assignNextReceiptNumber() {
    setDraft((current) => ({
      ...current,
      receiptNumber: peekNextReceiptNumber(sequence)
    }));
    flash("Numero sugerido atualizado.");
  }

  function loadReceipt(receiptId: string) {
    const receipt = receipts.find((item) => item.id === receiptId);
    if (!receipt) {
      return;
    }

    const receiptCompany = normalizeCompany(receipt.company || DEFAULT_COMPANY);
    const matchingClient = findMatchingClient(clients, receipt);

    setSelectedReceiptId(receipt.id);
    setSelectedClientId(matchingClient?.id || null);
    setCompanyForm(receiptCompany);
    setDraft(normalizeReceiptDraft(receipt));
    window.localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(receiptCompany));

    flash(`Recibo carregado: ${receipt.receiptNumber || "sem numero"}.`);
  }

  function duplicateReceipt(receiptId: string) {
    const receipt = receipts.find((item) => item.id === receiptId);
    if (!receipt) {
      return;
    }

    const matchingClient = findMatchingClient(clients, receipt);
    createReceiptDraftFromSource(receipt, matchingClient);
    flash(`Novo recibo criado a partir de ${receipt.receiptNumber || "um recibo anterior"}.`);
  }

  async function importContacts(files: File[]) {
    if (!files.length) {
      flash("Selecione pelo menos um ficheiro para importar.", "error");
      return;
    }

    const importedContacts = [];
    let failedFiles = 0;

    for (const file of files) {
      try {
        const rawText = await file.text();
        importedContacts.push(...parseContactFile(rawText, file.name));
      } catch {
        failedFiles += 1;
      }
    }

    const summary = mergeImportedClients(clients, importedContacts);
    const failureNote = failedFiles ? ` ${failedFiles} ficheiro(s) falharam.` : "";

    startTransition(() => {
      setClients(summary.clients);
      flash(
        `Importacao concluida: ${summary.added} novos, ${summary.updated} atualizados.${failureNote}`,
        summary.added === 0 && summary.updated === 0 ? "error" : "success"
      );
    });
  }

  return (
    <ReceiptAppContext.Provider
      value={{
        hasBootstrapped,
        feedback,
        dismissFeedback,
        companyForm,
        draft,
        previewCompany,
        previewDraft,
        clients,
        receipts,
        selectedClientId,
        selectedReceiptId,
        selectedClient,
        selectedReceipt,
        selectionLabel,
        nextReceiptSuggestion: peekNextReceiptNumber(sequence),
        updateCompanyField,
        updateDraftField,
        saveCompanyProfile,
        saveClient,
        deleteSelectedClient,
        clearClientFields,
        prepareFreshReceipt,
        loadClient,
        startNewReceiptForClient,
        repeatLastServiceForClient,
        saveClientTemplate,
        applyClientTemplate,
        saveReceipt,
        deleteSelectedReceipt,
        assignNextReceiptNumber,
        loadReceipt,
        duplicateReceipt,
        importContacts
      }}
    >
      {children}
    </ReceiptAppContext.Provider>
  );
}

export function useReceiptApp() {
  const context = useContext(ReceiptAppContext);

  if (!context) {
    throw new Error("useReceiptApp must be used inside ReceiptAppProvider");
  }

  return context;
}
