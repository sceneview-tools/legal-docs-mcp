/**
 * MCP tool definitions and schemas for legal document generation.
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";

const companySchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" as const, description: "Company or business name" },
    legalForm: { type: "string" as const, description: "Legal form (e.g. SAS, SARL, Auto-entrepreneur, EURL)" },
    address: { type: "string" as const, description: "Registered address" },
    siret: { type: "string" as const, description: "SIRET number (14 digits)" },
    siren: { type: "string" as const, description: "SIREN number (9 digits)" },
    rcs: { type: "string" as const, description: "RCS registration city" },
    capital: { type: "string" as const, description: "Share capital (e.g. '10 000 EUR')" },
    vatNumber: { type: "string" as const, description: "Intra-community VAT number (e.g. FR12345678901)" },
    email: { type: "string" as const, description: "Contact email" },
    phone: { type: "string" as const, description: "Contact phone number" },
    website: { type: "string" as const, description: "Website URL" },
    representative: { type: "string" as const, description: "Legal representative name" },
    representativeTitle: { type: "string" as const, description: "Title (e.g. President, Gerant)" },
  },
  required: ["name", "address", "email"],
};

const clientSchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" as const, description: "Client name or company name" },
    address: { type: "string" as const, description: "Client address" },
    siret: { type: "string" as const, description: "Client SIRET" },
    email: { type: "string" as const, description: "Client email" },
    representative: { type: "string" as const, description: "Client representative name" },
  },
  required: ["name"],
};

const partySchema = {
  type: "object" as const,
  properties: {
    name: { type: "string" as const, description: "Party name" },
    address: { type: "string" as const, description: "Party address" },
    representative: { type: "string" as const, description: "Representative name" },
  },
  required: ["name", "address"],
};

export const TOOLS: Tool[] = [
  {
    name: "generate_cgv",
    description:
      "Generate French CGV (Conditions Generales de Vente / General Terms and Conditions of Sale). Compliant with French Consumer Code and Commercial Code. Includes articles on pricing, payment, returns, warranties, liability, IP, GDPR, and jurisdiction.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        activityDescription: { type: "string", description: "Description of the business activity" },
        paymentTerms: { type: "string", description: "Payment terms (default: '30 jours a compter de la date de facturation')" },
        latePenaltyRate: { type: "number", description: "Late payment penalty rate in % per year (default: 10)" },
        returnPolicy: { type: "string", description: "Custom return/withdrawal policy text" },
        warrantyTerms: { type: "string", description: "Custom warranty terms text" },
        jurisdictionCity: { type: "string", description: "Jurisdiction city for disputes (default: Paris)" },
      },
      required: ["company", "activityDescription"],
    },
  },
  {
    name: "generate_cgu",
    description:
      "Generate French CGU (Conditions Generales d'Utilisation / Terms of Use). Covers access, registration, prohibited uses, moderation, IP, user content, GDPR, cookies, and jurisdiction.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        serviceName: { type: "string", description: "Name of the service or platform" },
        serviceDescription: { type: "string", description: "Description of the service" },
        minimumAge: { type: "number", description: "Minimum age for users (default: 18)" },
        prohibitedUses: {
          type: "array",
          items: { type: "string" },
          description: "List of prohibited uses",
        },
        moderationPolicy: { type: "string", description: "Custom moderation policy text" },
        jurisdictionCity: { type: "string", description: "Jurisdiction city for disputes (default: Paris)" },
      },
      required: ["company", "serviceName", "serviceDescription"],
    },
  },
  {
    name: "generate_privacy_policy",
    description:
      "Generate a GDPR-compliant privacy policy in French or English. Covers data controller, data collected, purposes, third parties, retention, hosting, cookies, user rights (Articles 15-22 GDPR), security.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        language: { type: "string", enum: ["fr", "en"], description: "Language (default: fr)" },
        dataCollected: {
          type: "array",
          items: { type: "string" },
          description: "List of personal data types collected (e.g. 'Nom et prenom', 'Adresse email')",
        },
        dataPurposes: {
          type: "array",
          items: { type: "string" },
          description: "List of purposes for data processing",
        },
        dataRetentionDays: { type: "number", description: "Data retention period in days (default: 365)" },
        thirdParties: { type: "array", items: { type: "string" }, description: "Third parties data may be shared with" },
        cookieTypes: { type: "array", items: { type: "string" }, description: "Types of cookies used" },
        dpoEmail: { type: "string", description: "Data Protection Officer email" },
        hostingProvider: { type: "string", description: "Hosting provider name" },
        hostingCountry: { type: "string", description: "Hosting country (default: France)" },
      },
      required: ["company", "language", "dataCollected", "dataPurposes"],
    },
  },
  {
    name: "generate_nda",
    description:
      "Generate a Non-Disclosure Agreement (NDA) in French or English. Supports unilateral or mutual agreements. Covers confidential information definition, obligations, duration, return, IP, and jurisdiction.",
    inputSchema: {
      type: "object",
      properties: {
        language: { type: "string", enum: ["fr", "en"], description: "Language" },
        disclosingParty: partySchema,
        receivingParty: partySchema,
        purpose: { type: "string", description: "Purpose of the confidential disclosure" },
        durationMonths: { type: "number", description: "Duration in months (default: 24)" },
        mutual: { type: "boolean", description: "Mutual NDA (default: false — unilateral)" },
        jurisdictionCity: { type: "string", description: "Jurisdiction city (default: Paris)" },
        governingLaw: { type: "string", description: "Governing law (default: French)" },
      },
      required: ["language", "disclosingParty", "receivingParty", "purpose"],
    },
  },
  {
    name: "generate_freelance_contract",
    description:
      "Generate a French freelance service contract (contrat de prestation de services). Covers mission, deliverables, pricing (daily rate or fixed), payment, independence clause, IP transfer, confidentiality, optional non-compete, termination, liability.",
    inputSchema: {
      type: "object",
      properties: {
        freelancer: companySchema,
        client: clientSchema,
        missionDescription: { type: "string", description: "Description of the freelance mission" },
        deliverables: { type: "array", items: { type: "string" }, description: "List of expected deliverables" },
        startDate: { type: "string", description: "Mission start date (ISO format YYYY-MM-DD)" },
        endDate: { type: "string", description: "Mission end date (ISO format YYYY-MM-DD)" },
        dailyRate: { type: "number", description: "Daily rate (TJM) in EUR" },
        fixedPrice: { type: "number", description: "Fixed price in EUR (alternative to daily rate)" },
        currency: { type: "string", description: "Currency (default: EUR)" },
        paymentTerms: { type: "string", description: "Payment terms" },
        intellectualPropertyTransfer: { type: "boolean", description: "Transfer IP to client (default: true)" },
        nonCompeteMonths: { type: "number", description: "Non-compete duration in months (0 = none)" },
        jurisdictionCity: { type: "string", description: "Jurisdiction city (default: Paris)" },
      },
      required: ["freelancer", "client", "missionDescription", "startDate"],
    },
  },
  {
    name: "generate_mentions_legales",
    description:
      "Generate French website legal notices (mentions legales) as required by the LCEN (Loi pour la Confiance dans l'Economie Numerique). Covers publisher info, publication director, hosting, IP, GDPR, cookies, liability, links.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        hostingProvider: { type: "string", description: "Hosting provider name (e.g. OVH, AWS, Vercel)" },
        hostingAddress: { type: "string", description: "Hosting provider address" },
        publicationDirector: { type: "string", description: "Directeur de la publication (usually the legal representative)" },
        dpoEmail: { type: "string", description: "Data Protection Officer email" },
      },
      required: ["company", "hostingProvider", "hostingAddress", "publicationDirector"],
    },
  },
  {
    name: "generate_devis",
    description:
      "Generate a professional quote/estimate (devis) compliant with French law. Includes company and client info, itemized pricing, VAT calculation (or art. 293 B exemption for auto-entrepreneurs), payment terms, validity period, and acceptance signature block.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        client: clientSchema,
        quoteNumber: { type: "string", description: "Quote reference number (e.g. DEV-2026-001)" },
        quoteDate: { type: "string", description: "Quote date (ISO format YYYY-MM-DD)" },
        validityDays: { type: "number", description: "Validity period in days (default: 30)" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string", description: "Line item description" },
              quantity: { type: "number", description: "Quantity" },
              unitPrice: { type: "number", description: "Unit price (HT)" },
              unit: { type: "string", description: "Unit (e.g. jour, heure, forfait)" },
            },
            required: ["description", "quantity", "unitPrice"],
          },
          description: "List of quote line items",
        },
        currency: { type: "string", description: "Currency (default: EUR)" },
        vatRate: { type: "number", description: "VAT rate in % (default: 20)" },
        vatExempt: { type: "boolean", description: "VAT exempt under art. 293 B CGI (auto-entrepreneur)" },
        paymentTerms: { type: "string", description: "Payment terms" },
        notes: { type: "string", description: "Additional notes" },
      },
      required: ["company", "client", "quoteNumber", "quoteDate", "items"],
    },
  },
  {
    name: "generate_terms_of_service",
    description:
      "Generate SaaS/API Terms of Service in English. Covers account registration, pricing, acceptable use, IP, user content, data protection (GDPR), SLA, limitation of liability, indemnification, termination, governing law.",
    inputSchema: {
      type: "object",
      properties: {
        company: companySchema,
        serviceName: { type: "string", description: "Name of the SaaS/API service" },
        serviceDescription: { type: "string", description: "Description of the service" },
        pricingUrl: { type: "string", description: "URL to pricing page" },
        freeTrialDays: { type: "number", description: "Free trial duration in days (0 = no trial)" },
        slaUptime: { type: "string", description: "SLA uptime target (e.g. '99.9%')" },
        dataProcessingLocation: { type: "string", description: "Where data is processed (e.g. 'EU')" },
        jurisdictionCity: { type: "string", description: "Jurisdiction city (default: Paris)" },
        governingLaw: { type: "string", description: "Governing law (default: French)" },
      },
      required: ["company", "serviceName", "serviceDescription"],
    },
  },
];
