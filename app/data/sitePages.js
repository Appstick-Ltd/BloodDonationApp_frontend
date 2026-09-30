// Site Data for Blood Banks Solutions, Guides & Educational Resources

export const FOOTER_SOLUTIONS = [
  {
    title: "Smart Proximity Match",
    href: "/smart-proximity",
    description: "Spatial donor telemetry mapping donors within 5km radius of hospitals in under 60 seconds."
  },
  {
    title: "Emergency SOS Broadcast",
    href: "/emergency-sos",
    description: "High-priority push alert broadcast for critical surgeries, ICU emergencies & trauma cases."
  },
  {
    title: "90-Day Safe Donor Cooldown",
    href: "/donor-cooldown",
    description: "Automated countdown health guardian enforcing WHO & DGHS 90-day rest periods."
  },
  {
    title: "Direct Attendant Protection",
    href: "/direct-connect",
    description: "Zero-broker encrypted phone exchange connecting patient families directly to voluntary donors."
  },
  {
    title: "Live Blood Bank Registry",
    href: "/blood-inventory",
    description: "Real-time verified blood group inventory tracking across 64 administrative districts in BD."
  },
  {
    title: "Voluntary Lifesaver Network",
    href: "/voluntary-donors",
    description: "Community platform uniting university clubs, youth organizations & humanitarian donors."
  }
];

export const FOOTER_GUIDES = [
  {
    title: "All Guides & Medical Blog",
    href: "/guides",
    description: "Comprehensive clinical transfusion guides, protocols, and voluntary donor guidelines."
  },
  {
    title: "Blood Compatibility Matrix",
    href: "/blood-compatibility-matrix",
    description: "Interactive ABO & Rh antigen matching tool showing safe donor and recipient combinations."
  },
  {
    title: "Donor Eligibility Criteria",
    href: "/donor-eligibility",
    description: "Complete health requirements, weight thresholds, age limits & temporary deferral rules."
  },
  {
    title: "90-Day Rest & Recovery Guide",
    href: "/donation-recovery",
    description: "Nutritional recovery, iron-rich local Bangladeshi foods, hydration & post-donation care."
  },
  {
    title: "Hospital Emergency Protocol",
    href: "/emergency-protocol",
    description: "Step-by-step checklist for patient families arranging urgent blood in Bangladesh hospitals."
  },
  {
    title: "Transfusion Safety Standards",
    href: "/safe-transfusion",
    description: "Mandatory screening for HIV, HBV, HCV, Syphilis and Malaria under Bangladesh Safe Blood Act."
  }
];

