import type { CGVParams } from "../types.js";
import { DISCLAIMER_FR } from "../types.js";

export function generateCGV(params: CGVParams): string {
  const c = params.company;
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const paymentTerms = params.paymentTerms ?? "30 jours a compter de la date de facturation";
  const penaltyRate = params.latePenaltyRate ?? 10;
  const returnPolicy = params.returnPolicy ?? "Le client dispose d'un delai de retractation de 14 jours a compter de la reception des produits ou de la souscription du service, conformement aux articles L.221-18 et suivants du Code de la consommation.";
  const warranty = params.warrantyTerms ?? "Les produits ou services sont couverts par la garantie legale de conformite (articles L.217-4 et suivants du Code de la consommation) et la garantie des vices caches (articles 1641 et suivants du Code civil).";

  return `# CONDITIONS GENERALES DE VENTE (CGV)

**${DISCLAIMER_FR}**

---

**Date de derniere mise a jour :** ${new Date().toISOString().split("T")[0]}

## Article 1 — Identification du vendeur

- **Raison sociale :** ${c.name}
${c.legalForm ? `- **Forme juridique :** ${c.legalForm}` : ""}
- **Siege social :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
${c.rcs ? `- **RCS :** ${c.rcs}` : ""}
${c.capital ? `- **Capital social :** ${c.capital}` : ""}
${c.vatNumber ? `- **Numero de TVA intracommunautaire :** ${c.vatNumber}` : ""}
- **Email :** ${c.email}
${c.phone ? `- **Telephone :** ${c.phone}` : ""}
${c.website ? `- **Site web :** ${c.website}` : ""}

## Article 2 — Objet et champ d'application

Les presentes Conditions Generales de Vente (CGV) s'appliquent a toutes les ventes de produits et/ou services realises par ${c.name} aupres de ses clients professionnels et particuliers.

**Activite :** ${params.activityDescription}

Toute commande implique l'acceptation sans reserve des presentes CGV. Elles prevalent sur toutes conditions generales d'achat, sauf derogation expresse et ecrite.

## Article 3 — Prix

Les prix sont indiques en euros (EUR)${c.vatNumber ? "" : " et sont nets de TVA (TVA non applicable, article 293 B du CGI)"}.
${c.vatNumber ? "Les prix s'entendent hors taxes (HT). La TVA applicable est celle en vigueur au jour de la facturation." : ""}

${c.name} se reserve le droit de modifier ses prix a tout moment. Les produits et services seront factures sur la base des tarifs en vigueur au moment de la validation de la commande.

## Article 4 — Commandes

Toute commande vaut acceptation des prix et descriptions des produits ou services proposes. ${c.name} se reserve le droit de refuser ou d'annuler toute commande en cas de litige existant, de probleme de paiement, ou de demande anormale.

## Article 5 — Conditions de paiement

Le paiement est exigible selon les modalites suivantes : ${paymentTerms}.

Moyens de paiement acceptes : virement bancaire, carte bancaire, ou tout autre moyen convenu entre les parties.

## Article 6 — Retard de paiement

En cas de retard de paiement, des penalites de retard seront appliquees au taux de ${penaltyRate}% par an, calculees sur le montant TTC de la facture, a compter de la date d'echeance. Une indemnite forfaitaire de 40 euros pour frais de recouvrement sera egalement due, conformement aux articles L.441-10 et D.441-5 du Code de commerce.

## Article 7 — Livraison / Execution

Les delais de livraison ou d'execution sont communiques a titre indicatif. Un retard ne peut donner lieu a des dommages et interets ni a l'annulation de la commande, sauf delai excessif au sens de l'article L.216-2 du Code de la consommation.

## Article 8 — Droit de retractation

${returnPolicy}

Pour exercer ce droit, le client doit notifier sa decision par email a ${c.email} ou par courrier recommande avant l'expiration du delai.

## Article 9 — Garanties

${warranty}

## Article 10 — Responsabilite

La responsabilite de ${c.name} ne saurait etre engagee en cas de force majeure ou d'evenements hors de son controle. La responsabilite totale de ${c.name} est limitee au montant de la commande concernee.

## Article 11 — Propriete intellectuelle

L'ensemble des contenus, marques, logos et elements visuels de ${c.name} sont proteges par le droit de la propriete intellectuelle. Toute reproduction, meme partielle, est interdite sans autorisation prealable ecrite.

## Article 12 — Donnees personnelles

${c.name} collecte et traite des donnees personnelles dans le cadre de ses activites, conformement au Reglement General sur la Protection des Donnees (RGPD) et a la loi Informatique et Libertes. Pour plus d'informations, consultez notre politique de confidentialite.

## Article 13 — Droit applicable et litiges

Les presentes CGV sont soumises au droit francais. En cas de litige, les parties s'engagent a rechercher une solution amiable. A defaut, les tribunaux de ${jurisdiction} seront seuls competents.

## Article 14 — Mediation

Conformement aux articles L.616-1 et R.616-1 du Code de la consommation, le client consommateur peut recourir gratuitement a un mediateur de la consommation en cas de litige non resolu.

---

**${DISCLAIMER_FR}**
`;
}
