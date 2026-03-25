import { describe, it, expect } from "vitest";
import { generateCGV } from "../templates/cgv.js";
import { generateCGU } from "../templates/cgu.js";
import { generatePrivacyPolicy } from "../templates/privacy-policy.js";
import { generateNDA } from "../templates/nda.js";
import { generateFreelanceContract } from "../templates/freelance-contract.js";
import { generateMentionsLegales } from "../templates/mentions-legales.js";
import { generateDevis } from "../templates/devis.js";
import { generateTermsOfService } from "../templates/terms-of-service.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

const testCompany = {
  name: "Acme SAS",
  legalForm: "SAS",
  address: "10 rue de la Paix, 75002 Paris",
  siret: "12345678901234",
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

describe("generateCGV", () => {
  it("generates a valid CGV document", () => {
    const result = generateCGV({
      company: testCompany,
      activityDescription: "Vente de logiciels et services numeriques",
    });
    expect(result).toContain("CONDITIONS GENERALES DE VENTE");
    expect(result).toContain("Acme SAS");
    expect(result).toContain("Vente de logiciels et services numeriques");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).toContain("Article 1");
    expect(result).toContain("Article 14");
    expect(result).toContain("12345678901234");
  });

  it("uses custom jurisdiction", () => {
    const result = generateCGV({
      company: testCompany,
      activityDescription: "Test",
      jurisdictionCity: "Lyon",
    });
    expect(result).toContain("Lyon");
  });

  it("includes penalty rate", () => {
    const result = generateCGV({
      company: testCompany,
      activityDescription: "Test",
      latePenaltyRate: 15,
    });
    expect(result).toContain("15%");
  });
});

describe("generateCGU", () => {
  it("generates a valid CGU document", () => {
    const result = generateCGU({
      company: testCompany,
      serviceName: "AcmeApp",
      serviceDescription: "Application SaaS de gestion",
    });
    expect(result).toContain("CONDITIONS GENERALES D'UTILISATION");
    expect(result).toContain("AcmeApp");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).toContain("18 ans");
  });

  it("uses custom minimum age", () => {
    const result = generateCGU({
      company: testCompany,
      serviceName: "App",
      serviceDescription: "Test",
      minimumAge: 16,
    });
    expect(result).toContain("16 ans");
  });

  it("includes custom prohibited uses", () => {
    const result = generateCGU({
      company: testCompany,
      serviceName: "App",
      serviceDescription: "Test",
      prohibitedUses: ["Minage de cryptomonnaie", "Scraping automatise"],
    });
    expect(result).toContain("Minage de cryptomonnaie");
    expect(result).toContain("Scraping automatise");
  });
});

describe("generatePrivacyPolicy", () => {
  it("generates French privacy policy", () => {
    const result = generatePrivacyPolicy({
      company: testCompany,
      language: "fr",
      dataCollected: ["Nom", "Email", "Adresse IP"],
      dataPurposes: ["Gestion du compte", "Communication"],
    });
    expect(result).toContain("POLITIQUE DE CONFIDENTIALITE");
    expect(result).toContain("Nom");
    expect(result).toContain("RGPD");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates English privacy policy", () => {
    const result = generatePrivacyPolicy({
      company: testCompany,
      language: "en",
      dataCollected: ["Name", "Email"],
      dataPurposes: ["Account management"],
    });
    expect(result).toContain("PRIVACY POLICY");
    expect(result).toContain("GDPR");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes third parties when provided", () => {
    const result = generatePrivacyPolicy({
      company: testCompany,
      language: "fr",
      dataCollected: ["Email"],
      dataPurposes: ["Communication"],
      thirdParties: ["Stripe (paiement)", "Google Analytics"],
    });
    expect(result).toContain("Stripe (paiement)");
    expect(result).toContain("Google Analytics");
  });

  it("includes cookie types", () => {
    const result = generatePrivacyPolicy({
      company: testCompany,
      language: "fr",
      dataCollected: ["Email"],
      dataPurposes: ["Communication"],
      cookieTypes: ["Cookies techniques", "Cookies analytiques"],
    });
    expect(result).toContain("Cookies techniques");
    expect(result).toContain("Cookies analytiques");
  });
});

