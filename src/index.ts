#!/usr/bin/env node

/**
 * legal-docs-mcp — MCP server for generating legal documents.
 *
 * Tools: generate_cgv, generate_cgu, generate_privacy_policy, generate_nda,
 * generate_freelance_contract, generate_mentions_legales, generate_devis,
 * generate_terms_of_service.
 *
 * Free tier: 5 documents/month. Pro: EUR 19.99/month unlimited.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { TOOLS } from "./tools.js";
import {
  generateCGV,
  generateCGU,
  generatePrivacyPolicy,
  generateNDA,
  generateFreelanceContract,
  generateMentionsLegales,
  generateDevis,
  generateTermsOfService,
} from "./templates/index.js";
import { canGenerate, incrementUsage, remainingFree } from "./usage.js";
import { DISCLAIMER_FR, DISCLAIMER_EN, FREE_TIER_LIMIT } from "./types.js";
import type {
  CGVParams,
  CGUParams,
  PrivacyPolicyParams,
  NDAParams,
  FreelanceContractParams,
  MentionsLegalesParams,
  DevisParams,
  TermsOfServiceParams,
} from "./types.js";

const server = new McpServer({
  name: "legal-docs-mcp",
  version: "1.0.0",
});

// Register all tools dynamically
for (const tool of TOOLS) {
  server.tool(
    tool.name,
    tool.description ?? "",
    tool.inputSchema.properties as Record<string, unknown>,
    async (args: Record<string, unknown>) => {
      // Usage tracking — default free user
      const userId = (args._userId as string) ?? "anonymous";
      const isPro = (args._isPro as boolean) ?? false;

      if (!canGenerate(userId, isPro)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Limite atteinte : vous avez utilise vos ${FREE_TIER_LIMIT} documents gratuits ce mois-ci.\n\nPassez a Pro (19,99 EUR/mois) pour des documents illimites.\n\n${DISCLAIMER_FR}`,
            },
          ],
        };
      }

      try {
        const document = generateDocument(tool.name, args);
        incrementUsage(userId);
        const remaining = isPro ? "illimite" : `${remainingFree(userId)}/${FREE_TIER_LIMIT}`;

        return {
          content: [
            {
              type: "text" as const,
              text: `${document}\n\n---\n*Documents restants ce mois : ${remaining}*`,
            },
          ],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [
            {
              type: "text" as const,
              text: `Erreur lors de la generation du document : ${message}\n\n${DISCLAIMER_FR}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
}

function generateDocument(toolName: string, args: Record<string, unknown>): string {
  switch (toolName) {
    case "generate_cgv":
      return generateCGV(args as unknown as CGVParams);
    case "generate_cgu":
      return generateCGU(args as unknown as CGUParams);
    case "generate_privacy_policy":
      return generatePrivacyPolicy(args as unknown as PrivacyPolicyParams);
    case "generate_nda":
      return generateNDA(args as unknown as NDAParams);
    case "generate_freelance_contract":
      return generateFreelanceContract(args as unknown as FreelanceContractParams);
    case "generate_mentions_legales":
      return generateMentionsLegales(args as unknown as MentionsLegalesParams);
    case "generate_devis":
      return generateDevis(args as unknown as DevisParams);
    case "generate_terms_of_service":
      return generateTermsOfService(args as unknown as TermsOfServiceParams);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("legal-docs-mcp server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
