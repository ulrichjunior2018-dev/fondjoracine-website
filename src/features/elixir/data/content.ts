import { formulaIngredients } from "@/content/formula";
import { config, formatXaf } from "@/lib/config";
import { siteImages } from "@/lib/site-images";

export type Locale = "en" | "fr";

export type LocalizedText = Record<Locale, string>;

function localized(english: string, french: string): LocalizedText {
  return { ["en"]: english, ["fr"]: french };
}

export type ElixirImage = {
  alt: LocalizedText;
  height: number;
  src: string;
  width: number;
};

export type CmsSection = {
  eyebrow: LocalizedText;
  title: LocalizedText;
  intro?: LocalizedText | undefined;
};

export type ElixirContent = {
  availability: LocalizedText;
  beforeAfter: CmsSection & {
    items: Array<{
      after: ElixirImage;
      before: ElixirImage;
      caption: LocalizedText;
      customer?:
        | {
            city: string;
            name: string;
            week: number;
          }
        | undefined;
      isPlaceholder?: boolean | undefined;
      label: LocalizedText;
    }>;
  };
  brand: string;
  brandPositioning: {
    primary: LocalizedText;
    secondary: LocalizedText;
  };
  currency: string;
  description: LocalizedText;
  faq: CmsSection & {
    items: Array<{
      answer: LocalizedText;
      question: LocalizedText;
    }>;
  };
  finalCta: CmsSection & {
    button: LocalizedText;
  };
  founder: CmsSection & {
    image: ElixirImage;
    name: string;
    signature: LocalizedText;
  };
  guarantee: CmsSection & {
    badges: LocalizedText[];
    terms: LocalizedText;
  };
  hero: {
    eyebrow: LocalizedText;
    primaryCta: LocalizedText;
    secondaryCta: LocalizedText;
    title: LocalizedText;
  };
  highlights: Array<{
    label: LocalizedText;
    value: LocalizedText;
  }>;
  howToUse: CmsSection & {
    steps: Array<{
      step: LocalizedText;
      text: LocalizedText;
      title: LocalizedText;
    }>;
  };
  id: string;
  images: ElixirImage[];
  ingredientScience: CmsSection & {
    ingredients: Array<{
      image?: string | undefined;
      imageAlt?: LocalizedText | undefined;
      name: LocalizedText;
      note: LocalizedText;
    }>;
  };
  inventory: {
    lowStockThreshold: number;
    stockCount: number;
  };
  innerCircle: CmsSection & {
    benefits: LocalizedText[];
    cta: LocalizedText;
    priceXaf: string;
  };
  launchAnnouncement: CmsSection & {
    badge: LocalizedText;
    cta: LocalizedText;
    enabled: boolean;
  };
  manualPayments: {
    heading: LocalizedText;
    intro: LocalizedText;
    methods: Array<{
      accountName: string;
      instructions: LocalizedText;
      label: string;
      number: string;
    }>;
  };
  priceCents: number;
  priceXaf: string;
  problem: CmsSection & {
    concerns: Array<{
      label: LocalizedText;
      text: LocalizedText;
    }>;
  };
  product: CmsSection & {
    name: LocalizedText;
    size: LocalizedText;
    priceXaf: string;
    description: LocalizedText;
  };
  seo: {
    description: LocalizedText;
    title: LocalizedText;
  };
  shipping: LocalizedText;
  slug: string;
  socialLinks: {
    instagram?: string | undefined;
    tiktok?: string | undefined;
  };
  stripePriceId?: string | undefined;
  testimonials: CmsSection & {
    items: Array<{
      approved: boolean;
      location: LocalizedText;
      name: string;
      quote: LocalizedText;
      result: LocalizedText;
    }>;
  };
  title: LocalizedText;
  timeline: CmsSection & {
    stages: Array<{
      day: LocalizedText;
      text: LocalizedText;
      title: LocalizedText;
    }>;
  };
  trust: LocalizedText[];
  whatsapp: {
    diagnosisCta: LocalizedText;
    finalCta: LocalizedText;
    label: LocalizedText;
    message: LocalizedText;
    phone: string;
  };
};

const formulaImageFallbacks = [
  siteImages.flatlayFormula,
  siteImages.productMacro,
  siteImages.originBueaHarvest,
  siteImages.lifestyleScalpRitual,
  siteImages.lifestyleMotherChild,
  siteImages.hairTextureLifestyle,
] as const;

