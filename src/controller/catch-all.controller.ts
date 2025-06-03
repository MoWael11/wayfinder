import knownUrls from "@/config/known-urls";
import { Request, Response } from "express";

const levenshtein = (a: string, b: string): number => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length,
    n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  return dp[m][n];
};

function buildSuggestionUrl(req: Request, bestMatch: string): string {
  const protocol = req.protocol;
  const host = req.hostname;
  const parts = host.split(".");

  parts[0] = bestMatch;
  const newHost = parts.join(".");

  return `${protocol}://${newHost}${req.originalUrl}`;
}

export const catchAll = (req: Request, res: Response) => {
  const host = req.hostname;
  const parts = host.split(".");

  if (parts.length < 2) return res.sendStatus(422);

  const subdomain = parts[0];
  let bestMatch: string | null = null;
  let bestDistance = Infinity;

  for (const candidate of knownUrls) {
    const dist = levenshtein(subdomain, candidate);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = candidate;
    }
  }

  const maxLen = Math.max(subdomain.length, (bestMatch || "").length);
  const threshold = Math.ceil(maxLen * 0.5);

  const suggestionURL =
    bestMatch && bestDistance <= threshold
      ? buildSuggestionUrl(req, bestMatch)
      : null;

  return res.status(404).render("pages/404", {
    suggestedUrl: suggestionURL,
  });
};
