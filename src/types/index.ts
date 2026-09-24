export type UserRole = 'ADMIN' | 'OFFICER' | 'CITIZEN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  district: string;
  state: string;
  avatarUrl?: string;
  isActive: boolean;
  isDemo: boolean;
  createdAt: string;
}

export type DocumentStatus =
  | 'QUEUED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'NEEDS_REVIEW'
  | 'VERIFIED'
  | 'CORRECTION_REQUESTED'
  | 'REJECTED';

export type DocumentType =
  | 'RECORD_OF_RIGHTS'
  | 'MUTATION_REGISTER'
  | 'SALE_DEED'
  | 'SURVEY_PARCEL_MAP'
  | 'INHERITANCE_DEED';

export type QualityAssessment = 'GOOD' | 'MODERATE' | 'POOR';

export interface BoundingBox {
  x: number;      // percentage 0 - 100
  y: number;      // percentage 0 - 100
  width: number;  // percentage
  height: number; // percentage
  label: string;
}

export interface ExtractedField {
  id: string;
  documentId: string;
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  normalizedValue: string;
  unit?: string;
  confidence: number; // 0 - 100
  sourcePage: number;
  cropBox: BoundingBox;
  reviewStatus: 'ORIGINAL' | 'CORRECTED' | 'FLAGGED';
  officerCorrection?: {
    correctedBy: string;
    correctedAt: string;
    oldValue: string;
    newValue: string;
    reason: string;
  };
}

export interface OcrReaderDetail {
  readerName: string;
  engine: string;
  status: 'SUCCESS' | 'WARNING' | 'FALLBACK';
  confidence: number;
  sampleSnippet: string;
}

export interface OcrResult {
  readerAgreement: number; // e.g. 92%
  textConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  disagreementLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  disagreementNotes?: string;
  readersExecuted: OcrReaderDetail[];
  rawExtractedText: string;
  linesDetected: number;
}

export type ValidationStatus = 'PASS' | 'REVIEW' | 'HOLD';

export interface ValidationRuleResult {
  id: string;
  ruleId: string;
  ruleName: string;
  status: ValidationStatus;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reasonCode: string;
  explanation: string;
  evidence: string;
  sourceDocument: string;
  recommendedAction: string;
  metricDetails?: {
    parentArea?: number;
    childrenAreaSum?: number;
    difference?: number;
    expectedOwner?: string;
    currentOwner?: string;
    registrationDate?: string;
    mutationDate?: string;
    heirSharesSum?: number;
    unit?: string;
  };
}

export interface TrustScore {
  overallScore: number; // 0 - 100
  routing: 'CLEAR' | 'REVIEW' | 'HOLD';
  readerAgreementScore: number;
  documentQualityScore: number;
  ruleConsistencyScore: number;
  historicalLineageScore: number;
  rationale: string;
}

export interface LandDocument {
  id: string;
  ownerUserId: string;
  ownerName: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  fileUrl: string;
  uploadDate: string;
  status: DocumentStatus;
  processingStage: number; // 1 to 9
  processingProgress: number; // 0 to 100
  documentType: DocumentType;
  isDemo: boolean;
  demoScenario?: 'SCENARIO_A_CLEAR' | 'SCENARIO_B_HOLD' | 'SCENARIO_C_REVIEW';
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  originalScanUrl: string;
  preprocessedScanUrl: string;
  qualityScore: number;
  qualityAssessment: QualityAssessment;
  detectedFeatures: {
    table: boolean;
    text: boolean;
    stamp: boolean;
    handwriting: boolean;
    deskewAngle: number;
    contrastBoost: string;
  };
  ocrResult: OcrResult;
  extractedFields: ExtractedField[];
  validationRules: ValidationRuleResult[];
  trustScore: TrustScore;
  officerDecision?: {
    decision: 'APPROVED' | 'CORRECTION_REQUESTED' | 'REJECTED';
    officerId: string;
    officerName: string;
    timestamp: string;
    comments: string;
  };
}

export interface Parcel {
  id: string;
  ulpin: string;
  surveyNumber: string;
  subDivision?: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  currentOwner: string;
  currentArea: number;
  unit: string;
  classification: string;
}

export interface ParcelLineageEvent {
  id: string;
  parcelId: string;
  year: number;
  date: string;
  eventType: 'ORIGINAL_SURVEY' | 'SALE_TRANSFER' | 'SUBDIVISION' | 'MUTATION' | 'CURRENT_RECORD';
  title: string;
  primaryParty: string;
  secondaryParty?: string;
  areaBefore: number;
  areaAfter: number;
  unit: string;
  documentRef: string;
  notes: string;
  isViolation?: boolean;
  subParcels?: {
    surveyNumber: string;
    area: number;
    owner: string;
    ulpin?: string;
  }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  documentId?: string;
  documentNumber?: string;
  action: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  previousHash: string;
  hash: string;
  integrityStatus: 'VERIFIED' | 'TAMPERED';
}

export interface SystemThresholds {
  clearScoreMin: number;
  reviewScoreMin: number;
  holdScoreMax: number;
  enforceAreaConservationStrict: boolean;
  requireBiometricOfficerApproval: boolean;
}
