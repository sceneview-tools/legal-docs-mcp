import type { CompanyInfo } from "../types.js";
import { DISCLAIMER_FR, DISCLAIMER_EN } from "../types.js";

export interface RGPDPolicyParams {
  company: CompanyInfo;
  language: "fr" | "en";
  dpoName?: string;
  dpoEmail?: string;
  dataInventory: Array<{
    category: string;
    dataTypes: string[];
    legalBasis: string;
    retentionDays: number;
    recipients?: string[];
  }>;
  processingActivities: string[];
  subProcessors?: Array<{
    name: string;
    purpose: string;
    country: string;
    guarantees?: string;
  }>;
  transfersOutsideEU?: boolean;
  transferMechanisms?: string[];
  securityMeasures?: string[];
  dpiaRequired?: boolean;
  dpiaTopics?: string[];
  consentMechanism?: string;
  breachProcedure?: boolean;
  dataPortabilityFormat?: string;
  cookiePolicy?: boolean;
  cookieCategories?: string[];
}

export function generateRGPDPolicy(params: RGPDPolicyParams): string {
  if (params.language === "en") return generateRGPDPolicyEN(params);
  return generateRGPDPolicyFR(params);
}

function generateRGPDPolicyFR(params: RGPDPolicyParams): string {
  const c = params.company;
  const dpoName = params.dpoName ?? c.representative ?? "Non designe";
  const dpoEmail = params.dpoEmail ?? c.email;
  const date = new Date().toISOString().split("T")[0];

  const dataInventorySection = params.dataInventory
    .map(
      (inv) => `### ${inv.category}

- **Donnees collectees :** ${inv.dataTypes.join(", ")}
- **Base legale :** ${inv.legalBasis}
- **Duree de conservation :** ${inv.retentionDays} jours
${inv.recipients && inv.recipients.length > 0 ? `- **Destinataires :** ${inv.recipients.join(", ")}` : "- **Destinataires :** Aucun tiers"}`
    )
    .join("\n\n");

  const subProcessorSection = params.subProcessors && params.subProcessors.length > 0
    ? params.subProcessors
        .map(
          (sp) =>
            `| ${sp.name} | ${sp.purpose} | ${sp.country} | ${sp.guarantees ?? "Clauses contractuelles types"} |`
        )
        .join("\n")
    : "| Aucun sous-traitant identifie | — | — | — |";

  const securityMeasures = params.securityMeasures ?? [
    "Chiffrement des donnees en transit (TLS 1.2+) et au repos (AES-256)",
    "Authentification multi-facteurs (MFA) pour les acces administratifs",
    "Sauvegardes chiffrees regulieres avec test de restauration",
    "Journalisation des acces aux donnees personnelles",
    "Formation des employes a la protection des donnees",
    "Politique de mots de passe robuste",
    "Mise a jour reguliere des systemes et correctifs de securite",
    "Tests de penetration annuels",
  ];

  return `# POLITIQUE DE CONFORMITE RGPD

**${DISCLAIMER_FR}**

---

**Date de derniere mise a jour :** ${date}

**Version :** 1.0

## 1. Responsable du traitement

- **Raison sociale :** ${c.name}
${c.legalForm ? `- **Forme juridique :** ${c.legalForm}` : ""}
- **Siege social :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
${c.siren ? `- **SIREN :** ${c.siren}` : ""}
- **Email :** ${c.email}
${c.phone ? `- **Telephone :** ${c.phone}` : ""}
${c.website ? `- **Site web :** ${c.website}` : ""}
${c.representative ? `- **Representant legal :** ${c.representative}` : ""}

## 2. Delegue a la Protection des Donnees (DPO)

- **Nom :** ${dpoName}
- **Email :** ${dpoEmail}
- **Missions :** Informer et conseiller le responsable de traitement, controler le respect du RGPD, cooperer avec la CNIL, etre le point de contact des personnes concernees.

## 3. Registre des activites de traitement

Conformement a l'article 30 du RGPD, ${c.name} tient un registre des activites de traitement.

### Activites de traitement

${params.processingActivities.map((a) => `- ${a}`).join("\n")}

## 4. Inventaire des donnees

${dataInventorySection}

## 5. Bases legales du traitement (Article 6 RGPD)

Les traitements de donnees sont fondes sur les bases legales suivantes :

- **Consentement** (Article 6.1.a) : Lorsque la personne concernee a donne son consentement explicite
- **Execution d'un contrat** (Article 6.1.b) : Lorsque le traitement est necessaire a l'execution d'un contrat
- **Obligation legale** (Article 6.1.c) : Lorsque le traitement est impose par la loi
- **Interets legitimes** (Article 6.1.f) : Lorsque le traitement est necessaire aux interets legitimes poursuivis par le responsable de traitement

${params.consentMechanism ? `### Mecanisme de consentement\n\n${params.consentMechanism}` : ""}

## 6. Sous-traitants (Article 28 RGPD)

| Sous-traitant | Finalite | Pays | Garanties |
|---|---|---|---|
${subProcessorSection}

Chaque sous-traitant est lie par un contrat de sous-traitance conforme a l'article 28 du RGPD, incluant les clauses obligatoires relatives a la protection des donnees.

## 7. Transferts hors UE/EEE

${
  params.transfersOutsideEU
    ? `Des transferts de donnees hors de l'UE/EEE sont effectues. Les mecanismes de protection utilises sont :\n\n${(params.transferMechanisms ?? ["Clauses contractuelles types (CCT) de la Commission europeenne", "Decisions d'adequation de la Commission europeenne"]).map((m) => `- ${m}`).join("\n")}`
    : "Aucun transfert de donnees personnelles n'est effectue en dehors de l'Union europeenne ou de l'Espace economique europeen."
}

## 8. Droits des personnes concernees (Articles 15-22 RGPD)

Conformement au RGPD, toute personne concernee dispose des droits suivants :

| Droit | Article RGPD | Description |
|---|---|---|
| Acces | Art. 15 | Obtenir la confirmation du traitement et une copie des donnees |
| Rectification | Art. 16 | Corriger des donnees inexactes ou incompletes |
| Effacement | Art. 17 | Demander la suppression des donnees (« droit a l'oubli ») |
| Limitation | Art. 18 | Restreindre le traitement dans certains cas |
| Portabilite | Art. 20 | Recevoir les donnees dans un format structure${params.dataPortabilityFormat ? ` (${params.dataPortabilityFormat})` : " (CSV, JSON)"} |
| Opposition | Art. 21 | S'opposer au traitement pour motifs legitimes |
| Retrait du consentement | Art. 7.3 | Retirer son consentement a tout moment |
| Reclamation | Art. 77 | Introduire une reclamation aupres de la CNIL |

**Pour exercer ces droits :** Adresser une demande a **${dpoEmail}** en joignant une copie de votre piece d'identite. Reponse sous 30 jours maximum.

## 9. Mesures de securite (Article 32 RGPD)

${c.name} met en oeuvre les mesures techniques et organisationnelles suivantes :

${securityMeasures.map((m) => `- ${m}`).join("\n")}

## 10. Analyse d'impact (DPIA — Article 35 RGPD)

${
  params.dpiaRequired
    ? `Une analyse d'impact relative a la protection des donnees (AIPD) est requise pour les traitements suivants :\n\n${(params.dpiaTopics ?? ["Traitement a grande echelle de donnees sensibles", "Surveillance systematique", "Profilage avec effets juridiques"]).map((t) => `- ${t}`).join("\n")}\n\nChaque AIPD est documentee et consultable par la CNIL sur demande.`
    : "A la date de redaction de ce document, aucune analyse d'impact n'est requise au regard des traitements effectues. Cette evaluation est revisee annuellement."
}

## 11. Notification de violations de donnees (Articles 33-34 RGPD)

${
  params.breachProcedure !== false
    ? `### Procedure en cas de violation

1. **Detection et evaluation** : Identification de la violation et evaluation de sa gravite
2. **Notification a la CNIL** : Dans un delai de **72 heures** apres connaissance de la violation (Article 33)
3. **Notification aux personnes** : Si risque eleve pour les droits et libertes (Article 34)
4. **Documentation** : Enregistrement de toute violation dans le registre des violations
5. **Mesures correctives** : Mise en place de mesures pour limiter l'impact et prevenir la recurrence

**Contact d'urgence :** ${dpoEmail}`
    : "Une procedure de notification de violations sera mise en place."
}

${
  params.cookiePolicy
    ? `## 12. Politique de cookies

${c.name} utilise les categories de cookies suivantes :

${(params.cookieCategories ?? ["Cookies strictement necessaires (exemptes de consentement)", "Cookies analytiques (soumis a consentement)", "Cookies de preference (soumis a consentement)", "Cookies marketing (soumis a consentement)"]).map((cc) => `- ${cc}`).join("\n")}

Le consentement aux cookies est recueilli via un bandeau de consentement conforme aux recommandations de la CNIL. L'utilisateur peut modifier ses preferences a tout moment.`
    : ""
}

## ${params.cookiePolicy ? "13" : "12"}. Revision et mise a jour

La presente politique est revisee au minimum une fois par an, ou a chaque modification significative des traitements de donnees. Toute modification substantielle est communiquee aux personnes concernees.

## ${params.cookiePolicy ? "14" : "13"}. Contact

Pour toute question relative a la protection des donnees personnelles :

- **DPO :** ${dpoName} — ${dpoEmail}
- **CNIL :** www.cnil.fr — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07

---

**${DISCLAIMER_FR}**
`;
}

function generateRGPDPolicyEN(params: RGPDPolicyParams): string {
  const c = params.company;
  const dpoName = params.dpoName ?? c.representative ?? "Not designated";
  const dpoEmail = params.dpoEmail ?? c.email;
  const date = new Date().toISOString().split("T")[0];

  const dataInventorySection = params.dataInventory
    .map(
      (inv) => `### ${inv.category}

- **Data collected:** ${inv.dataTypes.join(", ")}
- **Legal basis:** ${inv.legalBasis}
- **Retention period:** ${inv.retentionDays} days
${inv.recipients && inv.recipients.length > 0 ? `- **Recipients:** ${inv.recipients.join(", ")}` : "- **Recipients:** None"}`
    )
    .join("\n\n");

  const subProcessorSection = params.subProcessors && params.subProcessors.length > 0
    ? params.subProcessors
        .map(
          (sp) =>
            `| ${sp.name} | ${sp.purpose} | ${sp.country} | ${sp.guarantees ?? "Standard Contractual Clauses"} |`
        )
        .join("\n")
    : "| No sub-processors identified | — | — | — |";

  const securityMeasures = params.securityMeasures ?? [
    "Data encryption in transit (TLS 1.2+) and at rest (AES-256)",
    "Multi-factor authentication (MFA) for administrative access",
    "Encrypted backups with regular restoration testing",
    "Access logging for personal data",
    "Employee training on data protection",
    "Strong password policy",
    "Regular system updates and security patches",
    "Annual penetration testing",
  ];

  return `# GDPR COMPLIANCE POLICY

**${DISCLAIMER_EN}**

---

**Last updated:** ${date}

**Version:** 1.0

## 1. Data Controller

- **Company:** ${c.name}
${c.legalForm ? `- **Legal form:** ${c.legalForm}` : ""}
- **Registered address:** ${c.address}
${c.siret ? `- **SIRET:** ${c.siret}` : ""}
- **Email:** ${c.email}
${c.phone ? `- **Phone:** ${c.phone}` : ""}
${c.website ? `- **Website:** ${c.website}` : ""}
${c.representative ? `- **Legal representative:** ${c.representative}` : ""}

## 2. Data Protection Officer (DPO)

- **Name:** ${dpoName}
- **Email:** ${dpoEmail}
- **Role:** Inform and advise the data controller, monitor GDPR compliance, cooperate with the supervisory authority, serve as contact point for data subjects.

## 3. Record of Processing Activities

In accordance with Article 30 GDPR, ${c.name} maintains a record of processing activities.

### Processing Activities

${params.processingActivities.map((a) => `- ${a}`).join("\n")}

## 4. Data Inventory

${dataInventorySection}

## 5. Legal Bases for Processing (Article 6 GDPR)

Data processing is based on the following legal bases:

- **Consent** (Article 6.1.a): When the data subject has given explicit consent
- **Contract performance** (Article 6.1.b): When processing is necessary for contract execution
- **Legal obligation** (Article 6.1.c): When processing is required by law
- **Legitimate interests** (Article 6.1.f): When processing is necessary for legitimate interests

${params.consentMechanism ? `### Consent Mechanism\n\n${params.consentMechanism}` : ""}

## 6. Sub-Processors (Article 28 GDPR)

| Sub-processor | Purpose | Country | Safeguards |
|---|---|---|---|
${subProcessorSection}

Each sub-processor is bound by a data processing agreement compliant with Article 28 GDPR.

## 7. International Transfers

${
  params.transfersOutsideEU
    ? `Data transfers outside the EU/EEA are carried out. The following safeguards are in place:\n\n${(params.transferMechanisms ?? ["Standard Contractual Clauses (SCCs)", "EU adequacy decisions"]).map((m) => `- ${m}`).join("\n")}`
    : "No personal data transfers are made outside the European Union or European Economic Area."
}

## 8. Data Subject Rights (Articles 15-22 GDPR)

| Right | GDPR Article | Description |
|---|---|---|
| Access | Art. 15 | Obtain confirmation of processing and a copy of data |
| Rectification | Art. 16 | Correct inaccurate or incomplete data |
| Erasure | Art. 17 | Request deletion of data ("right to be forgotten") |
| Restriction | Art. 18 | Restrict processing in certain cases |
| Portability | Art. 20 | Receive data in a structured format${params.dataPortabilityFormat ? ` (${params.dataPortabilityFormat})` : " (CSV, JSON)"} |
| Objection | Art. 21 | Object to processing on legitimate grounds |
| Withdraw consent | Art. 7.3 | Withdraw consent at any time |
| Complaint | Art. 77 | Lodge a complaint with the supervisory authority |

**To exercise these rights:** Send a request to **${dpoEmail}** with a copy of your ID. Response within 30 days maximum.

## 9. Security Measures (Article 32 GDPR)

${c.name} implements the following technical and organizational measures:

${securityMeasures.map((m) => `- ${m}`).join("\n")}

## 10. Data Protection Impact Assessment (DPIA — Article 35 GDPR)

${
  params.dpiaRequired
    ? `A DPIA is required for the following processing activities:\n\n${(params.dpiaTopics ?? ["Large-scale processing of sensitive data", "Systematic monitoring", "Profiling with legal effects"]).map((t) => `- ${t}`).join("\n")}\n\nEach DPIA is documented and available to the supervisory authority upon request.`
    : "As of the date of this document, no DPIA is required based on current processing activities. This assessment is reviewed annually."
}

## 11. Data Breach Notification (Articles 33-34 GDPR)

${
  params.breachProcedure !== false
    ? `### Breach Procedure

1. **Detection and assessment**: Identify the breach and assess its severity
2. **Authority notification**: Within **72 hours** of becoming aware (Article 33)
3. **Data subject notification**: If high risk to rights and freedoms (Article 34)
4. **Documentation**: Record all breaches in the breach register
5. **Remediation**: Implement measures to limit impact and prevent recurrence

**Emergency contact:** ${dpoEmail}`
    : "A data breach notification procedure will be established."
}

## ${params.cookiePolicy ? "12. Cookie Policy" : ""}

${
  params.cookiePolicy
    ? `${c.name} uses the following cookie categories:\n\n${(params.cookieCategories ?? ["Strictly necessary cookies (consent-exempt)", "Analytics cookies (consent required)", "Preference cookies (consent required)", "Marketing cookies (consent required)"]).map((cc) => `- ${cc}`).join("\n")}\n\nCookie consent is collected via a consent banner compliant with GDPR requirements. Users can modify their preferences at any time.`
    : ""
}

## ${params.cookiePolicy ? "13" : "12"}. Review and Updates

This policy is reviewed at least annually, or whenever significant changes are made to data processing activities. Any material changes will be communicated to data subjects.

## ${params.cookiePolicy ? "14" : "13"}. Contact

For any questions regarding personal data protection:

- **DPO:** ${dpoName} — ${dpoEmail}
- **Supervisory authority (France):** CNIL — www.cnil.fr

---

**${DISCLAIMER_EN}**
`;
}