describe("generateNDA", () => {
  it("generates French unilateral NDA", () => {
    const result = generateNDA({
      language: "fr",
      disclosingParty: { name: "Acme SAS", address: "Paris" },
      receivingParty: { name: "Startup Inc", address: "Lyon" },
      purpose: "Evaluation d'un partenariat technologique",
    });
    expect(result).toContain("ACCORD DE CONFIDENTIALITE");
    expect(result).toContain("Acme SAS");
    expect(result).toContain("Startup Inc");
    expect(result).toContain(DISCLAIMER_FR);
    expect(result).not.toContain("mutuel");
  });

  it("generates English mutual NDA", () => {
    const result = generateNDA({
      language: "en",
      disclosingParty: { name: "Acme", address: "Paris" },
      receivingParty: { name: "Partner", address: "London" },
      purpose: "Technology partnership evaluation",
      mutual: true,
    });
    expect(result).toContain("NON-DISCLOSURE AGREEMENT");
    expect(result).toContain("Mutual NDA");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("respects custom duration", () => {
    const result = generateNDA({
      language: "fr",
      disclosingParty: { name: "A", address: "Paris" },
      receivingParty: { name: "B", address: "Lyon" },
      purpose: "Test",
      durationMonths: 36,
    });
    expect(result).toContain("36 mois");
  });
});

describe("generateFreelanceContract", () => {
  it("generates a contract with daily rate", () => {
    const result = generateFreelanceContract({
      freelancer: testCompany,
      client: testClient,
      missionDescription: "Developpement d'une application mobile",
      startDate: "2026-04-01",
      endDate: "2026-06-30",
      dailyRate: 600,
    });
    expect(result).toContain("CONTRAT DE PRESTATION");
    expect(result).toContain("600");
    expect(result).toContain("2026-04-01");
    expect(result).toContain("Acme SAS");
    expect(result).toContain("Client SARL");
    expect(result).toContain(DISCLAIMER_FR);
  });

  it("generates a contract with fixed price", () => {
    const result = generateFreelanceContract({
      freelancer: testCompany,
      client: testClient,
      missionDescription: "Creation site web",
      startDate: "2026-04-01",
      fixedPrice: 5000,
    });
    expect(result).toContain("forfait");
  });

  it("includes deliverables", () => {
    const result = generateFreelanceContract({
      freelancer: testCompany,
      client: testClient,
      missionDescription: "Test",
      startDate: "2026-04-01",
      deliverables: ["Application mobile", "Documentation technique"],
    });
    expect(result).toContain("Application mobile");
    expect(result).toContain("Documentation technique");
  });

  it("includes non-compete clause", () => {
    const result = generateFreelanceContract({
      freelancer: testCompany,
      client: testClient,
      missionDescription: "Test",
      startDate: "2026-04-01",
      nonCompeteMonths: 6,
    });
    expect(result).toContain("Non-concurrence");
    expect(result).toContain("6 mois");
  });
});

describe("generateMentionsLegales", () => {
  it("generates valid mentions legales", () => {
    const result = generateMentionsLegales({
      company: testCompany,
      hostingProvider: "OVH",
      hostingAddress: "2 rue Kellermann, 59100 Roubaix",
      publicationDirector: "Jean Dupont",
    });
    expect(result).toContain("MENTIONS LEGALES");
    expect(result).toContain("OVH");
    expect(result).toContain("2 rue Kellermann");
    expect(result).toContain("Jean Dupont");
    expect(result).toContain("CNIL");
    expect(result).toContain(DISCLAIMER_FR);
  });
});

describe("generateDevis", () => {
  it("generates a valid devis with VAT", () => {
    const result = generateDevis({
      company: testCompany,
      client: testClient,
      quoteNumber: "DEV-2026-001",
      quoteDate: "2026-03-25",
      items: [
        { description: "Developpement frontend", quantity: 10, unitPrice: 600, unit: "jour" },
        { description: "Design UI/UX", quantity: 5, unitPrice: 500, unit: "jour" },
      ],
    });
    expect(result).toContain("DEVIS");
    expect(result).toContain("DEV-2026-001");
    expect(result).toContain("Developpement frontend");
    expect(result).toContain("Design UI/UX");
    expect(result).toContain("Total HT");
    expect(result).toContain("Total TTC");
    expect(result).toContain(DISCLAIMER_FR);
    // HT = 10*600 + 5*500 = 8500
    expect(result).toContain("8");
  });

  it("generates VAT-exempt devis", () => {
    const companyNoVat = { ...testCompany, vatNumber: undefined };
    const result = generateDevis({
      company: companyNoVat,
      client: testClient,
      quoteNumber: "DEV-2026-002",
      quoteDate: "2026-03-25",
      items: [{ description: "Conseil", quantity: 1, unitPrice: 1000 }],
      vatExempt: true,
    });
    expect(result).toContain("293 B");
  });

  it("includes validity period", () => {
    const result = generateDevis({
      company: testCompany,
      client: testClient,
      quoteNumber: "DEV-001",
      quoteDate: "2026-03-25",
      items: [{ description: "Test", quantity: 1, unitPrice: 100 }],
      validityDays: 60,
    });
    expect(result).toContain("60 jours");
  });
});

describe("generateTermsOfService", () => {
  it("generates valid Terms of Service", () => {
    const result = generateTermsOfService({
      company: testCompany,
      serviceName: "AcmeAPI",
      serviceDescription: "REST API for data processing",
    });
    expect(result).toContain("TERMS OF SERVICE");
    expect(result).toContain("AcmeAPI");
    expect(result).toContain("REST API for data processing");
    expect(result).toContain("GDPR");
    expect(result).toContain(DISCLAIMER_EN);
  });

  it("includes free trial section", () => {
    const result = generateTermsOfService({
      company: testCompany,
      serviceName: "App",
      serviceDescription: "Test",
      freeTrialDays: 14,
    });
    expect(result).toContain("Free Trial");
    expect(result).toContain("14 days");
  });

  it("includes SLA", () => {
    const result = generateTermsOfService({
      company: testCompany,
      serviceName: "App",
      serviceDescription: "Test",
      slaUptime: "99.9%",
    });
    expect(result).toContain("99.9%");
  });
});

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
    ];
    for (const doc of docs) {
      expect(doc).toContain(DISCLAIMER_EN);
    }
  });
});
