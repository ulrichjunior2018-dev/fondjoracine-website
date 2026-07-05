import { formulaIngredients } from "@/content/formula";
import { config, formatXaf } from "@/lib/config";
import { siteImages } from "@/lib/site-images";

export type Locale = "en" | "fr";

export type LocalizedText = Record<Locale, string>;

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
  siteImages.ingredientCastorOil,
  siteImages.ingredientAvocadoOil,
  siteImages.ingredientCoconutOil,
  siteImages.ingredientOliveOil,
  siteImages.ingredientJojobaOil,
  siteImages.hairTextureLifestyle,
] as const;

const defaultFormulaIngredients = formulaIngredients.map((ingredient, index) => ({
  image: formulaImageFallbacks[index % formulaImageFallbacks.length],
  imageAlt: {
    en: `${ingredient.name_fr} botanical ingredient visual`,
    fr: `Visuel botanique ${ingredient.name_fr}`,
  },
  name: {
    en: ingredient.name_fr,
    fr: ingredient.name_fr,
  },
  note: {
    en: ingredient.chosen_for,
    fr: ingredient.chosen_for,
  },
}));

export const defaultElixirContent: ElixirContent = {
  availability: {
    en: "Available in Cameroon with WhatsApp-assisted delivery before payment.",
    fr: "Disponible au Cameroun avec livraison assistee par WhatsApp avant paiement.",
  },
  beforeAfter: {
    eyebrow: { en: "Before and after", fr: "Avant / apres" },
    intro: {
      en: "Customer photos, care notes, and founder updates will be published transparently as the community grows.",
      fr: "Les photos, avis et nouvelles du fondateur seront publies avec transparence a mesure que la communaute grandit.",
    },
    items: [
      {
        after: {
          alt: {
            en: "Grooming and styling at a Cameroonian barbershop — hair texture detail",
            fr: "Coiffage et soin dans un salon camerounais — detail texture capillaire",
          },
          height: 1300,
          src: "/images/hair-texture-lifestyle.png",
          width: 1800,
        },
        before: {
          alt: {
            en: "Everyday market lifestyle scene in Buea, Cameroon — context for Maison Fondjo",
            fr: "Scene de marche quotidien a Buea, Cameroun — contexte de vie Maison Fondjo",
          },
          height: 1300,
          src: "/images/hero-origin.png",
          width: 1800,
        },
        caption: {
          en: "A guided routine designed to support scalp comfort, softness, and visible shine.",
          fr: "Une routine accompagnee pour soutenir confort du cuir chevelu, douceur et brillance visible.",
        },
        isPlaceholder: true,
        label: { en: "Scalp comfort and shine", fr: "Confort cuir chevelu et brillance" },
      },
      {
        after: {
          alt: {
            en: "Evening self-care ritual with Sève oil by candlelight — nighttime hair care routine",
            fr: "Rituel de soin du soir avec huile Seve a la bougie — routine capillaire nocturne",
          },
          height: 1300,
          src: "/images/night-routine.png",
          width: 1800,
        },
        before: {
          alt: {
            en: "Mount Cameroon and Buea landscape at dusk — origin of Maison Fondjo botanical sourcing",
            fr: "Paysage du Mont Cameroun et Buea au crepuscule — origine des botaniques Maison Fondjo",
          },
          height: 1300,
          src: "/images/hero-origin.png",
          width: 1800,
        },
        caption: {
          en: "Botanical care that helps hair look polished without a heavy finish.",
          fr: "Un soin botanique pour une finition soignee sans effet lourd.",
        },
        isPlaceholder: true,
        label: { en: "Visible polish", fr: "Finition visible" },
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
    eyebrow: { en: "FAQ", fr: "FAQ" },
    items: [
      {
        answer: {
          en: "Use it consistently for 60 days. Results vary by hair history, routine, nutrition, and protective styling habits.",
          fr: "Utilisez-le regulierement pendant 60 jours. Les resultats varient selon l historique, la routine, l alimentation et les coiffures protectrices.",
        },
        question: { en: "How fast will I see results?", fr: "Quand verrai-je des resultats ?" },
      },
      {
        answer: {
          en: "Yes. Apply lightly to the scalp and edges, then use a small amount on lengths when needed.",
          fr: "Oui. Appliquez legerement sur le cuir chevelu et les tempes, puis une petite quantite sur les longueurs si besoin.",
        },
        question: {
          en: "Can I use it with braids or wigs?",
          fr: "Puis-je l utiliser avec tresses ou perruques ?",
        },
      },
      {
        answer: {
          en: "Start with 3-4 times per week. For very dry scalp, use a lighter daily amount and avoid over-applying.",
          fr: "Commencez 3 a 4 fois par semaine. Pour cuir chevelu tres sec, utilisez une petite quantite chaque jour sans surcharger.",
        },
        question: { en: "How often should I apply it?", fr: "A quelle frequence l appliquer ?" },
      },
    ],
    title: {
      en: "Everything customers ask before their first bottle.",
      fr: "Ce que les clientes demandent avant leur premier flacon.",
    },
  },
  finalCta: {
    button: {
      en: "Start Hair Consultation",
      fr: "Demarrer le diagnostic gratuit sur WhatsApp",
    },
    eyebrow: { en: "Start today", fr: "Commencez aujourd hui" },
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
    eyebrow: { en: "Founder story", fr: "Histoire fondatrice" },
    image: {
      alt: {
        en: "Mount Cameroon from Buea — the landscape where Maison Fondjo botanicals are sourced",
        fr: "Le Mont Cameroun depuis Buea — paysage d origine des botaniques Maison Fondjo",
      },
      height: 1300,
      src: "/images/hero-origin.png",
      width: 1800,
    },
    intro: {
      en: "Fondjo is the family name. Racine means root. Together they set the discipline of Maison Fondjo: begin with the scalp, respect the material, and make every bottle with the restraint expected of something carrying a name.",
      fr: "Fondjo est le nom de famille. Racine signifie racine. Ensemble, ils donnent la discipline de Maison Fondjo : commencer par le cuir chevelu, respecter la matiere et fabriquer chaque flacon avec la retenue qu'exige un nom.",
    },
    name: "Fondjo Ulrich — Fondateur / Fondjo Clarisse — Co-fondatrice",
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
      { en: "Patch test recommended", fr: "Test cutane recommande" },
      { en: "For external use only", fr: "Usage externe uniquement" },
      { en: "WhatsApp support", fr: "Support WhatsApp" },
    ],
    eyebrow: { en: "Trust and safety", fr: "Confiance et securite" },
    intro: {
      en: "Use SÈVE as a cosmetic hair-care oil. Avoid contact with eyes, keep out of reach of children, and discontinue use if irritation occurs.",
      fr: "Suivez la routine conseillee pendant 60 jours. Si le confort, la brillance ou la casse ne s ameliorent pas, notre equipe analyse votre progression et ajuste votre plan.",
    },
    terms: {
      en: "This product does not diagnose, treat, cure, prevent disease, or replace medical advice. Seek professional support for pain, sores, burning, sudden patchy hair loss, or persistent irritation.",
      fr: "La garantie demande preuve d achat, regularite et photos de suivi au Jour 0 et Jour 60.",
    },
    title: {
      en: "Beautiful care should also be careful.",
      fr: "Une promesse de resultats avec methode, pas du bruit.",
    },
  },
  hero: {
    eyebrow: {
      en: "Maison Fondjo · Sève Racine",
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
      label: { en: "Product", fr: "Produit" },
      value: { en: "SÈVE hair treatment oil", fr: "Huile capillaire SÈVE" },
    },
    {
      label: { en: "Bottle", fr: "Flacon" },
      value: { en: "100ml / 3.38 fl oz", fr: "100ml / 3,38 fl oz" },
    },
    {
      label: { en: "Availability", fr: "Disponibilite" },
      value: { en: "National delivery available", fr: "Livraison nationale disponible" },
    },
    {
      label: { en: "Delivery", fr: "Livraison" },
      value: { en: "Cameroon zones", fr: "Zones Cameroun" },
    },
  ],
  howToUse: {
    eyebrow: { en: "How to use", fr: "Mode d emploi" },
    intro: {
      en: "Designed for scalp, hairline, beard, protective styles, natural hair, relaxed hair, braids, and locs.",
      fr: "Pense pour coiffures protectrices, cheveux naturels, defrises et soins hebdomadaires.",
    },
    steps: [
      {
        step: { en: "01", fr: "01" },
        text: {
          en: "Apply a few drops directly to the scalp or target area.",
          fr: "Appliquez directement sur les raies et zones clairsemees 3 a 4 fois par semaine.",
        },
        title: { en: "Apply lightly", fr: "Appliquer legerement" },
      },
      {
        step: { en: "02", fr: "02" },
        text: {
          en: "Massage gently for 3-5 minutes.",
          fr: "Massez 2 minutes pour repartir l huile et stimuler le rituel cuir chevelu.",
        },
        title: { en: "Massage gently", fr: "Masser doucement" },
      },
      {
        step: { en: "03", fr: "03" },
        text: {
          en: "Use 2-3 times per week or as needed. Do not overapply.",
          fr: "Lissez une petite quantite sur les pointes pour reduire secheresse et casse visible.",
        },
        title: { en: "Repeat with restraint", fr: "Repeter avec mesure" },
      },
      {
        step: { en: "04", fr: "04" },
        text: {
          en: "For night routine, apply before bed. For beard or hairline, use only a small amount.",
          fr: "Pour la routine de nuit, appliquez avant le coucher. Pour barbe ou contours, utilisez tres peu.",
        },
        title: { en: "Adapt the ritual", fr: "Adapter le rituel" },
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
        en: "Sève Racine bottle front label",
        fr: "Etiquette avant du flacon Sève Racine",
      },
      height: 1600,
      src: "/images/front-label.png",
      width: 1200,
    },
    {
      alt: {
        en: "Sève Racine bottle back label — ingredients and directions",
        fr: "Etiquette arriere du flacon Sève Racine — ingredients et mode d emploi",
      },
      height: 1600,
      src: "/images/back-label.png",
      width: 1200,
    },
  ],
  ingredientScience: {
    eyebrow: { en: "Ingredients", fr: "Ingredients" },
    ingredients: defaultFormulaIngredients,
    intro: {
      en: "A botanical blend presented as cosmetic hair-care support, never as a medical treatment.",
      fr: "Un melange botanique concu autour de la vraie vie des cheveux africains : coiffes, proteges, laves et repares.",
    },
    title: {
      en: "Eleven botanicals for scalp, strands, beard, and protective styles.",
      fr: "Onze botaniques. Un rituel capillaire discipline.",
    },
  },
  innerCircle: {
    benefits: [
      { en: "Priority product guidance", fr: "Conseil produit prioritaire" },
      { en: "WhatsApp follow-up if requested", fr: "Suivi WhatsApp si souhaite" },
      {
        en: "Founder updates and customer results journey",
        fr: "Acces prioritaire aux lancements et packs",
      },
    ],
    cta: { en: "DM OIL on WhatsApp", fr: "Envoyer OIL sur WhatsApp" },
    eyebrow: { en: "Product and delivery support", fr: "Conseil produit et livraison" },
    intro: {
      en: `Contact the team for guidance, Cameroon delivery zones (${formatXaf(
        config.delivery.min,
      )}–${formatXaf(config.delivery.max)}), and order support.`,
      fr: `Contactez l'equipe pour conseils, zones de livraison au Cameroun (${formatXaf(
        config.delivery.min,
      )}–${formatXaf(config.delivery.max)}) et assistance commande.`,
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
        label: { en: "Breakage", fr: "Casse" },
        text: {
          en: "Ends snap before length is retained.",
          fr: "Les pointes cassent avant de garder la longueur.",
        },
      },
      {
        label: { en: "Slow growth", fr: "Pousse lente" },
        text: {
          en: "Your routine lacks consistency and scalp focus.",
          fr: "La routine manque de regularite et d attention racines.",
        },
      },
      {
        label: { en: "Dryness", fr: "Secheresse" },
        text: {
          en: "Hair feels rough after wash day and protective styling.",
          fr: "Les cheveux restent secs apres soins et coiffures protectrices.",
        },
      },
      {
        label: { en: "Thinning", fr: "Zones clairsemees" },
        text: {
          en: "Edges and scalp areas need a more disciplined ritual.",
          fr: "Les tempes et zones du cuir chevelu demandent une routine plus disciplinee.",
        },
      },
    ],
    eyebrow: { en: "The hair problem", fr: "Le probleme capillaire" },
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
    eyebrow: { en: "The product", fr: "Le produit" },
    name: { en: "Sève Racine", fr: "Sève Racine" },
    priceXaf: formatXaf(config.pricing.seveRacine),
    size: { en: "100ml / 3.38 fl oz", fr: "100ml / 3,38 fl oz" },
    title: { en: "SÈVE hair treatment oil, 100ml.", fr: "Huile capillaire SÈVE, 100ml." },
  },
  seo: {
    description: {
      en: "Sève Racine is a 100ml hair treatment oil by Maison Fondjo, founded and made in Buea, Cameroon.",
      fr: "Sève Racine est une huile capillaire 100ml par Maison Fondjo, fondee et fabriquee a Buea, Cameroun.",
    },
    title: {
      en: "Sève Racine Hair Treatment Oil | Maison Fondjo",
      fr: "Huile capillaire camerounaise garantie 60 jours",
    },
  },
  shipping: {
    en: `Cameroon delivery is coordinated on WhatsApp. Zones: ${formatXaf(
      config.delivery.min,
    )}–${formatXaf(config.delivery.max)}.`,
    fr: `Livraison au Cameroun coordonnee sur WhatsApp. Zones : ${formatXaf(
      config.delivery.min,
    )}–${formatXaf(config.delivery.max)}.`,
  },
  slug: "seve-hair-treatment-oil",
  socialLinks: {
    instagram: "https://www.instagram.com/fondjoracine",
    tiktok: "https://www.tiktok.com/@fondjoracine",
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
          en: "Douala, Cameroon",
          fr: "Douala, Cameroun",
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
          en: "Yaounde, Cameroon",
          fr: "Yaounde, Cameroun",
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
    eyebrow: { en: "Customer journey", fr: "Parcours cliente" },
    stages: [
      {
        day: { en: "Day 0", fr: "Jour 0" },
        text: {
          en: "Free WhatsApp diagnosis, baseline photos, routine setup.",
          fr: "Diagnostic WhatsApp gratuit, photos de depart, routine.",
        },
        title: { en: "Start with proof", fr: "Commencer avec preuves" },
      },
      {
        day: { en: "Day 14", fr: "Jour 14" },
        text: {
          en: "Scalp comfort and dryness check-in.",
          fr: "Suivi confort cuir chevelu et secheresse.",
        },
        title: { en: "Comfort check", fr: "Point confort" },
      },
      {
        day: { en: "Day 30", fr: "Jour 30" },
        text: {
          en: "Breakage, shine, and consistency review.",
          fr: "Evaluation casse, brillance et regularite.",
        },
        title: { en: "Retention review", fr: "Point retention" },
      },
      {
        day: { en: "Day 60", fr: "Jour 60" },
        text: {
          en: "Guarantee checkpoint with progress photos.",
          fr: "Point garantie avec photos de progression.",
        },
        title: { en: "Results checkpoint", fr: "Point resultats" },
      },
      {
        day: { en: "Day 90", fr: "Jour 90" },
        text: {
          en: "Transition into maintenance or a founder-led follow-up routine.",
          fr: "Passage en maintien ou suivi fondateur.",
        },
        title: { en: "Maintain momentum", fr: "Maintenir l elan" },
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
    { en: "National delivery available", fr: "Livraison nationale disponible" },
    { en: "Free WhatsApp hair diagnosis", fr: "Diagnostic WhatsApp gratuit" },
    { en: "MTN MoMo and Orange Money", fr: "MTN MoMo et Orange Money" },
    { en: "Cameroonian botanical ritual", fr: "Rituel botanique camerounais" },
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
    message: {
      en: "Hello Maison Fondjo, I want a free hair diagnosis for breakage, slow growth, dryness, or thinning. Please help me start the Sève Racine routine.",
      fr: "Bonjour Maison Fondjo, je veux un diagnostic gratuit pour casse, pousse lente, secheresse ou zones clairsemees. Aidez-moi a commencer le plan Sève Racine.",
    },
    phone: "+19295046726",
  },
};

export function t(text: LocalizedText, locale: Locale) {
  switch (locale) {
    case "en":
    case "fr":
      return text.fr;
  }
}

export function getPrimaryElixirImage(content: ElixirContent) {
  const image = content.images.at(0);

  if (!image) {
    throw new Error("Maison Fondjo storefront content requires at least one product image.");
  }

  return image;
}