const defaultFormulaIngredients = formulaIngredients.map((ingredient, index) => ({
  image: formulaImageFallbacks[index % formulaImageFallbacks.length],
  imageAlt: {
    en: `${ingredient.name_en} botanical card illustration`,
    fr: `Visuel botanique ${ingredient.name_fr}`,
  },
  name: {
    en: ingredient.name_en,
    fr: ingredient.name_fr,
  },
  note: {
    en: ingredient.chosen_for_en,
    fr: ingredient.chosen_for,
  },
}));

export const defaultElixirContent: ElixirContent = {
  availability: {
    en: "Available in Cameroon with WhatsApp-assisted delivery before payment.",
    fr: "Disponible au Cameroun avec livraison assistee par WhatsApp avant paiement.",
  },
  beforeAfter: {
    eyebrow: localized("Before and after", "Avant / apres"),
    intro: {
      en: "Customer photos, care notes, and founder updates will be published transparently as the community grows.",
      fr: "Les photos, avis et nouvelles du fondateur seront publies avec transparence a mesure que la communaute grandit.",
    },
    items: [
      {
        after: {
          alt: {
            en: "Grooming and styling at a Cameroonian barbershop. Hair texture detail",
            fr: "Coiffage et soin dans un salon camerounais. Detail texture capillaire",
          },
          height: 1537,
          src: "/images/hair-texture-lifestyle.png",
          width: 1023,
        },
        before: {
          alt: {
            en: "Everyday market lifestyle scene in Buea, Cameroon. Context for Maison Fondjo",
            fr: "Scene de marche quotidien a Buea, Cameroun. Contexte de vie Maison Fondjo",
          },
          height: 1448,
          src: "/images/hero.png",
          width: 1086,
        },
        caption: {
          en: "A guided routine designed to support scalp comfort, softness, and visible shine.",
          fr: "Une routine accompagnee pour soutenir confort du cuir chevelu, douceur et brillance visible.",
        },
        isPlaceholder: true,
        label: localized("Scalp comfort and shine", "Confort cuir chevelu et brillance"),
      },
      {
        after: {
          alt: {
            en: "Evening self-care ritual with Sève oil by candlelight. Nighttime hair care routine",
            fr: "Rituel de soin du soir avec huile Seve a la bougie. Routine capillaire nocturne",
          },
          height: 1402,
          src: "/images/lifestyle-scalp-ritual.png",
          width: 1122,
        },
        before: {
          alt: {
            en: "Mount Cameroon and Buea landscape at dusk. Origin of Maison Fondjo botanical sourcing",
            fr: "Paysage du Mont Cameroun et Buea au crepuscule. Origine des botaniques Maison Fondjo",
          },
          height: 1448,
          src: "/images/hero.png",
          width: 1086,
        },
        caption: {
          en: "Argan, olive and coconut coat the hair shaft and reduce dryness on lengths and ends.",
          fr: "Argan, olive et coco gainent la fibre et reduisent la secheresse sur les longueurs et pointes.",
        },
        isPlaceholder: true,
        label: localized("Visible polish", "Finition visible"),
      },
    ],
    title: {
      en: "Results journey coming soon.",
      fr: "Parcours resultats bientot disponible.",
    },
  },
  brand: "Maison Fondjo",
  brandPositioning: {
    primary: {
      en: "A precise hair treatment oil founded and made in Buea, Cameroon.",
      fr: "Une huile de soin capillaire precise fondee et fabriquee a Buea, Cameroun.",
    },
    secondary: {
      en: "The Fondjo family name, a root-led formula, and a quieter standard of care.",
      fr: "Le nom de famille Fondjo, une formule pensee par la racine et une exigence calme du soin.",
    },
  },
  currency: "XAF",
  description: {
    en: "SÈVE is a 100ml hair treatment oil founded and made in Buea, Cameroon - created to nourish, strengthen, and restore all hair types.",
    fr: "SÈVE est une huile capillaire 100ml fondee et fabriquee a Buea, Cameroun - creee pour nourrir, renforcer et restaurer tous types de cheveux.",
  },
  faq: {
    eyebrow: localized("FAQ", "FAQ"),
    items: [
      {
        answer: {
          en: "Hair responds to consistent care over time rather than overnight. With regular use, most people begin noticing a difference in scalp comfort and hair softness within a few weeks. For visible changes in strength and fullness, we recommend committing to at least one full bottle of consistent use.",
          fr: "Les cheveux répondent à un soin régulier dans le temps, plutôt qu'à un effet immédiat. Avec une utilisation régulière, la plupart des personnes commencent à remarquer une différence de confort du cuir chevelu et de douceur des cheveux en quelques semaines. Pour des changements visibles de solidité et de densité, nous recommandons de s'engager sur au moins un flacon complet d'utilisation régulière.",
        },
        question: localized("How fast will I see results?", "Quand verrai-je des résultats ?"),
      },
      {
        answer: {
          en: "Yes. Sève Racine is applied directly to the scalp, so it works well alongside braids, wigs, and other protective styles. Apply between sections or along the scalp part as needed.",
          fr: "Oui. Sève Racine s'applique directement sur le cuir chevelu, donc elle convient bien avec les tresses, perruques et autres coiffures protectrices. Appliquez entre les sections ou le long de la raie selon les besoins.",
        },
        question: {
          en: "Can I use it with braids or wigs?",
          fr: "Puis-je l'utiliser avec des tresses ou des perruques ?",
        },
      },
      {
        answer: {
          en: "We recommend applying a moderate amount to the scalp 2 to 4 times per week, massaging gently for 3 to 5 minutes. Leave it on for several hours or overnight for extended conditioning.",
          fr: "Nous recommandons d'appliquer une quantité modérée sur le cuir chevelu 2 à 4 fois par semaine, en massant doucement pendant 3 à 5 minutes. Laissez poser plusieurs heures ou toute la nuit pour un conditionnement prolongé.",
        },
        question: localized("How often should I apply it?", "À quelle fréquence l'appliquer ?"),
      },
      {
        answer: {
          en: "Yes. The formula is designed to support scalp health and hair fibre condition across hair types and textures.",
          fr: "Oui. La formule est conçue pour soutenir la santé du cuir chevelu et l'état de la fibre capillaire, tous types et textures confondus.",
        },
        question: localized(
          "Is Sève Racine suitable for all hair types?",
          "Sève Racine convient-elle à tous les types de cheveux ?",
        ),
      },
      {
        answer: {
          en: "We accept MTN Mobile Money and Orange Money. Payment is required before delivery. Orders can also be placed through WhatsApp.",
          fr: "Nous acceptons MTN Mobile Money et Orange Money. Le paiement est requis avant la livraison. Les commandes peuvent aussi se passer via WhatsApp.",
        },
        question: localized("How do I order and pay?", "Comment commander et payer ?"),
      },
    ],
    title: {
      en: "Questions before you begin.",
      fr: "Questions avant de commencer.",
    },
  },
  finalCta: {
    button: {
      en: "Start Hair Consultation",
      fr: "Demarrer le diagnostic gratuit sur WhatsApp",
    },
    eyebrow: localized("Start today", "Commencez aujourd hui"),
    intro: {
      en: "Answer the consultation, learn how to use SÈVE safely, and choose whether you want WhatsApp follow-up.",
      fr: "Envoyez une photo, decrivez votre probleme et recevez une orientation pour votre routine 60 jours avant achat.",
    },
    title: {
      en: "Your hair-care ritual starts with a free diagnosis.",
      fr: "Votre plan racines commence par un diagnostic gratuit.",
    },
  },
  founder: {
    eyebrow: localized("Founder story", "Histoire fondatrice"),
    image: {
      alt: {
        en: "Mount Cameroon from Buea. The landscape where Maison Fondjo botanicals are sourced",
        fr: "Le Mont Cameroun depuis Buea. Paysage d origine des botaniques Maison Fondjo",
      },
      height: 1448,
      src: "/images/hero.png",
      width: 1086,
    },
    intro: {
      en: "Fondjo is the family name. Racine means root. Together they set the discipline of Maison Fondjo: begin with the scalp, respect the material, and make every bottle with the restraint expected of something carrying a name.",
      fr: "Fondjo est le nom de famille. Racine signifie racine. Ensemble, ils donnent la discipline de Maison Fondjo : commencer par le cuir chevelu, respecter la matiere et fabriquer chaque flacon avec la retenue qu'exige un nom.",
    },
    name: "La famille Fondjo",
    signature: {
      en: "Buea is not decoration in this story. It is the place where the product is made, tested, handled, and held to a standard.",
      fr: "Buea n'est pas un decor dans cette histoire. C'est le lieu ou le produit est fabrique, teste, manipule et tenu a une exigence.",
    },
    title: {
      en: "A family name, carried carefully.",
      fr: "Un nom de famille, porte avec soin.",
    },
  },
  guarantee: {
    badges: [
      localized("Patch test recommended", "Test cutane recommande"),
      localized("For external use only", "Usage externe uniquement"),
      localized("WhatsApp support", "Support WhatsApp"),
    ],
    eyebrow: localized("Trust and safety", "Confiance et securite"),
    intro: {
      en: "Use SÈVE as a cosmetic hair-care oil. Avoid contact with eyes, keep out of reach of children, and discontinue use if irritation occurs.",
      fr: "Suivez la routine conseillee pendant 60 jours. Si le confort, la brillance ou la casse ne s ameliorent pas, notre equipe analyse votre progression et ajuste votre plan.",
    },
    terms: {
      en: "This product does not diagnose, treat, cure, prevent disease, or replace medical advice. Seek professional support for pain, sores, burning, sudden patchy hair loss, or persistent irritation.",
      fr: "La garantie demande preuve d achat, regularite et photos de suivi au Jour 0 et Jour 60.",
    },
    title: {
      en: "Safe use. Clear terms. Direct support.",
      fr: "Une promesse de resultats avec methode, pas du bruit.",
    },
  },
  hero: {
    eyebrow: {
      en: "Maison Fondjo Sève Racine",
      fr: "Soin capillaire botanique africain premium",
    },
    primaryCta: {
      en: "Start Hair Consultation",
      fr: "Demarrer le diagnostic gratuit sur WhatsApp",
    },
    secondaryCta: {
      en: "Start Free Hair Diagnosis",
      fr: "Voir la routine 60 jours",
    },
    title: {
      en: "FROM THE SOIL TO THE BOTTLE",
      fr: "L huile capillaire camerounaise avec garantie resultats 60 jours",
    },
  },
  highlights: [
    {
      label: localized("Product", "Produit"),
      value: localized("SÈVE hair treatment oil", "Huile capillaire SÈVE"),
    },
    {
      label: localized("Bottle", "Flacon"),
      value: localized("100ml / 3.38 fl oz", "100ml / 3,38 fl oz"),
    },
    {
      label: localized("Availability", "Disponibilite"),
      value: localized("National delivery available", "Livraison nationale disponible"),
    },
    {
      label: localized("Delivery", "Livraison"),
      value: localized("Cameroon zones", "Zones Cameroun"),
    },
  ],
  howToUse: {
    eyebrow: localized("How to use", "Mode d emploi"),
    intro: {
      en: "Designed for scalp, hairline, beard, protective styles, natural hair, relaxed hair, braids, and locs.",
      fr: "Pense pour coiffures protectrices, cheveux naturels, defrises et soins hebdomadaires.",
    },
    steps: [
      {
        step: localized("01", "01"),
        text: {
          en: "Apply a few drops directly to the scalp or target area.",
          fr: "Appliquez directement sur les raies et zones clairsemees 3 a 4 fois par semaine.",
        },
        title: localized("Apply lightly", "Appliquer legerement"),
      },
      {
        step: localized("02", "02"),
        text: {
          en: "Massage gently for 3-5 minutes.",
          fr: "Massez 2 minutes pour repartir l huile et stimuler le rituel cuir chevelu.",
        },
        title: localized("Massage gently", "Masser doucement"),
      },
      {
        step: localized("03", "03"),
        text: {
          en: "Use 2-3 times per week or as needed. Do not overapply.",
          fr: "Lissez une petite quantite sur les pointes pour reduire secheresse et casse visible.",
        },
        title: localized("Repeat with restraint", "Repeter avec mesure"),
      },
      {
        step: localized("04", "04"),
        text: {
          en: "For night routine, apply before bed. For beard or hairline, use only a small amount.",
          fr: "Pour la routine de nuit, appliquez avant le coucher. Pour barbe ou contours, utilisez tres peu.",
        },
        title: localized("Adapt the ritual", "Adapter le rituel"),
      },
    ],
    title: {
      en: "A few drops. A quiet massage. A disciplined ritual.",
      fr: "Trois minutes. Trois a quatre fois par semaine.",
    },
  },
  id: "fondjo-racine-seve",
  images: [
    {
      alt: {
        en: "Sève Racine bottle in a reflective black studio",
        fr: "Flacon Sève Racine en studio noir réfléchissant",
      },
      height: 1448,
      src: "/images/studio.png",
      width: 1086,
    },
    {
      alt: {
        en: "Sève Racine bottle and pipette macro detail",
        fr: "Macro du flacon Sève Racine et pipette",
      },
      height: 1448,
      src: "/images/product-macro-pipette.png",
      width: 1086,
    },
    {
      alt: {
        en: "Sève Racine bottle front label",
        fr: "Etiquette avant du flacon Sève Racine",
      },
      height: 1448,
      src: "/images/front-label.png",
      width: 1086,
    },
    {
      alt: {
        en: "Sève Racine bottle back label. Ingredients and directions",
        fr: "Etiquette arriere du flacon Sève Racine. Ingredients et mode d emploi",
      },
      height: 1536,
      src: "/images/bottle-back-label-v2.png",
      width: 1024,
    },
  ],
  ingredientScience: {
    eyebrow: localized("Ingredients", "Ingredients"),
    ingredients: defaultFormulaIngredients,
    intro: {
      en: "A rich blend of botanical oils and herbs, each selected for a specific role in scalp and hair-fibre care.",
      fr: "Un melange botanique concu autour de la vraie vie des cheveux africains : coiffes, proteges, laves et repares.",
    },
    title: {
      en: "A botanical blend for scalp, strands, beard, and protective styles.",
      fr: "Un mélange botanique. Un rituel capillaire discipliné.",
    },
  },
  innerCircle: {
    benefits: [
      localized("Priority product guidance", "Conseil produit prioritaire"),
      localized("WhatsApp follow-up if requested", "Suivi WhatsApp si souhaite"),
      {
        en: "Founder updates and customer results journey",
        fr: "Acces prioritaire aux lancements et packs",
      },
    ],
    cta: localized("DM OIL on WhatsApp", "Envoyer OIL sur WhatsApp"),
    eyebrow: localized("Product and delivery support", "Conseil produit et livraison"),
    intro: {
      en: `Contact the team for guidance, order support, and delivery from Buea. ${config.delivery.text.en}`,
      fr: `Contactez l'equipe pour conseils, assistance commande et livraison depuis Buea. ${config.delivery.text.fr}`,
    },
    priceXaf: `${formatXaf(config.pricing.seveRacine)} local equivalent`,
    title: {
      en: "Botanical ritual - contact available.",
      fr: "Restez reguliere pour moins chaque mois.",
    },
  },
  inventory: {
    lowStockThreshold: 10,
    stockCount: 30,
  },
  launchAnnouncement: {
    badge: {
      en: "Botanical ritual - contact available",
      fr: "Conseil disponible",
    },
    cta: {
      en: "Contact the team",
      fr: "Contacter l equipe",
    },
    enabled: true,
    eyebrow: {
      en: "National delivery available",
      fr: "Diagnostics et commandes ouverts",
    },
    intro: {
      en: "SÈVE is available with WhatsApp-assisted product guidance and Cameroon delivery support.",
      fr: "SÈVE est disponible avec conseil WhatsApp et livraison au Cameroun.",
    },
    title: {
      en: "Sève Racine is available with direct Maison Fondjo support.",
      fr: "Sève Racine est disponible avec un accompagnement direct Maison Fondjo.",
    },
  },
  manualPayments: {
    heading: {
      en: "Manual mobile money checkout",
      fr: "Paiement mobile money manuel",
    },
    intro: {
      en: "Prefer local payment? Send the exact amount, then WhatsApp your payment screenshot and delivery details for confirmation.",
      fr: "Vous preferez payer localement ? Envoyez le montant exact, puis partagez la capture et l'adresse de livraison sur WhatsApp.",
    },
    methods: [
      {
        accountName: "Maison Fondjo",
        instructions: {
          en: "Use merchant transfer, then include your full name and city in the WhatsApp message.",
          fr: "Utilisez le transfert marchand, puis envoyez votre nom complet et votre ville sur WhatsApp.",
        },
        label: "MTN MoMo",
        number: "",
      },
      {
        accountName: "Maison Fondjo",
        instructions: {
          en: "Use Orange Money transfer and keep the confirmation message until your order is confirmed.",
          fr: "Utilisez le transfert Orange Money et gardez le message de confirmation jusqu'a validation.",
        },
        label: "Orange Money",
        number: "",
      },
    ],
  },
  priceCents: config.pricing.seveRacine,
  priceXaf: formatXaf(config.pricing.seveRacine),
  problem: {
    concerns: [
      {
        label: localized("Breakage", "Casse"),
        text: {
          en: "Ends snap before length is retained.",
          fr: "Les pointes cassent avant de garder la longueur.",
        },
      },
      {
        label: localized("Slow growth", "Pousse lente"),
        text: {
          en: "Your routine lacks consistency and scalp focus.",
          fr: "La routine manque de regularite et d attention racines.",
        },
      },
      {
        label: localized("Dryness", "Secheresse"),
        text: {
          en: "Hair feels rough after wash day and protective styling.",
          fr: "Les cheveux restent secs apres soins et coiffures protectrices.",
        },
      },
      {
        label: localized("Thinning", "Zones clairsemees"),
        text: {
          en: "Edges and scalp areas need a more disciplined ritual.",
          fr: "Les tempes et zones du cuir chevelu demandent une routine plus disciplinee.",
        },
      },
    ],
    eyebrow: localized("The hair problem", "Le probleme capillaire"),
    intro: {
      en: "SÈVE supports a calmer-looking, better-conditioned routine without promising medical outcomes or hair regrowth.",
      fr: "La plupart des routines traitent la longueur et oublient la racine. Maison Fondjo commence la ou poussent confort, retention et longueur.",
    },
    title: {
      en: "Nourish, strengthen, restore - from root to tip, with restraint.",
      fr: "Casse, pousse lente, secheresse et tempes clairsemees demandent un plan racines d abord.",
    },
  },
  product: {
    description: {
      en: "A nutrient-rich botanical hair treatment oil crafted to nourish the scalp, strengthen hair from root to tip, and restore natural shine and vitality.",
      fr: "Une huile botanique 100ml racines-a-longueurs pour 60 jours de massage, scellage et finition visible.",
    },
    eyebrow: localized("The product", "Le produit"),
    name: localized("Sève Racine", "Sève Racine"),
    priceXaf: formatXaf(config.pricing.seveRacine),
    size: localized("100ml / 3.38 fl oz", "100ml / 3,38 fl oz"),
    title: localized("SÈVE hair treatment oil, 100ml.", "Huile capillaire SÈVE, 100ml."),
  },
  seo: {
    description: {
      en: "Sève Racine is a 100ml hair treatment oil by Maison Fondjo, founded and made in Buea, Cameroon.",
      fr: "Sève Racine est une huile capillaire 100ml par Maison Fondjo, fondee et fabriquee a Buea, Cameroun.",
    },
    title: {
      en: "Sève Racine Hair Treatment Oil | Maison Fondjo",
      fr: "Huile capillaire Sève Racine | Maison Fondjo",
    },
  },
  shipping: {
    en: config.delivery.text.en,
    fr: config.delivery.text.fr,
  },
  slug: "seve-hair-treatment-oil",
  socialLinks: {
    instagram: "https://www.instagram.com/maison.fondjo",
    tiktok: "https://www.tiktok.com/@maison.fondjo",
  },
  testimonials: {
    eyebrow: {
      en: "Customer notes",
      fr: "Avis clientes",
    },
    items: [
      {
        approved: true,
        location: {
          en: "Cameroon",
          fr: "Cameroun",
        },
        name: "Mireille",
        quote: {
          en: "The routine feels premium and simple. My scalp stays comfortable longer between wash days.",
          fr: "La routine est premium et simple. Mon cuir chevelu reste confortable plus longtemps entre les soins.",
        },
        result: {
          en: "Less dryness after protective styling",
          fr: "Moins de secheresse apres coiffure protectrice",
        },
      },
      {
        approved: true,
        location: {
          en: "Cameroon",
          fr: "Cameroun",
        },
        name: "Clarisse",
        quote: {
          en: "I like that the WhatsApp diagnosis made the oil feel guided, not random.",
          fr: "J aime que le diagnostic WhatsApp rende l huile accompagnee, pas aleatoire.",
        },
        result: {
          en: "More consistent application routine",
          fr: "Rituel cuir chevelu plus regulier",
        },
      },
      {
        approved: true,
        location: {
          en: "Buea, Cameroon",
          fr: "Buea, Cameroun",
        },
        name: "Ange",
        quote: {
          en: "The finish is polished without feeling heavy on my ends.",
          fr: "Le fini est soigne sans alourdir mes pointes.",
        },
        result: {
          en: "Softer ends and visible shine",
          fr: "Pointes plus douces et brillance visible",
        },
      },
    ],
    title: {
      en: "Guided routines create calmer, more confident customers.",
      fr: "Les routines accompagnees creent des clientes plus confiantes.",
    },
  },
  timeline: {
    eyebrow: localized("Customer journey", "Parcours cliente"),
    stages: [
      {
        day: localized("Day 0", "Jour 0"),
        text: {
          en: "Free WhatsApp diagnosis, baseline photos, routine setup.",
          fr: "Diagnostic WhatsApp gratuit, photos de depart, routine.",
        },
        title: localized("Start with proof", "Commencer avec preuves"),
      },
      {
        day: localized("Day 14", "Jour 14"),
        text: {
          en: "Scalp comfort and dryness check-in.",
          fr: "Suivi confort cuir chevelu et secheresse.",
        },
        title: localized("Comfort check", "Point confort"),
      },
      {
        day: localized("Day 30", "Jour 30"),
        text: {
          en: "Breakage, shine, and consistency review.",
          fr: "Evaluation casse, brillance et regularite.",
        },
        title: localized("Retention review", "Point retention"),
      },
      {
        day: localized("Day 60", "Jour 60"),
        text: {
          en: "Guarantee checkpoint with progress photos.",
          fr: "Point garantie avec photos de progression.",
        },
        title: localized("Results checkpoint", "Point resultats"),
      },
      {
        day: localized("Day 90", "Jour 90"),
        text: {
          en: "Transition into maintenance or a founder-led follow-up routine.",
          fr: "Passage en maintien ou suivi fondateur.",
        },
        title: localized("Maintain momentum", "Maintenir l elan"),
      },
    ],
    title: {
      en: "A 90-day path from diagnosis to retention.",
      fr: "Un parcours 90 jours du diagnostic a la retention.",
    },
  },
  title: {
    en: "SÈVE",
    fr: "SÈVE",
  },
  trust: [
    localized("National delivery available", "Livraison nationale disponible"),
    localized("Free WhatsApp hair diagnosis", "Diagnostic WhatsApp gratuit"),
    localized("MTN MoMo and Orange Money", "MTN MoMo et Orange Money"),
    localized("Cameroonian botanical ritual", "Rituel botanique camerounais"),
  ],
  whatsapp: {
    diagnosisCta: {
      en: "Start Free Hair Diagnosis on WhatsApp",
      fr: "Demarrer le diagnostic gratuit sur WhatsApp",
    },
    finalCta: {
      en: "Start my Maison Fondjo routine",
      fr: "Commencer mon plan Maison Fondjo 60 jours",
    },
    label: {
      en: "WhatsApp diagnosis",
      fr: "Diagnostic WhatsApp",
    },
    message: localized(
      "Hello Maison Fondjo, I want a free hair diagnosis for breakage, slow growth, dryness, or thinning. Please help me start the Sève Racine routine.",
      "Bonjour Maison Fondjo, je veux un diagnostic gratuit pour casse, pousse lente, secheresse ou zones clairsemees. Aidez-moi a commencer le plan Sève Racine.",
    ),
    phone: "+237682109136",
  },
};

export function t(text: LocalizedText, locale: Locale) {
  return locale.charCodeAt(0) === 102 ? text.fr : text.en;
}

export function getPrimaryElixirImage(content: ElixirContent) {
  const image = content.images.at(0);

  if (!image) {
    throw new Error("Maison Fondjo storefront content requires at least one product image.");
  }

  return image;
}
