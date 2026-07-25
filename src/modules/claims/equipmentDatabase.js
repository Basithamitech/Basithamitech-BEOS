export const equipmentDatabase = [
  {
    id: "deye-12kw-3phase",
    category: "Solar",
    manufacturer: "Deye",
    model: "SUN-12K-SG04LP3-EU",
    type: "Hybrid Inverter",
    specifications: {
      ratedPower: "12 kW",
      phases: "Three Phase",
      batteryVoltage: "48 V",
      mppt: "2",
      maxPvVoltage: "800 VDC"
    },
    requiredTests: [
      "AC Input Voltage",
      "AC Output Voltage",
      "PV Voltage",
      "PV Current",
      "Battery Voltage",
      "Battery Current",
      "Earth Continuity",
      "SPD Inspection",
      "Neutral Integrity",
      "Firmware Status"
    ]
  },

  {
    id: "sunsynk-12kw",
    category: "Solar",
    manufacturer: "Sunsynk",
    model: "12kW Hybrid 3 Phase",
    type: "Hybrid Inverter",
    specifications: {
      ratedPower: "12 kW",
      phases: "Three Phase",
      batteryVoltage: "48 V",
      mppt: "2",
      maxPvVoltage: "800 VDC"
    },
    requiredTests: [
      "AC Input Voltage",
      "AC Output Voltage",
      "PV Voltage",
      "Battery Voltage",
      "Earth Continuity",
      "SPD Inspection"
    ]
  },

  {
    id: "dyness-powerbrick-max",
    category: "Solar",
    manufacturer: "Dyness",
    model: "PowerBrick Max 16kWh",
    type: "Lithium Battery",
    specifications: {
      capacity: "16 kWh",
      voltage: "51.2 V",
      chemistry: "LiFePO4",
      communication: "CAN / RS485"
    },
    requiredTests: [
      "Battery Voltage",
      "State of Charge",
      "BMS Communication",
      "Charge Test",
      "Discharge Test",
      "Water Ingress",
      "Terminal Inspection"
    ]
  }
];

export const getCategories = () =>
  [...new Set(equipmentDatabase.map(x => x.category))];

export const getManufacturers = category =>
  [...new Set(
    equipmentDatabase
      .filter(x => x.category === category)
      .map(x => x.manufacturer)
  )];

export const getModels = (category, manufacturer) =>
  equipmentDatabase.filter(
    x =>
      x.category === category &&
      x.manufacturer === manufacturer
  );

export const getEquipment = id =>
  equipmentDatabase.find(x => x.id === id);