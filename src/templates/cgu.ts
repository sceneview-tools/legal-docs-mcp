import type { CGUParams } from "../types.js";
import { DISCLAIMER_FR } from "../types.js";

export function generateCGU(params: CGUParams): string {
  const c = params.company;
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const minAge = params.minimumAge ?? 18;
  const prohibited = params.prohibitedUses ?? [
    "Utilisation a des fins illegales ou frauduleuses",
    "Atteinte aux droits de tiers",
    "Diffusion de contenus haineux, diffamatoires ou obscenes",
    "Tentative de piratage ou d'intrusion dans les systemes",
    "Utilisation de robots ou de scripts automatises sans autorisation",
  ];
  const moderation = params.moderationPolicy ?? `${c.name} se reserve le droit de supprimer tout contenu contraire aux presentes CGU, sans preavis ni indemnite.`;

  return `# CONDITIONS GENERALES D'UTILISATION (CGU)

**${DISCLAIMER_FR}**

---

**Date de derniere mise a jour :** ${new Date().toISOString().split("T")[0]}

## Article 1 — Identification de l'editeur

- **Raison sociale :** ${c.name}
${c.legalForm ? `- **Forme juridique :** ${c.legalForm}` : ""}
- **Siege social :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
- **Email :** ${c.email}
${c.phone ? `- **Telephone :** ${c.phone}` : ""}
${c.website ? `- **Site web :** ${c.website}` : ""}

## Article 2 — Objet

Les presentes Conditions Generales d'Utilisation (CGU) ont pour objet de definir les conditions d'acces et d'utilisation du service **${params.serviceName}** edite par ${c.name}.

**Description du service :** ${params.serviceDescription}

L'acces et l'utilisation du service impliquent l'acceptation pleine et entiere des presentes CGU.

## Article 3 — Acces au service

Le service est accessible gratuitement ou selon les modalites tarifaires prevues, depuis un navigateur web ou une application.

${c.name} se reserve le droit de suspendre ou d'interrompre l'acces au service pour maintenance ou mise a jour, sans obligation d'indemnisation.

## Article 4 — Inscription et compte utilisateur

L'inscription peut etre requise pour acceder a certaines fonctionnalites. L'utilisateur s'engage a fournir des informations exactes et a les maintenir a jour.

L'utilisateur est seul responsable de la confidentialite de ses identifiants. Toute utilisation du compte est presumee faite par le titulaire.

**Age minimum :** L'utilisation du service est reservee aux personnes agees d'au moins ${minAge} ans.

## Article 5 — Utilisations interdites

Les utilisations suivantes sont strictement interdites :

${prohibited.map((u) => `- ${u}`).join("\n")}

## Article 6 — Moderation

${moderation}

## Article 7 — Propriete intellectuelle

L'ensemble du contenu du service (textes, images, logos, code source, bases de donnees) est protege par le droit de la propriete intellectuelle. Toute reproduction ou representation, totale ou partielle, est interdite sans autorisation ecrite de ${c.name}.

## Article 8 — Contenu utilisateur

En publiant du contenu sur le service, l'utilisateur accorde a ${c.name} une licence non exclusive, mondiale et gratuite pour utiliser, afficher et distribuer ce contenu dans le cadre du fonctionnement du service.

L'utilisateur reste responsable du contenu qu'il publie et garantit qu'il dispose des droits necessaires.

## Article 9 — Responsabilite

${c.name} met en oeuvre les moyens raisonnables pour assurer le bon fonctionnement du service, mais ne garantit pas une disponibilite ininterrompue.

${c.name} ne saurait etre tenu responsable des dommages indirects lies a l'utilisation du service.

## Article 10 — Donnees personnelles

${c.name} collecte et traite des donnees personnelles conformement au RGPD et a la loi Informatique et Libertes. L'utilisateur dispose de droits d'acces, de rectification, de suppression et de portabilite de ses donnees. Pour exercer ces droits : ${c.email}.

## Article 11 — Cookies

Le service peut utiliser des cookies. L'utilisateur peut gerer ses preferences via les parametres de son navigateur ou le bandeau de consentement.

## Article 12 — Modification des CGU

${c.name} se reserve le droit de modifier les presentes CGU a tout moment. Les utilisateurs seront informes des modifications par email ou notification sur le service. La poursuite de l'utilisation vaut acceptation des nouvelles CGU.

## Article 13 — Resiliation

${c.name} peut resilier ou suspendre l'acces d'un utilisateur en cas de non-respect des presentes CGU, sans preavis ni indemnite.

L'utilisateur peut supprimer son compte a tout moment en contactant ${c.email}.

## Article 14 — Droit applicable et litiges

Les presentes CGU sont soumises au droit francais. En cas de litige, les parties priviligieront une resolution amiable. A defaut, les tribunaux de ${jurisdiction} seront competents.

---

**${DISCLAIMER_FR}**
`;
}
