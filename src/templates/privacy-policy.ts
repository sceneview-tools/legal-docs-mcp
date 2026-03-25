import type { PrivacyPolicyParams } from "../types.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

export function generatePrivacyPolicy(params: PrivacyPolicyParams): string {
  if (params.language === "en") return generatePrivacyPolicyEN(params);
  return generatePrivacyPolicyFR(params);
}

function generatePrivacyPolicyFR(params: PrivacyPolicyParams): string {
  const c = params.company;
  const retention = params.dataRetentionDays ?? 365;
  const dpo = params.dpoEmail ?? c.email;
  const hosting = params.hostingProvider ?? "Non specifie";
  const hostingCountry = params.hostingCountry ?? "France";

  return `# POLITIQUE DE CONFIDENTIALITE

**${DISCLAIMER_FR}**

---

**Date de derniere mise a jour :** ${new Date().toISOString().split("T")[0]}

## 1. Responsable du traitement

- **Raison sociale :** ${c.name}
- **Siege social :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
- **Email :** ${c.email}
- **DPO / Contact donnees personnelles :** ${dpo}

## 2. Donnees collectees

Nous collectons les donnees suivantes :

${params.dataCollected.map((d) => `- ${d}`).join("\n")}

## 3. Finalites du traitement

Les donnees sont collectees pour les finalites suivantes :

${params.dataPurposes.map((p) => `- ${p}`).join("\n")}

**Base legale :** consentement de l'utilisateur, execution d'un contrat, interet legitime, ou obligation legale, selon le cas.

## 4. Destinataires des donnees

${
  params.thirdParties && params.thirdParties.length > 0
    ? `Les donnees peuvent etre partagees avec les tiers suivants :\n\n${params.thirdParties.map((t) => `- ${t}`).join("\n")}`
    : "Les donnees ne sont pas partagees avec des tiers, sauf obligation legale."
}

## 5. Duree de conservation

Les donnees sont conservees pendant une duree maximale de **${retention} jours** a compter de leur collecte, sauf obligation legale de conservation plus longue.

## 6. Hebergement

- **Hebergeur :** ${hosting}
- **Pays :** ${hostingCountry}

${hostingCountry !== "France" && hostingCountry !== "UE" ? "En cas de transfert hors UE, des garanties appropriees sont mises en place conformement au RGPD (clauses contractuelles types, decision d'adequation, etc.)." : ""}

## 7. Cookies

${
  params.cookieTypes && params.cookieTypes.length > 0
    ? `Le site utilise les types de cookies suivants :\n\n${params.cookieTypes.map((ct) => `- ${ct}`).join("\n")}\n\nVous pouvez gerer vos preferences via le bandeau de consentement ou les parametres de votre navigateur.`
    : "Le site peut utiliser des cookies techniques necessaires au fonctionnement. Vous pouvez gerer vos preferences via les parametres de votre navigateur."
}

## 8. Droits des utilisateurs

Conformement au RGPD (articles 15 a 22), vous disposez des droits suivants :

- **Droit d'acces** : obtenir la confirmation du traitement et une copie de vos donnees
- **Droit de rectification** : corriger des donnees inexactes
- **Droit a l'effacement** : demander la suppression de vos donnees
- **Droit a la limitation** : restreindre le traitement dans certains cas
- **Droit a la portabilite** : recevoir vos donnees dans un format structure
- **Droit d'opposition** : vous opposer au traitement pour motifs legitimes
- **Droit de retirer votre consentement** a tout moment

Pour exercer ces droits, contactez : **${dpo}**

En cas de reponse insatisfaisante, vous pouvez introduire une reclamation aupres de la CNIL (www.cnil.fr).

## 9. Securite

${c.name} met en oeuvre des mesures techniques et organisationnelles appropriees pour proteger les donnees personnelles contre l'acces non autorise, la perte ou la destruction.

## 10. Modifications

La presente politique peut etre modifiee a tout moment. Les utilisateurs seront informes de toute modification substantielle.

---

**${DISCLAIMER_FR}**
`;
}

function generatePrivacyPolicyEN(params: PrivacyPolicyParams): string {
  const c = params.company;
  const retention = params.dataRetentionDays ?? 365;
  const dpo = params.dpoEmail ?? c.email;
  const hosting = params.hostingProvider ?? "Not specified";
  const hostingCountry = params.hostingCountry ?? "France";

  return `# PRIVACY POLICY

**${DISCLAIMER_EN}**

---

**Last updated:** ${new Date().toISOString().split("T")[0]}

## 1. Data Controller

- **Company:** ${c.name}
- **Registered address:** ${c.address}
${c.siret ? `- **SIRET:** ${c.siret}` : ""}
- **Email:** ${c.email}
- **DPO / Privacy contact:** ${dpo}

## 2. Data Collected

We collect the following personal data:

${params.dataCollected.map((d) => `- ${d}`).join("\n")}

## 3. Purposes of Processing

Data is collected for the following purposes:

${params.dataPurposes.map((p) => `- ${p}`).join("\n")}

**Legal basis:** user consent, performance of a contract, legitimate interest, or legal obligation, as applicable.

## 4. Data Recipients

${
  params.thirdParties && params.thirdParties.length > 0
    ? `Data may be shared with the following third parties:\n\n${params.thirdParties.map((t) => `- ${t}`).join("\n")}`
    : "Data is not shared with third parties unless required by law."
}

## 5. Data Retention

Personal data is retained for a maximum of **${retention} days** from the date of collection, unless a longer retention period is required by law.

## 6. Hosting

- **Hosting provider:** ${hosting}
- **Country:** ${hostingCountry}

${hostingCountry !== "France" && hostingCountry !== "EU" ? "For transfers outside the EU, appropriate safeguards are implemented in compliance with the GDPR (standard contractual clauses, adequacy decisions, etc.)." : ""}

## 7. Cookies

${
  params.cookieTypes && params.cookieTypes.length > 0
    ? `This website uses the following types of cookies:\n\n${params.cookieTypes.map((ct) => `- ${ct}`).join("\n")}\n\nYou can manage your preferences via the consent banner or your browser settings.`
    : "This website may use strictly necessary technical cookies. You can manage your preferences via your browser settings."
}

## 8. Your Rights

Under the GDPR (Articles 15-22), you have the following rights:

- **Right of access**: obtain confirmation of processing and a copy of your data
- **Right to rectification**: correct inaccurate data
- **Right to erasure**: request deletion of your data
- **Right to restriction**: restrict processing in certain cases
- **Right to data portability**: receive your data in a structured format
- **Right to object**: object to processing on legitimate grounds
- **Right to withdraw consent** at any time

To exercise these rights, contact: **${dpo}**

If you are not satisfied with our response, you may lodge a complaint with the relevant supervisory authority (CNIL in France: www.cnil.fr).

## 9. Security

${c.name} implements appropriate technical and organizational measures to protect personal data against unauthorized access, loss, or destruction.

## 10. Changes

This policy may be updated at any time. Users will be informed of any material changes.

---

**${DISCLAIMER_EN}**
`;
}
