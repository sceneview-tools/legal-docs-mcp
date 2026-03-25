import type { DevisParams } from "../types.js";
import { DISCLAIMER_FR } from "../types.js";

export function generateDevis(params: DevisParams): string {
  const c = params.company;
  const cl = params.client;
  const currency = params.currency ?? "EUR";
  const validityDays = params.validityDays ?? 30;
  const vatRate = params.vatRate ?? 20;
  const vatExempt = params.vatExempt ?? !c.vatNumber;
  const paymentTerms = params.paymentTerms ?? "30 jours a compter de la date de facturation";

  // Calculate totals
  const subtotal = params.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const vatAmount = vatExempt ? 0 : subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const itemsTable = params.items
    .map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      return `| ${item.description} | ${item.quantity} ${item.unit ?? ""} | ${item.unitPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency} | ${lineTotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency} |`;
    })
    .join("\n");

  return `# DEVIS

**${DISCLAIMER_FR}**

---

## Informations du prestataire

- **Raison sociale :** ${c.name}
${c.legalForm ? `- **Forme juridique :** ${c.legalForm}` : ""}
- **Adresse :** ${c.address}
${c.siret ? `- **SIRET :** ${c.siret}` : ""}
${c.vatNumber ? `- **TVA intracommunautaire :** ${c.vatNumber}` : ""}
- **Email :** ${c.email}
${c.phone ? `- **Telephone :** ${c.phone}` : ""}

## Informations du client

- **Nom :** ${cl.name}
${cl.address ? `- **Adresse :** ${cl.address}` : ""}
${cl.siret ? `- **SIRET :** ${cl.siret}` : ""}
${cl.email ? `- **Email :** ${cl.email}` : ""}

---

- **Numero de devis :** ${params.quoteNumber}
- **Date du devis :** ${params.quoteDate}
- **Validite :** ${validityDays} jours (jusqu'au ${computeExpiryDate(params.quoteDate, validityDays)})

---

## Detail de la prestation

| Description | Quantite | Prix unitaire HT | Total HT |
|---|---|---|---|
${itemsTable}

---

| | Montant |
|---|---|
| **Total HT** | ${subtotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency} |
${vatExempt ? `| **TVA** | Non applicable (art. 293 B du CGI) |` : `| **TVA (${vatRate}%)** | ${vatAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency} |`}
| **Total TTC** | ${total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} ${currency} |

---

## Conditions de paiement

${paymentTerms}

${params.notes ? `## Notes\n\n${params.notes}` : ""}

## Mentions obligatoires

${vatExempt ? "TVA non applicable, article 293 B du Code general des impots." : ""}

Conformement a l'article L.441-9 du Code de commerce, en cas de retard de paiement, le client sera redevable de penalites de retard au taux de 10% par an, ainsi que d'une indemnite forfaitaire de 40 EUR pour frais de recouvrement.

---

## Acceptation

**Bon pour accord — Date et signature du client :**

Nom : ${cl.representative ?? cl.name}
Date : ________________
Signature : ________________

Mention manuscrite : "Bon pour accord"

---

**${DISCLAIMER_FR}**
`;
}

function computeExpiryDate(dateStr: string, days: number): string {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  } catch {
    return `${dateStr} + ${days} jours`;
  }
}
