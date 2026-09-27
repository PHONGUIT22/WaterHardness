export interface SupplierFaqItem {
  question: string;
  answer: string;
}

export interface SupplierMetadata {
  slug: string;
  name: string;
  dbPattern: string;
  region: string;
  tagline: string;
  waterSource: string;
  waterSourceType: "chalk_groundwater" | "surface_reservoir" | "mixed_catchment" | "upland_granite";
  typicalPpmRange: string;
  hardnessCategory: "Soft Water" | "Moderately Soft" | "Moderately Hard" | "Hard Water" | "Very Hard Water";
  majorCities: string[];
  metaTitle: string;
  metaDescription: string;
  quickAnswer: {
    isHard: boolean;
    summary: string;
    sourceBreakdown: string;
    limescaleRisk: "Very Low" | "Low" | "Moderate" | "High" | "Severe";
  };
  applianceGuidance: {
    kettle: string;
    dishwasher: string;
    boiler: string;
    softenerRecommended: boolean;
    softenerAdvice: string;
  };
  faqItems: SupplierFaqItem[];
}

export const suppliersData: SupplierMetadata[] = [
  {
    slug: "thames-water",
    name: "Thames Water",
    dbPattern: "%Thames Water%",
    region: "Greater London, Thames Valley, Surrey & Gloucestershire",
    tagline: "The UK's largest water utility supplying over 16 million customers across London and the Thames Valley",
    waterSource: "70% River Thames & River Lee abstraction, 30% Underground Cretaceous chalk boreholes",
    waterSourceType: "mixed_catchment",
    typicalPpmRange: "260 – 320 PPM (mg/L CaCO3)",
    hardnessCategory: "Hard Water",
    majorCities: ["London", "Reading", "Oxford", "Swindon", "Slough", "Guildford", "Luton"],
    metaTitle: "Thames Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Thames Water hardness across London & Thames Valley postcodes. Official DWI PPM ratings, chalk aquifer facts, kettle care & boiler protection.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, Thames Water tap water is hard to very hard across virtually its entire operational network, averaging 275 PPM (19.3° Clark). Rain filtering through the porous Cretaceous chalk of the Chilterns and North Downs dissolves heavy concentrations of calcium and magnesium carbonate.",
      sourceBreakdown: "Roughly 70% of drinking water is pumped from the River Thames and River Lee (both fed by spring waters from chalk hills), while 30% is pumped directly from deep subterranean chalk boreholes.",
      limescaleRisk: "High",
    },
    applianceGuidance: {
      kettle: "Descale monthly using 50g of citric acid powder boiled in 500ml water to dissolve mineral crust.",
      dishwasher: "Calibrate to H05 on Bosch/Neff/Siemens or Level 4 on Beko. Do not rely exclusively on all-in-one tablets.",
      boiler: "Under Building Regulations Part L and BS 7593, an inline scale inhibitor or water softener is required for combi boilers (>200 PPM).",
      softenerRecommended: true,
      softenerAdvice: "An ion-exchange water softener completely eliminates chalk scale from shower screens, taps, and boiler heat exchangers, saving £140–£200 annually on gas and detergents."
    },
    faqItems: [
      {
        question: "Is Thames Water hard or soft?",
        answer: "Thames Water supplies hard to very hard tap water, averaging roughly 275 PPM (19.3° Clark) in Greater London and the Thames Valley. Sourced from chalk-fed rivers and underground aquifers, it contains high concentrations of dissolved calcium and magnesium."
      },
      {
        question: "How do I check water hardness from my Thames Water bill?",
        answer: "Your Thames Water bill lists your customer account number and supply address. Using your postal outcode (e.g. SW1A, RG1, OX1), you can check your exact local PPM rating and water quality zone on our postcode directory."
      },
      {
        question: "Do I need a water softener with Thames Water?",
        answer: "While Thames Water is completely safe to drink, installing an ion-exchange water softener is strongly recommended for homeowners to prevent rapid limescale build-up in combi boilers, kettles, washing machines, and luxury shower screens."
      },
      {
        question: "What dishwasher salt setting should I use for Thames Water?",
        answer: "Set your dishwasher water softener dial to setting H05 (or Level 4). In Thames Water zones, all-in-one dishwasher tablets fail to prevent internal resin fouling, so keeping the salt compartment charged is essential."
      }
    ]
  },
  {
    slug: "severn-trent-water",
    name: "Severn Trent Water",
    dbPattern: "%Severn Trent%",
    region: "West Midlands, East Midlands, Gloucestershire & Mid-Wales",
    tagline: "Supplying 8 million customers across the heart of England from the Welsh border to the Humber",
    waterSource: "Blend of Welsh upland reservoirs (Elan Valley), lowland rivers (Severn & Derwent), and Sherwood sandstone boreholes",
    waterSourceType: "mixed_catchment",
    typicalPpmRange: "40 – 300 PPM (Varies dramatically by region)",
    hardnessCategory: "Moderately Hard",
    majorCities: ["Birmingham", "Coventry", "Nottingham", "Leicester", "Derby", "Stoke-on-Trent", "Worcester"],
    metaTitle: "Severn Trent Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Severn Trent water hardness across the Midlands. Official DWI PPM ratings, soft water in Birmingham vs hard water in Nottingham, boiler advice.",
    quickAnswer: {
      isHard: false,
      summary: "Severn Trent spans a dramatic hydrogeological divide: Birmingham and the Black Country receive naturally soft water (40–60 PPM) piped 73 miles from Wales, whereas Nottingham, Leicester, and Derby receive hard water (220–290 PPM) from lowland rivers and sandstone aquifers.",
      sourceBreakdown: "Western supplies originate in impermeable gritstone and slate catchments of the Welsh Elan Valley. Eastern supplies rely heavily on the River Trent, River Derwent, and Sherwood sandstone boreholes rich in minerals.",
      limescaleRisk: "Moderate",
    },
    applianceGuidance: {
      kettle: "If in Birmingham, descaling is rarely needed. If in Nottingham, Leicester, or Derby, descale monthly with citric acid.",
      dishwasher: "Birmingham: set to H00 or H01 (salt optional). East Midlands: set to H04 or H05 with mandatory salt top-ups.",
      boiler: "East Midlands addresses require BS 7593 compliant inline scale protection. West Midlands homes should focus on corrosion inhibitors.",
      softenerRecommended: false,
      softenerAdvice: "Not recommended for Birmingham or Wolverhampton (already soft). Highly beneficial in Nottingham and Leicester homes suffering from hard water deposits."
    },
    faqItems: [
      {
        question: "Is Severn Trent water hard or soft?",
        answer: "It depends entirely on your city. Birmingham receives naturally soft water (around 45 PPM) from the Welsh Elan Valley. In contrast, East Midlands towns like Nottingham and Leicester receive hard water (240–280 PPM)."
      },
      {
        question: "Why is tap water in Birmingham soft while Nottingham is hard?",
        answer: "Birmingham's water flows by gravity through the Elan Aqueduct from upland Welsh reservoirs resting on insoluble slate rock. Nottingham abstracts water from the River Trent catchment and deep mineralized sandstone boreholes."
      },
      {
        question: "Do I need dishwasher salt in Severn Trent areas?",
        answer: "If you live in B postcodes (Birmingham), dishwasher salt is optional. In NG, LE, DE, or CV postcodes, water hardness is moderate to hard, so keeping the salt reservoir filled is mandatory to avoid cloudy glassware."
      },
      {
        question: "Does Severn Trent water damage combi boilers?",
        answer: "In East Midlands regions, uninhibited hard water causes rapid heat exchanger calcification. Fitting an inline electrolytic scale inhibitor is recommended under British Standard BS 7593."
      }
    ]
  },
  {
    slug: "anglian-water",
    name: "Anglian Water",
    dbPattern: "%Anglian Water%",
    region: "East Anglia, Bedfordshire, Northamptonshire & Lincolnshire",
    tagline: "Managing the largest geographic licensed water and water recycling area in England and Wales",
    waterSource: "50% Underground Cretaceous chalk aquifers, 50% Surface reservoirs fed by lowland rivers",
    waterSourceType: "chalk_groundwater",
    typicalPpmRange: "290 – 360+ PPM (mg/L CaCO3)",
    hardnessCategory: "Very Hard Water",
    majorCities: ["Norwich", "Ipswich", "Cambridge", "Peterborough", "Northampton", "Milton Keynes", "Colchester"],
    metaTitle: "Anglian Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Anglian Water hardness across Norfolk, Suffolk & Cambs. Official DWI PPM ratings (300-360 PPM), chalk aquifer geology & boiler protection.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, Anglian Water supplies some of the hardest drinking water in the British Isles, averaging 310 PPM and frequently exceeding 350 PPM. East Anglia sits atop a massive Cretaceous chalk aquifer with minimal annual rainfall, resulting in extreme mineral saturation.",
      sourceBreakdown: "Half of public tap water is pumped from deep agricultural and chalk boreholes across Norfolk, Suffolk, and Cambridgeshire; the other half is stored in lowland reservoirs like Rutland Water and Grafham Water.",
      limescaleRisk: "Severe",
    },
    applianceGuidance: {
      kettle: "Descale every 2 weeks. Thick stone-like calcium crust forms rapidly without frequent citric acid treatment.",
      dishwasher: "Set to maximum setting H06 or H07 (Bosch) or Level 5 (Beko). Always maintain granular salt to avoid permanent glass etching.",
      boiler: "Mandatory Part L scale prevention (>200 PPM). A 1.2mm scale layer reduces heating efficiency by 10%, adding £150+ to annual gas bills.",
      softenerRecommended: true,
      softenerAdvice: "A dual-cylinder ion-exchange water softener is virtually standard in East Anglian homes, paying for itself within 3–4 years through appliance longevity and energy savings."
    },
    faqItems: [
      {
        question: "How hard is water in the Anglian Water region?",
        answer: "Anglian Water tap water is classified as very hard to extremely hard, ranging between 290 and 360+ PPM (20.3° to 25.2° Clark). Norwich, Ipswich, and Bury St Edmunds routinely record some of the highest mineral counts in the UK."
      },
      {
        question: "Why is East Anglia water so hard?",
        answer: "East Anglia is underlain by the primary English Chalk aquifer and receives the lowest rainfall in the UK. Rain remains underground in chalk strata for prolonged periods, dissolving high amounts of calcium and magnesium bicarbonate."
      },
      {
        question: "What dishwasher setting should I use in Anglian Water territory?",
        answer: "Select the highest hardness setting on your appliance (H06/H07 on Bosch/Siemens, or Level 5 on Beko). Never run appliances without salt in this region."
      },
      {
        question: "Will hard water damage my boiler in Norfolk or Suffolk?",
        answer: "Yes, combi boiler secondary heat exchangers can choke with scale within 12 to 18 months in untreated 330+ PPM water. Fitting an inline scale inhibitor is mandatory under Building Regulations Part L."
      }
    ]
  },
  {
    slug: "united-utilities",
    name: "United Utilities",
    dbPattern: "%United Utilities%",
    region: "North West England (Greater Manchester, Merseyside, Cheshire, Cumbria, Lancashire)",
    tagline: "Supplying 7 million people across North West England from the Lake District to Cheshire",
    waterSource: "Upland impounding reservoirs in the Lake District (Thirlmere, Haweswater) and Pennines",
    waterSourceType: "surface_reservoir",
    typicalPpmRange: "25 – 65 PPM (mg/L CaCO3)",
    hardnessCategory: "Soft Water",
    majorCities: ["Manchester", "Liverpool", "Preston", "Bolton", "Warrington", "Blackpool", "Carlisle"],
    metaTitle: "United Utilities Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check United Utilities water hardness across Manchester, Liverpool & Cumbria. Official DWI PPM ratings, Lake District soft water facts & boiler care.",
    quickAnswer: {
      isHard: false,
      summary: "No, United Utilities delivers naturally soft water across almost all of North West England, averaging just 45 PPM (3.2° Clark). Sourced from the remote volcanic fells of the Lake District and Pennine moors, it causes minimal limescale.",
      sourceBreakdown: "The majority of water is gravity-fed via historic aqueducts from Thirlmere and Haweswater in Cumbria, flowing over ancient, insoluble Borrowdale volcanic rocks that contain negligible soluble calcium.",
      limescaleRisk: "Very Low",
    },
    applianceGuidance: {
      kettle: "Rarely requires descaling. A quick warm rinse once every 6 months is plenty to maintain element cleanliness.",
      dishwasher: "Set to Level 1 or H01. You will rarely need to refill dishwasher salt when using standard multi-benefit tablets.",
      boiler: "Limescale blockage is extremely rare. However, soft upland water can be slightly acidic, making annual corrosion inhibitor dosing under BS 7593 essential to prevent radiator sludge.",
      softenerRecommended: false,
      softenerAdvice: "Installing an ion-exchange water softener in Manchester, Liverpool, or Lancashire is completely unnecessary."
    },
    faqItems: [
      {
        question: "Is water hard or soft in United Utilities areas?",
        answer: "Tap water supplied by United Utilities is naturally soft to very soft, averaging around 45 PPM (3.2° Clark). It lathers instantly with soap and leaves virtually zero chalky scale in kettles."
      },
      {
        question: "Where does Manchester and Liverpool drinking water come from?",
        answer: "Most tap water is transported from reservoirs in the Lake District (such as Thirlmere and Haweswater) and the Forest of Bowland via the Thirlmere and Vyrnwy Aqueducts."
      },
      {
        question: "Do I need a water softener in North West England?",
        answer: "No. United Utilities supplies some of the softest water in England. Purchasing an ion-exchange water softener is unnecessary and offers no benefit."
      },
      {
        question: "What dishwasher setting is best for United Utilities customers?",
        answer: "Set your dishwasher water hardness regulator to Level 1 (or H01). This saves bags of salt and prevents unnecessary chemical discharge."
      }
    ]
  },
  {
    slug: "yorkshire-water",
    name: "Yorkshire Water",
    dbPattern: "%Yorkshire Water%",
    region: "North, South, West, and East Yorkshire",
    tagline: "Serving 5.7 million people and 140,000 businesses across the historic county of Yorkshire",
    waterSource: "Pennine moorland reservoirs (West/South) and deep Cretaceous chalk boreholes (East)",
    waterSourceType: "mixed_catchment",
    typicalPpmRange: "60 – 340 PPM (Split along Magnesian Limestone ridge)",
    hardnessCategory: "Moderately Soft",
    majorCities: ["Leeds", "Sheffield", "Bradford", "York", "Hull", "Huddersfield", "Harrogate"],
    metaTitle: "Yorkshire Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Yorkshire Water hardness across Leeds, Sheffield, York & Hull. Official DWI PPM ratings, Pennine vs chalk aquifer geology & appliance tips.",
    quickAnswer: {
      isHard: false,
      summary: "Yorkshire Water features a striking geological divide: West and South Yorkshire (Leeds, Sheffield, Bradford) enjoy soft water (60–100 PPM) from gritstone Pennine moors, whereas East Yorkshire (Hull, Beverley) receives very hard chalk borehole water (300–340 PPM).",
      sourceBreakdown: "West Yorkshire draws from upland reservoirs in the Washburn Valley and Peak District; East Yorkshire sits on the Cretaceous chalk of the Yorkshire Wolds and relies on deep groundwater extraction.",
      limescaleRisk: "Moderate",
    },
    applianceGuidance: {
      kettle: "Leeds/Sheffield: descale biannually. Hull/East Riding: descale every 3–4 weeks with citric acid crystals.",
      dishwasher: "West Yorkshire: set to H02 or Level 2. East Yorkshire: set to H05 or Level 4 with dedicated salt.",
      boiler: "East Yorkshire combi boilers must comply with Part L scale inhibitor rules (>200 PPM). West Yorkshire homes require standard BS 7593 inhibitor.",
      softenerRecommended: false,
      softenerAdvice: "Unnecessary in Leeds, Sheffield, and Bradford. Highly recommended for homeowners in Hull, Beverley, and the East Riding."
    },
    faqItems: [
      {
        question: "Is Yorkshire Water hard or soft?",
        answer: "It depends on whether you live east or west of the limestone ridge. Leeds and Sheffield have soft to moderate water (70–90 PPM), while Hull and East Yorkshire have very hard water (over 300 PPM)."
      },
      {
        question: "Why is Yorkshire Tea so famous for water compatibility?",
        answer: "Taylors of Harrogate originally blended Yorkshire Tea for the soft, peat-filtered waters of West Yorkshire. The lack of calcium allows delicate tea aromatics to brew cleanly without floating scum."
      },
      {
        question: "Do I need dishwasher salt in Leeds?",
        answer: "In Leeds (LS postcodes), water is moderately soft (around 85–120 PPM). Setting your machine to Level 2 provides optimal results with low salt consumption."
      },
      {
        question: "Why is water so hard in Hull?",
        answer: "Hull sits on the Yorkshire Wolds Cretaceous chalk formation. Yorkshire Water abstracts groundwater from deep chalk boreholes, resulting in natural mineral concentrations exceeding 330 PPM."
      }
    ]
  },
  {
    slug: "scottish-water",
    name: "Scottish Water",
    dbPattern: "%Scottish Water%",
    region: "Scotland (All 32 Council Areas)",
    tagline: "Publicly owned water supplier providing over 1.5 billion litres of fresh drinking water every day across Scotland",
    waterSource: "Highland lochs, mountain streams, and upland impounding reservoirs (e.g. Loch Katrine)",
    waterSourceType: "upland_granite",
    typicalPpmRange: "15 – 45 PPM (mg/L CaCO3)",
    hardnessCategory: "Soft Water",
    majorCities: ["Glasgow", "Edinburgh", "Aberdeen", "Dundee", "Inverness", "Stirling", "Perth"],
    metaTitle: "Scottish Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Scottish Water hardness across Glasgow, Edinburgh & Aberdeen. Official DWI PPM ratings, highland loch soft water science & appliance guide.",
    quickAnswer: {
      isHard: false,
      summary: "No, Scottish Water is famously and naturally soft across the entire country, averaging between 15 and 35 PPM (1 to 2.5° Clark). Scotland's ancient bedrock consists of impermeable granite and metamorphic schists with virtually no chalk or limestone.",
      sourceBreakdown: "Over 90% of drinking water is collected from surface lochs and mountain impounding reservoirs like Loch Katrine (serving Glasgow) and Megget Reservoir (serving Edinburgh).",
      limescaleRisk: "Very Low",
    },
    applianceGuidance: {
      kettle: "Virtually zero limescale. Kettles stay mirror-bright for years with standard rinsing.",
      dishwasher: "Set to Level 0 or 1. Water softener salt is completely optional, and multi-benefit pods handle all washing needs.",
      boiler: "Zero scale buildup on heat exchangers. However, peaty upland runoff can be slightly acidic, making annual inhibitor testing under BS 7593 important.",
      softenerRecommended: false,
      softenerAdvice: "Never install an ion-exchange water softener in Scotland; the water is already as soft as pure rain."
    },
    faqItems: [
      {
        question: "Is water in Scotland hard or soft?",
        answer: "Scottish tap water is naturally ultra-soft across the nation, typically testing between 15 and 35 PPM (under 2.5° Clark). It lathers instantly and leaves zero chalk scum on tea or sanitaryware."
      },
      {
        question: "Why is tap water in Scotland so soft?",
        answer: "Scotland's geology is dominated by ancient crystalline granite, basalt, and schists. Rain falling across the Highlands absorbs virtually no soluble calcium carbonate as it drains into natural lochs."
      },
      {
        question: "Do I need dishwasher salt in Glasgow or Edinburgh?",
        answer: "No. With hardness ratings under 30 PPM, dishwasher salt regeneration is unnecessary. Set the internal machine dial to H00 or H01."
      },
      {
        question: "Does soft Scottish water damage central heating systems?",
        answer: "While soft water prevents limescale, low mineral alkalinity can promote internal radiator corrosion if left untreated. Always ensure corrosion inhibitors (like Sentinel X100) are dosed annually."
      }
    ]
  },
  {
    slug: "welsh-water",
    name: "Dŵr Cymru Welsh Water",
    dbPattern: "%Welsh Water%",
    region: "Wales and Herefordshire",
    tagline: "The only not-for-profit water utility in England and Wales, protecting Welsh catchments and communities",
    waterSource: "Upland mountain reservoirs in the Brecon Beacons, Snowdonia, and Elan Valley",
    waterSourceType: "upland_granite",
    typicalPpmRange: "25 – 80 PPM (mg/L CaCO3)",
    hardnessCategory: "Soft Water",
    majorCities: ["Cardiff", "Swansea", "Newport", "Wrexham", "Bangor", "Hereford"],
    metaTitle: "Welsh Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Dŵr Cymru Welsh Water hardness across Cardiff, Swansea & Newport. Official DWI PPM ratings, Brecon Beacons soft water facts & appliance guide.",
    quickAnswer: {
      isHard: false,
      summary: "No, Dŵr Cymru Welsh Water delivers naturally soft tap water across over 90% of Wales, averaging 45 PPM (3.2° Clark). Rainfall flowing across the ancient gritstones and sandstones of the Brecon Beacons and Snowdonia collects minimal dissolved minerals.",
      sourceBreakdown: "Water is drawn primarily from upland impounding reservoirs such as Llwyn-on, Cantref, and Talybont, with small localized groundwater boreholes in Flintshire and Pembrokeshire.",
      limescaleRisk: "Very Low",
    },
    applianceGuidance: {
      kettle: "Limescale formation is negligible. Descaling once every 6 months is more than sufficient.",
      dishwasher: "Set to Level 1 or H01 on digital displays. Detergent usage can be safely reduced by 30% compared to southern England recipes.",
      boiler: "No scale risk for combi boilers. Dose corrosion inhibitors during annual service to comply with BS 7593.",
      softenerRecommended: false,
      softenerAdvice: "Do not install a water softener in Cardiff, Swansea, or Newport; tap water is naturally soft."
    },
    faqItems: [
      {
        question: "Is water hard in Cardiff and Swansea?",
        answer: "No, tap water across South Wales is naturally soft to moderately soft, averaging between 40 and 70 PPM. It lathers easily and produces clean, scum-free tea."
      },
      {
        question: "Where does Welsh Water get its drinking supply?",
        answer: "Dŵr Cymru abstracts over 90% of its drinking water from upland reservoirs situated in national parks, including the Brecon Beacons and Eryri (Snowdonia)."
      },
      {
        question: "Is water hard anywhere in Wales?",
        answer: "A few border pockets in Flintshire, Wrexham, and parts of Pembrokeshire draw from local limestone aquifers where hardness can rise to 120–160 PPM. Over 90% of Welsh customers enjoy soft water."
      },
      {
        question: "Do I need a water softener in Wales?",
        answer: "No. Installing an ion-exchange water softener in Wales is unnecessary and an unjustified expense."
      }
    ]
  },
  {
    slug: "south-west-water",
    name: "South West Water",
    dbPattern: "%South West Water%",
    region: "Devon, Cornwall, and small parts of Dorset & Somerset (Pennon Group)",
    tagline: "Supplying 1.8 million residents and millions of seasonal visitors across England's South West peninsula",
    waterSource: "Dartmoor and Bodmin Moor granite reservoirs (Burrator, Roadford, Colliford)",
    waterSourceType: "upland_granite",
    typicalPpmRange: "30 – 190 PPM (Split between granite moors and East Devon)",
    hardnessCategory: "Soft Water",
    majorCities: ["Plymouth", "Exeter", "Torquay", "Truro", "Barnstaple", "Penzance"],
    metaTitle: "South West Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check South West Water hardness across Plymouth, Exeter & Cornwall. Official DWI PPM ratings, Dartmoor soft water facts & East Devon borehole advice.",
    quickAnswer: {
      isHard: false,
      summary: "Approximately 85% of South West Water customers receive soft water (30–65 PPM) sourced from Dartmoor and Bodmin Moor granite catchments. Plymouth has some of the purest soft water in England (34 PPM), while East Devon (Honiton, Sidmouth) receives moderately hard groundwater (180–210 PPM).",
      sourceBreakdown: "West Devon and Cornwall draw from high moorland reservoirs (Burrator, Roadford, Stithians). East Devon relies on Otter Valley sandstone and greensand boreholes.",
      limescaleRisk: "Low",
    },
    applianceGuidance: {
      kettle: "In Plymouth and Cornwall, descaling is rarely needed. In East Devon (EX10, EX14), descale monthly.",
      dishwasher: "Set to Level 1 in Plymouth, Exeter, and Truro. Set to Level 3 in Honiton and Axminster.",
      boiler: "Combi boiler scale protection under Part L is only necessary in East Devon. All homes must maintain BS 7593 inhibitor levels.",
      softenerRecommended: false,
      softenerAdvice: "Unnecessary for 85% of households. Homeowners in East Devon with hard borehole water may benefit from a water softener."
    },
    faqItems: [
      {
        question: "Is South West Water tap water hard or soft?",
        answer: "For the vast majority of Devon and Cornwall, tap water is naturally soft (35–65 PPM). Only localized areas in East Devon (Honiton, Axminster) experience moderately hard water from sandstone boreholes."
      },
      {
        question: "Why is Plymouth water so soft?",
        answer: "Plymouth's supply comes from Burrator Reservoir on Dartmoor, where rain falls over ancient impermeable granite tors, absorbing almost zero calcium carbonate."
      },
      {
        question: "Do I need a water softener in Devon or Cornwall?",
        answer: "In Plymouth, Exeter, Torbay, and Cornwall, no. You only need to consider a water softener if you live in the East Devon groundwater zone (EX10, EX12, EX14)."
      },
      {
        question: "What dishwasher setting should I use in Exeter?",
        answer: "Exeter averages 50 PPM (soft). Set your dishwasher to Level 1 or H01 to prevent unnecessary salt consumption."
      }
    ]
  },
  {
    slug: "southern-water",
    name: "Southern Water",
    dbPattern: "%Southern Water%",
    region: "Hampshire, West Sussex, East Sussex, and Kent",
    tagline: "Providing essential water services to 2.6 million customers across the southern coastal counties",
    waterSource: "70% Deep groundwater chalk boreholes (South Downs & North Downs), 23% Chalk-fed rivers (Test & Itchen)",
    waterSourceType: "chalk_groundwater",
    typicalPpmRange: "260 – 310 PPM (mg/L CaCO3)",
    hardnessCategory: "Hard Water",
    majorCities: ["Southampton", "Brighton", "Portsmouth", "Winchester", "Hastings", "Canterbury"],
    metaTitle: "Southern Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Southern Water hardness across Southampton, Brighton & Kent. Official DWI PPM ratings, South Downs chalk geology, kettle care & boiler protection.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, Southern Water delivers hard to very hard tap water across Hampshire, Sussex, and Kent, averaging 280 PPM (19.6° Clark). The South Downs and North Downs chalk hills act as enormous calcium sponges, saturating groundwater before abstraction.",
      sourceBreakdown: "Over 70% of drinking water is extracted from underground chalk boreholes, while 23% is abstracted from chalk-fed rivers including the world-famous chalk streams of the River Test and River Itchen.",
      limescaleRisk: "High",
    },
    applianceGuidance: {
      kettle: "Descale monthly using 50g citric acid powder to dissolve hard calcium carbonate crust.",
      dishwasher: "Set to Level 4 or H05. Always maintain coarse granular salt in the bottom reservoir.",
      boiler: "British Standard BS 7593 and Part L mandate permanent inline scale protection for boilers on supplies above 200 PPM.",
      softenerRecommended: true,
      softenerAdvice: "Highly recommended for homeowners in Southampton, Brighton, and Sussex to eliminate bathroom limescale and prevent boiler heat exchanger calcification."
    },
    faqItems: [
      {
        question: "Is tap water hard in Southern Water areas?",
        answer: "Yes, Southern Water supplies hard to very hard tap water averaging 280 PPM across Hampshire, Sussex, and Kent due to the vast Cretaceous chalk downlands."
      },
      {
        question: "Why is water so hard in Brighton and Southampton?",
        answer: "Brighton and Southampton draw drinking water from deep boreholes in the South Downs chalk formation and the chalk-fed River Test, both laden with dissolved limestone minerals."
      },
      {
        question: "Do I need dishwasher salt in Southern Water territory?",
        answer: "Yes, absolutely. Calibrate your dishwasher to Level 4 or H05. Without regeneration salt, glasses will develop a permanent cloudy mineral film."
      },
      {
        question: "Does Southern Water cause limescale in boilers?",
        answer: "Yes. In untreated 280 PPM water, calcium carbonate bakes onto combi boiler heat exchangers, degrading heat transfer efficiency by 7–10% within two years."
      }
    ]
  },
  {
    slug: "wessex-water",
    name: "Wessex Water",
    dbPattern: "%Wessex Water%",
    region: "Bath, Bristol, Somerset, Wiltshire, and Dorset",
    tagline: "Top-performing water and sewerage company serving 2.8 million customers in the South West of England",
    waterSource: "75% Groundwater boreholes and springs in Jurassic oolitic limestone and southern chalk",
    waterSourceType: "chalk_groundwater",
    typicalPpmRange: "250 – 315 PPM (mg/L CaCO3)",
    hardnessCategory: "Very Hard Water",
    majorCities: ["Bath", "Bristol", "Dorchester", "Salisbury", "Bournemouth", "Trowbridge", "Taunton"],
    metaTitle: "Wessex Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Wessex Water hardness across Bath, Bristol, Somerset & Dorset. Official DWI PPM ratings, Jurassic limestone facts, kettle care & boiler tips.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, tap water supplied by Wessex Water across Bath, Somerset, Wiltshire, and Dorset is hard to very hard, averaging 290 PPM (20.3° Clark). Rich in calcium carbonate dissolved from famous Jurassic oolitic limestone (Bath Stone) and southern chalk hills.",
      sourceBreakdown: "Wessex Water abstracts roughly 75% of drinking water from groundwater springs and boreholes sunk into limestone and chalk strata, with the remainder from lowland reservoirs.",
      limescaleRisk: "Severe",
    },
    applianceGuidance: {
      kettle: "Descale every 3–4 weeks with citric acid powder. Heavy scale crust reduces heating speed and taints tea.",
      dishwasher: "Set to Level 4 or H05. Never rely solely on all-in-one tablets in Wessex Water territory.",
      boiler: "Comply with Part L building regulations by fitting an approved inline scale reducer or water softener.",
      softenerRecommended: true,
      softenerAdvice: "An ion-exchange water softener provides dramatic relief for Bath and Somerset households, keeping shower glass clear and preventing boiler breakdowns."
    },
    faqItems: [
      {
        question: "How hard is water in the Wessex Water region?",
        answer: "Wessex Water tap water averages between 250 and 315 PPM (17.5° to 22.0° Clark), classifying it firmly as hard to very hard."
      },
      {
        question: "Why is water so hard in Bath and Somerset?",
        answer: "The region sits on Jurassic oolitic limestone (Bath Stone) and the chalk hills of Salisbury Plain. Rain dissolving through these rocks creates mineral-dense groundwater."
      },
      {
        question: "What dishwasher setting should I use in Wessex Water areas?",
        answer: "Set your dishwasher water hardness dial to H05 on Bosch/Neff/Siemens, or Level 4 on Beko, and ensure granular salt is consistently replenished."
      },
      {
        question: "Do boilers break down faster in Wessex Water areas?",
        answer: "Yes, limescale accumulation on secondary plate heat exchangers causes kettling noises and temperature fluctuations, requiring BS 7593 scale inhibitors."
      }
    ]
  },
  {
    slug: "affinity-water",
    name: "Affinity Water",
    dbPattern: "%Affinity Water%",
    region: "Central (Herts, Bucks, N London), Southeast (Surrey), and Eastern (Essex)",
    tagline: "The UK's largest water-only supply company delivering 950 million litres daily to 3.8 million customers",
    waterSource: "65% Deep underground chalk aquifers (Chiltern Hills and North Downs), 35% River abstraction",
    waterSourceType: "chalk_groundwater",
    typicalPpmRange: "280 – 340 PPM (mg/L CaCO3)",
    hardnessCategory: "Very Hard Water",
    majorCities: ["Woking", "St Albans", "Watford", "Luton", "Hemel Hempstead", "Stevenage", "Harlow"],
    metaTitle: "Affinity Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check Affinity Water hardness by postcode (280-340 PPM) across Surrey, Herts & Essex. Official DWI PPM ratings, limescale tips & dishwasher settings.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, Affinity Water delivers some of the hardest tap water in Great Britain, averaging 290 to 325 PPM (20.3° to 22.8° Clark). Over 65% of supply is drawn directly from deep chalk aquifers beneath Hertfordshire, Buckinghamshire, and Surrey.",
      sourceBreakdown: "Water is abstracted from deep boreholes in the Chiltern Hills and North Downs chalk beds, with additional surface water blended from the River Thames and lowland Essex rivers.",
      limescaleRisk: "Severe",
    },
    applianceGuidance: {
      kettle: "Descale every 2–3 weeks with citric acid crystals. Never let calcium crust bake permanently onto heating bases.",
      dishwasher: "Calibrate to H05 or H06 on Bosch/Neff, or Level 4 on Beko. Do not run appliances without salt.",
      boiler: "Mandatory scale reduction on boiler cold feeds under Building Regulations Part L (>200 PPM).",
      softenerRecommended: true,
      softenerAdvice: "A whole-house water softener is standard in modern Surrey and Hertfordshire homes, protecting thermostatic showers and unvented hot water cylinders."
    },
    faqItems: [
      {
        question: "Is Affinity Water tap water hard or soft?",
        answer: "Affinity Water tap water is classified as very hard, averaging between 280 and 340 PPM. Over 65% is abstracted from natural chalk aquifers beneath Hertfordshire, Buckinghamshire, and Surrey."
      },
      {
        question: "What is the water hardness in Woking?",
        answer: "Woking (GU21/GU22) averages 290 to 310 PPM (very hard). Sourced from Surrey greensand and chalk boreholes blended with Thames water, it forms scale in kettles within days."
      },
      {
        question: "What dishwasher salt setting should I use for Affinity Water?",
        answer: "Set your dishwasher water softener dial to H05 or H06 on Bosch/Siemens, or Level 4 on Beko. Running appliances without salt leads to cloudy glasses and heater burnout."
      },
      {
        question: "Does Affinity Water cause combi boiler scale?",
        answer: "Yes. Untreated Affinity Water causes a 1.2mm scale layer to accumulate within two years, increasing annual gas bills by £130 to £190 under BS 7593 guidelines."
      }
    ]
  },
  {
    slug: "south-east-water",
    name: "South East Water",
    dbPattern: "%South East Water%",
    region: "Kent, Sussex, Surrey, Hampshire, and Berkshire",
    tagline: "Supplying top quality drinking water to 2.3 million customers across south east England",
    waterSource: "75% Groundwater from deep chalk aquifers and greensand strata, 25% River reservoirs",
    waterSourceType: "chalk_groundwater",
    typicalPpmRange: "260 – 310 PPM (mg/L CaCO3)",
    hardnessCategory: "Hard Water",
    majorCities: ["Maidstone", "Basingstoke", "Tunbridge Wells", "Ashford", "Wokingham", "Eastbourne"],
    metaTitle: "South East Water Hardness: Official DWI PPM Ratings & Map",
    metaDescription: "Check South East Water hardness across Kent, Sussex, Surrey & Berks. Official DWI PPM ratings, chalk aquifer facts, boiler protection & kettle care.",
    quickAnswer: {
      isHard: true,
      summary: "Yes, South East Water delivers hard to very hard tap water, averaging 270 PPM (18.9° Clark). Three-quarters of supply is pumped from deep underground chalk and greensand aquifers across the North Downs and Weald.",
      sourceBreakdown: "75% of drinking water is abstracted from underground chalk boreholes, while 25% comes from surface water reservoirs like Bewl Water and Arlington Reservoir.",
      limescaleRisk: "High",
    },
    applianceGuidance: {
      kettle: "Descale monthly using food-grade citric acid powder to dissolve calcium crust before it flakes.",
      dishwasher: "Set machine hardness dial to Level 4 or H05. Maintain coarse granular salt in the reservoir.",
      boiler: "Inline scale reducers or whole-house softeners are required under Building Regulations Part L for all new boiler installations.",
      softenerRecommended: true,
      softenerAdvice: "Installing a water softener in Kent, Sussex, or Berkshire eliminates stubborn bathroom scale marks and prolongs heating appliance life."
    },
    faqItems: [
      {
        question: "Is South East Water hard or soft?",
        answer: "South East Water delivers hard to very hard drinking water across Kent, Sussex, Surrey, and Berkshire, averaging 270 PPM (18.9° Clark)."
      },
      {
        question: "Why is water so hard in Kent and Sussex?",
        answer: "The South East sits atop ancient Cretaceous chalk strata and the Wealden Greensand. Rain absorbs high volumes of calcium and magnesium as it filters into regional aquifers."
      },
      {
        question: "What dishwasher setting should I use for South East Water?",
        answer: "Calibrate your machine to Level 4 or H05. Always ensure the salt chamber is charged to prevent cloudy mineral film on glasses."
      },
      {
        question: "Does South East Water cause limescale damage?",
        answer: "Yes. High mineral density causes rapid limescale encrustation on boiler heat exchangers, shower valves, and immersion elements without approved scale protection."
      }
    ]
  }
];

export function getAllSuppliers(): SupplierMetadata[] {
  return suppliersData;
}

export function getSupplierBySlug(slug: string): SupplierMetadata | undefined {
  return suppliersData.find((s) => s.slug === slug);
}
