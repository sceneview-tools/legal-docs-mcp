import type { FreelanceContractParams } from "../types.js";
import { DISCLAIMER_FR } from "../types.js";

export function generateFreelanceContract(params: FreelanceContractParams): string {
  const f = params.freelancer;
  const cl = params.client;
  const currency = params.currency ?? "EUR";
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const paymentTerms = params.paymentTerms ?? "30 jours a compter de la date de facturation";
  const ipTransfer = params.intellectualPropertyTransfer ?? true;

  let priceClause: string;
  if (params.fixedPrice != null) {
    priceClause = `Le prix de la prestation est fixe a **${params.fixedPrice.toLocaleString("fr-FR")} ${currency} HT** (forfait).`;
  } else if (params.dailyRate != null) {
    priceClause = `Le tarif journalier de la prestation est de **${params.dailyRate.toLocaleString("fr-FR")} ${currency} HT/jour**.`;
  } else {
    priceClause = `Le prix de la prestation sera determine d'un commun accord entre les parties.`;
  }

  return `# CONTRAT DE PRESTATION DE SERVICES (FREELANCE)

**${DISCLAIMER_FR}**

---

**Date :** ${new Date().toISOString().split("T")[0]}

## ENTRE LES SOUSSIGNES

**Le Prestataire :**
- Nom / Raison sociale : ${f.name}
${f.legalForm ? `- Forme juridique : ${f.legalForm}` : ""}
- Adresse : ${f.address}
${f.siret ? `- SIRET : ${f.siret}` : ""}
${f.vatNumber ? `- TVA intracommunautaire : ${f.vatNumber}` : ""}
- Email : ${f.email}
${f.phone ? `- Telephone : ${f.phone}` : ""}

**Le Client :**
- Nom / Raison sociale : ${cl.name}
${cl.address ? `- Adresse : ${cl.address}` : ""}
${cl.siret ? `- SIRET : ${cl.siret}` : ""}
${cl.email ? `- Email : ${cl.email}` : ""}
${cl.representative ? `- Representant : ${cl.representative}` : ""}

## Article 1 — Objet

Le present contrat a pour objet de definir les conditions dans lesquelles le Prestataire realise pour le Client la mission suivante :

**${params.missionDescription}**

${
  params.deliverables && params.deliverables.length > 0
    ? `### Livrables attendus :\n\n${params.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}`
    : ""
}

## Article 2 — Duree

La mission debute le **${params.startDate}**${params.endDate ? ` et se termine le **${params.endDate}**` : ""}.

${!params.endDate ? "La duree sera determinee en fonction de l'avancement de la mission, par accord entre les parties." : ""}

## Article 3 — Independance

Le Prestataire exerce sa mission en toute independance. Il n'existe aucun lien de subordination entre le Prestataire et le Client. Le Prestataire organise librement son travail, ses horaires et ses methodes.

Le Prestataire conserve la possibilite d'exercer d'autres activites professionnelles pendant la duree du present contrat.

## Article 4 — Prix et facturation

${priceClause}

${!f.vatNumber ? "TVA non applicable, article 293 B du Code general des impots." : "La TVA sera facturee au taux en vigueur."}

## Article 5 — Conditions de paiement

Le paiement est du dans un delai de ${paymentTerms}.

En cas de retard de paiement, des penalites de retard au taux de 10% par an seront appliquees de plein droit, ainsi qu'une indemnite forfaitaire de 40 EUR pour frais de recouvrement.

## Article 6 — Obligations du Prestataire

Le Prestataire s'engage a :
- Executer la mission avec diligence et professionnalisme
- Respecter les delais convenus
- Informer le Client de tout probleme susceptible d'affecter la mission
- Assurer la confidentialite des informations du Client

## Article 7 — Obligations du Client

Le Client s'engage a :
- Fournir au Prestataire les informations et accee necessaires a l'execution de la mission
- Valider les livrables dans un delai raisonnable
- Regler les factures dans les delais convenus

## Article 8 — Propriete intellectuelle

${
  ipTransfer
    ? `Sous reserve du paiement integral de la prestation, le Prestataire cede au Client l'ensemble des droits de propriete intellectuelle sur les livrables, pour le monde entier et pour toute la duree de protection legale. Cette cession comprend les droits de reproduction, representation, adaptation et distribution, sur tous supports et par tous moyens.`
    : `Le Prestataire conserve les droits de propriete intellectuelle sur les livrables. Le Client beneficie d'une licence d'utilisation non exclusive pour les besoins definis dans le present contrat.`
}

## Article 9 — Confidentialite

Chaque partie s'engage a maintenir confidentielles les informations echangees dans le cadre du present contrat pendant toute sa duree et pendant 24 mois apres son terme.

${
  params.nonCompeteMonths != null && params.nonCompeteMonths > 0
    ? `## Article 10 — Non-concurrence\n\nLe Prestataire s'engage a ne pas exercer d'activite concurrente directe au Client pendant une duree de ${params.nonCompeteMonths} mois a compter de la fin de la mission, dans le secteur d'activite du Client.`
    : ""
}

## Article ${params.nonCompeteMonths ? "11" : "10"} — Resiliation

Chaque partie peut resilier le contrat avec un preavis de 30 jours par lettre recommandee avec accuse de reception.

En cas de manquement grave de l'une des parties, l'autre partie peut resilier le contrat avec effet immediat apres mise en demeure restee sans effet pendant 15 jours.

Les prestations realisees jusqu'a la date de resiliation restent dues.

## Article ${params.nonCompeteMonths ? "12" : "11"} — Responsabilite

La responsabilite du Prestataire est limitee au montant total des sommes effectivement percues au titre du present contrat. Le Prestataire n'est pas responsable des dommages indirects.

## Article ${params.nonCompeteMonths ? "13" : "12"} — Force majeure

Aucune des parties ne sera responsable de l'inexecution de ses obligations en cas de force majeure au sens de l'article 1218 du Code civil.

## Article ${params.nonCompeteMonths ? "14" : "13"} — Droit applicable et litiges

Le present contrat est regi par le droit francais. En cas de litige, les parties rechercheront une solution amiable. A defaut, les tribunaux de ${jurisdiction} seront competents.

---

**Signatures :**

Le Prestataire :

Nom : ${f.representative ?? f.name}
Date : ________________
Signature : ________________

Le Client :

Nom : ${cl.representative ?? cl.name}
Date : ________________
Signature : ________________

---

**${DISCLAIMER_FR}**
`;
}
