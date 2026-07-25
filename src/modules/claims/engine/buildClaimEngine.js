export function buildClaimEngine({
  assessment,
  tests,
  equipment,
  evidence,
  boq
}) {
  const findingsComplete =
    Boolean(assessment.findings?.trim());

  const opinionComplete =
    Boolean(assessment.opinion?.trim());

  const recommendationComplete =
    Boolean(assessment.recommendation?.trim());

  const outcomeComplete =
    assessment.outcome !== "Pending";

  const testsComplete =
    tests.length > 0 &&
    tests.every(
      (test) =>
        test.status !== "Pending"
    );

  const equipmentComplete =
    equipment.length > 0 &&
    equipment.every(
      (item) =>
        item.decision !== "Pending" &&
        (
          item.serial?.trim() ||
          item.serialStatus === "Not available"
        )
    );

  const evidenceComplete =
    evidence.filter(
      (item) =>
        item.includeInReport
    ).length >= 3;

  const boqComplete =
    boq.length > 0 &&
    boq.every(
      (item) =>
        Number(item.quantity) > 0 &&
        Number(item.rate) >= 0
    );

  const contradictions = [];

  const functionalTestPassed =
    tests.some(
      (test) =>
        test.status === "Pass" &&
        /functional|operation/i.test(
          test.test || ""
        )
    );

  const replacementRecommended =
    /replace/i.test(
      assessment.recommendation || ""
    );

  if (
    functionalTestPassed &&
    replacementRecommended
  ) {
    contradictions.push({
      code: "FUNCTIONAL_REPLACEMENT",
      message:
        "Functional testing records the equipment as operational, but the recommendation proposes replacement."
    });
  }

  const lightningCause =
    /lightning/i.test(
      assessment.cause || ""
    );

  const lightningEvidence =
    tests.some(
      (test) =>
        /spd|surge|earth|earthing/i.test(
          test.test || ""
        )
    );

  if (
    lightningCause &&
    !lightningEvidence
  ) {
    contradictions.push({
      code: "LIGHTNING_EVIDENCE",
      message:
        "Lightning is recorded as the cause, but no SPD, surge-protection or earthing test has been captured."
    });
  }

  const checks = [
    {
      key: "findings",
      label: "Technical findings",
      complete: findingsComplete,
      target: "Assessment"
    },
    {
      key: "opinion",
      label: "Technical opinion",
      complete: opinionComplete,
      target: "Assessment"
    },
    {
      key: "recommendation",
      label: "Recommendation",
      complete: recommendationComplete,
      target: "Assessment"
    },
    {
      key: "outcome",
      label: "Final outcome",
      complete: outcomeComplete,
      target: "Assessment"
    },
    {
      key: "testing",
      label: "Testing register",
      complete: testsComplete,
      target: "Testing"
    },
    {
      key: "equipment",
      label: "Equipment decisions",
      complete: equipmentComplete,
      target: "Equipment"
    },
    {
      key: "evidence",
      label: "Report evidence",
      complete: evidenceComplete,
      target: "Photos"
    },
    {
      key: "boq",
      label: "Bill of quantities",
      complete: boqComplete,
      target: "BOQ"
    },
    {
      key: "logic",
      label: "Technical logic",
      complete:
        contradictions.length === 0,
      target: "Reports"
    }
  ];

  const completedChecks =
    checks.filter(
      (check) =>
        check.complete
    ).length;

  const readiness =
    Math.round(
      (
        completedChecks /
        checks.length
      ) * 100
    );

  const subtotalExcludingVat =
    boq.reduce(
      (total, item) =>
        total +
        (
          Number(item.quantity || 0) *
          Number(item.rate || 0)
        ),
      0
    );

  const vat =
    subtotalExcludingVat * 0.15;

  return {
    checks,
    missingControls:
      checks.filter(
        (check) =>
          !check.complete
      ),
    contradictions,
    readiness,
    reportReady:
      checks.every(
        (check) =>
          check.complete
      ),
    subtotalExcludingVat,
    vat,
    totalIncludingVat:
      subtotalExcludingVat + vat
  };
}
