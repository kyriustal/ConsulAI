/**
 * Types and interfaces for the ConsulAI Engine
 */

export type CountryCode = "USA" | "Canada" | "Schengen" | "Brazil" | "Angola" | "UK" | "Portugal" | "Spain" | "France" | "Germany" | "Luxembourg" | "Poland";

export interface ApplicantData {
  applicantName: string;
  passportNumber: string;
  age: number;
  country: CountryCode;
  schengenCountry?: string; // e.g. "Alemanha", "Portugal", etc.
  visaType: string;
  monthlyIncome: number;
  bankBalance: number;
  jobType: string;
  jobTiesYears: number;
  familyInOrigin: "strong_ties" | "moderate_ties" | "no_ties" | "casado_sem_filhos_com_bens" | "solteiro_com_filhos_e_bens" | "solteiro_sem_filhos_com_bens";
  travelHistory: string[]; // e.g., ["USA", "Schengen", "South America", "None"]
  hasDeniedVisas: "yes" | "no";
  deniedVisaCountry?: string;
  deniedVisaReason?: string;
  hasDeportations: "yes" | "no";
  deportationCountry?: string;
  deportationReason?: string;
  purposeOfTrip: string;
  durationOfStayDays: number;
  validDocs: boolean;
  balanceRecentIncrease: boolean; // Fraud indicator: sudden unexplained spike
  jobUnverified: boolean; // Fraud indicator: lack of unverified employment
  requireAllDocs?: boolean; // If true, requires all checklist documents
  accommodationType?: "Hotel" | "Casa Familiar ou de Amigo" | "Residência Escolar" | "Alojamento de Empregador" | "Igreja" | "";
  hasInvitationLetter?: "yes" | "no" | "";
  relationshipWithHost?: string;
  hostLegalStatus?: "Cidadão" | "Residente Legal" | "Visto de Estudante" | "Visto de Trabalho" | "Visto de Turismo" | "";
  nationality?: string;
  hasOtherNationality?: "yes" | "no";
  otherNationality?: string;
  contractType?: string;
  contractDuration?: string;
  assetsOwned?: string;
  tripSponsor?: "Eu Mesmo" | "Pai" | "Mãe" | "Irmã(o)" | "Empresa" | "Escola" | "Bolsa de Estudos" | "Amigo" | "Anfitrião" | "";
  tripSponsorRelation?: "Pai" | "Mãe" | "Irmã(o)" | "Empresa" | "Escola" | "Bolsa de Estudos" | "Amigo" | "Outro" | "";
  flightCost?: number;
  accommodationCost?: number;
  otherCosts?: number;
  checkedDocs?: {
    identity_docs?: boolean;
    bank_statements?: boolean;
    job_letter?: boolean;
    payslips?: boolean;
    travel_insurance?: boolean;
    hotel_booking?: boolean;
    flight_booking?: boolean;
    invitation_letter?: boolean;
    authentications?: boolean;
    certificates?: boolean;
    contracts?: boolean;
    criminal_record?: boolean;
    marriage_birth_certificate?: boolean;
    accommodation_proof?: boolean;
    health_insurance_long?: boolean;
    language_proficiency?: boolean;
    heritage_proof?: boolean;
  };
  attachedFile?: {
    name: string;
    mimeType: string;
    base64?: string;
    size?: number;
    source?: "local" | "google_drive" | "dropbox" | "onedrive" | "direct_link";
    extractedText?: string;
    category?: string;
  };
  attachedFiles?: Array<{
    name: string;
    mimeType: string;
    base64?: string;
    size?: number;
    source?: "local" | "google_drive" | "dropbox" | "onedrive" | "direct_link";
    extractedText?: string;
    category?: string;
  }>;
  analysisType?: "perfil" | "processo";
}

export interface LegalRules {
  country: CountryCode;
  visa_type: string;
  legal_basis: string[];
  requirements: string[];
  risk_factors: string[];
  approval_factors: string[];
  rejection_reasons: string[];
}

export interface EvaluationResult {
  data: ApplicantData;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  decision: "FORTE_APROVACAO" | "APROVAVEL" | "ALTO_RISCO" | "RECUSADO";
  legalAnalysis: {
    passed: boolean;
    issues: string[];
    baseRules: string[];
  };
  fraudFlags: string[];
  aiOpinion: string;
  confidence: number;
  reasons: string[];
  suggestedActions: string[];
}

export interface CaseHistoryEntry {
  id: string;
  createdAt: string;
  applicantName: string;
  country: CountryCode;
  decision: "FORTE_APROVACAO" | "APROVAVEL" | "ALTO_RISCO" | "RECUSADO";
  riskScore: number;
  result: EvaluationResult;
}
