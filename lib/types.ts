export type CompanyProfile = {
  companyName: string;
  companyTaxId: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  companyResponsible: string;
  companyStamp: string;
};

export type ClientFields = {
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  clientCity: string;
  clientPostalCode: string;
};

export type RugFields = {
  rugType: string;
  rugSize: string;
  rugColor: string;
  rugCondition: string;
  rugNotes: string;
};

export type ServiceFields = {
  estimatedValue: string;
  serviceNotes: string;
};

export type ReceiptMeta = {
  receiptNumber: string;
  pickupDate: string;
  deliveryDate: string;
};

export type ServicePreset = RugFields & ServiceFields;

export type ReceiptDraft = ClientFields & ServicePreset & ReceiptMeta;

export type ClientRecord = ClientFields & {
  id: string;
  createdAt: string;
  updatedAt: string;
  servicePreset: ServicePreset;
};

export type ReceiptRecord = ReceiptDraft & {
  id: string;
  updatedAt: string;
  company: CompanyProfile;
};

export type AppLanguage = "es" | "ca" | "en";

export type AppPreferences = {
  language: AppLanguage;
};

export type FeedbackState =
  | {
      kind: "success" | "error";
      message: string;
    }
  | null;

export type ImportSummary = {
  clients: ClientRecord[];
  added: number;
  updated: number;
  skipped: number;
};
