import { describe, it, expect } from "vitest";
import { generateCGV } from "../templates/cgv.js";
import { generateCGU } from "../templates/cgu.js";
import { generatePrivacyPolicy } from "../templates/privacy-policy.js";
import { generateNDA } from "../templates/nda.js";
import { generateFreelanceContract } from "../templates/freelance-contract.js";
import { generateMentionsLegales } from "../templates/mentions-legales.js";
import { generateDevis } from "../templates/devis.js";
import { generateTermsOfService } from "../templates/terms-of-service.js";
import { generateRGPDPolicy } from "../templates/rgpd-policy.js";
import { generateCessionContrat } from "../templates/cession-contrat.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

const testCompany = {
  name: "Acme SAS",
  legalForm: "SAS",
  address: "10 rue de la Paix, 75002 Paris",
  siret: "12345678901234",
  siren: "123456789",
  rcs: "Paris",
  capital: "10 000 EUR",
  vatNumber: "FR12345678901",
  email: "contact@acme.fr",
  phone: "+33 1 23 45 67 89",
  website: "https://acme.fr",
  representative: "Jean Dupont",
  representativeTitle: "President",
};

const testClient = {
  name: "Client SARL",
  address: "5 avenue des Champs-Elysees, 75008 Paris",
  siret: "98765432109876",
  email: "contact@client.fr",
  representative: "Marie Martin",
};

// ==========================================================================
// CGV
// ==========================================================================

describe("generateCGV", () => {
  it("generates a valid CGV document", () => {
    const result = generateCGV({ company: testCompany, activityDescription: "Vente de logiciels et services numeriques" });
    expect(result).toContain("CONDITIONS GENERALES DE VENTE");
    expect(result).toContain("Acme SAS");
    expect(result).toContain("Vente de logiciels et services numeriques");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).toContain("Article 1");
    expect(result).toContain("Article 14");
    expect(result).toContain("12345678901234");
  });

  it("uses custom jurisdiction", () => {
    const result = generateCGV({ company: testCompany, activityDescription: "Test", jurisdictionCity: "Lyon" });
    expect(result).toContain("Lyon");
  });

  it("includes penalty rate", () => {
    const result = generateCGV({ company: testCompany, activityDescription: "Test", latePenaltyRate: 15 });
    expect(result).toContain("15%");
  });

  it("includes custom return policy", () => {
    const result = generateCGV({ company: testCompany, activityDescription: "Test", returnPolicy: "Pas de retour possible." });
    expect(result).toContain("Pas de retour possible");
  });

  it("shows art 293 B when no VAT number", () => {
    const noVat = { ...testCompany, vatNumber: undefined };
    const result = generateCGV({ company: noVat, activityDescription: "Test" });
    expect(result).toContain("293 B");
  });
});

// ==========================================================================
// CGU
// ==========================================================================

describe("generateCGU", () => {
  it("generates a valid CGU document", () => {
    const result = generateCGU({ company: testCompany, serviceName: "AcmeApp", serviceDescription: "Application SaaS de gestion" });
    expect(result).toContain("CONDITIONS GENERALES D'UTILISATION");
    expect(result).toContain("AcmeApp");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).toContain("18 ans");
  });

  it("uses custom minimum age", () => {
    const result = generateCGU({ company: testCompany, serviceName: "App", serviceDescription: "Test", minimumAge: 16 });
    expect(result).toContain("16 ans");
  });

  it("includes custom prohibited uses", () => {
    const result = generateCGU({ company: testCompany, serviceName: "App", serviceDescription: "Test", prohibitedUses: ["Minage de cryptomonnaie", "Scraping automatise"] });
    expect(result).toContain("Minage de cryptomonnaie");
    expect(result).toContain("Scraping automatise");
  });
});

// ==========================================================================
// Privacy Policy
// ==========================================================================

