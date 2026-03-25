import type { NDAParams } from "../types.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

export function generateNDA(params: NDAParams): string {
  if (params.language === "en") return generateNDAEN(params);
  return generateNDAFR(params);
}

function generateNDAFR(params: NDAParams): string {
  const dur = params.durationMonths ?? 24;
  const mutual = params.mutual ?? false;
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const dp = params.disclosingParty;
  const rp = params.receivingParty;

  const partiesIntro = mutual
    ? `Les deux parties s'engagent mutuellement a proteger les informations confidentielles echangees.`
    : `La Partie Divulgatrice communique des informations confidentielles a la Partie Receptrice, qui s'engage a les proteger.`;

  return `# ACCORD DE CONFIDENTIALITE (NDA)

**${DISCLAIMER_FR}**

---

**Date :** ${new Date().toISOString().split("T")[0]}

## ENTRE LES SOUSSIGNES

**Partie Divulgatrice :**
- Nom : ${dp.name}
- Adresse : ${dp.address}
${dp.representative ? `- Representant : ${dp.representative}` : ""}

**Partie Receptrice :**
- Nom : ${rp.name}
- Adresse : ${rp.address}
${rp.representative ? `- Representant : ${rp.representative}` : ""}

${mutual ? "*(Accord mutuel : chaque partie est a la fois Divulgatrice et Receptrice)*" : ""}

## Article 1 — Objet

Le present accord a pour objet de definir les conditions dans lesquelles des informations confidentielles sont echangees entre les parties dans le cadre de : **${params.purpose}**.

${partiesIntro}

## Article 2 — Definition des informations confidentielles

Sont considerees comme confidentielles toutes les informations, donnees, documents, savoir-faire, methodes, logiciels, plans, strategies, donnees financieres, listes de clients, et tout autre element communique par la Partie Divulgatrice, quel que soit le support (ecrit, oral, electronique, visuel).

Sont exclues les informations qui :
- Sont dans le domaine public au moment de leur divulgation
- Deviennent publiques sans faute de la Partie Receptrice
- Etaient deja en possession de la Partie Receptrice avant la divulgation
- Sont recues d'un tiers autorise a les communiquer
- Sont developpees independamment par la Partie Receptrice

## Article 3 — Obligations de la Partie Receptrice

La Partie Receptrice s'engage a :
- Maintenir la stricte confidentialite des informations recues
- Ne pas divulguer les informations a des tiers sans accord ecrit prealable
- Ne pas utiliser les informations a d'autres fins que celles prevues a l'Article 1
- Limiter l'acces aux informations aux seules personnes ayant un besoin legitime
- Proteger les informations avec le meme degre de soin que ses propres informations confidentielles

## Article 4 — Duree

Le present accord est conclu pour une duree de **${dur} mois** a compter de sa signature.

Les obligations de confidentialite survivent a l'expiration de l'accord pendant une duree supplementaire de 12 mois.

## Article 5 — Restitution

A l'expiration de l'accord ou a la demande de la Partie Divulgatrice, la Partie Receptrice s'engage a restituer ou detruire l'ensemble des informations confidentielles et leurs copies, et a certifier par ecrit cette destruction ou restitution.

## Article 6 — Propriete intellectuelle

La divulgation d'informations confidentielles ne confere aucun droit de propriete intellectuelle a la Partie Receptrice. Tous les droits restent la propriete de la Partie Divulgatrice.

## Article 7 — Sanctions

Toute violation du present accord pourra donner lieu a des dommages et interets en reparation du prejudice subi, sans prejudice de toute autre action legale.

## Article 8 — Droit applicable et competence

Le present accord est regi par le droit francais. En cas de litige, les parties s'efforceront de trouver une solution amiable. A defaut, les tribunaux de ${jurisdiction} seront seuls competents.

---

**Signatures :**

Pour la Partie Divulgatrice :

Nom : ${dp.representative ?? dp.name}
Date : ________________
Signature : ________________

Pour la Partie Receptrice :

Nom : ${rp.representative ?? rp.name}
Date : ________________
Signature : ________________

---

**${DISCLAIMER_FR}**
`;
}

function generateNDAEN(params: NDAParams): string {
  const dur = params.durationMonths ?? 24;
  const mutual = params.mutual ?? false;
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const law = params.governingLaw ?? "French";
  const dp = params.disclosingParty;
  const rp = params.receivingParty;

  return `# NON-DISCLOSURE AGREEMENT (NDA)

**${DISCLAIMER_EN}**

---

**Date:** ${new Date().toISOString().split("T")[0]}

## BETWEEN

**Disclosing Party:**
- Name: ${dp.name}
- Address: ${dp.address}
${dp.representative ? `- Representative: ${dp.representative}` : ""}

**Receiving Party:**
- Name: ${rp.name}
- Address: ${rp.address}
${rp.representative ? `- Representative: ${rp.representative}` : ""}

${mutual ? "*(Mutual NDA: each party is both Disclosing and Receiving Party)*" : ""}

## 1. Purpose

This Agreement is entered into for the purpose of: **${params.purpose}**.

${mutual ? "Both parties mutually agree to protect confidential information exchanged between them." : "The Disclosing Party will share confidential information with the Receiving Party, who agrees to protect it."}

## 2. Definition of Confidential Information

"Confidential Information" means all information, data, documents, know-how, methods, software, plans, strategies, financial data, client lists, and any other material disclosed by the Disclosing Party, regardless of format (written, oral, electronic, visual).

Exclusions:
- Information in the public domain at the time of disclosure
- Information that becomes public through no fault of the Receiving Party
- Information already in the Receiving Party's possession prior to disclosure
- Information received from an authorized third party
- Information independently developed by the Receiving Party

## 3. Obligations

The Receiving Party agrees to:
- Maintain strict confidentiality of the received information
- Not disclose information to third parties without prior written consent
- Not use information for purposes other than those stated in Section 1
- Restrict access to persons with a legitimate need to know
- Protect information with the same degree of care as its own confidential information

## 4. Duration

This Agreement is effective for **${dur} months** from the date of signature.

Confidentiality obligations survive termination for an additional 12 months.

## 5. Return of Information

Upon expiration or at the Disclosing Party's request, the Receiving Party shall return or destroy all confidential information and copies, and certify such destruction or return in writing.

## 6. Intellectual Property

Disclosure of confidential information does not transfer any intellectual property rights to the Receiving Party. All rights remain with the Disclosing Party.

## 7. Remedies

Any breach of this Agreement may result in damages and any other legal remedies available.

## 8. Governing Law

This Agreement is governed by ${law} law. In case of dispute, the parties shall seek an amicable resolution. Failing that, the courts of ${jurisdiction} shall have exclusive jurisdiction.

---

**Signatures:**

For the Disclosing Party:

Name: ${dp.representative ?? dp.name}
Date: ________________
Signature: ________________

For the Receiving Party:

Name: ${rp.representative ?? rp.name}
Date: ________________
Signature: ________________

---

**${DISCLAIMER_EN}**
`;
}
