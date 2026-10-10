export interface DishwasherBrand {
  id: string;
  name: string;
  scaleType: string;
  programmingGuide: string;
}

export const DISHWASHER_BRANDS: DishwasherBrand[] = [
  {
    id: "bosch",
    name: "Bosch",
    scaleType: "Digital Scale (H:00 – H:07)",
    programmingGuide: "Switch on machine. Press and hold Setup 3 sec (or Programme button A and Start) until display flashes H:0x. Press + or - (or Programme button C) to change value, then press Start/Setup to save."
  },
  {
    id: "beko",
    name: "Beko",
    scaleType: "Regeneration Dial / Digital (Level 1 – 5)",
    programmingGuide: "Turn machine off. Hold Start/Pause while turning selector to position 1. Release Start/Pause. The level indicators show current setting. Rotate dial to adjust Level 1 to 5, then press Start/Pause to store."
  },
  {
    id: "miele",
    name: "Miele",
    scaleType: "Electronic Hardness Menu (°dH / °Clark)",
    programmingGuide: "Turn machine off. Hold Start/Stop and switch machine on. Release Start/Stop within 2 seconds. Select 'Water Hardness' from Settings menu. Adjust setting (1–4 or exact °dH) with arrows and press OK."
  },
  {
    id: "samsung",
    name: "Samsung",
    scaleType: "Digital Hardness Setting (H1 – H6)",
    programmingGuide: "Power off machine. Press Power while holding Delay Start or Sanitize until display shows Hx. Press Programme button repeatedly to cycle H1 through H6, then wait 5 seconds or press Power to store."
  },
  {
    id: "indesit",
    name: "Indesit",
    scaleType: "Selector Level (Level 1 – 5)",
    programmingGuide: "Turn machine off. Hold down the P button for 6 seconds until beeps sound. Press P button repeatedly to select hardness Level 1 to 5. Switch machine off to confirm."
  },
  {
    id: "siemens",
    name: "Siemens",
    scaleType: "Digital Scale (H:00 – H:07)",
    programmingGuide: "Switch on. Hold Setup button for 3 seconds. Scroll through menu using +/- buttons until 'Water Hardness' H:0x appears. Adjust to required setting and press Setup 3 sec to save."
  },
  {
    id: "neff",
    name: "Neff",
    scaleType: "Digital Scale (H:00 – H:07)",
    programmingGuide: "Switch on. Hold Programme button A and Start until display displays H:00. Press Programme button C repeatedly until required H:0x setting appears. Press Start to save."
  },
  {
    id: "hotpoint",
    name: "Hotpoint",
    scaleType: "Selector Level (Level 1 – 5)",
    programmingGuide: "Switch on, then press and hold the P button for 5 seconds until beep. LED indicator shows current level. Press P to change level (1 to 5). Turn off machine to store."
  },
  {
    id: "whirlpool",
    name: "Whirlpool",
    scaleType: "Selector Level (Level 1 – 5)",
    programmingGuide: "Press On/Off. Hold Programme button for 3 seconds. The salt indicator and level LEDs illuminate. Press Programme button to cycle Level 1 to 5. Press Start to confirm."
  },
  {
    id: "blomberg",
    name: "Blomberg",
    scaleType: "Regeneration Scale (Level 1 – 5)",
    programmingGuide: "Press On/Off. Hold Start/Cancel button for 3 seconds. Level indicator LEDs flash. Press Programme button to cycle Level 1 to 5. Press Start to save."
  }
];

export interface DishwasherCalibrationResult {
  brand: DishwasherBrand;
  ppm: number;
  clarkDegrees: number;
  germanDegrees: number;
  frenchDegrees: number;
  hardnessCategory: "Soft Water" | "Moderately Hard" | "Hard Water" | "Very Hard Water";
  settingCode: string;
  settingExplanation: string;
  saltConsumptionMonthly: string;
  requiresSalt: boolean;
  tabletsOnlyAllowed: boolean;
  rinseAidAdvice: string;
  maintenanceAdvice: string[];
  boilerDragWarning: string;
}

