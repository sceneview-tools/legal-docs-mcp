import type { MentionsLegalesParams } from "../types.js";
import { DISCLAIMER_FR } from "../types.js";

export function generateMentionsLegales(params: MentionsLegalesParams): string {
  const c = params.company;
  const dpo = params.dpoEmail ?? c.email;

  return `# MENTIONS LEGALES

**${DISCLAIMER_FR}**

---

**Date de derniere mise a jour :** ${new Date().toISOString().split("T")[0]}

## 1. Editeur du site

- **Raison sociale :** ${c.name}
${c.legalForm ? `- **Forme juridique :** ${c.legalForm}` : ""}
- **Siege social :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
${c.siren ? `- **SIREN :** ${c.siren}` : ""}
${c.rcs ? `- **RCS :** ${c.rcs}` : ""}
${c.capital ? `- **Capital social :** ${c.capital}` : ""}
${c.vatNumber ? `- **Numero de TVA intracommunautaire :** ${c.vatNumber}` : ""}
- **Email :** ${c.email}
${c.phone ? `- **Telephone :** ${c.phone}` : ""}
${c.website ? `- **Site web :** ${c.website}` : ""}
${c.representative ? `- **Representant legal :** ${c.representative}${c.representativeTitle ? `, ${c.representativeTitle}` : ""}` : ""}

## 2. Directeur de la publication

**${params.publicationDirector}**

## 3. Hebergeur

- **Nom :** ${params.hostingProvider}
- **Adresse :** ${params.hostingAddress}

## 4. Propriete intellectuelle

L'ensemble du contenu du site (textes, images, graphismes, logo, icones, sons, logiciels, etc.) est la propriete exclusive de ${c.name} ou de ses partenaires, et est protege par les lois francaises et internationales relatives a la propriete intellectuelle.

Toute reproduction, representation, modification, publication, adaptation ou exploitation, totale ou partielle, des elements du site, quel que soit le moyen ou le procede utilise, est interdite sans autorisation ecrite prealable de ${c.name}.

## 5. Donnees personnelles et RGPD

Conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes du 6 janvier 1978 modifiee, vous disposez des droits suivants concernant vos donnees personnelles :

- Droit d'acces
- Droit de rectification
- Droit a l'effacement
- Droit a la limitation du traitement
- Droit a la portabilite des donnees
- Droit d'opposition

Pour exercer ces droits, contactez : **${dpo}**

Vous pouvez egalement introduire une reclamation aupres de la CNIL (Commission Nationale de l'Informatique et des Libertes) : www.cnil.fr

## 6. Cookies

Le site peut utiliser des cookies pour ameliorer l'experience utilisateur. Conformement a la loi, vous etes informe de l'utilisation de cookies et pouvez les accepter ou les refuser via le bandeau de consentement.

## 7. Limitation de responsabilite

${c.name} s'efforce de fournir des informations aussi precises que possible sur le site. Toutefois, ${c.name} ne peut garantir l'exactitude, l'exhaustivite et l'actualite des informations publiees.

${c.name} ne saurait etre tenu responsable des dommages directs ou indirects resultant de l'acces au site ou de l'utilisation des informations qui y sont contenues.

## 8. Liens hypertextes

Le site peut contenir des liens vers des sites tiers. ${c.name} n'exerce aucun controle sur ces sites et decline toute responsabilite quant a leur contenu.

## 9. Droit applicable

Les presentes mentions legales sont soumises au droit francais.

---

**${DISCLAIMER_FR}**
`;
}
