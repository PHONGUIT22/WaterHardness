export interface AreaPpm {
  name: string;
  ppm: number;
}

export interface CityFaqItem {
  question: string;
  answer: string;
}

export interface CityData {
  name: string;
  slug: string;
  supplier: string;
  region: string;
  avgPpm: number;
  clarkDegrees: number;
  hardnessCategory: "Soft Water" | "Moderately Hard" | "Hard Water" | "Very Hard Water";
  softestArea: AreaPpm;
  hardestArea: AreaPpm;
  metaTitle: string;
  metaDescription: string;
  outcodePrefixes: string[];
  editorialSummary: string;
  faqItems: CityFaqItem[];
}

export const citiesData: CityData[] = [
  {
    name: "London",
    slug: "london",
    supplier: "Thames Water & Affinity Water",
    region: "Greater London",
    avgPpm: 278,
    clarkDegrees: 19.4,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Enfield & Barnet", ppm: 235 },
    hardestArea: { name: "Wandsworth & Battersea", ppm: 315 },
    metaTitle: "London Water Hardness Guide",
    metaDescription: "Check London water hardness levels across all postcodes. Compare Thames Water PPM ratings, kettle descaling advice, and dishwasher salt settings.",
    outcodePrefixes: ["SW", "SE", "E", "EC", "W", "WC", "N", "NW"],
    editorialSummary: "London tap water is famously hard, filtered naturally through the deep chalk aquifers of the Thames Basin and the Chiltern Hills. Across the capital, mineral levels frequently exceed 275 PPM CaCO3, leading to rapid kettle furring, crusty showerheads, and an oily scum floating on your morning cuppa. For London homeowners, heating system scale is a serious expense: a 1.5mm limescale crust inside a combi boiler heat exchanger cuts thermal efficiency by up to 12%, making annual chemical inhibitor dosing under British Standard BS 7593 essential. London renters can easily tackle kettle scale by boiling one tablespoon of citric acid once a fortnight.",
    faqItems: [
      {
        question: "Is London tap water hard or soft?",
        answer: "London tap water is classified as hard to very hard, averaging roughly 278 PPM (parts per million) or 19.4 Clark degrees. It is sourced primarily from the River Thames and River Lee, both fed by natural mineral-rich chalk aquifers."
      },
      {
        question: "Do I need dishwasher salt in London?",
        answer: "Yes, absolutely. In London's hard water, your dishwasher's built-in ion-exchange resin will quickly become exhausted without salt. Set your machine's water hardness dial to level 4 or 5 (or H4/H5 on digital displays) to avoid cloudy glassware."
      },
      {
        question: "Is London hard water safe to drink?",
        answer: "Yes. London tap water complies with all Drinking Water Inspectorate (DWI) legal standards. The dissolved calcium and magnesium are essential dietary minerals, though many Londoners prefer a countertop carbon filter to remove chlorine taste."
      },
      {
        question: "Does London water cause dry skin and eczema?",
        answer: "Hard water minerals bind to soap, forming an insoluble curd that strips natural protective skin oils. Many London families with eczema report significant symptom relief after fitting a whole-house water softener."
      }
    ]
  },
  {
    name: "Birmingham",
    slug: "birmingham",
    supplier: "Severn Trent Water",
    region: "West Midlands",
    avgPpm: 48,
    clarkDegrees: 3.4,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Edgbaston & Harborne", ppm: 38 },
    hardestArea: { name: "Sutton Coldfield", ppm: 145 },
    metaTitle: "Birmingham Water Hardness Guide",
    metaDescription: "Check Birmingham water hardness levels and PPM ratings. Find Severn Trent Elan Valley soft water facts, kettle care, and dishwasher salt guidance.",
    outcodePrefixes: ["B"],
    editorialSummary: "Unlike southern England, Birmingham enjoys some of the purest, softest municipal water in the UK. The majority of the city's tap water travels 73 miles by gravity alone from the Elan Valley reservoirs in Mid-Wales via the historic Elan Aqueduct. With average hardness hovering around 48 PPM, Birmingham residents rarely struggle with furred kettles, limescale-choked taps, or scum on their tea. Shampoos and soaps lather effortlessly with a fraction of the product needed down south. However, northern suburbs like Sutton Coldfield draw from local groundwater blend wells, where hardness can rise into moderately hard territory.",
    faqItems: [
      {
        question: "Why is Birmingham water so soft?",
        answer: "Birmingham receives around 80% of its water from the remote Elan Valley in Mid-Wales. Flowing over insoluble slate and gritstone moorland, the water collects virtually zero calcium or magnesium before arriving in the city."
      },
      {
        question: "Do I need dishwasher salt in Birmingham?",
        answer: "If you live in central, southern, or western Birmingham where Elan Valley water is supplied, your water is soft (under 60 PPM). You can set your dishwasher salt dispenser to setting 1 or off if using all-in-one tablets. Sutton Coldfield residents should maintain setting 2."
      },
      {
        question: "Do I need a water softener in Birmingham?",
        answer: "No. Installing an ion-exchange water softener in Birmingham is unnecessary and a waste of money, as the water naturally contains virtually no limescale-forming minerals."
      }
    ]
  },
  {
    name: "Manchester",
    slug: "manchester",
    supplier: "United Utilities",
    region: "North West",
    avgPpm: 35,
    clarkDegrees: 2.4,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Didsbury & Chorlton", ppm: 28 },
    hardestArea: { name: "Salford Quays", ppm: 52 },
    metaTitle: "Manchester Water Hardness Guide",
    metaDescription: "Check Manchester water hardness and United Utilities PPM ratings. Discover Lake District soft water facts, appliance care, and salt requirements.",
    outcodePrefixes: ["M"],
    editorialSummary: "Greater Manchester is blessed with exceptionally soft, refreshing tap water, supplied primarily by United Utilities from the Lake District national park (Thirlmere and Haweswater reservoirs) and the Pennine Moors. Averaging just 35 PPM CaCO3, Manchester's water is remarkably kind to domestic appliances. Kettles stay sparkling clean for months without descaling, showers remain clear of calcium stains, and combi boiler heat exchangers operate free of limescale constriction. If you move to Manchester from London or the South East, you will immediately notice that a single pea-sized drop of washing-up liquid produces a sink full of suds.",
    faqItems: [
      {
        question: "Is Manchester water hard or soft?",
        answer: "Manchester tap water is very soft, averaging approximately 35 PPM (2.4 Clark degrees). It originates in granite and volcanic rock catchments in the Lake District and Peak District."
      },
      {
        question: "Do kettles get limescale in Manchester?",
        answer: "Hardly ever. Manchester water contains minimal calcium bicarbonate, so kettle elements remain virtually scale-free year-round without the need for chemical descaling solutions."
      },
      {
        question: "What dishwasher setting should I use in Manchester?",
        answer: "Set your dishwasher water softener regulator to level 1 (the lowest setting). Multi-benefit dishwasher tablets contain more than enough chelating agents to handle Manchester's minor mineral content."
      }
    ]
  },
  {
    name: "Glasgow",
    slug: "glasgow",
    supplier: "Scottish Water",
    region: "Scotland",
    avgPpm: 22,
    clarkDegrees: 1.5,
    hardnessCategory: "Soft Water",
    softestArea: { name: "West End & Hillhead", ppm: 18 },
    hardestArea: { name: "Southside & Shawlands", ppm: 30 },
    metaTitle: "Glasgow Water Hardness Guide",
    metaDescription: "Check Glasgow water hardness levels and Scottish Water PPM. Find Loch Katrine soft water ratings, appliance care tips, and dishwasher salt advice.",
    outcodePrefixes: ["G"],
    editorialSummary: "Glasgow's drinking water is widely celebrated as some of the finest tap water in Europe. Originating in Loch Katrine in the Scottish Highlands, the city's supply has been piped through aqueducts and tunnels since Victorian civil engineer John Bateman completed the scheme in 1859. With an average hardness rating of just 22 PPM, Glasgow's water contains almost undetectable levels of calcium carbonate. Household kettles never develop fur, chrome fixtures retain their mirror shine without scrubbing, and Scottish tea brews with full-bodied aroma and clear liquor, free of surface scum.",
    faqItems: [
      {
        question: "How soft is Glasgow tap water?",
        answer: "Glasgow tap water is exceptionally soft, averaging 22 PPM (1.5 Clark degrees). It is among the softest municipal water supplies in the United Kingdom."
      },
      {
        question: "Do I need to descale appliances in Glasgow?",
        answer: "No. Limescale does not build up in Glasgow kettles, coffee machines, or iron steam vents. Regular rinsing to remove loose sediment is all that is required."
      },
      {
        question: "Does Glasgow water require dishwasher salt?",
        answer: "No salt is required for softening purposes in Glasgow. You can safely switch your dishwasher's internal salt dosing unit to the minimum setting (Level 0 or Level 1)."
      }
    ]
  },
  {
    name: "Liverpool",
    slug: "liverpool",
    supplier: "United Utilities",
    region: "North West",
    avgPpm: 42,
    clarkDegrees: 2.9,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Allerton & Aigburth", ppm: 32 },
    hardestArea: { name: "City Centre & Baltic", ppm: 58 },
    metaTitle: "Liverpool Water Hardness Guide",
    metaDescription: "Check Liverpool water hardness levels and United Utilities PPM. Explore Lake Vyrnwy soft water ratings, appliance care, and kettle scale advice.",
    outcodePrefixes: ["L"],
    editorialSummary: "Liverpool taps run with wonderfully soft upland water, piped across Cheshire and Merseyside from Lake Vyrnwy in Powys, Wales, alongside contributions from the River Dee. At an average of 42 PPM, Merseyside residents enjoy hassle-free domestic plumbing. Limescale buildup in kettles is virtually non-existent, washing machines run efficiently without expensive water softening additives, and hair feels soft and manageable after washing. Heating engineers in Liverpool rarely encounter limescale blockages in combi boilers, though corrosion inhibitor protection remains essential under BS 7593.",
    faqItems: [
      {
        question: "Where does Liverpool get its water from?",
        answer: "Liverpool receives the vast bulk of its tap water from Lake Vyrnwy reservoir in northern Powys, Wales, engineered in the 1880s to provide clean, soft water to the city."
      },
      {
        question: "Is Liverpool water hard?",
        answer: "No, Liverpool water is firmly classified as soft (averaging 42 PPM). It does not produce hard limescale deposits in domestic appliances."
      },
      {
        question: "Do I need water softening tablets for washing machines in Liverpool?",
        answer: "No. Calgon and other anti-limescale tablets are unnecessary in Liverpool. You only need the manufacturer's recommended 'soft water' detergent dosage."
      }
    ]
  },
  {
    name: "Bristol",
    slug: "bristol",
    supplier: "Bristol Water",
    region: "South West",
    avgPpm: 285,
    clarkDegrees: 19.9,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Clifton & Redland", ppm: 240 },
    hardestArea: { name: "Bedminster & Southville", ppm: 310 },
    metaTitle: "Bristol Water Hardness Guide",
    metaDescription: "Check Bristol water hardness levels across all postcodes. Compare Mendip Hills hard water PPM, kettle descaling, and dishwasher salt settings.",
    outcodePrefixes: ["BS"],
    editorialSummary: "Bristol's water is notoriously hard, sourced from rainwater percolating through the carboniferous limestone of the Mendip Hills, Chew Valley Lake, and Blagdon Lake. With average mineral concentrations reaching 285 PPM, Bristol homes face constant limescale battles. Kettles fur up within weeks, tap spouts clog with white crystalline grit, and tea is prone to a chalky aftertaste. Without water softener protection, hot water cylinders and combi boilers suffer reduced efficiency and premature heat exchanger failures. We recommend regular citric acid boiling for kettles and rigorous dishwasher salt maintenance.",
    faqItems: [
      {
        question: "Why is Bristol water so hard?",
        answer: "Bristol's water catchment is surrounded by limestone and chalk hills in Somerset and the Cotswolds. As rainwater dissolves these rocks, it absorbs high concentrations of calcium and magnesium carbonate."
      },
      {
        question: "What should I set my dishwasher to in Bristol?",
        answer: "Set your dishwasher water softener to Level 5 (hard/very hard) or 20° Clark. Always keep the salt reservoir topped up with granular or tablet dishwasher salt to avoid chalky film on plates."
      },
      {
        question: "How do I remove limescale from my Bristol kettle?",
        answer: "Add two tablespoons of citric acid powder or a 50/50 mixture of white vinegar and water. Boil once, leave to soak for 15 minutes, and rinse thoroughly with cold tap water."
      }
    ]
  },
  {
    name: "Edinburgh",
    slug: "edinburgh",
    supplier: "Scottish Water",
    region: "Scotland",
    avgPpm: 38,
    clarkDegrees: 2.7,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Old Town & New Town", ppm: 26 },
    hardestArea: { name: "Morningside & Bruntsfield", ppm: 48 },
    metaTitle: "Edinburgh Water Hardness Guide",
    metaDescription: "Check Edinburgh water hardness levels and Scottish Water PPM. Discover Moorfoot and Megget soft water facts, kettle care, and salt settings.",
    outcodePrefixes: ["EH"],
    editorialSummary: "Edinburgh's tap water is soft and clean, collected from upland catchment areas in the Moorfoot, Pentland, and Tweedsmuir hills, notably Megget and Talla reservoirs. With hardness readings consistently below 45 PPM, Edinburgh residents rarely experience limescale problems. Kettles, showerheads, and hot water boilers stay clear of chalky mineral crumbing. Tea and coffee lovers appreciate the soft water profile, which extracts subtle aromatic flavour notes without the bitter astringency caused by heavy mineral salts.",
    faqItems: [
      {
        question: "Is Edinburgh water soft?",
        answer: "Yes, Edinburgh tap water is classified as soft, averaging around 38 PPM. It is collected from non-calcareous Scottish hill reservoirs."
      },
      {
        question: "Do I need dishwasher salt in Edinburgh?",
        answer: "In Edinburgh, dishwasher salt is rarely critical unless using economy powder detergents. On modern dishwashers, set the hardness selector to setting 1."
      },
      {
        question: "Can I drink Edinburgh tap water directly from the tap?",
        answer: "Yes, Scottish Water provides tap water that meets strict UK and European drinking water standards, requiring no domestic filtration for safety."
      }
    ]
  },
  {
    name: "Leeds",
    slug: "leeds",
    supplier: "Yorkshire Water",
    region: "Yorkshire & The Humber",
    avgPpm: 75,
    clarkDegrees: 5.2,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Headingley & Hyde Park", ppm: 55 },
    hardestArea: { name: "Garforth & Rothwell", ppm: 130 },
    metaTitle: "Leeds Water Hardness Guide",
    metaDescription: "Check Leeds water hardness levels and Yorkshire Water PPM. Explore moorland reservoir soft water facts, kettle care, and dishwasher settings.",
    outcodePrefixes: ["LS"],
    editorialSummary: "Leeds tap water is primarily soft, sourced from Yorkshire Water's extensive network of Pennine moorland reservoirs in the Washburn and Wharfe valleys, alongside water pumped from the River Ouse and River Derwent. While central and northern Leeds enjoy soft water around 55–75 PPM, eastern suburbs toward Garforth and Micklefield receive blended river water that can creep into moderately hard territory. For the majority of Leeds households, limescale accumulation in kettles is negligible and soaps lather smoothly.",
    faqItems: [
      {
        question: "Is Leeds water hard or soft?",
        answer: "The majority of Leeds enjoys soft tap water (averaging 75 PPM). However, eastern areas receiving treated river water can experience moderately hard water up to 130 PPM."
      },
      {
        question: "Do I need to descale my kettle frequently in Leeds?",
        answer: "No, a light descale every 3 to 4 months with white vinegar or citric acid is typically sufficient to keep Leeds kettles in pristine condition."
      },
      {
        question: "What dishwasher setting is best for Leeds?",
        answer: "Set your dishwasher water hardness regulator to Level 2 (soft to moderate). This protects your glassware while avoiding unnecessary salt consumption."
      }
    ]
  },
  {
    name: "Sheffield",
    slug: "sheffield",
    supplier: "Yorkshire Water",
    region: "Yorkshire & The Humber",
    avgPpm: 46,
    clarkDegrees: 3.2,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Ecclesall & Broomhill", ppm: 36 },
    hardestArea: { name: "Darnall & Attercliffe", ppm: 68 },
    metaTitle: "Sheffield Water Hardness Guide",
    metaDescription: "Check Sheffield water hardness ratings and Yorkshire Water PPM. Discover Peak District soft water qualities, kettle care, and salt settings.",
    outcodePrefixes: ["S"],
    editorialSummary: "Sheffield benefits from exceptionally soft upland tap water, collected from the Peak District moorlands and reservoirs along the Rivelin, Loxley, and Ewden valleys. Averaging roughly 46 PPM, Sheffield's water is free from significant calcium and magnesium concentrations. Local kettles remain spotless, shower enclosures resist water spotting, and laundry washes soft without fabric conditioners. Combi boilers run efficiently with zero limescale burden on heat exchangers, though heating systems must remain treated with anti-corrosion inhibitor.",
    faqItems: [
      {
        question: "How hard is Sheffield water?",
        answer: "Sheffield tap water is soft, with an average hardness of 46 PPM (3.2 Clark degrees). It flows from peat moorlands and millstone grit catchments in the Peak District."
      },
      {
        question: "Do I need a water softener in Sheffield?",
        answer: "No. Installing a water softener in Sheffield is completely unnecessary because the natural tap water contains very few limescale-forming minerals."
      },
      {
        question: "What dishwasher salt setting should I choose in Sheffield?",
        answer: "Keep your dishwasher setting on Level 1. If you use 3-in-1 or all-in-one dishwasher pods, the built-in salt replacement will easily suffice."
      }
    ]
  },
  {
    name: "Newcastle upon Tyne",
    slug: "newcastle",
    supplier: "Northumbrian Water",
    region: "North East",
    avgPpm: 125,
    clarkDegrees: 8.7,
    hardnessCategory: "Moderately Hard",
    softestArea: { name: "Jesmond & Gosforth", ppm: 95 },
    hardestArea: { name: "Byker & Walker", ppm: 155 },
    metaTitle: "Newcastle Water Hardness Guide",
    metaDescription: "Check Newcastle upon Tyne water hardness levels and PPM ratings. Discover Kielder Water facts, limescale buildup advice, and dishwasher settings.",
    outcodePrefixes: ["NE"],
    editorialSummary: "Newcastle upon Tyne receives moderately hard tap water, supplied by Northumbrian Water from Kielder Water (the largest man-made reservoir in the UK by capacity) and regional upland reservoirs like Catcleugh, blended with groundwater sources. At around 125 PPM, Tyneside water strikes a middle ground: you will notice light limescale furring on kettle heating elements after several months, and bathroom shower screens require regular wiping. Keeping dishwasher salt topped up ensures smear-free glassware.",
    faqItems: [
      {
        question: "Is Newcastle tap water hard or soft?",
        answer: "Newcastle tap water is classified as moderately hard, averaging 125 PPM (8.7 Clark degrees). It is a blend of upland reservoir water and mineralized groundwater."
      },
      {
        question: "Does Newcastle water cause limescale?",
        answer: "Yes, gradual limescale will build up on kettle bases and showerheads over time, though far slower than in London or the South East. Descaling every 2 to 3 months is recommended."
      },
      {
        question: "What dishwasher setting should I use in Newcastle?",
        answer: "Set your dishwasher water hardness dial to Level 2 or 3 (medium setting) to ensure optimal detergent action and protect against glassware clouding."
      }
    ]
  },
  {
    name: "Nottingham",
    slug: "nottingham",
    supplier: "Severn Trent Water",
    region: "East Midlands",
    avgPpm: 265,
    clarkDegrees: 18.5,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Wollaton & Beeston", ppm: 210 },
    hardestArea: { name: "West Bridgford & Rushcliffe", ppm: 295 },
    metaTitle: "Nottingham Water Hardness Guide",
    metaDescription: "Check Nottingham water hardness levels and Severn Trent PPM ratings. Compare sandstone aquifer hard water facts, kettle care, and salt settings.",
    outcodePrefixes: ["NG"],
    editorialSummary: "Nottingham sits in a firmly hard water belt, with average tap water hardness measuring 265 PPM. Severn Trent supplies the city through a blend of Sherwood Sandstone groundwater aquifers and surface water from the River Derwent. As water filters through limestone-rich strata, it accumulates high levels of calcium carbonate. Nottingham householders regularly face furred kettle elements, chalk deposits in shower roses, and cloudy streaks on washed dishes. Fitting a water softener or using citric acid descaling routinely saves time and energy bills.",
    faqItems: [
      {
        question: "Why is Nottingham water hard?",
        answer: "Much of Nottingham's water is drawn from deep boreholes in the Sherwood Sandstone formation, which is naturally rich in calcium and magnesium mineral salts."
      },
      {
        question: "Do I need dishwasher salt in Nottingham?",
        answer: "Yes. Due to high mineral hardness, dishwasher salt is vital. Keep the reservoir filled and select hardness setting 4 or 5 to prevent mineral etching on glasses."
      },
      {
        question: "How does Nottingham hard water affect my central heating?",
        answer: "Limescale settles inside boiler heat exchangers, reducing heating transfer efficiency. In hard water areas like Nottingham, an in-line scale reducer and annual inhibitor dosing under BS 7593 are strongly advised."
      }
    ]
  },
  {
    name: "Cardiff",
    slug: "cardiff",
    supplier: "Dŵr Cymru Welsh Water",
    region: "Wales",
    avgPpm: 72,
    clarkDegrees: 5.0,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Roath & Cathays", ppm: 54 },
    hardestArea: { name: "Cardiff Bay & Butetown", ppm: 98 },
    metaTitle: "Cardiff Water Hardness Guide",
    metaDescription: "Check Cardiff water hardness levels and Welsh Water PPM. Discover Brecon Beacons soft upland reservoir water, appliance care, and salt tips.",
    outcodePrefixes: ["CF"],
    editorialSummary: "Cardiff tap water is pleasantly soft, supplied by Dŵr Cymru Welsh Water from the scenic upland reservoirs of the Brecon Beacons, including Llwyn-on, Cantref, and Beacons reservoirs in the Taff catchment. With average hardness of roughly 72 PPM, Welsh capital households enjoy low-limescale living. Kettles need only occasional cleaning, taps do not clog with scale crusts, and morning tea brews bright and aromatic. While boiler limescale is minimal, central heating systems still require regular corrosion inhibitor maintenance.",
    faqItems: [
      {
        question: "Is water in Cardiff hard or soft?",
        answer: "Cardiff tap water is soft, averaging approximately 72 PPM. The water is gathered from acidic, non-calcareous moorland catchments in South Wales."
      },
      {
        question: "Do I need dishwasher salt in Cardiff?",
        answer: "With soft water, dishwasher salt consumption is low. Setting 1 or 2 is adequate, and all-in-one dishwasher tablets generally provide all the water conditioning needed."
      },
      {
        question: "Does Cardiff water cause skin irritation?",
        answer: "Soft water lathers easily and rinses clean without leaving chalky soap scum residue, making it gentle on sensitive skin and suitable for eczema sufferers."
      }
    ]
  },
  {
    name: "Belfast",
    slug: "belfast",
    supplier: "Northern Ireland Water",
    region: "Northern Ireland",
    avgPpm: 68,
    clarkDegrees: 4.8,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Mourne & South Belfast", ppm: 45 },
    hardestArea: { name: "East Belfast & Castlereagh", ppm: 92 },
    metaTitle: "Belfast Water Hardness Guide",
    metaDescription: "Check Belfast water hardness levels and NI Water PPM. Discover Mourne Mountains soft water facts, kettle maintenance, and dishwasher settings.",
    outcodePrefixes: ["BT"],
    editorialSummary: "Belfast tap water is predominantly soft, sourced by Northern Ireland Water from the granite peaks of the Mourne Mountains (Silent Valley reservoir) and Lough Neagh. With mineral hardness averaging around 68 PPM, Belfast homeowners avoid the destructive limescale issues prevalent in southern England. Domestic kettles stay clear of fur, soap suds form rapidly in the shower, and combi boilers run efficiently without heavy mineral scaling on internal heat exchangers.",
    faqItems: [
      {
        question: "Where does Belfast get its drinking water from?",
        answer: "Belfast is supplied primarily by the Silent Valley and Ben Crom reservoirs in the Mourne Mountains, alongside treated water from Lough Neagh."
      },
      {
        question: "Is tap water hard in Belfast?",
        answer: "No, Belfast tap water is soft, with an average hardness rating of 68 PPM (4.8 Clark degrees). It contains very low levels of dissolved calcium."
      },
      {
        question: "Should I buy a water softener in Belfast?",
        answer: "No. A water softener is not needed in Belfast, as the water naturally possesses soft, low-mineral characteristics that do not create limescale."
      }
    ]
  },
  {
    name: "Southampton",
    slug: "southampton",
    supplier: "Southern Water",
    region: "South East",
    avgPpm: 295,
    clarkDegrees: 20.6,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Shirley & Millbrook", ppm: 260 },
    hardestArea: { name: "Bitterne & Portswood", ppm: 320 },
    metaTitle: "Southampton Water Hardness Guide",
    metaDescription: "Check Southampton water hardness levels and Southern Water PPM. Learn about chalk aquifer hard water, kettle descaling, and boiler protection.",
    outcodePrefixes: ["SO"],
    editorialSummary: "Southampton has some of the hardest water in Hampshire, averaging 295 PPM CaCO3. Southern Water draws supply from deep chalk boreholes and groundwater-fed rivers including the River Test and River Itchen. These pure chalk-filtered waters carry heavy concentrations of dissolved calcium bicarbonate. As a result, kettles develop a thick fur within weeks, chrome bathroom fittings become cloudy, and boiler heat exchangers can lose up to 15% efficiency over time if left unprotected.",
    faqItems: [
      {
        question: "Why is water so hard in Southampton?",
        answer: "Hampshire is underlain by massive chalk formations. Rainwater percolating through the chalk dissolves large quantities of calcium carbonate before being pumped to homes."
      },
      {
        question: "What dishwasher setting should I use in Southampton?",
        answer: "Configure your dishwasher to Level 5 (very hard). Ensure the salt container is filled regularly to protect glassware and heating elements from scale damage."
      },
      {
        question: "Is a water softener worth it in Southampton?",
        answer: "Yes, many Southampton homeowners install ion-exchange water softeners. They eliminate limescale from bathrooms, extend boiler life, and cut detergent usage in half."
      }
    ]
  },
  {
    name: "Leicester",
    slug: "leicester",
    supplier: "Severn Trent Water",
    region: "East Midlands",
    avgPpm: 245,
    clarkDegrees: 17.1,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Clarendon Park & Knighton", ppm: 215 },
    hardestArea: { name: "Beaumont Leys & Belgrave", ppm: 280 },
    metaTitle: "Leicester Water Hardness Guide",
    metaDescription: "Check Leicester water hardness levels and Severn Trent PPM ratings. Compare East Midlands hard water facts, kettle descaling, and salt settings.",
    outcodePrefixes: ["LE"],
    editorialSummary: "Leicester tap water falls firmly into the hard water category, with an average hardness rating of 245 PPM. Sourced by Severn Trent from regional surface reservoirs (like Cropston and Thornton) and blended with River Dove and Derwent transfers, the water dissolves significant mineral content from the local Triassic mudstones and limestones. Leicester homeowners must regularly descale kettles, clear white crust from tap aerators, and ensure combi boilers are protected with heating inhibitors.",
    faqItems: [
      {
        question: "Is tap water in Leicester hard?",
        answer: "Yes, Leicester tap water is hard, averaging 245 PPM (17.1 Clark degrees). You will experience noticeable limescale on heated appliances."
      },
      {
        question: "How can I prevent limescale in my Leicester kettle?",
        answer: "Descale monthly using food-grade citric acid: boil one tablespoon in a full kettle, let sit for 15 minutes, and rinse. It is odourless and far cheaper than branded descalers."
      },
      {
        question: "Do I need dishwasher salt in Leicester?",
        answer: "Yes, set your dishwasher hardness control to Level 4. Without salt, hard water will leave a white, cloudy film on plates and glassware."
      }
    ]
  },
  {
    name: "Coventry",
    slug: "coventry",
    supplier: "Severn Trent Water",
    region: "West Midlands",
    avgPpm: 275,
    clarkDegrees: 19.2,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Earlsdon & Tile Hill", ppm: 240 },
    hardestArea: { name: "Stoke & Walsgrave", ppm: 305 },
    metaTitle: "Coventry Water Hardness Guide",
    metaDescription: "Check Coventry water hardness levels and Severn Trent PPM. Discover groundwater hard water ratings, kettle descaling, and dishwasher advice.",
    outcodePrefixes: ["CV"],
    editorialSummary: "Unlike its neighbour Birmingham, Coventry suffers from distinctly hard water, averaging 275 PPM. While Birmingham gets soft Welsh reservoir water, Coventry's supply relies heavily on local groundwater boreholes and treated water from the River Severn and River Avon catchments. As water seeps through sandstone and mineral beds, it gathers calcium and magnesium. Coventry residents frequently deal with furred kettle coils, scum on cups of tea, and limescale deposits on shower screens.",
    faqItems: [
      {
        question: "Why is Coventry water hard while Birmingham water is soft?",
        answer: "Birmingham receives water from the Elan Valley in Mid-Wales, while Coventry relies on groundwater aquifers and River Severn blends that naturally contain high calcium levels."
      },
      {
        question: "What dishwasher setting is recommended for Coventry?",
        answer: "Use setting 4 or 5 on your dishwasher hardness dial. Keep granular dishwasher salt topped up every month to avoid cloudy glassware."
      },
      {
        question: "Will hard water damage my boiler in Coventry?",
        answer: "Limescale crust can insulate boiler heat exchangers, driving up gas bills. Ensure your heating engineer adds a chemical inhibitor under BS 7593 during annual servicing."
      }
    ]
  },
  {
    name: "Brighton & Hove",
    slug: "brighton",
    supplier: "Southern Water",
    region: "South East",
    avgPpm: 285,
    clarkDegrees: 19.9,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Hove & Portslade", ppm: 255 },
    hardestArea: { name: "Kemptown & Hanover", ppm: 310 },
    metaTitle: "Brighton Water Hardness Guide",
    metaDescription: "Check Brighton and Hove water hardness ratings and Southern Water PPM. Learn about South Downs chalk water, kettle care, and salt calibration.",
    outcodePrefixes: ["BN"],
    editorialSummary: "Brighton and Hove tap water is naturally very hard, averaging 285 PPM. Sourced directly from deep boreholes in the South Downs chalk block, Southern Water pumps water that has spent months filtering through calcium carbonate rock. While this gives Brighton water a clean, crisp mineral taste, it wreaks havoc on household appliances. Kettles fur quickly, shower glass clouds with etched scale, and hot water cylinders accumulate substantial limescale sludge over time.",
    faqItems: [
      {
        question: "Why is Brighton tap water so hard?",
        answer: "Brighton is situated on the South Downs chalk aquifer. Tap water is 100% groundwater filtered through calcium-rich chalk, resulting in high mineral concentrations."
      },
      {
        question: "How do I protect shower screens from limescale in Brighton?",
        answer: "Wipe shower glass daily with a rubber squeegee after showering, and spray weekly with diluted white vinegar to dissolve calcium spots before they harden into the glass."
      },
      {
        question: "Do I need dishwasher salt in Brighton?",
        answer: "Yes, set your dishwasher to Level 5. Without salt regeneration, the ion-exchange resin will saturate rapidly, leaving milky chalk marks on crockery."
      }
    ]
  },
  {
    name: "Plymouth",
    slug: "plymouth",
    supplier: "South West Water",
    region: "South West",
    avgPpm: 34,
    clarkDegrees: 2.4,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Peverell & Hartley", ppm: 25 },
    hardestArea: { name: "The Hoe & Barbican", ppm: 48 },
    metaTitle: "Plymouth Water Hardness Guide",
    metaDescription: "Check Plymouth water hardness levels and South West Water PPM. Discover Dartmoor granite soft water facts, appliance care, and salt savings.",
    outcodePrefixes: ["PL"],
    editorialSummary: "Plymouth tap water is amongst the purest and softest in the UK, measuring an average of just 34 PPM. South West Water sources Plymouth's supply from Dartmoor National Park (Burrator Reservoir) and the River Tamar. Flowing across impermeable Dartmoor granite and peat moorlands, the water collects virtually no calcium or magnesium. Plymouth households enjoy scale-free kettles, sparkling shower glass, and luxurious soap lather, with zero need for domestic water softeners.",
    faqItems: [
      {
        question: "Is Plymouth water soft or hard?",
        answer: "Plymouth water is very soft, averaging 34 PPM. It is gathered from granite moorland catchments on Dartmoor."
      },
      {
        question: "Do I need dishwasher salt in Plymouth?",
        answer: "No, dishwasher salt is largely optional in Plymouth. Set the hardness regulator to setting 1, and standard detergent tablets will handle the rest."
      },
      {
        question: "Will limescale build up in my boiler in Plymouth?",
        answer: "No, limescale buildup is virtually non-existent. However, soft water can be slightly acidic, making corrosion inhibitor dosing under BS 7593 important."
      }
    ]
  },
  {
    name: "Stoke-on-Trent",
    slug: "stoke-on-trent",
    supplier: "Severn Trent Water",
    region: "West Midlands",
    avgPpm: 165,
    clarkDegrees: 11.5,
    hardnessCategory: "Moderately Hard",
    softestArea: { name: "Tunstall & Burslem", ppm: 135 },
    hardestArea: { name: "Longton & Trentham", ppm: 195 },
    metaTitle: "Stoke Water Hardness Guide",
    metaDescription: "Check Stoke-on-Trent water hardness levels and Severn Trent PPM. Compare Staffordshire moorland blend ratings, kettle care, and salt advice.",
    outcodePrefixes: ["ST"],
    editorialSummary: "Stoke-on-Trent has moderately hard tap water, averaging roughly 165 PPM. Severn Trent supplies the Potteries from a combination of Tittesworth Reservoir in the Staffordshire Moorlands and groundwater wells across the North Staffordshire coalfield and sandstone beds. Householders will notice light limescale crusting on kettle bases every couple of months, but it remains far less aggressive than in the south of England. Regular kettle descaling keeps appliances running smoothly.",
    faqItems: [
      {
        question: "Is water hard in Stoke-on-Trent?",
        answer: "Stoke-on-Trent has moderately hard water (average 165 PPM). It is neither very soft nor aggressively hard, representing a balanced mineral profile."
      },
      {
        question: "What dishwasher setting should I use in Stoke-on-Trent?",
        answer: "Set your dishwasher water softener to Level 2 or 3. This balances salt usage while protecting your glassware from mineral hazing."
      },
      {
        question: "How often should I descale my kettle in Stoke?",
        answer: "Descaling every 8 to 12 weeks with white vinegar or citric acid is typically sufficient to remove the moderate mineral crust."
      }
    ]
  },
  {
    name: "Wolverhampton",
    slug: "wolverhampton",
    supplier: "Severn Trent Water",
    region: "West Midlands",
    avgPpm: 155,
    clarkDegrees: 10.8,
    hardnessCategory: "Moderately Hard",
    softestArea: { name: "Tettenhall & Penn", ppm: 110 },
    hardestArea: { name: "Wednesfield & Bilston", ppm: 190 },
    metaTitle: "Wolverhampton Water Hardness",
    metaDescription: "Check Wolverhampton water hardness levels and Severn Trent PPM. Learn about Black Country water blending, kettle scale, and dishwasher salt.",
    outcodePrefixes: ["WV"],
    editorialSummary: "Wolverhampton water is classified as moderately hard, with average readings around 155 PPM. Supplied by Severn Trent, the city's tap water is blended from local sandstone boreholes, River Severn abstractions, and small transfers from the Elan Valley system. Western neighbourhoods like Tettenhall enjoy slightly softer water, while eastern districts like Bilston experience firmer mineral hardness. Keeping an eye on kettle bases and using moderate dishwasher salt settings maintains appliance health.",
    faqItems: [
      {
        question: "Is Wolverhampton water hard or soft?",
        answer: "Wolverhampton tap water is moderately hard, averaging 155 PPM (10.8 Clark degrees). It varies slightly depending on local blending from wells and rivers."
      },
      {
        question: "Do I need a water softener in Wolverhampton?",
        answer: "Most households do not require a water softener, as limescale buildup is moderate. However, families with hard water skin sensitivity may benefit from one."
      },
      {
        question: "What dishwasher salt setting is best for Wolverhampton?",
        answer: "Select Level 2 or Level 3 on your dishwasher. Keep salt topped up to avoid drying spots on drinking glasses."
      }
    ]
  },
  {
    name: "Derby",
    slug: "derby",
    supplier: "Severn Trent Water",
    region: "East Midlands",
    avgPpm: 230,
    clarkDegrees: 16.1,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Allestree & Darley Abbey", ppm: 185 },
    hardestArea: { name: "Alvaston & Chellaston", ppm: 260 },
    metaTitle: "Derby Water Hardness Guide",
    metaDescription: "Check Derby water hardness levels and Severn Trent PPM ratings. Explore Derwent Valley hard water facts, kettle descaling, and salt settings.",
    outcodePrefixes: ["DE"],
    editorialSummary: "Derby tap water sits firmly in the hard water bracket, with an average hardness of 230 PPM. Severn Trent treats water from the River Derwent and regional reservoirs, passing through limestone catchments in Derbyshire before reaching city taps. Residents in Derby routinely experience limescale deposits in kettles, cloudy shower glass, and increased soap consumption. Boiler heating circuits should be dosed annually with anti-scale inhibitor to prevent boiler noise and preserve efficiency.",
    faqItems: [
      {
        question: "Is Derby water hard?",
        answer: "Yes, Derby tap water is classified as hard, averaging 230 PPM (16.1 Clark degrees). It picks up calcium as it drains through Derbyshire limestone."
      },
      {
        question: "What should I set my dishwasher to in Derby?",
        answer: "Set your dishwasher water softener to Level 4 (hard water). Make sure to replenish dishwasher salt every 4 to 6 weeks."
      },
      {
        question: "How can I protect my boiler in Derby?",
        answer: "Fit a magnetic filter and scale reducer on your cold feed, and have your heating engineer verify corrosion inhibitor concentrations under BS 7593."
      }
    ]
  },
  {
    name: "Swansea",
    slug: "swansea",
    supplier: "Dŵr Cymru Welsh Water",
    region: "Wales",
    avgPpm: 45,
    clarkDegrees: 3.1,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Mumbles & Gower", ppm: 32 },
    hardestArea: { name: "Morriston & Llansamlet", ppm: 62 },
    metaTitle: "Swansea Water Hardness Guide",
    metaDescription: "Check Swansea water hardness ratings and Welsh Water PPM. Discover reservoir soft water qualities, appliance protection, and kettle maintenance.",
    outcodePrefixes: ["SA"],
    editorialSummary: "Swansea tap water is naturally very soft, averaging just 45 PPM. Sourced by Dŵr Cymru Welsh Water from upland reservoirs across the Black Mountain and Brecon Beacons (such as Cray and Lliw reservoirs), the supply flows through siliceous rock and moorland peat with almost zero calcium content. Swansea households enjoy scale-free kettles, glistening chrome taps, and silky showers where a tiny dab of shampoo creates rich, luxurious foam.",
    faqItems: [
      {
        question: "Is Swansea tap water soft?",
        answer: "Yes, Swansea water is exceptionally soft, averaging 45 PPM (3.1 Clark degrees). It is sourced from pure Welsh mountain reservoirs."
      },
      {
        question: "Do I need dishwasher salt in Swansea?",
        answer: "Dishwasher salt is not strictly required in Swansea for water softening. Setting 1 on your dishwasher is ideal, and all-in-one tablets work perfectly."
      },
      {
        question: "Does Swansea water cause kettle furring?",
        answer: "No, kettle furring does not occur with Swansea tap water due to the lack of dissolved calcium carbonate minerals."
      }
    ]
  },
  {
    name: "Aberdeen",
    slug: "aberdeen",
    supplier: "Scottish Water",
    region: "Scotland",
    avgPpm: 28,
    clarkDegrees: 2.0,
    hardnessCategory: "Soft Water",
    softestArea: { name: "Cults & Bieldside", ppm: 20 },
    hardestArea: { name: "Bridge of Don & Dyce", ppm: 38 },
    metaTitle: "Aberdeen Water Hardness Guide",
    metaDescription: "Check Aberdeen water hardness levels and Scottish Water PPM. Explore River Dee and Don soft granite water, kettle care, and appliance facts.",
    outcodePrefixes: ["AB"],
    editorialSummary: "Aberdeen tap water is famously soft and crisp, averaging a mere 28 PPM. Scottish Water draws from the River Dee, which rises high in the Cairngorm Mountains and flows over ancient granite terrain. The water contains virtually no dissolved chalk or limestone salts. Aberdeen kettles never develop limescale crusts, washing machines operate at peak efficiency without water softening tablets, and hot water boilers stay entirely free of mineral scale constriction.",
    faqItems: [
      {
        question: "How soft is Aberdeen tap water?",
        answer: "Aberdeen tap water is very soft, averaging 28 PPM (2.0 Clark degrees). It is among the lowest mineral content supplies in the British Isles."
      },
      {
        question: "Do I need to descale appliances in Aberdeen?",
        answer: "No descaling is necessary for Aberdeen kettles, irons, or coffee makers because limescale does not form from granite-filtered water."
      },
      {
        question: "What dishwasher setting should I use in Aberdeen?",
        answer: "Set your dishwasher water hardness level to the absolute minimum (Level 0 or Level 1) to conserve salt."
      }
    ]
  },
  {
    name: "Portsmouth",
    slug: "portsmouth",
    supplier: "Portsmouth Water",
    region: "South East",
    avgPpm: 290,
    clarkDegrees: 20.3,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Southsea & Old Portsmouth", ppm: 265 },
    hardestArea: { name: "Cosham & Drayton", ppm: 315 },
    metaTitle: "Portsmouth Water Hardness Guide",
    metaDescription: "Check Portsmouth water hardness levels and Portsmouth Water PPM. Discover South Downs chalk spring hard water, kettle care, and salt settings.",
    outcodePrefixes: ["PO"],
    editorialSummary: "Portsmouth tap water is naturally very hard, with an average hardness rating of 290 PPM. Portsmouth Water abstracts water from the world-famous natural chalk springs at Havant and Bedhampton, together with River Itchen borehole transfers. The water has spent months slowly filtering through deep South Downs chalk, absorbing massive quantities of calcium bicarbonate. While beautifully clear and refreshing to drink, it leads to rapid kettle scaling, cloudy glassware, and stiff laundry unless treated.",
    faqItems: [
      {
        question: "Where does Portsmouth water come from?",
        answer: "Most of Portsmouth's drinking water comes from natural springs at Havant and Bedhampton, emerging from underground chalk aquifers in the South Downs."
      },
      {
        question: "What dishwasher setting is needed in Portsmouth?",
        answer: "Set your dishwasher water softener to Level 5. Refill the salt container whenever the warning indicator illuminates to avoid chalk residue."
      },
      {
        question: "How do I remove limescale from my Portsmouth shower?",
        answer: "Use warm white vinegar or a citric acid spray. Avoid harsh abrasive cleaners that scratch chrome and glass surfaces."
      }
    ]
  },
  {
    name: "York",
    slug: "york",
    supplier: "Yorkshire Water",
    region: "Yorkshire & The Humber",
    avgPpm: 240,
    clarkDegrees: 16.8,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Fulford & Heslington", ppm: 210 },
    hardestArea: { name: "Clifton & Rawcliffe", ppm: 270 },
    metaTitle: "York Water Hardness Guide",
    metaDescription: "Check York water hardness levels and Yorkshire Water PPM. Compare River Ouse and Derwent hard water ratings, kettle care, and boiler protection.",
    outcodePrefixes: ["YO"],
    editorialSummary: "Unlike the soft upland water found in Sheffield and West Yorkshire, York has hard tap water, averaging roughly 240 PPM. Supplied by Yorkshire Water from abstractions along the River Ouse and River Derwent, the water drains extensive limestone and chalk vales across North Yorkshire before reaching York water treatment works. Kettles in York require regular monthly descaling, and dishwasher salt must be maintained to prevent cloudy calcium stains on glassware.",
    faqItems: [
      {
        question: "Why is York water harder than Leeds and Sheffield?",
        answer: "While Leeds and Sheffield draw from Pennine peat moorlands, York relies on lowland river abstractions fed by runoff from limestone hills in North Yorkshire."
      },
      {
        question: "Do I need dishwasher salt in York?",
        answer: "Yes, set your dishwasher hardness dial to Level 4 (hard). Keep salt topped up to avoid dull, chalky drinking glasses."
      },
      {
        question: "How can I protect my boiler in York?",
        answer: "Have your boiler serviced annually with an inhibitor top-up conforming to BS 7593, and consider an in-line electrolytic scale reducer."
      }
    ]
  },
  {
    name: "Reading",
    slug: "reading",
    supplier: "Thames Water",
    region: "South East",
    avgPpm: 295,
    clarkDegrees: 20.6,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Caversham & Mapledurham", ppm: 265 },
    hardestArea: { name: "Tilehurst & Southcote", ppm: 320 },
    metaTitle: "Reading Water Hardness Guide",
    metaDescription: "Check Reading water hardness levels across Berkshire postcodes. Compare Thames Water chalk PPM, kettle descaling advice, and softener settings.",
    outcodePrefixes: ["RG"],
    editorialSummary: "Reading tap water is classified as hard to very hard, averaging 295 PPM. Supplied by Thames Water from River Kennet and River Thames abstractions alongside Berkshire chalk boreholes, the water contains high amounts of dissolved calcium and magnesium. Reading households face stubborn kettle furring, chalky tap crusts, and persistent bath scum. Fitting a water softener or keeping a 1kg tub of food-grade citric acid on hand is standard practice for Berkshire homeowners.",
    faqItems: [
      {
        question: "Is tap water hard in Reading?",
        answer: "Yes, Reading tap water is hard, averaging 295 PPM (20.6 Clark degrees). It is heavily mineralised by the surrounding chalk geology of the Thames Valley."
      },
      {
        question: "What dishwasher setting should I use in Reading?",
        answer: "Use Level 5 on your dishwasher hardness setting. Check salt levels monthly to prevent glassware etching and cloudiness."
      },
      {
        question: "Is a water softener recommended in Reading?",
        answer: "Yes. Many Reading residents install water softeners to protect boilers, eliminate bathroom limescale, and improve skin hydration."
      }
    ]
  },
  {
    name: "Norwich",
    slug: "norwich",
    supplier: "Anglian Water",
    region: "East of England",
    avgPpm: 325,
    clarkDegrees: 22.7,
    hardnessCategory: "Very Hard Water",
    softestArea: { name: "Eaton & Cringleford", ppm: 295 },
    hardestArea: { name: "Thorpe St Andrew", ppm: 355 },
    metaTitle: "Norwich Water Hardness Guide",
    metaDescription: "Check Norwich water hardness levels and Anglian Water PPM. Compare Norfolk chalk aquifer very hard water, kettle furring, and boiler maintenance.",
    outcodePrefixes: ["NR"],
    editorialSummary: "Norwich tap water is among the hardest in the United Kingdom, frequently exceeding 325 PPM. Anglian Water draws supplies from deep groundwater boreholes in the Norfolk Chalk and the River Wensum. The water is saturated with dissolved calcium carbonate. Kettles fur up heavily within days, shower heads clog with crumbly white scale, and combi boilers face severe risk of heat exchanger failure without chemical treatment and scale protection under BS 7593.",
    faqItems: [
      {
        question: "Why is Norwich water so hard?",
        answer: "Norfolk is underlain by thick Cretaceous chalk deposits. Rainwater filtering through the chalk dissolves massive amounts of calcium before being pumped into the mains."
      },
      {
        question: "What dishwasher setting is needed in Norwich?",
        answer: "Set your dishwasher water softener to the maximum setting (Level 5 or Level 6). Never run the machine without dishwasher salt in Norwich."
      },
      {
        question: "How do I descale a kettle quickly in Norwich?",
        answer: "Boil two tablespoons of citric acid powder in your kettle once a week. The scale will fizz away in under 5 minutes without chemical odours."
      }
    ]
  },
  {
    name: "Cambridge",
    slug: "cambridge",
    supplier: "Cambridge Water",
    region: "East of England",
    avgPpm: 315,
    clarkDegrees: 22.0,
    hardnessCategory: "Very Hard Water",
    softestArea: { name: "Newnham & Girton", ppm: 285 },
    hardestArea: { name: "Cherry Hinton & Trumpington", ppm: 345 },
    metaTitle: "Cambridge Water Hardness Guide",
    metaDescription: "Check Cambridge water hardness levels and Cambridge Water PPM. Learn about chalk aquifer very hard water, kettle descaling, and softener advice.",
    outcodePrefixes: ["CB"],
    editorialSummary: "Cambridge sits on a massive chalk seam, giving the city very hard tap water that averages 315 PPM. Cambridge Water pumps 100% of its supply from underground chalk boreholes throughout Cambridgeshire. While exceptionally wholesome and mineral-rich to drink, this water rapidly forms stubborn limescale. Kettles fur thick within a fortnight, shower screens etch permanently if not squeegeed, and boilers suffer energy losses without proactive descaling and water softening.",
    faqItems: [
      {
        question: "Is Cambridge tap water very hard?",
        answer: "Yes, Cambridge tap water is very hard, averaging 315 PPM (22 Clark degrees). It is sourced entirely from underground chalk aquifers."
      },
      {
        question: "Do I need a water softener in Cambridge?",
        answer: "While not legally mandatory, a water softener is highly recommended in Cambridge to prevent costly limescale damage to boilers, taps, and showers."
      },
      {
        question: "What dishwasher setting should I choose in Cambridge?",
        answer: "Select the highest available setting (Level 5 or 6). Keep coarse dishwasher salt replenished to protect your glasses from irreversible calcium clouding."
      }
    ]
  },
  {
    name: "Oxford",
    slug: "oxford",
    supplier: "Thames Water",
    region: "South East",
    avgPpm: 290,
    clarkDegrees: 20.3,
    hardnessCategory: "Hard Water",
    softestArea: { name: "Jericho & Summertown", ppm: 260 },
    hardestArea: { name: "Headington & Cowley", ppm: 320 },
    metaTitle: "Oxford Water Hardness Guide",
    metaDescription: "Check Oxford water hardness ratings and Thames Water PPM. Compare Oxfordshire limestone hard water, kettle care tips, and dishwasher settings.",
    outcodePrefixes: ["OX"],
    editorialSummary: "Oxford tap water is hard, averaging 290 PPM. Thames Water draws supply from the River Thames (Farmoor Reservoir) and local groundwater boreholes penetrating the Jurassic limestone and chalk geology of Oxfordshire. Kettles fur quickly, chrome fittings collect white waterline crusts, and morning tea develops an oily mineral film if brewed with freshly boiled hard water. Oxford residents benefit greatly from routine citric acid descaling and proper dishwasher salt regulation.",
    faqItems: [
      {
        question: "Why is water so hard in Oxford?",
        answer: "Oxfordshire sits across mineral-dense limestone and chalk geological formations. Rainwater dissolves calcium and magnesium carbonates as it filters into rivers and aquifers."
      },
      {
        question: "What dishwasher salt setting should I use in Oxford?",
        answer: "Set your dishwasher water softener to Level 5. Always keep the salt reservoir filled to protect glassware and heating elements."
      },
      {
        question: "How do I prevent limescale in my Oxford kettle?",
        answer: "Boil one tablespoon of citric acid powder or 100ml of white vinegar with water every 2 to 3 weeks, let sit for 15 minutes, and rinse thoroughly."
      }
    ]
  },
  {
    name: "Exeter",
    slug: "exeter",
    supplier: "South West Water",
    region: "South West",
    avgPpm: 48,
    clarkDegrees: 3.4,
    hardnessCategory: "Soft Water",
    softestArea: { name: "St Leonards & Topsham", ppm: 35 },
    hardestArea: { name: "Pinhoe & Whipton", ppm: 68 },
    metaTitle: "Exeter Water Hardness Guide",
    metaDescription: "Check Exeter water hardness levels and South West Water PPM. Discover Exmoor surface reservoir soft water, kettle care, and appliance advice.",
    outcodePrefixes: ["EX"],
    editorialSummary: "Exeter tap water is soft and refreshing, averaging 48 PPM. South West Water sources the city's supply from surface water reservoirs fed by the River Exe and River Dart, draining the sandstone and shale moorlands of Exmoor and Dartmoor. With very low dissolved calcium content, Exeter residents enjoy clean, scale-free kettles, shiny chrome taps, and silky lather from soaps and shampoos, without the ongoing expense of water softeners.",
    faqItems: [
      {
        question: "Is Exeter tap water hard or soft?",
        answer: "Exeter tap water is soft, with an average hardness of 48 PPM (3.4 Clark degrees). It flows from clean moorland rivers across Devon and Somerset."
      },
      {
        question: "Do I need dishwasher salt in Exeter?",
        answer: "Dishwasher salt is optional or can be set to Level 1 in Exeter due to the low mineral content of the water."
      },
      {
        question: "Does Exeter water cause limescale in kettles?",
        answer: "No, limescale accumulation in Exeter kettles is negligible, requiring only light rinsing to remove natural loose sediment."
      }
    ]
  }
];

export function getAllCities(): CityData[] {
  return citiesData;
}

export function getCityBySlug(slug: string): CityData | undefined {
  return citiesData.find((c) => c.slug === slug);
}

export function getCitiesByRegion(region: string): CityData[] {
  return citiesData.filter((c) => c.region === region);
}
