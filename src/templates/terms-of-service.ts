import type { TermsOfServiceParams } from "../types.js";
import { DISCLAIMER_EN } from "../types.js";

export function generateTermsOfService(params: TermsOfServiceParams): string {
  const c = params.company;
  const jurisdiction = params.jurisdictionCity ?? "Paris";
  const law = params.governingLaw ?? "French";

  return `# TERMS OF SERVICE

**${DISCLAIMER_EN}**

---

**Last updated:** ${new Date().toISOString().split("T")[0]}

## 1. Introduction

These Terms of Service ("Terms") govern your access to and use of **${params.serviceName}** ("Service"), operated by ${c.name} ("Company", "we", "us", or "our").

**Service description:** ${params.serviceDescription}

By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.

## 2. Company Information

- **Company:** ${c.name}
${c.legalForm ? `- **Legal form:** ${c.legalForm}` : ""}
- **Registered address:** ${c.address}
${c.siret ? `- **SIRET:** ${c.siret}` : ""}
${c.vatNumber ? `- **VAT:** ${c.vatNumber}` : ""}
- **Email:** ${c.email}
${c.website ? `- **Website:** ${c.website}` : ""}

## 3. Account Registration

To use certain features of the Service, you may need to create an account. You agree to:
- Provide accurate and complete information
- Maintain the security of your account credentials
- Notify us immediately of any unauthorized use
- Accept responsibility for all activity under your account

You must be at least 18 years old to create an account.

${
  params.freeTrialDays
    ? `## 4. Free Trial\n\nWe offer a free trial period of **${params.freeTrialDays} days**. At the end of the trial, you will need to subscribe to a paid plan to continue using the Service. No charge will be made during the trial period.`
    : ""
}

## ${params.freeTrialDays ? "5" : "4"}. Pricing and Payment

${params.pricingUrl ? `Current pricing is available at: ${params.pricingUrl}` : "Pricing information is available upon request or on our website."}

- All fees are exclusive of applicable taxes unless stated otherwise
- Subscriptions are billed in advance on a recurring basis
- You may cancel your subscription at any time; cancellation takes effect at the end of the current billing period
- No refunds are provided for partial billing periods

## ${params.freeTrialDays ? "6" : "5"}. Acceptable Use

You agree not to:
- Use the Service for any illegal purpose or in violation of any laws
- Infringe upon the rights of others
- Transmit harmful code, malware, or viruses
- Attempt to gain unauthorized access to any systems
- Interfere with or disrupt the Service
- Use the Service to send spam or unsolicited communications
- Reverse engineer, decompile, or disassemble the Service
- Resell or redistribute the Service without authorization

## ${params.freeTrialDays ? "7" : "6"}. Intellectual Property

The Service, including all content, features, and functionality, is owned by ${c.name} and protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable license to use the Service in accordance with these Terms.

## ${params.freeTrialDays ? "8" : "7"}. User Content

You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and display such content solely for the purpose of providing the Service.

You are responsible for your content and represent that it does not violate any third-party rights.

## ${params.freeTrialDays ? "9" : "8"}. Data Protection

We process personal data in accordance with the GDPR and applicable data protection laws. Please refer to our Privacy Policy for details.

${params.dataProcessingLocation ? `Data is processed in: **${params.dataProcessingLocation}**` : ""}

## ${params.freeTrialDays ? "10" : "9"}. Service Availability and SLA

${params.slaUptime ? `We target an uptime of **${params.slaUptime}** for the Service.` : "We strive to maintain high availability of the Service."}

We reserve the right to suspend or discontinue the Service (or any part thereof) temporarily or permanently, with or without notice, for maintenance, upgrades, or any other reason.

We are not liable for any downtime or service interruptions.

## ${params.freeTrialDays ? "11" : "10"}. Limitation of Liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW:

- The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind
- We do not warrant that the Service will be uninterrupted, error-free, or secure
- Our total liability shall not exceed the amounts paid by you in the 12 months preceding the claim
- We are not liable for any indirect, incidental, special, consequential, or punitive damages

## ${params.freeTrialDays ? "12" : "11"}. Indemnification

You agree to indemnify and hold harmless ${c.name} and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.

## ${params.freeTrialDays ? "13" : "12"}. Termination

We may terminate or suspend your access to the Service at any time, with or without cause, with or without notice.

Upon termination:
- Your right to use the Service ceases immediately
- We may delete your account and data after a reasonable retention period
- Provisions that by their nature should survive termination will survive

## ${params.freeTrialDays ? "14" : "13"}. Modifications

We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance.

## ${params.freeTrialDays ? "15" : "14"}. Governing Law and Disputes

These Terms are governed by ${law} law. Any disputes shall be subject to the exclusive jurisdiction of the courts of ${jurisdiction}.

## ${params.freeTrialDays ? "16" : "15"}. Contact

For questions about these Terms, contact us at: **${c.email}**

---

**${DISCLAIMER_EN}**
`;
}
