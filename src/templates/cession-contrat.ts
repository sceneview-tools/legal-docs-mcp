import type { CompanyInfo, ClientInfo } from "../types.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

export interface CessionContratParams {
  language: "fr" | "en";
  seller: CompanyInfo;
  buyer: ClientInfo;
  businessDescription: string;
  assets: Array<{
    category: string;
    description: string;
    estimatedValue?: number;
  }>;
  totalPrice: number;
  currency?: string;
  paymentSchedule?: Array<{
    date: string;
    amount: number;
    description: string;
  }>;
  effectiveDate: string;
  transitionPeriodDays?: number;
  employeeTransfer?: boolean;
  employeeCount?: number;
  nonCompeteYears?: number;
  nonCompeteRadius?: string;
  warranties?: string[];
  conditions?: string[];
  jurisdictionCity?: string;
  governingLaw?: string;
}

export function generateCessionContrat(params: CessionContratParams): string {
  if (params.language === "en") return generateCessionContratEN(params);
  return generateCessionContratFR(params);
}

function generateCessionContratFR(params: CessionContratParams): string {
  const s = params.seller;
  const b = params.buyer;
  const currency = params.currency ?? "EUR";
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const date = new Date().toISOString().split("T")[0];
  const transitionDays = params.transitionPeriodDays ?? 90;
  const nonCompeteYears = params.nonCompeteYears ?? 3;

  const assetsTable = params.assets
    .map(
      (a) =>
        `| ${a.category} | ${a.description} | ${a.estimatedValue ? `${a.estimatedValue.toLocaleString("fr-FR")} ${currency}` : "Inclus dans le prix global"} |`
    )
    .join("\n");

  const paymentSection = params.paymentSchedule && params.paymentSchedule.length > 0
    ? params.paymentSchedule
        .map(
          (p) =>
            `| ${p.date} | ${p.amount.toLocaleString("fr-FR")} ${currency} | ${p.description} |`
        )
        .join("\n")
    : `| ${params.effectiveDate} | ${params.totalPrice.toLocaleString("fr-FR")} ${currency} | Paiement integral a la signature |`;

  const warranties = params.warranties ?? [
    "Le cedant garantit etre le proprietaire exclusif du fonds de commerce",
    "Le cedant garantit l'absence de litige en cours relatif au fonds",
    "Le cedant garantit l'exactitude des informations financieres communiquees",
    "Le cedant garantit la regularite des contrats de travail des employes transferes",
    "Le cedant garantit la conformite du fonds aux normes en vigueur",
  ];

  const conditions = params.conditions ?? [
    "Obtention des autorisations administratives necessaires",
    "Obtention du financement par le cessionnaire",
    "Absence de changement significatif defavorable avant la date de cession",
  ];

  return `# CONTRAT DE CESSION DE FONDS DE COMMERCE

**${DISCLAIMER_FR}**

---

**Date du contrat :** ${date}

## ENTRE LES SOUSSIGNES

### Le Cedant

- **Raison sociale :** ${s.name}
${s.legalForm ? `- **Forme juridique :** ${s.legalForm}` : ""}
- **Siege social :** ${s.address}
${s.siret ? `- **SIRET :** ${s.siret}` : ""}
${s.siren ? `- **SIREN :** ${s.siren}` : ""}
${s.rcs ? `- **RCS :** ${s.rcs}` : ""}
${s.capital ? `- **Capital social :** ${s.capital}` : ""}
- **Email :** ${s.email}
${s.representative ? `- **Representant legal :** ${s.representative} (${s.representativeTitle ?? "Gerant"})` : ""}

### Le Cessionnaire

- **Nom / Raison sociale :** ${b.name}
${b.address ? `- **Adresse :** ${b.address}` : ""}
${b.siret ? `- **SIRET :** ${b.siret}` : ""}
${b.email ? `- **Email :** ${b.email}` : ""}
${b.representative ? `- **Representant :** ${b.representative}` : ""}

---

## Article 1 — Objet de la cession

Le Cedant cede au Cessionnaire, qui accepte, le fonds de commerce exploite sous l'enseigne **${s.name}**, sis a l'adresse suivante : ${s.address}.

**Description de l'activite :** ${params.businessDescription}

La presente cession est realisee conformement aux articles L.141-1 et suivants du Code de commerce.

## Article 2 — Elements cedes

La cession porte sur les elements suivants du fonds de commerce :

| Categorie | Description | Valeur estimee |
|---|---|---|
${assetsTable}

### Elements corporels inclus

- Materiel, outillage et equipements professionnels
- Mobilier commercial
- Stocks de marchandises (inventaire contradictoire a la date de cession)

### Elements incorporels inclus

- Enseigne et nom commercial
- Clientele et achalandage
- Droit au bail
- Licences et autorisations d'exploitation
- Droits de propriete intellectuelle lies a l'activite
- Contrats en cours (bail, fournisseurs, clients)

## Article 3 — Prix de cession

Le prix de cession du fonds de commerce est fixe a **${params.totalPrice.toLocaleString("fr-FR")} ${currency}** (${currency === "EUR" ? "euros" : currency}).

### Echeancier de paiement

| Date | Montant | Description |
|---|---|---|
${paymentSection}

Le paiement sera effectue par virement bancaire sur le compte sequestre du cedant, conformement a l'article L.141-12 du Code de commerce.

## Article 4 — Declarations obligatoires (Article L.141-1 Code de commerce)

Le Cedant declare :

- **Chiffre d'affaires des 3 derniers exercices** : A communiquer dans l'annexe financiere
- **Resultats d'exploitation des 3 derniers exercices** : A communiquer dans l'annexe financiere
- **Etat des privileges et nantissements** : Neant (ou a preciser)
- **Conditions du bail** : A annexer
- **Nom et adresse du bailleur** : A preciser

Le defaut de l'une de ces mentions peut entrainer la nullite de la cession (Article L.141-1 Code de commerce).

## Article 5 — Date d'effet et prise de possession

La cession prend effet le **${params.effectiveDate}**.

A compter de cette date, le Cessionnaire sera subroge dans les droits et obligations du Cedant relatifs au fonds de commerce.

## Article 6 — Periode de transition

Le Cedant s'engage a assister le Cessionnaire pendant une periode de **${transitionDays} jours** a compter de la date d'effet, pour :

- Presenter la clientele et les partenaires commerciaux
- Transmettre les savoir-faire lies a l'exploitation
- Assurer la continuite des contrats en cours
- Former le Cessionnaire aux processus operationnels

${
  params.employeeTransfer
    ? `## Article 7 — Transfert des contrats de travail

Conformement a l'article L.1224-1 du Code du travail, les contrats de travail des **${params.employeeCount ?? "tous les"} salaries** attaches au fonds de commerce sont automatiquement transferes au Cessionnaire.

Le Cessionnaire s'engage a :
- Maintenir l'ensemble des contrats de travail en cours
- Reprendre l'anciennete acquise par les salaries
- Respecter les conventions collectives applicables
- Informer les representants du personnel conformement a la loi`
    : ""
}

## Article ${params.employeeTransfer ? "8" : "7"} — Clause de non-concurrence

Le Cedant s'interdit, pendant une duree de **${nonCompeteYears} ans** a compter de la date d'effet de la cession${params.nonCompeteRadius ? `, dans un rayon de **${params.nonCompeteRadius}** autour du lieu d'exploitation` : ""} :

- D'exploiter un fonds de commerce similaire
- De travailler, directement ou indirectement, dans une activite concurrente
- De solliciter la clientele cedeee

En cas de violation, le Cedant sera redevable d'une indemnite egale a 30% du prix de cession, sans prejudice de dommages et interets complementaires.

## Article ${params.employeeTransfer ? "9" : "8"} — Garanties du Cedant

Le Cedant garantit au Cessionnaire :

${warranties.map((w) => `- ${w}`).join("\n")}

La garantie est valable pendant une duree de **24 mois** a compter de la date d'effet.

## Article ${params.employeeTransfer ? "10" : "9"} — Conditions suspensives

La presente cession est soumise aux conditions suspensives suivantes :

${conditions.map((c) => `- ${c}`).join("\n")}

Si l'une des conditions n'est pas realisee dans un delai de 60 jours a compter de la signature, le present contrat sera caduc de plein droit, et les sommes versees seront restituees.

## Article ${params.employeeTransfer ? "11" : "10"} — Formalites

Le Cessionnaire prend a sa charge les formalites suivantes :

- Publication de l'avis de cession dans un journal d'annonces legales
- Publication au BODACC (Bulletin officiel des annonces civiles et commerciales)
- Enregistrement aupres du service des impots (droits d'enregistrement)
- Inscription modificative au RCS
- Notification au bailleur

## Article ${params.employeeTransfer ? "12" : "11"} — Opposition des creanciers

Conformement a l'article L.141-12 du Code de commerce, les creanciers du Cedant disposent d'un delai de **10 jours** a compter de la publication au BODACC pour faire opposition sur le prix de cession.

Le prix de cession sera consigne en sequestre pendant ce delai d'opposition.

## Article ${params.employeeTransfer ? "13" : "12"} — Droit applicable et litiges

Le present contrat est regi par le droit francais. En cas de litige, les parties rechercheront une solution amiable. A defaut, le tribunal de commerce de **${jurisdiction}** sera seul competent.

---

**Signatures :**

Le Cedant :

Nom : ${s.representative ?? s.name}
Date : ________________
Signature : ________________

Le Cessionnaire :

Nom : ${b.representative ?? b.name}
Date : ________________
Signature : ________________

---

**Annexes :**
1. Inventaire detaille du materiel et des stocks
2. Etats financiers des 3 derniers exercices
3. Copie du bail commercial
4. Liste des contrats en cours
${params.employeeTransfer ? "5. Liste des salaries transferes\n6. Conventions collectives applicables" : ""}

---

**${DISCLAIMER_FR}**
`;
}

function generateCessionContratEN(params: CessionContratParams): string {
  const s = params.seller;
  const b = params.buyer;
  const currency = params.currency ?? "EUR";
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const law = params.governingLaw ?? "French";
  const date = new Date().toISOString().split("T")[0];
  const transitionDays = params.transitionPeriodDays ?? 90;
  const nonCompeteYears = params.nonCompeteYears ?? 3;

  const assetsTable = params.assets
    .map(
      (a) =>
        `| ${a.category} | ${a.description} | ${a.estimatedValue ? `${a.estimatedValue.toLocaleString("en-US")} ${currency}` : "Included in total price"} |`
    )
    .join("\n");

  const paymentSection = params.paymentSchedule && params.paymentSchedule.length > 0
    ? params.paymentSchedule
        .map(
          (p) =>
            `| ${p.date} | ${p.amount.toLocaleString("en-US")} ${currency} | ${p.description} |`
        )
        .join("\n")
    : `| ${params.effectiveDate} | ${params.totalPrice.toLocaleString("en-US")} ${currency} | Full payment at signing |`;

  const warranties = params.warranties ?? [
    "The seller warrants exclusive ownership of the business",
    "The seller warrants no pending litigation related to the business",
    "The seller warrants the accuracy of all financial information provided",
    "The seller warrants compliance of the business with applicable regulations",
  ];

  const conditions = params.conditions ?? [
    "Obtaining necessary administrative authorizations",
    "Obtaining financing by the buyer",
    "No material adverse change before the transfer date",
  ];

  return `# BUSINESS TRANSFER AGREEMENT

**${DISCLAIMER_EN}**

---

**Date:** ${date}

## BETWEEN

### The Seller

- **Company:** ${s.name}
${s.legalForm ? `- **Legal form:** ${s.legalForm}` : ""}
- **Registered address:** ${s.address}
${s.siret ? `- **SIRET:** ${s.siret}` : ""}
- **Email:** ${s.email}
${s.representative ? `- **Legal representative:** ${s.representative} (${s.representativeTitle ?? "Manager"})` : ""}

### The Buyer

- **Name / Company:** ${b.name}
${b.address ? `- **Address:** ${b.address}` : ""}
${b.siret ? `- **SIRET:** ${b.siret}` : ""}
${b.email ? `- **Email:** ${b.email}` : ""}
${b.representative ? `- **Representative:** ${b.representative}` : ""}

---

## 1. Subject Matter

The Seller transfers to the Buyer, who accepts, the business operated under the name **${s.name}**, located at: ${s.address}.

**Business description:** ${params.businessDescription}

## 2. Transferred Assets

| Category | Description | Estimated Value |
|---|---|---|
${assetsTable}

### Tangible assets included

- Equipment, tools, and professional machinery
- Commercial furniture
- Inventory (contradictory inventory at transfer date)

### Intangible assets included

- Business name and trade name
- Clientele and goodwill
- Lease rights
- Licenses and operating permits
- Intellectual property rights
- Ongoing contracts (lease, suppliers, clients)

## 3. Transfer Price

The total transfer price is **${params.totalPrice.toLocaleString("en-US")} ${currency}**.

### Payment Schedule

| Date | Amount | Description |
|---|---|---|
${paymentSection}

## 4. Effective Date

The transfer takes effect on **${params.effectiveDate}**.

## 5. Transition Period

The Seller agrees to assist the Buyer for **${transitionDays} days** from the effective date, including:

- Introducing the clientele and business partners
- Transferring operational know-how
- Ensuring continuity of ongoing contracts
- Training the Buyer on operational processes

${
  params.employeeTransfer
    ? `## 6. Employee Transfer

All employment contracts of **${params.employeeCount ?? "all"} employees** attached to the business are automatically transferred to the Buyer in accordance with applicable labor law.

The Buyer agrees to:
- Maintain all ongoing employment contracts
- Honor accrued seniority
- Comply with applicable collective agreements`
    : ""
}

## ${params.employeeTransfer ? "7" : "6"}. Non-Compete Clause

The Seller agrees not to, for a period of **${nonCompeteYears} years** from the effective date${params.nonCompeteRadius ? `, within a radius of **${params.nonCompeteRadius}** from the business location` : ""}:

- Operate a similar business
- Work, directly or indirectly, in a competing activity
- Solicit the transferred clientele

In case of breach, the Seller shall pay an indemnity equal to 30% of the transfer price, without prejudice to additional damages.

## ${params.employeeTransfer ? "8" : "7"}. Seller Warranties

The Seller warrants to the Buyer:

${warranties.map((w) => `- ${w}`).join("\n")}

These warranties are valid for **24 months** from the effective date.

## ${params.employeeTransfer ? "9" : "8"}. Conditions Precedent

This transfer is subject to the following conditions precedent:

${conditions.map((c) => `- ${c}`).join("\n")}

If any condition is not met within 60 days of signing, this agreement shall be void and all sums paid shall be refunded.

## ${params.employeeTransfer ? "10" : "9"}. Governing Law

This agreement is governed by ${law} law. In case of dispute, the parties shall seek an amicable resolution. Failing that, the courts of **${jurisdiction}** shall have exclusive jurisdiction.

---

**Signatures:**

The Seller:

Name: ${s.representative ?? s.name}
Date: ________________
Signature: ________________

The Buyer:

Name: ${b.representative ?? b.name}
Date: ________________
Signature: ________________

---

**Annexes:**
1. Detailed inventory of equipment and stock
2. Financial statements for the last 3 fiscal years
3. Copy of commercial lease
4. List of ongoing contracts
${params.employeeTransfer ? "5. List of transferred employees" : ""}

---

**${DISCLAIMER_EN}**
`;
}