describe("generatePrivacyPolicy", () => {
  it("generates French privacy policy", () => {
    const result = generatePrivacyPolicy({ company: testCompany, language: "fr", dataCollected: ["Nom", "Email", "Adresse IP"], dataPurposes: ["Gestion du compte", "Communication"] });
    expect(result).toContain("POLITIQUE DE CONFIDENTIALITE");
    expect(result).toContain("RGPD");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates English privacy policy", () => {
    const result = generatePrivacyPolicy({ company: testCompany, language: "en", dataCollected: ["Name", "Email"], dataPurposes: ["Account management"] });
    expect(result).toContain("PRIVACY POLICY");
    expect(result).toContain("GDPR");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes third parties when provided", () => {
    const result = generatePrivacyPolicy({ company: testCompany, language: "fr", dataCollected: ["Email"], dataPurposes: ["Communication"], thirdParties: ["Stripe (paiement)", "Google Analytics"] });
    expect(result).toContain("Stripe (paiement)");
  });

  it("includes cookie types", () => {
    const result = generatePrivacyPolicy({ company: testCompany, language: "fr", dataCollected: ["Email"], dataPurposes: ["Communication"], cookieTypes: ["Cookies techniques"] });
    expect(result).toContain("Cookies techniques");
  });

  it("handles non-EU hosting", () => {
    const result = generatePrivacyPolicy({ company: testCompany, language: "fr", dataCollected: ["Email"], dataPurposes: ["Test"], hostingCountry: "USA" });
    expect(result).toContain("transfert hors UE");
  });
});

// ==========================================================================
// NDA
// ==========================================================================

