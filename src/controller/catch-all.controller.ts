import knownUrls from "@/config/known-urls";
import { Request, Response } from "express";

const levenshtein = (a: string, b: string) => {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length,
    n = b.length;

  // Create a matrix (m+1) x (n+1)
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
};

export const catchAll = (req: Request, res: Response) => {
  const subdomain = req.subdomains[0];

  if (!subdomain) return res.sendStatus(422);

  // FIND THE CLOSEST MATCH
  let bestMatch = null;
  let bestDistance = Infinity;

  for (const candidate of knownUrls) {
    const dist = levenshtein(subdomain, candidate);
    if (dist < bestDistance) {
      bestDistance = dist;
      bestMatch = candidate;
    }
  }

  // DECIDE IF “SIMILAR ENOUGH” (THRESHOLD) ---
  // A simple rule: allow up to ~50% of length as "errors", but at least 1.
  const maxLen = Math.max(subdomain.length, (bestMatch || "").length);
  const threshold = Math.ceil(maxLen * 0.5);

  return res.status(404).render("pages/404", {
    suggestedUrl: bestMatch && bestDistance <= threshold ? bestMatch : null,
  });
};
