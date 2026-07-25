import { seedClaims } from "../data/claims";

const STORAGE_KEY = "beos012-claims";

function readClaims() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(seedClaims)
      );

      return seedClaims;
    }

    return JSON.parse(stored);
  } catch {
    return seedClaims;
  }
}

function writeClaims(claims) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(claims)
  );
}

export function getClaims() {
  return readClaims();
}

export function getClaimById(id) {
  return readClaims().find(
    (claim) => claim.id === id
  );
}

export function createClaim(data) {
  const claims = readClaims();

  const claim = {
    ...data,
    id: `CLM-${Date.now()}`,
    stage: "New Instruction",
    reportStatus: "Not generated",
    invoiceStatus: "Not invoiced",
    value: 0,
    sla: "Not started"
  };

  writeClaims([
    claim,
    ...claims
  ]);

  return claim;
}

export function updateClaim(id, updates) {
  const claims = readClaims().map(
    (claim) =>
      claim.id === id
        ? {
            ...claim,
            ...updates
          }
        : claim
  );

  writeClaims(claims);

  return getClaimById(id);
}

export function resetClaims() {
  writeClaims(seedClaims);
}