describe("generateNDA", () => {
  it("generates French unilateral NDA", () => {
    const result = generateNDA({ language: "fr", disclosingParty: { name: "Acme SAS", address: "Paris" }, receivingParty: { name: "Startup Inc", address: "Lyon" }, purpose: "Evaluation d'un partenariat" });
    expect(result).toContain("ACCORD DE CONFIDENTIALITE");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).not.toContain("mutuel");
  });

  it("generates English mutual NDA", () => {
    const result = generateNDA({ language: "en", disclosingParty: { name: "Acme", address: "Paris" }, receivingParty: { name: "Partner", address: "London" }, purpose: "Partnership", mutual: true });
    expect(result).toContain("Mutual NDA");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("respects custom duration", () => {
    const result = generateNDA({ language: "fr", disclosingParty: { name: "A", address: "P" }, receivingParty: { name: "B", address: "L" }, purpose: "Test", durationMonths: 36 });
    expect(result).toContain("36 mois");
  });

  it("includes representative names", () => {
    const result = generateNDA({ language: "en", disclosingParty: { name: "A", address: "P", representative: "John" }, receivingParty: { name: "B", address: "L", representative: "Jane" }, purpose: "Test" });
    expect(result).toContain("John");
    expect(result).toContain("Jane");
  });
});

// ==========================================================================
// Freelance Contract
// ==========================================================================

describe("generateFreelanceContract", () => {
  it("generates a contract with daily rate", () => {
    const result = generateFreelanceContract({ freelancer: testCompany, client: testClient, missionDescription: "Dev mobile", startDate: "2026-04-01", endDate: "2026-06-30", dailyRate: 600 });
    expect(result).toContain("CONTRAT DE PRESTATION");
    expect(result).toContain("600");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates a contract with fixed price", () => {
    const result = generateFreelanceContract({ freelancer: testCompany, client: testClient, missionDescription: "Site web", startDate: "2026-04-01", fixedPrice: 5000 });
    expect(result).toContain("forfait");
  });

  it("includes deliverables", () => {
    const result = generateFreelanceContract({ freelancer: testCompany, client: testClient, missionDescription: "Test", startDate: "2026-04-01", deliverables: ["App mobile", "Docs"] });
    expect(result).toContain("App mobile");
  });

  it("includes non-compete clause", () => {
    const result = generateFreelanceContract({ freelancer: testCompany, client: testClient, missionDescription: "Test", startDate: "2026-04-01", nonCompeteMonths: 6 });
    expect(result).toContain("Non-concurrence");
    expect(result).toContain("6 mois");
  });
});

// ==========================================================================
// Mentions Legales
// ==========================================================================

describe("generateMentionsLegales", () => {
  it("generates valid mentions legales", () => {
    const result = generateMentionsLegales({ company: testCompany, hostingProvider: "OVH", hostingAddress: "59100 Roubaix", publicationDirector: "Jean Dupont" });
    expect(result).toContain("MENTIONS LEGALES");
    expect(result).toContain("OVH");
    expect(result).toContain("CNIL");
    expect(result).toContain(DISCLAIMER_FR);
  });
});

// ==========================================================================
// Devis
// ==========================================================================

describe("generateDevis", () => {
  it("generates a valid devis with VAT", () => {
    const result = generateDevis({ company: testCompany, client: testClient, quoteNumber: "DEV-2026-001", quoteDate: "2026-03-25", items: [{ description: "Dev frontend", quantity: 10, unitPrice: 600, unit: "jour" }] });
    expect(result).toContain("DEVIS");
    expect(result).toContain("DEV-2026-001");
    expect(result).toContain("Total HT");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates VAT-exempt devis", () => {
    const noVat = { ...testCompany, vatNumber: undefined };
    const result = generateDevis({ company: noVat, client: testClient, quoteNumber: "DEV-002", quoteDate: "2026-03-25", items: [{ description: "Conseil", quantity: 1, unitPrice: 1000 }], vatExempt: true });
    expect(result).toContain("293 B");
  });

  it("includes validity period", () => {
    const result = generateDevis({ company: testCompany, client: testClient, quoteNumber: "DEV-001", quoteDate: "2026-03-25", items: [{ description: "Test", quantity: 1, unitPrice: 100 }], validityDays: 60 });
    expect(result).toContain("60 jours");
  });

  it("handles custom notes", () => {
    const result = generateDevis({ company: testCompany, client: testClient, quoteNumber: "DEV-001", quoteDate: "2026-03-25", items: [{ description: "Test", quantity: 1, unitPrice: 100 }], notes: "Debut sous 2 semaines" });
    expect(result).toContain("Debut sous 2 semaines");
  });
});

// ==========================================================================
// Terms of Service
// ==========================================================================

describe("generateTermsOfService", () => {
  it("generates valid Terms of Service", () => {
    const result = generateTermsOfService({ company: testCompany, serviceName: "AcmeAPI", serviceDescription: "REST API" });
    expect(result).toContain("TERMS OF SERVICE");
    expect(result).toContain("AcmeAPI");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes free trial section", () => {
    const result = generateTermsOfService({ company: testCompany, serviceName: "App", serviceDescription: "Test", freeTrialDays: 14 });
    expect(result).toContain("Free Trial");
    expect(result).toContain("14 days");
  });

  it("includes SLA", () => {
    const result = generateTermsOfService({ company: testCompany, serviceName: "App", serviceDescription: "Test", slaUptime: "99.9%" });
    expect(result).toContain("99.9%");
  });
});

// ==========================================================================
// RGPD Policy (NEW)
// ==========================================================================

describe("generateRGPDPolicy", () => {
  const baseParams = {
    company: testCompany,
    language: "fr" as const,
    dataInventory: [{ category: "Clients", dataTypes: ["Nom", "Email"], legalBasis: "Contrat", retentionDays: 365, recipients: ["Comptabilite"] }],
    processingActivities: ["Gestion client", "Facturation"],
  };

  it("generates complete French RGPD policy", () => {
    const result = generateRGPDPolicy(baseParams);
    expect(result).toContain("POLITIQUE DE CONFORMITE RGPD");
    expect(result).toContain("article 30");
    expect(result).toContain("Articles 15");
    expect(result).toContain("CNIL");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates complete English GDPR policy", () => {
    const result = generateRGPDPolicy({ ...baseParams, language: "en" });
    expect(result).toContain("GDPR COMPLIANCE POLICY");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes DPO information", () => {
    const result = generateRGPDPolicy({ ...baseParams, dpoName: "Alice DPO", dpoEmail: "dpo@acme.fr" });
    expect(result).toContain("Alice DPO");
    expect(result).toContain("dpo@acme.fr");
  });

  it("includes sub-processors", () => {
    const result = generateRGPDPolicy({ ...baseParams, subProcessors: [{ name: "AWS", purpose: "Hebergement", country: "Irlande" }] });
    expect(result).toContain("AWS");
  });

  it("includes international transfers", () => {
    const result = generateRGPDPolicy({ ...baseParams, transfersOutsideEU: true, transferMechanisms: ["CCT"] });
    expect(result).toContain("CCT");
  });

  it("shows no transfers when not applicable", () => {
    const result = generateRGPDPolicy({ ...baseParams, transfersOutsideEU: false });
    expect(result).toContain("Aucun transfert");
  });

  it("includes DPIA section when required", () => {
    const result = generateRGPDPolicy({ ...baseParams, dpiaRequired: true, dpiaTopics: ["Profilage"] });
    expect(result).toContain("Profilage");
    expect(result).toContain("AIPD");
  });

  it("includes cookie policy", () => {
    const result = generateRGPDPolicy({ ...baseParams, cookiePolicy: true, cookieCategories: ["Cookies essentiels"] });
    expect(result).toContain("Cookies essentiels");
  });

  it("includes custom security measures", () => {
    const result = generateRGPDPolicy({ ...baseParams, securityMeasures: ["Chiffrement AES-256"] });
    expect(result).toContain("Chiffrement AES-256");
  });

  it("includes breach procedure", () => {
    const result = generateRGPDPolicy({ ...baseParams, breachProcedure: true });
    expect(result).toContain("72 heures");
  });

  it("includes consent mechanism", () => {
    const result = generateRGPDPolicy({ ...baseParams, consentMechanism: "Double opt-in" });
    expect(result).toContain("Double opt-in");
  });

  it("includes data portability format", () => {
    const result = generateRGPDPolicy({ ...baseParams, dataPortabilityFormat: "JSON et XML" });
    expect(result).toContain("JSON et XML");
  });

  it("handles multiple data inventory categories", () => {
    const result = generateRGPDPolicy({
      ...baseParams,
      dataInventory: [
        { category: "Clients", dataTypes: ["Nom"], legalBasis: "Contrat", retentionDays: 365 },
        { category: "Employes", dataTypes: ["Adresse"], legalBasis: "Obligation legale", retentionDays: 1825 },
      ],
    });
    expect(result).toContain("Clients");
    expect(result).toContain("Employes");
  });
});

// ==========================================================================
// Cession Contrat (NEW)
// ==========================================================================

describe("generateCessionContrat", () => {
  const baseParams = {
    language: "fr" as const,
    seller: testCompany,
    buyer: testClient,
    businessDescription: "Boulangerie artisanale",
    assets: [
      { category: "Materiel", description: "Four professionnel", estimatedValue: 50000 },
      { category: "Clientele", description: "Fonds de clientele", estimatedValue: 100000 },
    ],
    totalPrice: 200000,
    effectiveDate: "2026-06-01",
  };

  it("generates complete French cession contrat", () => {
    const result = generateCessionContrat(baseParams);
    expect(result).toContain("CONTRAT DE CESSION DE FONDS DE COMMERCE");
    expect(result).toContain("Boulangerie artisanale");
    expect(result).toContain("Article L.141-1");
    expect(result).toContain("BODACC");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates English business transfer agreement", () => {
    const result = generateCessionContrat({ ...baseParams, language: "en" });
    expect(result).toContain("BUSINESS TRANSFER AGREEMENT");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes assets table", () => {
    const result = generateCessionContrat(baseParams);
    expect(result).toContain("Materiel");
    expect(result).toContain("Four professionnel");
  });

  it("includes custom payment schedule", () => {
    const result = generateCessionContrat({
      ...baseParams,
      paymentSchedule: [
        { date: "2026-06-01", amount: 100000, description: "Acompte" },
        { date: "2026-09-01", amount: 100000, description: "Solde" },
      ],
    });
    expect(result).toContain("Acompte");
    expect(result).toContain("Solde");
  });

  it("includes employee transfer", () => {
    const result = generateCessionContrat({ ...baseParams, employeeTransfer: true, employeeCount: 5 });
    expect(result).toContain("L.1224-1");
    expect(result).toContain("5 salaries");
  });

  it("includes non-compete with radius", () => {
    const result = generateCessionContrat({ ...baseParams, nonCompeteYears: 5, nonCompeteRadius: "30 km" });
    expect(result).toContain("5 ans");
    expect(result).toContain("30 km");
  });

  it("includes custom warranties", () => {
    const result = generateCessionContrat({ ...baseParams, warranties: ["CA minimum 300k EUR"] });
    expect(result).toContain("CA minimum 300k EUR");
  });

  it("includes custom conditions", () => {
    const result = generateCessionContrat({ ...baseParams, conditions: ["Accord du bailleur"] });
    expect(result).toContain("Accord du bailleur");
  });

  it("uses custom jurisdiction", () => {
    const result = generateCessionContrat({ ...baseParams, jurisdictionCity: "Nantes" });
    expect(result).toContain("Nantes");
  });

  it("handles English with governing law", () => {
    const result = generateCessionContrat({ ...baseParams, language: "en", governingLaw: "English" });
    expect(result).toContain("English law");
  });

  it("includes transition period", () => {
    const result = generateCessionContrat({ ...baseParams, transitionPeriodDays: 180 });
    expect(result).toContain("180 jours");
  });

  it("includes mandatory declarations", () => {
    const result = generateCessionContrat(baseParams);
    expect(result).toContain("Chiffre d'affaires des 3 derniers exercices");
  });

  it("includes annexes list", () => {
    const result = generateCessionContrat(baseParams);
    expect(result).toContain("Annexes");
    expect(result).toContain("Inventaire detaille");
  });
});

// ==========================================================================
// Disclaimer presence (cross-cutting)
// ==========================================================================

describe("disclaimer presence", () => {
  it("all French documents contain the French disclaimer", () => {
    const docs = [
      generateCGV({ company: testCompany, activityDescription: "Test" }),
      generateCGU({ company: testCompany, serviceName: "App", serviceDescription: "Test" }),
      generatePrivacyPolicy({ company: testCompany, language: "fr", dataCollected: ["Email"], dataPurposes: ["Test"] }),
      generateNDA({ language: "fr", disclosingParty: { name: "A", address: "P" }, receivingParty: { name: "B", address: "L" }, purpose: "Test" }),
      generateFreelanceContract({ freelancer: testCompany, client: testClient, missionDescription: "Test", startDate: "2026-01-01" }),
      generateMentionsLegales({ company: testCompany, hostingProvider: "OVH", hostingAddress: "Roubaix", publicationDirector: "Jean" }),
      generateDevis({ company: testCompany, client: testClient, quoteNumber: "D1", quoteDate: "2026-01-01", items: [{ description: "X", quantity: 1, unitPrice: 100 }] }),
      generateRGPDPolicy({ company: testCompany, language: "fr", dataInventory: [{ category: "T", dataTypes: ["E"], legalBasis: "C", retentionDays: 30 }], processingActivities: ["T"] }),
      generateCessionContrat({ language: "fr", seller: testCompany, buyer: testClient, businessDescription: "T", assets: [{ category: "T", description: "T" }], totalPrice: 1000, effectiveDate: "2026-01-01" }),
    ];
    for (const doc of docs) {
      expect(doc).toContain(DISCLAIMER_FR);
    }
  });

  it("all English documents contain the English disclaimer", () => {
    const docs = [
      generatePrivacyPolicy({ company: testCompany, language: "en", dataCollected: ["Email"], dataPurposes: ["Test"] }),
      generateNDA({ language: "en", disclosingParty: { name: "A", address: "P" }, receivingParty: { name: "B", address: "L" }, purpose: "Test" }),
      generateTermsOfService({ company: testCompany, serviceName: "App", serviceDescription: "Test" }),
      generateRGPDPolicy({ company: testCompany, language: "en", dataInventory: [{ category: "T", dataTypes: ["E"], legalBasis: "C", retentionDays: 30 }], processingActivities: ["T"] }),
      generateCessionContrat({ language: "en", seller: testCompany, buyer: testClient, businessDescription: "T", assets: [{ category: "T", description: "T" }], totalPrice: 1000, effectiveDate: "2026-01-01" }),
    ];
    for (const doc of docs) {
      expect(doc).toContain(DISCLAIMER_EN);
    }
  });
});
