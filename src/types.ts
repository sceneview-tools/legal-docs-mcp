/**
 * Common types for legal document generation.
 */

export interface CompanyInfo {
  name: string;
  legalForm?: string; // e.g. "SAS", "SARL", "Auto-entrepreneur", "EURL"
  address: string;
  siret?: string;
  siren?: string;
  rcs?: string; // RCS city
  capital?: string; // e.g. "10 000 EUR"
  vatNumber?: string; // e.g. "FR12345678901"
  email: string;
  phone?: string;
  website?: string;
  representative?: string; // legal representative name
  representativeTitle?: string; // e.g. "President", "Gerant"
}

export interface ClientInfo {
  name: string;
  address?: string;
  siret?: string;
  email?: string;
  representative?: string;
}

export type Language = "fr" | "en";

export interface CGVParams {
  company: CompanyInfo;
  activityDescription: string;
  paymentTerms?: string; // e.g. "30 jours fin de mois"
  latePenaltyRate?: number; // percentage, default 3x legal rate
  returnPolicy?: string;
  warrantyTerms?: string;
  jurisdictionCity?: string;
}

export interface CGUParams {
  company: CompanyInfo;
  serviceName: string;
  serviceDescription: string;
  minimumAge?: number; // default 18
  prohibitedUses?: string[];
  moderationPolicy?: string;
  jurisdictionCity?: string;
}

export interface PrivacyPolicyParams {
  company: CompanyInfo;
  language: Language;
  dataCollected: string[];
  dataPurposes: string[];
  dataRetentionDays?: number;
  thirdParties?: string[];
  cookieTypes?: string[];
  dpoEmail?: string; // Data Protection Officer
  hostingProvider?: string;
  hostingCountry?: string;
}

export interface NDAParams {
  language: Language;
  disclosingParty: { name: string; address: string; representative?: string };
  receivingParty: { name: string; address: string; representative?: string };
  purpose: string;
  durationMonths?: number; // default 24
  mutual?: boolean; // default false — unilateral
  jurisdictionCity?: string;
  governingLaw?: string; // default "French" or "France"
}

export interface FreelanceContractParams {
  freelancer: CompanyInfo;
  client: ClientInfo;
  missionDescription: string;
  deliverables?: string[];
  startDate: string; // ISO date
  endDate?: string;
  dailyRate?: number;
  fixedPrice?: number;
  currency?: string; // default "EUR"
  paymentTerms?: string;
  intellectualPropertyTransfer?: boolean; // default true
  nonCompeteMonths?: number;
  jurisdictionCity?: string;
}

export interface MentionsLegalesParams {
  company: CompanyInfo;
  hostingProvider: string;
  hostingAddress: string;
  publicationDirector: string; // Directeur de la publication
  dpoEmail?: string;
}

export interface DevisParams {
  company: CompanyInfo;
  client: ClientInfo;
  quoteNumber: string;
  quoteDate: string; // ISO date
  validityDays?: number; // default 30
  items: DevisItem[];
  currency?: string; // default "EUR"
  vatRate?: number; // percentage, e.g. 20
  vatExempt?: boolean; // auto-entrepreneur TVA franchise
  paymentTerms?: string;
  notes?: string;
}

export interface DevisItem {
  description: string;
  quantity: number;
  unitPrice: number;
  unit?: string; // e.g. "jour", "heure", "forfait"
}

export interface TermsOfServiceParams {
  company: CompanyInfo;
  serviceName: string;
  serviceDescription: string;
  pricingUrl?: string;
  freeTrialDays?: number;
  slaUptime?: string; // e.g. "99.9%"
  dataProcessingLocation?: string;
  jurisdictionCity?: string;
  governingLaw?: string;
}

export interface UsageRecord {
  userId: string;
  month: string; // "YYYY-MM"
  count: number;
}

export const DISCLAIMER_FR =
  "Ce document est un modele generique fourni a titre informatif. Il ne constitue pas un conseil juridique. Consultez un avocat pour l'adapter a votre situation.";

export const DISCLAIMER_EN =
  "This document is a generic template provided for informational purposes only. It does not constitute legal advice. Consult a lawyer to adapt it to your situation.";

export const FREE_TIER_LIMIT = 5;