export const PAGES_CONTENT = {
  "smart-proximity": {
    slug: "smart-proximity",
    category: "Spatial Donor Telemetry",
    title: "Smart 5km Location Proximity Donor Matching in Bangladesh",
    subtitle: "When critical surgery starts at DMCH or BSMMU, every minute matters. Our spatial engine connects verified voluntary donors within a 5-kilometer radius of the hospital in under 60 seconds.",
    badge: "5KM RADIUS SCAN",
    highlights: ["100% Free & Voluntary", "Real-Time GPS Telemetry", "Dhaka & Division Traffic Aware"],
    toolType: "proximity-simulator",
    cards: [
      {
        tag: "RAPID GEOSPATIAL SEARCH",
        title: "5km Radius Geospatial Indexing",
        desc: "Rather than blasting broadcast messages across the whole city, our spatial indexing finds voluntary donors geographically nearest to the hospital ICU or operating theater."
      },
      {
        tag: "REAL-TIME AVAILABILITY",
        title: "Live Active Status Filtering",
        desc: "The algorithm filters out donors currently on their 90-day cooldown or marked temporarily unavailable, reaching only active donors ready to respond immediately."
      },
      {
        tag: "TRAFFIC AWARENESS",
        title: "Bangladesh Traffic Calculation",
        desc: "Factors in average transit times across congested hubs like Farmgate, Mohakhali, and Shahbagh so families know realistic arrival timelines."
      },
      {
        tag: "PRIVACY SHIELD",
        title: "Protected GPS Coordinates",
        desc: "Donor exact home addresses are never published. The app measures distance relative to the hospital coordinates only, ensuring complete personal privacy."
      }
    ],
    localContext: {
      tag: "Bangladesh Urban Transit Reality",
      title: "Overcoming Dhaka Gridlocks in Life-or-Death Emergencies",
      desc: "In Bangladesh cities, traffic congestion can double or triple travel times. When a patient in Dhaka Medical College Hospital (DMCH) urgently requires blood for a postpartum hemorrhage or bypass surgery, radial proximity dispatch ensures donors within walking or short motorbike distance are contacted first.",
      points: [
        {
          title: "Shahbagh & Old Dhaka Corridor",
          desc: "Targeting donors in Lalbagh, Bakshibazar, and Ramna ensures rapid hospital bedside arrival within 15–20 minutes."
        },
        {
          title: "Sub-Ward Divisional Outreach",
          desc: "In Chittagong, Khulna, and Rajshahi, proximity matching covers key upazila health complexes and sadar hospitals."
        },
        {
          title: "Eliminating False Leads",
          desc: "Avoids contacting willing donors who are 25km away and cannot physically cross gridlocks in time."
        },
        {
          title: "Direct Route Guidance",
          desc: "Accepted donors receive direct one-tap Google Maps navigation coordinates to the blood transfusion unit."
        }
      ]
    },
    faqs: [
      {
        q: "How does the app protect my exact home location?",
        a: "Blood Banks never displays your exact GPS coordinates to other users. Proximity calculation is performed privately on our secure servers, calculating only the distance (e.g., '2.3 km away') relative to the hospital."
      },
      {
        q: "What is the maximum radius scanned for emergency requests?",
        a: "The standard emergency radius is 5 kilometers. If no active compatible donor is found within 3 minutes, the radius expands to 10 kilometers to ensure no urgent request goes unanswered."
      },
      {
        q: "Can I pause proximity alerts if I am traveling or sick?",
        a: "Yes. From your donor profile in the mobile app, you can toggle your status to 'Resting' or 'Away' at any time to pause push notifications."
      }
    ]
  },

  "emergency-sos": {
    slug: "emergency-sos",
    category: "Critical Emergency Alert",
    title: "Emergency Blood SOS Broadcast Pipeline",
    subtitle: "High-priority Firebase Cloud Messaging (FCM) notifications that bypass silent phone modes for critical surgery emergencies, trauma cases, and urgent obstetric deliveries.",
    badge: "CRITICAL SOS ENGINE",
    highlights: ["High-Priority FCM", "Direct Bedside Request", "Zero Delay"],
    toolType: "triage-simulator",
    cards: [
      {
        tag: "HIGH PRIORITY FCM",
        title: "Override Silent Mode",
        desc: "Surgery and trauma alerts trigger high-priority system notifications, ensuring voluntary donors never miss an urgent request even during nighttime hours."
      },
      {
        tag: "ONE-TAP ACCEPTANCE",
        title: "Instant Donor Confirmation",
        desc: "Donors can confirm their willingness with a single tap, locking the request to prevent duplicate efforts and giving immediate reassurance to the family."
      },
      {
        tag: "HOSPITAL BED REQUISITION",
        title: "Structured Clinical Details",
        desc: "Requests include verified hospital ward, bed number, doctor requisition slip photo, and contact details for the attending relative."
      },
      {
        tag: "ANTI-SPAM FILTERING",
        title: "Abuse & Duplication Protection",
        desc: "Automated checks prevent commercial brokers or spammers from flooding the voluntary network with false alarms."
      }
    ],
    localContext: {
      tag: "Social Media vs Dedicated Pipeline",
      title: "Why Facebook Posts Fail When Every Minute Counts",
      desc: "When families post blood requests on Facebook groups, the post gets buried by social media algorithms, receives spam comments, or falls prey to commercial blood brokers. Blood Banks delivers a targeted notification directly to verified, compatible donors within 60 seconds.",
      points: [
        {
          title: "Immediate Delivery",
          desc: "Push notifications reach the smartphone screen within 1.2 seconds of publication."
        },
        {
          title: "Targeted Blood Matching",
          desc: "Only donors matching the patient's exact compatible ABO and Rh blood groups receive the alert."
        },
        {
          title: "Zero Broker Spam",
          desc: "Direct communication with voluntary donors with no commissions or middleman exploitation."
        },
        {
          title: "Automated Fulfillment Closure",
          desc: "Once required units are confirmed, the alert closes automatically so donors are not unnecessarily called."
        }
      ]
    },
    faqs: [
      {
        q: "Who can post an emergency blood request?",
        a: "Any patient attendant or hospital coordinator can submit an emergency request by entering the hospital name, bed number, required blood group, and contact number."
      },
      {
        q: "What happens when multiple donors accept the emergency call?",
        a: "The app assigns the nearest primary donor and keeps secondary donors on standby. If the primary donor is delayed or cross-matching fails, the backup donor is notified immediately."
      },
      {
        q: "Is there any fee or charge to send an emergency SOS?",
        a: "No. Blood Banks is 100% free and voluntary. We never charge patients or donors for any service."
      }
    ]
  },

  "donor-cooldown": {
    slug: "donor-cooldown",
    category: "Health & Safety Protocol",
    title: "90-Day Safe Donor Cooldown Guardian",
    subtitle: "Protecting voluntary blood donors in Bangladesh with an automated 90-day cooldown countdown, ensuring complete red blood cell and iron regeneration before the next donation.",
    badge: "HEALTH SAFETY GUARDIAN",
    highlights: ["WHO & DGHS Standards", "Erythrocyte Regeneration", "Automated Cooldown Lock"],
    toolType: "cooldown-calculator",
    cards: [
      {
        tag: "ERYTHROCYTE RECOVERY",
        title: "Red Blood Cell Replenishment",
        desc: "While plasma volume restores within 24–48 hours, replacing 450ml of red blood cells requires 6 to 8 weeks of bone marrow erythropoiesis."
      },
      {
        tag: "IRON DEPLETION SAFEGUARD",
        title: "Ferritin Level Protection",
        desc: "Each whole blood donation removes approximately 200–250 mg of elemental iron. The 90-day cooldown prevents iron-deficiency anemia in regular donors."
      },
      {
        tag: "AUTOMATED DATABASE LOCK",
        title: "Premature Request Shielding",
        desc: "Donors in cooldown are automatically masked from emergency search broadcasts, removing social pressure to donate before full recovery."
      },
      {
        tag: "ELIGIBILITY CELEBRATION",
        title: "Ready-to-Save Notification",
        desc: "On day 91, the donor receives an encouraging notification that their body has fully recharged and they are once again eligible to save lives."
      }
    ],
    localContext: {
      tag: "DGHS Bangladesh Guidelines",
      title: "Protecting Student & Youth Donors from Anemia",
      desc: "In Bangladesh, university students form the backbone of voluntary blood donation. However, frequent unmonitored donations without adequate recovery intervals lead to chronic fatigue and depleted iron stores. Our system enforces the Directorate General of Health Services (DGHS) 90-day rule strictly.",
      points: [
        {
          title: "Male Donors (90 Days)",
          desc: "Whole blood donation safe interval: minimum 3 months (90 days) between donations."
        },
        {
          title: "Female Donors (120 Days)",
          desc: "Due to monthly menstrual iron loss, female donors are safeguarded with a 4-month (120 days) cooldown."
        },
        {
          title: "Hemoglobin Verification",
          desc: "Encouraging minimum 12.5 g/dL before every donation across all blood collection centers."
        },
        {
          title: "Nutritional Guidance",
          desc: "In-app tips guiding donors on affordable, iron-rich Bangladeshi foods like kolar mocha, dal, and spinach."
        }
      ]
    },
    faqs: [
      {
        q: "Why can't I donate before 90 days if I feel completely fine?",
        a: "Even if you feel energetic, your body's bone marrow needs time to restore red blood cells and ferritin (iron reserves). Premature donation can trigger subclinical anemia and chronic fatigue."
      },
      {
        q: "Does platelet (apheresis) donation also require a 90-day wait?",
        a: "No. Plateletpheresis returns your red blood cells back to your body, meaning platelets can be donated more frequently (every 14 days, up to 24 times per year) under clinical supervision."
      },
      {
        q: "How does the app know when I donated last?",
        a: "When you mark a request as fulfilled or update your profile with a recent donation date, our Supabase PostgreSQL cluster automatically computes your exact countdown."
      }
    ]
  },

  "direct-connect": {
    slug: "direct-connect",
    category: "Security & Privacy",
    title: "Direct Attendant Calling & Anti-Broker Protection",
    subtitle: "Connecting verified voluntary donors and patient families through secure, direct communication while eliminating commercial blood middlemen and unwanted spam calls.",
    badge: "ZERO MIDDLEMEN",
    highlights: ["Encrypted Phone Exchange", "Zero Broker Commission", "No Public Number Scraping"],
    toolType: "privacy-comparison",
    cards: [
      {
        tag: "CONTROLLED ACCESS",
        title: "No Public Phone Numbers",
        desc: "Your phone number is never indexed on search engines or publicly displayed to internet scrapers. Only authenticated patient attendants can initiate contact."
      },
      {
        tag: "VOLUNTARY CONSENT FIRST",
        title: "Call Enabled After Acceptance",
        desc: "Patient attendants can only call a donor after the donor voluntarily reviews the hospital details and taps 'Accept Emergency Call'."
      },
      {
        tag: "BROKER BLACKLIST",
        title: "Zero-Tolerance Commercial Ban",
        desc: "Any user attempting to sell blood, charge money, or act as a middleman broker is permanently banned and reported to regulatory authorities."
      },
      {
        tag: "ONE-TOUCH DIALING",
        title: "Immediate Bedside Connection",
        desc: "When urgent blood is needed, attendants connect with a single tap, minimizing confusion and stressful typing errors."
      }
    ],
    localContext: {
      tag: "Hospital Reality in Bangladesh",
      title: "Eliminating Exploitative Blood Brokers at Public Hospitals",
      desc: "Outside major medical centers like Sir Salimullah Medical College (Mitford) and Dhaka Medical College, professional blood syndicates often exploit panic-stricken families by charging exorbitant sums for unverified, unsafe blood. Blood Banks creates a purely voluntary, direct bond between the humanitarian donor and the patient family.",
      points: [
        {
          title: "Direct Family Contact",
          desc: "Families speak directly with the real voluntary lifesaver without third-party commission."
        },
        {
          title: "Donor Safety Assurance",
          desc: "Female donors can specify daytime preferences or hospital-accompanied donation protocols."
        },
        {
          title: "Post-Call Mutual Rating",
          desc: "Both parties can verify completion, upholding community trust and humanitarian dignity."
        },
        {
          title: "Instant Abuse Reporting",
          desc: "24/7 moderation team investigates any reported commercial solicitation within 15 minutes."
        }
      ]
    },
    faqs: [
      {
        q: "Can strangers find my phone number on Google?",
        a: "Never. Blood Banks keeps all donor contact information private and encrypted. Your number is never accessible to web crawlers or unverified accounts."
      },
      {
        q: "What should I do if an attendant offers money for my blood donation?",
        a: "Politely remind them that voluntary blood donation in Bangladesh is a free humanitarian act. You can report any commercial transactions inside the app."
      },
      {
        q: "Can I cancel an acceptance if an emergency comes up?",
        a: "Yes. If an unexpected emergency prevents you from traveling, you can cancel in the app so a backup donor is immediately mobilized."
      }
    ]
  },

  "blood-inventory": {
    slug: "blood-inventory",
    category: "Database Telemetry",
    title: "Live Supabase Blood Inventory & Distribution Registry",
    subtitle: "Real-time verified blood group registry across 64 administrative districts in Bangladesh, powered by a high-availability Supabase PostgreSQL cluster with sub-second synchronization.",
    badge: "DATABASE TELEMETRY",
    highlights: ["PostgreSQL Cluster", "Sub-Second Sync", "64 Districts Covered"],
    toolType: "inventory-explorer",
    cards: [
      {
        tag: "REAL-TIME SYNC",
        title: "Sub-Second PostgreSQL Stream",
        desc: "Every donor registration, availability change, and fulfilled donation updates the nationwide metrics in real time via Supabase Websockets."
      },
      {
        tag: "DISTRICT-BY-DISTRICT",
        title: "64 Administrative Districts",
        desc: "From Panchagarh to Cox's Bazar, track verified donor density across sadar hospitals, medical colleges, and upazila health complexes."
      },
      {
        tag: "DEFICIT PREDICTION",
        title: "Rare Group Shortage Warning",
        desc: "Automated telemetry flags regional shortages for rare groups like O- and AB-, alerting local volunteer clubs before critical crises occur."
      },
      {
        tag: "DATA INTEGRITY",
        title: "Clean, Verified Records",
        desc: "Row-Level Security (RLS) and strict database constraints guarantee zero duplicate records and prevent corrupted registry entries."
      }
    ],
    localContext: {
      tag: "National Supply & Demand",
      title: "Addressing Bangladesh's 1,000,000 Annual Units Demand",
      desc: "Bangladesh requires between 800,000 and 1,000,000 units of blood annually for surgeries, road accidents, thalassemia, and maternal complications. Live inventory visibility helps humanitarian youth organizations organize targeted donor camps in underserved divisions.",
      points: [
        {
          title: "Thalassemia Regularity",
          desc: "Over 60,000 children with Thalassemia in BD need blood transfusions every 21–30 days."
        },
        {
          title: "Dengue Epidemic Surges",
          desc: "Seasonal dengue outbreaks in Dhaka cause sudden spikes in platelet demand that strain public blood banks."
        },
        {
          title: "Maternal Health Protection",
          desc: "Postpartum hemorrhage remains a leading cause of maternal mortality; fast blood availability saves mothers' lives."
        },
        {
          title: "District Balancing",
          desc: "Facilitates inter-district emergency donor coordination between neighboring divisions."
        }
      ]
    },
    faqs: [
      {
        q: "How often is the blood inventory data refreshed?",
        a: "The landing page and mobile app poll live Supabase metrics every 30 seconds and update instantly when new donors register or fulfill requests."
      },
      {
        q: "Are the donor counts real verified people?",
        a: "Yes. Every record represents a registered user in our database who verified their phone number and provided their blood group and district."
      },
      {
        q: "Can hospital blood banks connect their internal inventory?",
        a: "We are currently developing verified hospital APIs for Sandhani, Quantum, Red Crescent, and medical college transfusion units."
      }
    ]
  },

  "voluntary-donors": {
    slug: "voluntary-donors",
    category: "Community Mission",
    title: "Voluntary Lifesaver Community Network",
    subtitle: "Uniting university blood donation clubs, youth organizations, and compassionate humanitarians across Bangladesh into an unstoppable life-saving movement.",
    badge: "VOLUNTARY LIFESAVERS",
    highlights: ["Non-Remunerated Voluntary", "Verifiable Certificates", "Community Badges"],
    toolType: "impact-calculator",
    cards: [
      {
        tag: "YOUTH MOVEMENT",
        title: "University Club Alliances",
        desc: "Partnering with university blood clubs across DU, BUET, NUBTK, RU, and CU to mobilize active student donors during critical shortages."
      },
      {
        tag: "DIGITAL CERTIFICATES",
        title: "Verifiable Lifesaver Honors",
        desc: "Donors earn digital, tamper-proof donation certificates recognized by humanitarian organizations and institutional partners."
      },
      {
        tag: "MILESTONE BADGES",
        title: "Donation Tier Recognition",
        desc: "Progress from Bronze Lifesaver (1 donation) to Silver (3+), Gold (10+), and Platinum Legend (25+ lifetime voluntary donations)."
      },
      {
        tag: "HUMANITARIAN ETHICS",
        title: "100% Non-Remunerated Ethos",
        desc: "Rooted in the fundamental belief that human blood is a gift of life that should never be commodified, bought, or sold."
      }
    ],
    localContext: {
      tag: "Youth Leadership in BD",
      title: "How Student Donors Built the Modern Lifesaver Network",
      desc: "For decades, Bangladesh's blood safety has relied on the courage of young student volunteers who step up during national disasters, floods, and hospital crises. Blood Banks gives these youth organizations modern technological infrastructure to multiply their impact.",
      points: [
        {
          title: "Campus Blood Drives",
          desc: "Hosting regular voluntary donation camps with sterile clinical equipment and qualified transfusion officers."
        },
        {
          title: "National Humanitarian Pride",
          desc: "Inspiring the next generation of youth to view regular blood donation as a basic civic and moral duty."
        },
        {
          title: "Bridging the Gender Gap",
          desc: "Encouraging more female donors through dedicated awareness on nutrition, hemoglobin, and comfortable donation environments."
        },
        {
          title: "Community Brotherhood",
          desc: "A brotherhood of donors standing ready whenever a fellow citizen faces a medical emergency."
        }
      ]
    },
    faqs: [
      {
        q: "How can my university or college club partner with Blood Banks?",
        a: "We welcome all voluntary clubs! Reach out to us via our support email (support@appstick.com.bd) or WhatsApp to get your club verified and featured on our network."
      },
      {
        q: "Do I receive a certificate after every blood donation?",
        a: "Yes. Once your donation is marked fulfilled by the patient attendant or hospital, a digital certificate is automatically generated in your mobile app."
      },
      {
        q: "What are the requirements to join as a voluntary donor?",
        a: "You must be 18 to 60 years old, weigh at least 45 kg, have a hemoglobin of 12.5 g/dL or higher, and be in good general health."
      }
    ]
  },

  "guides": {
    slug: "guides",
    category: "Clinical Knowledge Hub",
    title: "All Guides & Clinical Blood Resources",
    subtitle: "Essential medical guides, emergency protocols, and nutritional advice curated by medical professionals for voluntary blood donors and patient families in Bangladesh.",
    badge: "CLINICAL KNOWLEDGE",
    highlights: ["Medical Accuracy", "DGHS & WHO Standards", "Local BD Clinical Context"],
    toolType: "guides-directory",
    cards: [
      {
        tag: "COMPATIBILITY",
        title: "Blood Compatibility Matrix",
        desc: "Understand ABO red cell antigens, Rh factors, and universal donor/recipient rules to ensure safe transfusions."
      },
      {
        tag: "ELIGIBILITY",
        title: "Donor Health Requirements",
        desc: "Learn about age limits, weight criteria, blood pressure standards, and permanent vs temporary deferral periods."
      },
      {
        tag: "AFTERCARE",
        title: "90-Day Rest & Nutrition",
        desc: "Essential dietary advice, iron-rich Bangladeshi foods, and hydration tips to recover red blood cells quickly."
      },
      {
        tag: "HOSPITAL CHECKLIST",
        title: "Emergency Request Protocol",
        desc: "A step-by-step hospital checklist for families navigating requisitions, sample tubes, and cross-matching."
      }
    ],
    localContext: {
      tag: "Health Literacy in Bangladesh",
      title: "Empowering Citizens with Accurate Medical Knowledge",
      desc: "Myths and misinformation often prevent willing citizens from donating blood in Bangladesh. Common misconceptions—such as blood donation causing permanent weakness or weight loss—are debunked through clear, evidence-based medical information.",
      points: [
        {
          title: "Myth: 'Donating makes you weak'",
          desc: "Fact: The human body restores fluid volume within 24 hours and stimulates healthy bone marrow to produce fresh blood cells."
        },
        {
          title: "Myth: 'Women shouldn't donate blood'",
          desc: "Fact: Healthy women with hemoglobin of 12.5 g/dL or higher can safely donate every 4 months."
        },
        {
          title: "Myth: 'You might catch infections'",
          desc: "Fact: Blood collection uses sterile, single-use disposable needles that are destroyed immediately after one use."
        },
        {
          title: "Cardiovascular Benefits",
          desc: "Regular voluntary blood donation helps regulate blood viscosity and reduces harmful excess iron storage."
        }
      ]
    },
    faqs: [
      {
        q: "Who authors these clinical guides?",
        a: "Our educational guides are formulated based on WHO transfusion guidelines, Bangladesh Directorate General of Health Services (DGHS) safe blood manuals, and validated clinical protocols."
      },
      {
        q: "Can I share these guides with my community?",
        a: "Yes! All guides are freely accessible and encouraged to be shared across educational institutions, social media, and humanitarian clubs."
      }
    ]
  },

  "blood-compatibility-matrix": {
    slug: "blood-compatibility-matrix",
    category: "Medical Clinical Tool",
    title: "Interactive Blood Compatibility Matrix & Clinical Guide",
    subtitle: "Understand ABO and Rh blood group antigen compatibility. Explore who can safely donate to whom, and which groups can receive blood without hemolytic transfusion reactions.",
    badge: "COMPATIBILITY TOOL",
    highlights: ["ABO & Rh Antigen Rules", "Universal O- & AB+", "Clinical Transfusion Protocols"],
    toolType: "compatibility-explorer",
    cards: [
      {
        tag: "UNIVERSAL DONOR",
        title: "O- Negative (O Negative)",
        desc: "Has neither A nor B antigens on red cells and lacks Rh factor. Can be given to any patient in life-threatening emergencies before type is determined."
      },
      {
        tag: "UNIVERSAL RECIPIENT",
        title: "AB+ Positive (AB Positive)",
        desc: "Has both A and B antigens as well as Rh factor. Can safely receive red blood cells from all eight ABO and Rh blood groups."
      },
      {
        tag: "RH FACTOR RULES",
        title: "Rh Positive vs Rh Negative",
        desc: "Rh-positive individuals can receive both Rh-positive and Rh-negative blood, while Rh-negative individuals must only receive Rh-negative blood to prevent anti-D sensitization."
      },
      {
        tag: "CROSS-MATCHING MANDATE",
        title: "Mandatory Major Cross-Match",
        desc: "Even when ABO groups match, hospital blood banks must perform major cross-matching between donor red cells and patient serum before transfusion."
      }
    ],
    localContext: {
      tag: "Blood Demographics in Bangladesh",
      title: "Rarity of Rh-Negative Groups in the Bangladeshi Population",
      desc: "While O-positive (32%) and B-positive (33%) are the most common blood groups in Bangladesh, Rh-negative blood groups (O-, A-, B-, AB-) account for less than 3% of the total population. This makes rapid compatibility matching for negative blood groups a matter of urgent life and death.",
      points: [
        {
          title: "B+ (33%) & O+ (32%)",
          desc: "Represent roughly two-thirds of all voluntary blood donors in Bangladesh."
        },
        {
          title: "A+ (23%) & AB+ (8%)",
          desc: "Represent the remaining majority of Rh-positive donors across 64 districts."
        },
        {
          title: "O- Negative (~1.5%)",
          desc: "Critically scarce; urgently needed during maternal complications and emergency trauma surgery."
        },
        {
          title: "AB- Negative (<0.5%)",
          desc: "The rarest blood type in Bangladesh; voluntary registers must maintain active standby contacts."
        }
      ]
    },
    faqs: [
      {
        q: "What happens if an incompatible blood group is transfused?",
        a: "The patient's immune antibodies will attack and destroy the transfused foreign red blood cells (acute hemolytic transfusion reaction), which can cause kidney failure, shock, and fatal complications. Strict compatibility testing prevents this."
      },
      {
        q: "Can an O+ person donate blood to an A+ patient?",
        a: "Yes! O-positive red blood cells lack A and B surface antigens, so an A-positive patient can safely receive O-positive red blood cells."
      },
      {
        q: "Why can't Rh-negative patients receive Rh-positive blood?",
        a: "Rh-negative blood lacks the D antigen. If exposed to Rh-positive red cells, the recipient's immune system will develop anti-D antibodies, causing severe hemolytic reactions during future transfusions or pregnancies."
      }
    ]
  },

  "donor-eligibility": {
    slug: "donor-eligibility",
    category: "Medical Screening Guidelines",
    title: "Blood Donor Eligibility Criteria in Bangladesh",
    subtitle: "Complete clinical health requirements, minimum age and weight thresholds, blood pressure standards, and permanent vs temporary deferral rules for safe blood donation.",
    badge: "ELIGIBILITY GUIDELINES",
    highlights: ["Age 18-60", "Weight 45kg+", "Hemoglobin >= 12.5 g/dL", "DGHS Bangladesh Standards"],
    toolType: "eligibility-quiz",
    cards: [
      {
        tag: "AGE & WEIGHT",
        title: "Basic Physical Criteria",
        desc: "Donors must be between 18 and 60 years old and weigh at least 45 kg (whole blood 350ml) or 50 kg (standard 450ml collection pack)."
      },
      {
        tag: "HEMOGLOBIN CHECK",
        title: "Minimum Hemoglobin Level",
        desc: "Hemoglobin must be at least 12.5 g/dL (tested quickly via copper sulfate or digital hemoglobinometer prior to donation)."
      },
      {
        tag: "VITAL SIGNS",
        title: "Normal Blood Pressure & Pulse",
        desc: "Systolic BP 100–140 mmHg, Diastolic BP 60–90 mmHg, and resting pulse between 60 and 100 beats per minute with no fever."
      },
      {
        tag: "SAFE INTERVAL",
        title: "Cooldown Verification",
        desc: "Must have completed at least 90 days since previous whole blood donation (120 days recommended for female donors)."
      }
    ],
    localContext: {
      tag: "Screening at Blood Camps",
      title: "Ensuring Donor Safety First, Recipient Safety Always",
      desc: "A safe blood donation starts with rigorous donor selection. In Bangladesh, voluntary organizations like Sandhani, Badhan, and Red Crescent carry out pre-donation medical history questionnaires to ensure donating blood will never compromise the donor's health.",
      points: [
        {
          title: "Temporary Deferrals (1–4 Weeks)",
          desc: "Recent cold/flu/fever (wait 1 week), completed oral antibiotics course (wait 2 weeks), minor dental extraction (wait 7 days)."
        },
        {
          title: "Intermediate Deferrals (6–12 Months)",
          desc: "Tattoos or body piercings (wait 6–12 months), major surgical operation (wait 6–12 months), typhoid recovery (wait 12 months)."
        },
        {
          title: "Female Donors (Pregnancy & Nursing)",
          desc: "Deferred during pregnancy and 6 months post-delivery; deferred during active breastfeeding."
        },
        {
          title: "Permanent Exclusions",
          desc: "History of cardiac disease, chronic kidney disorder, cancer, active hepatitis B/C, HIV, or intravenous drug use."
        }
      ]
    },
    faqs: [
      {
        q: "Can cigarette smokers donate blood?",
        a: "Yes, smokers can donate blood provided they are otherwise healthy. However, you should avoid smoking for at least 2 hours before and after donation to avoid lightheadedness."
      },
      {
        q: "Can I donate if I am taking medication for high blood pressure?",
        a: "Yes, if your blood pressure is well-controlled under consistent medication and falls within 100–140/60–90 mmHg on the day of donation."
      },
      {
        q: "How long after getting a tattoo can I donate blood in Bangladesh?",
        a: "Under DGHS and international standards, you must wait at least 6 months after receiving a tattoo or cosmetic body piercing to rule out window-period infections."
      }
    ]
  },

  "donation-recovery": {
    slug: "donation-recovery",
    category: "Post-Donation Care",
    title: "Post-Donation Rest & Nutritional Recovery Guide",
    subtitle: "Clinical post-donation guidelines on rapid fluid hydration, iron-rich local Bangladeshi nutrition, physical rest, and safe recovery practices after donating whole blood.",
    badge: "POST-DONATION CARE",
    highlights: ["500ml Plasma Recovery in 24h", "Iron-Rich Local BD Foods", "Safe Recovery Steps"],
    toolType: "recovery-timeline",
    cards: [
      {
        tag: "IMMEDIATE REST",
        title: "First 15–20 Minutes at Hospital",
        desc: "Rest comfortably in the donor lounge with legs slightly elevated. Enjoy a sweet snack and juice to stabilize blood glucose and blood pressure."
      },
      {
        tag: "HYDRATION PRIORITY",
        title: "Replenish Fluids Within 24 Hours",
        desc: "Drink an extra 4 to 6 glasses of clean water, coconut water (daab), or fresh juice over the next 24 hours to rapidly restore your blood volume."
      },
      {
        tag: "PHYSICAL ACTIVITY",
        title: "Avoid Heavy Lifting on Same Day",
        desc: "Avoid strenuous gym workouts, heavy motorcycle riding in traffic, or manual labor for 12 hours following your blood donation."
      },
      {
        tag: "PUNCTURE CARE",
        title: "Keep Bandage Dry & Clean",
        desc: "Keep the pressure dressing on your arm for at least 4 hours. If slight bruising occurs, apply an ice pack wrapped in a clean cloth."
      }
    ],
    localContext: {
      tag: "Affordable Nutrition in Bangladesh",
      title: "Local Bangladeshi Foods for Rapid Iron & Red Cell Rebuilding",
      desc: "You don't need expensive supplements to replenish your blood. The rich local cuisine of Bangladesh provides abundant, natural, highly bioavailable iron and vitamin C to accelerate red blood cell synthesis.",
      points: [
        {
          title: "Kolija & Eggs (Heme Iron)",
          desc: "Chicken or mutton liver (kolija) and eggs provide heme iron, which is absorbed 3x faster than plant-based iron."
        },
        {
          title: "Kolar Mocha & Kochu Shak",
          desc: "Banana flower (kolar mocha), taro greens (kochu shak), and spinach are traditional iron powerhouses."
        },
        {
          title: "Dal & Kalojira (Black Seed)",
          desc: "Lentils (musur dal) paired with kalojira and roasted peanuts furnish essential amino acids and trace minerals."
        },
        {
          title: "Vitamin C Pairing (Lebu & Amloki)",
          desc: "Always squeeze fresh lemon (lebu) or eat amla (amloki) with meals; vitamin C boosts iron absorption by up to 300%."
        }
      ]
    },
    faqs: [
      {
        q: "What should I do if I feel dizzy or lightheaded after donating?",
        a: "Lie down immediately with your feet elevated higher than your head. Loosen tight clothing and sip cold water. The sensation will pass in a few minutes as circulation stabilizes."
      },
      {
        q: "How long does it take for my body to replace the donated blood?",
        a: "Fluid plasma volume is replaced within 24 to 48 hours. Red blood cells and hemoglobin are fully replenished by your bone marrow within 6 to 8 weeks."
      },
      {
        q: "Can I drive a motorcycle immediately after donation?",
        a: "We strongly advise resting 30 minutes and drinking juice before riding a motorcycle or driving, particularly in Dhaka's congested traffic."
      }
    ]
  },

  "emergency-protocol": {
    slug: "emergency-protocol",
    category: "Hospital Coordination",
    title: "Hospital Emergency Blood Request Protocol",
    subtitle: "A practical step-by-step checklist for patient families and attendants navigating doctor requisitions, cross-matching tubes, and safe transfusion in Bangladesh hospitals.",
    badge: "HOSPITAL PROTOCOL",
    highlights: ["Doctor Requisition Slip", "Cross-Matching Sample Tube", "Safe Transfusion Checklist"],
    toolType: "protocol-checklist",
    cards: [
      {
        tag: "STEP 1: REQUISITION",
        title: "Doctor's Blood Requisition Form",
        desc: "Ensure the attending physician signs the official requisition indicating patient name, bed number, diagnosis, blood group, and required units."
      },
      {
        tag: "STEP 2: SAMPLE TUBE",
        title: "Patient Cross-Match Sample",
        desc: "Collect a 3–5 ml clotted blood sample tube from the patient with an exact matching patient ID label for the hospital transfusion laboratory."
      },
      {
        tag: "STEP 3: POST ON APP",
        title: "Submit Emergency Alert on Blood Banks",
        desc: "Enter the hospital name, required group, and bed details. Proximity engine automatically notifies compatible voluntary donors within 5km."
      },
      {
        tag: "STEP 4: SCREEN & TRANSFUSE",
        title: "Cross-Match & Mandatory Screening",
        desc: "When the donor arrives, the transfusion lab conducts mandatory 5-disease screening and cross-matching before the blood bag is collected."
      }
    ],
    localContext: {
      tag: "Hospital Navigation Guide",
      title: "How to Avoid Delays at Dhaka Medical & Divisional Hospitals",
      desc: "Emergency wards in government hospitals (DMCH, SOMCH, Chittagong Medical) are intense, fast-moving environments. Knowing the exact sequence of documents and procedures saves hours of critical time during surgical emergencies.",
      points: [
        {
          title: "Transfusion Lab Location",
          desc: "Identify the blood transfusion medicine department (Blood Bank) as soon as admission is complete."
        },
        {
          title: "Blood Bag Cold-Chain Box",
          desc: "Always carry an insulated ice container or cold bag when transporting cross-matched blood bags from the lab to the ICU."
        },
        {
          title: "Verify Donor Arrival Before Puncturing",
          desc: "Coordinate with the donor on WhatsApp/phone so they report straight to the blood transfusion department without wandering."
        },
        {
          title: "Check Expiry & Labeling",
          desc: "Before transfusion, double-check that the blood bag label matches the patient's name, bed number, and blood group exactly."
        }
      ]
    },
    faqs: [
      {
        q: "What is major cross-matching and why does it take 30–60 minutes?",
        a: "Cross-matching mixes patient serum with donor red cells in the lab to confirm no agglutination or destruction occurs. It is an indispensable safety test to prevent fatal transfusion reactions."
      },
      {
        q: "What if the hospital does not have an active blood bank?",
        a: "In smaller clinics or upazila hospitals, patient attendants coordinate with nearby authorized centers (e.g. Red Crescent, Sandhani, Quantum, or government district sadar hospital) for screening and blood collection."
      },
      {
        q: "Who is responsible for the donor's testing fees?",
        a: "In Bangladesh government medical colleges, mandatory screening fees are standardized at minimal government rates (typically ৳400–৳600). The voluntary donor provides the blood free of charge as a humanitarian gift."
      }
    ]
  },

  "safe-transfusion": {
    slug: "safe-transfusion",
    category: "Clinical Quality & Safety",
    title: "Safe Blood Transfusion & Mandatory Screening Standards",
    subtitle: "The 5 mandatory infectious disease screenings required by Bangladesh Safe Blood Transfusion Act to protect recipients from transfusion-transmitted infections (TTIs).",
    badge: "MANDATORY SCREENING",
    highlights: ["Safe Blood Transfusion Act", "5 Mandatory Tests", "Sterile Single-Use Kits"],
    toolType: "screening-standards",
    cards: [
      {
        tag: "MANDATORY TEST 1",
        title: "HIV 1 & 2 Screening",
        desc: "Screening for Human Immunodeficiency Virus types 1 and 2 to guarantee total prevention of transfusion-transmitted AIDS."
      },
      {
        tag: "MANDATORY TEST 2 & 3",
        title: "Hepatitis B (HBsAg) & Hepatitis C (HCV)",
        desc: "Rigorous testing for Hepatitis B surface antigen and anti-HCV antibodies to safeguard patient liver health."
      },
      {
        tag: "MANDATORY TEST 4",
        title: "Syphilis (VDRL / TPHA)",
        desc: "Serological screening for Treponema pallidum to prevent transmission of venereal syphilis."
      },
      {
        tag: "MANDATORY TEST 5",
        title: "Malaria Parasite (MP)",
        desc: "Microscopic or rapid diagnostic testing for Plasmodium species, especially relevant for donors from endemic hilly districts."
      }
    ],
    localContext: {
      tag: "Legal Framework in Bangladesh",
      title: "The Safe Blood Transfusion Act of 2002",
      desc: "Under the Safe Blood Transfusion Act 2002 passed by the Parliament of Bangladesh, it is a criminal offense to transfuse unscreened blood. All medical institutions, clinics, and blood centers must certify that all 5 tests have been conducted with certified, unexpired diagnostic reagents.",
      points: [
        {
          title: "Sterile Disposable Needles",
          desc: "All collection sets are sterile, single-use, and hermetically sealed. Donors face zero risk of contracting infections during donation."
        },
        {
          title: "ELISA & Rapid Test Verification",
          desc: "Hospital laboratories utilize modern enzyme-linked immunosorbent assays (ELISA) or high-sensitivity rapid diagnostic tests (RDT)."
        },
        {
          title: "Discarding Reactive Bags",
          desc: "Any blood unit reactive to any of the 5 screenings is immediately autoclaved and incinerated under biomedical waste protocols."
        },
        {
          title: "Confidential Donor Notification",
          desc: "Donors who show reactive results are notified privately and linked with qualified medical counseling."
        }
      ]
    },
    faqs: [
      {
        q: "Can a donor get an infection like HIV or Hepatitis by donating blood?",
        a: "No! Absolutely not. Blood donation is 100% sterile. Every needle, tube, and blood bag is brand-new, factory-sealed, used once for you alone, and destroyed immediately afterward."
      },
      {
        q: "How long does the 5-disease screening take at the hospital?",
        a: "With modern rapid diagnostic kits, screening takes approximately 20 to 35 minutes alongside blood grouping and cross-matching."
      },
      {
        q: "What is the 'window period' in blood screening?",
        a: "The window period is the early phase after infection before detectable antibodies or antigens develop. This is why strict pre-donation donor questionnaires and voluntary non-remunerated donors are so essential."
      }
    ]
  },

  "privacy-policy": {
    slug: "privacy-policy",
    category: "Legal & Medical Privacy",
    title: "Privacy Policy & Medical Data Protection",
    subtitle: "Our solemn commitment to protecting your health information, donor contact privacy, location telemetry, and communications under strict security standards.",
    badge: "PRIVACY POLICY",
    highlights: ["Encrypted Phone Exchange", "Zero Third-Party Data Sale", "Donor Consent Control"],
    toolType: "legal-document",
    cards: [
      {
        tag: "DATA COLLECTION",
        title: "What Information We Collect",
        desc: "We collect only essential data needed to save lives: your name, blood group, district/sub-district, approximate GPS coordinates, and contact phone number."
      },
      {
        tag: "NO DATA SELLING",
        title: "Zero Commercial Exploitation",
        desc: "We will never sell, rent, monetize, or trade your personal or health data to advertisers, pharmaceutical companies, or third parties."
      },
      {
        tag: "LOCATION SHIELD",
        title: "Protected Geolocation Telemetry",
        desc: "Your exact home coordinates are never published online. Location calculations measure distance relative to hospital coordinates only."
      },
      {
        tag: "DELETION RIGHTS",
        title: "Full Account & Data Control",
        desc: "You can update your availability, pause notifications, or permanently delete your account and profile data at any time from the app settings."
      }
    ],
    localContext: {
      tag: "Ethical Standards",
      title: "Humanitarian Medical Ethics First",
      desc: "Blood donation is one of the highest acts of human charity. Blood Banks treats your data with the dignity and confidentiality required by global medical standards and the laws of Bangladesh.",
      points: [
        {
          title: "Supabase Row-Level Security",
          desc: "All personal records are encrypted in transit via SSL/TLS and protected with PostgreSQL Row-Level Security (RLS)."
        },
        {
          title: "Masked Calling Protocol",
          desc: "Phone numbers are only disclosed to patient families after you voluntarily tap 'Accept' on an emergency request."
        },
        {
          title: "Zero Broker Access",
          desc: "Automated behavioral monitoring blocks unauthorized data scrapers and commercial syndicates."
        },
        {
          title: "Government Compliance",
          desc: "Fully aligned with Bangladesh Digital Security and Telecommunications regulatory guidelines."
        }
      ]
    },
    faqs: [
      {
        q: "How can I request complete deletion of my data?",
        a: "You can delete your account inside the mobile app settings under 'Privacy & Security > Delete Account', or email support@appstick.com.bd for immediate purging."
      },
      {
        q: "Who operates the Blood Banks platform?",
        a: "Blood Banks is an institutional humanitarian initiative powered by Appstick Ltd and Northern University of Business & Technology Khulna (NUBTK)."
      }
    ]
  },

  "terms-condition": {
    slug: "terms-condition",
    category: "Terms of Service",
    title: "Terms of Service & Humanitarian Code of Conduct",
    subtitle: "Rules governing voluntary participation, emergency blood requests, and our strict zero-tolerance policy against commercial blood trade.",
    badge: "TERMS OF SERVICE",
    highlights: ["Strictly Non-Commercial", "Zero Broker Tolerance", "Humanitarian Code of Conduct"],
    toolType: "legal-document",
    cards: [
      {
        tag: "NON-COMMERCIAL",
        title: "100% Voluntary Humanitarian Service",
        desc: "All donations arranged through Blood Banks must be strictly voluntary and non-remunerated. Demanding or offering money for blood is prohibited."
      },
      {
        tag: "ACCURACY OF REQUESTS",
        title: "Honest Medical Need",
        desc: "Users submitting emergency requests warrant that the request is for a genuine patient with a valid hospital requisition slip."
      },
      {
        tag: "MEDICAL DISCLAIMER",
        title: "Coordination Platform, Not a Laboratory",
        desc: "Blood Banks is an alert communications platform. Medical screening, testing, cross-matching, and transfusion must be performed by certified hospitals."
      },
      {
        tag: "IMMEDIATE SUSPENSION",
        title: "Enforcement & Penalties",
        desc: "Any account found soliciting money, posting fraudulent requests, or harassing voluntary donors will be permanently terminated."
      }
    ],
    localContext: {
      tag: "Code of Conduct",
      title: "Protecting the Sanctity of Voluntary Donation",
      desc: "By using the Blood Banks platform, all donors and patient families agree to uphold the highest standards of mutual respect, transparency, and humanitarian dignity.",
      points: [
        {
          title: "Respect for Donor Time",
          desc: "Attendants must provide accurate hospital directions and maintain respectful communication with voluntary donors."
        },
        {
          title: "No Duplicate Commercial Orders",
          desc: "Users must not engage commercial brokers while utilizing the voluntary lifesaver network."
        },
        {
          title: "Reporting Misconduct",
          desc: "All community members have the right and responsibility to report suspicious behavior through the in-app reporting tool."
        },
        {
          title: "Governing Law",
          desc: "These terms are governed by the laws of the People's Republic of Bangladesh, including the Safe Blood Transfusion Act 2002."
        }
      ]
    },
    faqs: [
      {
        q: "What should I do if a user violates these terms?",
        a: "Report the user immediately through the mobile app's 'Report Issue' button or contact support@appstick.com.bd with relevant screenshots."
      },
      {
        q: "Can organizations use the Blood Banks name for commercial events?",
        a: "No. The name, branding, and assets of Blood Banks are proprietary intellectual property and cannot be used commercially without written authorization."
      }
    ]
  }
};