export function calculateDishwasherCalibration(
  brandId: string,
  ppmInput: number
): DishwasherCalibrationResult {
  const brand =
    DISHWASHER_BRANDS.find((b) => b.id.toLowerCase() === brandId.toLowerCase()) ||
    DISHWASHER_BRANDS[0];

  const ppm = Math.max(0, Math.round(ppmInput));
  const clarkDegrees = Number((ppm * 0.07).toFixed(1));
  const germanDegrees = Number((ppm * 0.056).toFixed(1));
  const frenchDegrees = Number((ppm * 0.1).toFixed(1));

  let hardnessCategory: "Soft Water" | "Moderately Hard" | "Hard Water" | "Very Hard Water" = "Soft Water";
  if (ppm > 300) {
    hardnessCategory = "Very Hard Water";
  } else if (ppm > 200) {
    hardnessCategory = "Hard Water";
  } else if (ppm > 100) {
    hardnessCategory = "Moderately Hard";
  } else {
    hardnessCategory = "Soft Water";
  }

  let settingCode = "H:04";
  let settingExplanation = "";
  let saltConsumptionMonthly = "1.0 – 1.4 kg / month";
  let requiresSalt = true;
  let tabletsOnlyAllowed = false;

  const bId = brand.id.toLowerCase();

  if (bId === "bosch" || bId === "siemens" || bId === "neff") {
    if (ppm <= 60) {
      settingCode = "H:00";
      settingExplanation = "Water softener is electronically switched OFF. No salt required.";
      saltConsumptionMonthly = "0 kg (Disabled)";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 100) {
      settingCode = "H:01";
      settingExplanation = "Minimum softening active. Minimal resin regeneration.";
      saltConsumptionMonthly = "0.1 – 0.2 kg / month";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 150) {
      settingCode = "H:02";
      settingExplanation = "Low-moderate softening active for balanced limescale protection.";
      saltConsumptionMonthly = "0.4 – 0.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 200) {
      settingCode = "H:03";
      settingExplanation = "Standard UK moderate setting. Regeneration every 3–4 cycles.";
      saltConsumptionMonthly = "0.7 – 0.9 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 250) {
      settingCode = "H:04";
      settingExplanation = "Hard water setting. Essential to protect heating elements from chalk.";
      saltConsumptionMonthly = "1.0 – 1.3 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 300) {
      settingCode = "H:05";
      settingExplanation = "High hard water setting. Active regeneration preventing cloudy glasses.";
      saltConsumptionMonthly = "1.3 – 1.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 380) {
      settingCode = "H:06";
      settingExplanation = "Very hard water setting. Maximum resin wash every 1–2 cycles.";
      saltConsumptionMonthly = "1.7 – 2.0 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else {
      settingCode = "H:07";
      settingExplanation = "Maximum extreme hardness setting. Heavy brine regeneration on every cycle.";
      saltConsumptionMonthly = "2.0 – 2.4 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    }
  } else if (bId === "beko" || bId === "blomberg") {
    if (ppm <= 100) {
      settingCode = "Level 1";
      settingExplanation = "Regeneration disabled (Soft Water mode). Salt not required.";
      saltConsumptionMonthly = "0 kg";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 150) {
      settingCode = "Level 2";
      settingExplanation = "Low hardness setting. Light salt usage.";
      saltConsumptionMonthly = "0.4 – 0.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 200) {
      settingCode = "Level 3";
      settingExplanation = "Moderate hardness setting. Recommended for mixed river supplies.";
      saltConsumptionMonthly = "0.7 – 0.9 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 300) {
      settingCode = "Level 4";
      settingExplanation = "Hard water mode. Essential for chalk and limestone areas.";
      saltConsumptionMonthly = "1.1 – 1.4 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else {
      settingCode = "Level 5";
      settingExplanation = "Maximum hardness mode for severe limescale zones (>300 PPM).";
      saltConsumptionMonthly = "1.6 – 2.1 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    }
  } else if (bId === "miele") {
    if (ppm <= 100) {
      settingCode = "1 – 4°dH (Setting 1)";
      settingExplanation = "Electronic softening set to lowest band. Resin bypassed.";
      saltConsumptionMonthly = "0 – 0.2 kg / month";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 200) {
      settingCode = "5 – 11°dH (Setting 2)";
      settingExplanation = "Moderate softening band. Calibrated for 5–11 German degrees.";
      saltConsumptionMonthly = "0.5 – 0.8 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 300) {
      settingCode = "12 – 17°dH (Setting 3)";
      settingExplanation = "Hard water band. Protects Miele Perfect GlassCare system.";
      saltConsumptionMonthly = "1.0 – 1.4 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else {
      settingCode = "18 – 70°dH (Setting 4 / Max)";
      settingExplanation = "Extreme hardness band. Full brine flush on every cycle.";
      saltConsumptionMonthly = "1.6 – 2.2 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    }
  } else if (bId === "samsung") {
    if (ppm <= 100) {
      settingCode = "H1";
      settingExplanation = "Soft water mode. Softener off.";
      saltConsumptionMonthly = "0 – 0.2 kg / month";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 150) {
      settingCode = "H2";
      settingExplanation = "Low-moderate setting.";
      saltConsumptionMonthly = "0.4 – 0.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 200) {
      settingCode = "H3";
      settingExplanation = "Standard moderate setting for typical UK municipal water.";
      saltConsumptionMonthly = "0.7 – 0.9 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 250) {
      settingCode = "H4";
      settingExplanation = "Hard water mode. Protects Samsung digital inverter pump.";
      saltConsumptionMonthly = "1.1 – 1.3 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 300) {
      settingCode = "H5";
      settingExplanation = "High hard water setting for Thames/Chalk water postcodes.";
      saltConsumptionMonthly = "1.3 – 1.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else {
      settingCode = "H6";
      settingExplanation = "Maximum hardness setting for extreme mineral areas (>300 PPM).";
      saltConsumptionMonthly = "1.8 – 2.3 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    }
  } else {
    // Indesit, Hotpoint, Whirlpool
    if (ppm <= 100) {
      settingCode = "Level 1";
      settingExplanation = "Soft water mode. Resin regeneration disabled.";
      saltConsumptionMonthly = "0 kg";
      requiresSalt = false;
      tabletsOnlyAllowed = true;
    } else if (ppm <= 150) {
      settingCode = "Level 2";
      settingExplanation = "Low hardness level for blended supplies.";
      saltConsumptionMonthly = "0.4 – 0.6 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 200) {
      settingCode = "Level 3";
      settingExplanation = "Moderate hardness level for balanced rinse aid dispersion.";
      saltConsumptionMonthly = "0.7 – 0.9 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else if (ppm <= 300) {
      settingCode = "Level 4";
      settingExplanation = "Hard water level. Essential to prevent white cloudy glass corrosion.";
      saltConsumptionMonthly = "1.1 – 1.4 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    } else {
      settingCode = "Level 5";
      settingExplanation = "Maximum level for very hard chalk water (>300 PPM).";
      saltConsumptionMonthly = "1.6 – 2.1 kg / month";
      requiresSalt = true;
      tabletsOnlyAllowed = false;
    }
  }

  const rinseAidAdvice =
    ppm > 200
      ? "Set rinse aid to Level 4 or 5. In hard water, rinse aid breaks surface tension, enabling water droplets to slide off without depositing calcium spots."
      : ppm > 100
      ? "Set rinse aid to Level 2 or 3. Provides clean drying without blue rainbow streaks."
      : "Set rinse aid to Level 1 or 2. Soft water requires minimal rinse aid; excessive dosage leaves cloudy soapy smears.";

  const maintenanceAdvice = [
    ppm > 200
      ? "Never rely exclusively on 'All-in-One' tablets in hard water (>200 PPM). Tablets only soften water during the main wash; the final hot rinse uses raw mains tap water, leaving cloudy limescale crust on glasses unless your internal ion-exchange salt chamber is active."
      : "All-in-one dishwasher tablets may suffice in soft water, but charging the salt tank to the lowest setting provides backup against seasonal water blending.",
    "Always use coarse granular dishwasher salt (Sodium Chloride purity >99.4%). Never use fine table salt or cooking salt, as anti-caking agents clog the delicate ion-exchange resin bed.",
    "Refill the salt reservoir when the low-salt indicator light illuminates on your dashboard, and immediately run a short rinse cycle to wash away any spilled grains and prevent interior stainless steel tub pitting."
  ];

  const boilerDragWarning = `Water hardness of ${ppm} PPM (${clarkDegrees}° Clark) also creates scale inside combi boiler heat exchangers, causing up to 10%–15% annual thermal efficiency loss under British Standard BS 7593.`;

  return {
    brand,
    ppm,
    clarkDegrees,
    germanDegrees,
    frenchDegrees,
    hardnessCategory,
    settingCode,
    settingExplanation,
    saltConsumptionMonthly,
    requiresSalt,
    tabletsOnlyAllowed,
    rinseAidAdvice,
    maintenanceAdvice,
    boilerDragWarning
  };
}
