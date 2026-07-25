const commonFunctionalTest = {
  key: "functional-operation",
  test: "Functional operation test",
  instrument: "Visual and operational test",
  expected: "Equipment operates according to its intended function",
  status: "Pending",
  notes: ""
};

export const perilTemplates = {
  lightning: {
    label: "Lightning",
    assessmentPrompts: [
      "Record the reported date and approximate time of the lightning event.",
      "Confirm whether other equipment at the risk address was affected.",
      "Inspect the electrical supply, earthing and surge-protection path.",
      "Record visible burn marks, carbonisation, ruptured components or damaged communication ports.",
      "Separate direct lightning evidence from age-related or maintenance-related failure."
    ],
    tests: [
      {
        key: "earth-continuity",
        test: "Earth continuity test",
        instrument: "Continuity tester or multimeter",
        expected: "Continuous protective-earth path",
        status: "Pending",
        notes: ""
      },
      {
        key: "earth-resistance",
        test: "Earth resistance test",
        instrument: "Earth resistance tester",
        expected: "Within applicable installation limits",
        status: "Pending",
        notes: ""
      },
      {
        key: "spd-inspection",
        test: "Surge protection device inspection",
        instrument: "Visual inspection and multimeter",
        expected: "SPD indicators healthy and device electrically serviceable",
        status: "Pending",
        notes: ""
      },
      {
        key: "neutral-earth-voltage",
        test: "Neutral-to-earth voltage",
        instrument: "True-RMS multimeter",
        expected: "Stable and within acceptable operating range",
        status: "Pending",
        notes: ""
      },
      {
        key: "supply-voltage",
        test: "Incoming supply voltage",
        instrument: "True-RMS multimeter",
        expected: "Stable supply within equipment rating",
        status: "Pending",
        notes: ""
      },
      {
        key: "surge-path",
        test: "Potential surge-path inspection",
        instrument: "Visual inspection and continuity testing",
        expected: "No unexplained open circuits or damaged conductive paths",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  "power surge": {
    label: "Power Surge",
    assessmentPrompts: [
      "Confirm the reported supply interruption or voltage fluctuation.",
      "Inspect the distribution board and equipment protection devices.",
      "Confirm whether power reaches the affected equipment.",
      "Inspect internal fuses, power supplies and control boards where accessible.",
      "Compare the alleged surge damage with the condition of other connected equipment."
    ],
    tests: [
      {
        key: "incoming-voltage",
        test: "Incoming supply voltage",
        instrument: "True-RMS multimeter",
        expected: "Voltage within the equipment operating range",
        status: "Pending",
        notes: ""
      },
      {
        key: "neutral-earth",
        test: "Neutral-to-earth voltage",
        instrument: "True-RMS multimeter",
        expected: "Stable and within acceptable range",
        status: "Pending",
        notes: ""
      },
      {
        key: "spd-status",
        test: "SPD and surge-protection inspection",
        instrument: "Visual inspection and multimeter",
        expected: "Protection devices serviceable",
        status: "Pending",
        notes: ""
      },
      {
        key: "equipment-input",
        test: "Equipment input-voltage test",
        instrument: "True-RMS multimeter",
        expected: "Correct voltage present at equipment input",
        status: "Pending",
        notes: ""
      },
      {
        key: "internal-fuse",
        test: "Internal fuse and power-supply inspection",
        instrument: "Continuity tester or multimeter",
        expected: "Fuses and power-supply circuits serviceable",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  "water ingress": {
    label: "Water Ingress",
    assessmentPrompts: [
      "Identify the apparent source and route of the water entry.",
      "Record whether the equipment was installed indoors or outdoors.",
      "Inspect for moisture staining, corrosion, mineral deposits and contamination.",
      "Determine whether the ingress arose from an insured event, installation defect or maintenance issue.",
      "Record whether the equipment was energised while wet."
    ],
    tests: [
      {
        key: "moisture-inspection",
        test: "Moisture-ingress inspection",
        instrument: "Visual inspection and moisture meter where applicable",
        expected: "No moisture inside electrical or electronic assemblies",
        status: "Pending",
        notes: ""
      },
      {
        key: "corrosion-inspection",
        test: "Corrosion and contamination inspection",
        instrument: "Visual inspection",
        expected: "No corrosion, deposits or conductive contamination",
        status: "Pending",
        notes: ""
      },
      {
        key: "insulation-resistance",
        test: "Insulation resistance test",
        instrument: "Insulation resistance tester",
        expected: "Insulation resistance within applicable limits",
        status: "Pending",
        notes: ""
      },
      {
        key: "enclosure-sealing",
        test: "Enclosure and cable-entry inspection",
        instrument: "Visual inspection",
        expected: "Enclosure and entries adequately sealed",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  hail: {
    label: "Hail",
    assessmentPrompts: [
      "Record the surfaces exposed to the reported hail direction.",
      "Inspect condenser fins, cabinet panels, fan guards and mounting components.",
      "Differentiate cosmetic impact from operational damage.",
      "Record whether damaged fins can be restored without compromising the coil.",
      "Confirm that electrical and refrigeration functions remain serviceable."
    ],
    tests: [
      {
        key: "condenser-fins",
        test: "Condenser-fin inspection",
        instrument: "Visual inspection",
        expected: "Fins substantially straight with unrestricted airflow",
        status: "Pending",
        notes: ""
      },
      {
        key: "fan-operation",
        test: "Condenser-fan operation",
        instrument: "Operational test",
        expected: "Fan rotates freely without abnormal noise or vibration",
        status: "Pending",
        notes: ""
      },
      {
        key: "coil-inspection",
        test: "Condenser-coil inspection",
        instrument: "Visual inspection",
        expected: "No puncture, leakage or material deformation",
        status: "Pending",
        notes: ""
      },
      {
        key: "refrigeration-operation",
        test: "Cooling and refrigeration operation",
        instrument: "Operational test and gauges where required",
        expected: "Unit produces normal cooling output",
        status: "Pending",
        notes: ""
      },
      {
        key: "cabinet-inspection",
        test: "Cabinet and mounting inspection",
        instrument: "Visual inspection",
        expected: "Cabinet and mounting remain structurally serviceable",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  theft: {
    label: "Theft",
    assessmentPrompts: [
      "Record the stolen item and the remaining installation components.",
      "Inspect for forced entry, cut wiring, damaged brackets or removed foundations.",
      "Confirm the make, model and serial number from records where the item is absent.",
      "Identify resultant damage caused during removal.",
      "Separate replacement scope from optional security upgrades."
    ],
    tests: [
      {
        key: "remaining-wiring",
        test: "Remaining wiring inspection",
        instrument: "Visual inspection and multimeter",
        expected: "Remaining wiring safe and reusable where applicable",
        status: "Pending",
        notes: ""
      },
      {
        key: "supply-test",
        test: "Supply availability test",
        instrument: "True-RMS multimeter",
        expected: "Correct supply available at the installation point",
        status: "Pending",
        notes: ""
      },
      {
        key: "mounting-damage",
        test: "Mounting and foundation inspection",
        instrument: "Visual inspection and measurement",
        expected: "Mounting point suitable for reinstatement",
        status: "Pending",
        notes: ""
      }
    ]
  },

  fire: {
    label: "Fire",
    assessmentPrompts: [
      "Identify the apparent fire origin and affected zones.",
      "Record direct flame, heat, smoke and soot damage separately.",
      "Inspect electrical insulation and heat-sensitive components.",
      "Identify consequential damage caused by firefighting activities.",
      "Record any safety limitations that prevented energisation or testing."
    ],
    tests: [
      {
        key: "heat-damage",
        test: "Heat and flame-damage inspection",
        instrument: "Visual inspection",
        expected: "No heat distortion, melting or carbonisation",
        status: "Pending",
        notes: ""
      },
      {
        key: "insulation-test",
        test: "Electrical insulation resistance",
        instrument: "Insulation resistance tester",
        expected: "Insulation resistance within applicable limits",
        status: "Pending",
        notes: ""
      },
      {
        key: "smoke-contamination",
        test: "Smoke and soot contamination inspection",
        instrument: "Visual inspection",
        expected: "No conductive or corrosive contamination",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  wind: {
    label: "Wind",
    assessmentPrompts: [
      "Record the reported wind event and direction.",
      "Inspect mounting points, brackets, fixings and exposed cabling.",
      "Distinguish wind loading from impact, misuse or inadequate installation.",
      "Record displaced, bent, detached or fractured components.",
      "Confirm whether the equipment remains operational."
    ],
    tests: [
      {
        key: "mounting-integrity",
        test: "Mounting and fixing integrity",
        instrument: "Visual inspection and physical check",
        expected: "All mounting points secure and structurally sound",
        status: "Pending",
        notes: ""
      },
      {
        key: "cabling",
        test: "Exposed cabling inspection",
        instrument: "Visual inspection and continuity tester",
        expected: "Cabling intact, supported and electrically continuous",
        status: "Pending",
        notes: ""
      },
      commonFunctionalTest
    ]
  },

  default: {
    label: "General Assessment",
    assessmentPrompts: [
      "Record the insured's description of the incident.",
      "Inspect the affected equipment and surrounding installation.",
      "Capture identifying details and serial numbers.",
      "Perform applicable electrical, mechanical or operational tests.",
      "Separate insured damage from maintenance, deterioration and installation defects."
    ],
    tests: [commonFunctionalTest]
  }
};

export function normalisePeril(peril = "") {
  return peril.trim().toLowerCase();
}

export function getPerilTemplate(peril = "") {
  const normalised = normalisePeril(peril);

  if (perilTemplates[normalised]) {
    return perilTemplates[normalised];
  }

  if (normalised.includes("lightning")) {
    return perilTemplates.lightning;
  }

  if (
    normalised.includes("surge") ||
    normalised.includes("voltage")
  ) {
    return perilTemplates["power surge"];
  }

  if (
    normalised.includes("water") ||
    normalised.includes("moisture") ||
    normalised.includes("leak")
  ) {
    return perilTemplates["water ingress"];
  }

  if (normalised.includes("hail")) {
    return perilTemplates.hail;
  }

  if (
    normalised.includes("theft") ||
    normalised.includes("stolen")
  ) {
    return perilTemplates.theft;
  }

  if (
    normalised.includes("fire") ||
    normalised.includes("smoke")
  ) {
    return perilTemplates.fire;
  }

  if (
    normalised.includes("wind") ||
    normalised.includes("storm")
  ) {
    return perilTemplates.wind;
  }

  return perilTemplates.default;
}

export function createTestsFromPeril(peril = "") {
  const template = getPerilTemplate(peril);

  return template.tests.map((test, index) => ({
    ...test,
    id: `template-${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 7)}`
  }));
}