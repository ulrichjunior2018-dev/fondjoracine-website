import { config, formatXaf } from "@/lib/config";
import { en as storefrontEn } from "@/i18n/dictionaries/en";
import { fr as storefrontFr } from "@/i18n/dictionaries/fr";
import { buildMarketingNav } from "@/lib/marketing-nav";

import { advisorCopy as advisorFr } from "./advisor-copy";

const consultationPrice = formatXaf(config.pricing.consultation);
const surMesurePrice = formatXaf(config.pricing.surMesure);

const publicFr = {
  errors: {
    genericMessage: "Un incident est survenu. Rechargez la page ou revenez par WhatsApp.",
    genericTitle: "La page n'a pas pu se charger",
    notFoundBody: "Cette page Maison Fondjo n'est pas disponible.",
    notFoundTitle: "Page introuvable",
  },
  metadata: {
    contact: {
      description:
        "Contact Maison Fondjo pour Sève Racine, la livraison au Cameroun, le suivi diagnostic et les questions de sécurité produit.",
      title: "Contact | Maison Fondjo",
    },
    faq: {
      description:
        "Réponses sur Sève Racine, la livraison au Cameroun, la sécurité produit et l'assistance WhatsApp.",
      title: "FAQ | Maison Fondjo",
    },
    howToUse: {
      description:
        "Mode d'emploi de Sève Racine : quelques gouttes, racine, longueurs, barbe et geste mesuré.",
      title: "Mode d'emploi | Maison Fondjo",
    },
    origin: {
      description:
        "L'origine Maison Fondjo : Buea, le Mont Cameroun, le nom Fondjo et le sens de Racine.",
      title: "Origine | Maison Fondjo",
    },
    orderConfirmation: {
      description:
        "Confirmation de commande Maison Fondjo : paiement, référence Mobile Money et livraison au Cameroun.",
      title: "Confirmation | Maison Fondjo",
    },
    privacy: {
      description:
        "Comment Maison Fondjo protège les informations de commande, paiement, livraison et diagnostic.",
      title: "Confidentialité | Maison Fondjo",
    },
    returns: {
      description:
        "Conditions de retour Maison Fondjo : produit personnel, dommage vérifié à la livraison, échange étudié.",
      title: "Retours | Maison Fondjo",
    },
    shipping: {
      description:
        "Livraison Sève Racine au Cameroun : zones, frais confirmés avant paiement et coordination WhatsApp.",
      title: "Livraison | Maison Fondjo",
    },
    terms: {
      description:
        "Conditions Maison Fondjo pour utiliser le site, commander Sève Racine et vérifier le paiement.",
      title: "Conditions | Maison Fondjo",
    },
  },
  orderConfirmation: {
    actions: {
      backHome: "Mes commandes",
      newOrder: "Commander à nouveau",
    },
    customer: "Client",
    delivery: "Livraison",
    missing: {
      body: "Revenez au parcours de commande Sève Racine ou contactez l'assistance WhatsApp pour retrouver votre confirmation.",
      title: "Lien de confirmation absent",
    },
    paymentReference: "Référence",
    status: {
      cancelled: "Cette commande a été annulée.",
      confirmed: "Le paiement est confirmé. La commande passe ensuite en préparation.",
      delivered: "La commande est marquée comme livrée.",
      fallback:
        "Votre commande Maison Fondjo est reçue. Les paiements Mobile Money sont vérifiés avant confirmation.",
      packed: "La commande est préparée et attend la livraison.",
      payment_submitted: "Le paiement est en cours de confirmation automatique.",
      pending_payment:
        "La commande est créée. Envoyez le paiement, puis ajoutez votre référence de transaction.",
      refunded: "Cette commande a été remboursée.",
      shipped: "La commande est en livraison.",
    },
    title: "Confirmation de commande",
    total: "Total",
  },
  contactPage: {
    cards: {
      email: {
        label: "Email",
        title: "Presse et administration",
      },
      safety: {
        label: "Sécurité",
        text: "Usage externe. Test cutané recommandé.",
        title: "Questions sécurité produit",
      },
      whatsapp: {
        label: "WhatsApp",
        title: "Livraison et conseil produit",
      },
    },
    heading: "Conseil produit, livraison au Cameroun, presse et sécurité.",
    intro:
      "Maison Fondjo travaille depuis Buea. WhatsApp reste le chemin le plus direct pour confirmer une zone de livraison, poser une question sur Sève Racine ou demander un suivi après diagnostic.",
    kicker: "Contact",
  },
  policies: {
    backHome: "Retour à l'accueil",
    kicker: "Politique",
    privacy: {
      title: "Politique de confidentialité",
      sections: [
        {
          heading: "Ce que nous collectons",
          paragraphs: [
            "Lorsque vous passez commande ou réalisez notre diagnostic capillaire, nous pouvons collecter : votre nom, numéro de téléphone, adresse de livraison, les préoccupations capillaires que vous partagez, ainsi que les détails de commande et de paiement.",
          ],
        },
        {
          heading: "Comment nous l'utilisons",
          bullets: [
            "Pour traiter et livrer votre commande",
            "Pour recommander le produit ou la consultation adaptés à vos besoins",
            "Pour assurer le suivi de votre commande et prendre des nouvelles de vos résultats",
            "Pour améliorer nos produits et notre service dans le temps",
          ],
        },
        {
          heading: "Comment nous le protégeons",
          paragraphs: [
            "Vos informations sont stockées de manière sécurisée et ne sont pas vendues à des tiers. L'accès est limité aux membres de l'équipe Maison Fondjo qui en ont besoin pour honorer votre commande.",
          ],
        },
        {
          heading: "Vos droits",
          paragraphs: [
            "Vous pouvez nous demander à tout moment de consulter les informations que nous détenons sur vous, de les corriger ou de les supprimer. Contactez-nous via WhatsApp, ou par email à info@maisonfondjo.com, hello@maisonfondjo.com ou support@maisonfondjo.com.",
          ],
        },
        {
          heading: "Communication",
          paragraphs: [
            "Nous pouvons vous écrire via WhatsApp au sujet de votre commande, ou pour des mises à jour occasionnelles sur de nouveaux produits. Vous pouvez demander à ne plus les recevoir à tout moment.",
          ],
        },
      ],
    },
    returns: {
      title: "Retours et remboursements",
      sections: [
        {
          heading: "Politique de remboursement pour dommages uniquement",
          paragraphs: [
            "Parce que Sève Racine est un produit cosmétique appliqué directement sur la peau et le cuir chevelu, nous ne pouvons pas accepter de retours ou d'échanges une fois qu'un flacon a été ouvert ou utilisé, sauf en cas de dommage réel pendant le transport. Nos flacons sont en plastique noir mat, qui peut montrer clairement des rayures ou fissures s'ils sont malmenés en transit. Veuillez inspecter le vôtre soigneusement à la réception.",
          ],
        },
        {
          heading: "Comment signaler un dommage",
          bullets: [
            "Inspectez votre flacon au moment de la livraison, avec le livreur présent si possible",
            "En cas de dommage, prenez immédiatement une photo claire",
            "Contactez-nous via WhatsApp ou email dans les 24 heures suivant la livraison avec les détails de votre commande et la photo",
          ],
          paragraphs: [
            "Une fois que nous confirmons que le dommage est survenu pendant le transport, nous envoyons un remplacement sous 2 à 3 jours ouvrés, sans frais supplémentaires pour vous.",
          ],
        },
        {
          heading: "Ce qui n'est pas couvert",
          paragraphs: [
            "Le changement d'avis, un diagnostic personnel incorrect des préoccupations capillaires, ou l'insatisfaction des résultats après une utilisation correcte du produit ne donnent pas droit à un remboursement. Nous sommes heureux de vous aider à tirer le meilleur de votre produit. Écrivez-nous sur WhatsApp pour toute question avant ou pendant l'utilisation.",
          ],
        },
      ],
    },
    shipping: {
      title: "Politique de livraison",
      sections: [
        {
          heading: "Zone de couverture",
          paragraphs: [
            "Nous livrons actuellement dans tout le Cameroun. La livraison internationale arrive bientôt.",
          ],
        },
        {
          heading: "Frais de livraison",
          paragraphs: [
            "Les frais de livraison commencent à 1 000 FCFA et augmentent selon votre distance de Buea. Votre tarif exact sera confirmé par notre équipe lorsque vous passez commande.",
          ],
        },
        {
          heading: "Délais de livraison",
          rows: [
            {
              label: "Buea, Douala, Yaoundé",
              value: "24 à 48 heures",
            },
            {
              label: "Autres régions",
              value:
                "Confirmé au moment de la commande, selon la distance et la disponibilité du coursier",
            },
          ],
        },
        {
          heading: "Paiement avant livraison",
          paragraphs: [
            "Le paiement intégral via Mobile Money est requis avant l'expédition de votre commande. Une fois le paiement confirmé, nous préparons et envoyons votre commande rapidement.",
          ],
        },
      ],
    },
    terms: {
      title: "Conditions générales",
      sections: [
        {
          heading: "À propos de ces conditions",
          paragraphs: [
            "Ces Conditions régissent votre utilisation de maisonfondjo.com et tout achat effectué auprès de Maison Fondjo. En passant commande, vous acceptez ces Conditions.",
          ],
        },
        {
          heading: "Produits et tarifs",
          paragraphs: [
            "Tous les prix sont indiqués en francs CFA d'Afrique centrale (XAF) et peuvent être modifiés sans préavis. Nous mettons en œuvre des efforts raisonnables pour garantir l'exactitude des descriptions et des prix.",
          ],
        },
        {
          heading: "Commandes et paiement",
          paragraphs: [
            "Les commandes sont confirmées via WhatsApp. Le paiement doit être effectué via Mobile Money avant l'expédition. Nous nous réservons le droit de refuser ou d'annuler toute commande à notre discrétion, notamment en cas de suspicion de fraude ou de problème de paiement.",
          ],
        },
        {
          heading: "Propriété intellectuelle",
          paragraphs: [
            "Tout le contenu de ce site, textes, images, identité de marque et formule Sève Racine, est la propriété de Maison Fondjo et ne peut être copié, reproduit ou utilisé sans autorisation écrite préalable.",
          ],
        },
        {
          heading: "Utilisation du produit et avertissement",
          paragraphs: [
            "Sève Racine est un produit cosmétique destiné à un usage externe sur le cuir chevelu et les cheveux. Ce n'est pas un traitement médical et il n'est pas destiné à diagnostiquer, traiter ou guérir une condition médicale. Si vous avez une affection du cuir chevelu, une allergie ou une préoccupation de santé, consultez un professionnel de santé avant utilisation.",
          ],
        },
        {
          heading: "Limitation de responsabilité",
          paragraphs: [
            "Dans la mesure permise par la loi, Maison Fondjo n'est pas responsable des dommages indirects ou consécutifs résultant de l'utilisation du produit, de retards de livraison, ou de circonstances hors de notre contrôle raisonnable.",
          ],
        },
        {
          heading: "Modifications de ces conditions",
          paragraphs: [
            "Nous pouvons mettre à jour ces Conditions de temps à autre. L'utilisation continue de notre site ou de nos services après publication des modifications vaut acceptation des Conditions mises à jour.",
          ],
        },
        {
          heading: "Résoudre les préoccupations ensemble",
          paragraphs: [
            "Si quelque chose dans votre commande ou votre expérience ne vous semble pas juste, contactez-nous d'abord. Nous voulons sincèrement avoir la chance de corriger la situation. La plupart des préoccupations se résolvent rapidement et chaleureusement par une conversation directe sur WhatsApp ou par email, avant toute démarche plus formelle.",
          ],
        },
        {
          heading: "Droit applicable",
          paragraphs: ["Ces Conditions sont régies par les lois de la République du Cameroun."],
        },
        {
          heading: "Contact",
          paragraphs: [
            "Pour toute question sur ces Conditions, joignez-nous via WhatsApp, ou par email à info@maisonfondjo.com, hello@maisonfondjo.com ou support@maisonfondjo.com.",
          ],
        },
      ],
    },
  },
  faqPage: {
    kicker: "FAQ",
    title: "Questions fréquentes",
    intro:
      "Réponses sur Sève Racine, la livraison au Cameroun, le paiement et l'assistance WhatsApp.",
    items: [
      {
        question: "Quand verrai-je des résultats ?",
        answer:
          "Les cheveux répondent à un soin régulier dans le temps, plutôt qu'à un effet immédiat. Avec une utilisation régulière, la plupart des personnes commencent à remarquer une différence de confort du cuir chevelu et de douceur des cheveux en quelques semaines. Pour des changements visibles de solidité et de densité, nous recommandons de s'engager sur au moins un flacon complet d'utilisation régulière.",
      },
      {
        question: "Puis-je l'utiliser avec des tresses ou des perruques ?",
        answer:
          "Oui. Sève Racine s'applique directement sur le cuir chevelu, donc elle convient bien avec les tresses, perruques et autres coiffures protectrices. Appliquez entre les sections ou le long de la raie selon les besoins.",
      },
      {
        question: "À quelle fréquence l'appliquer ?",
        answer:
          "Nous recommandons d'appliquer une quantité modérée sur le cuir chevelu 2 à 4 fois par semaine, en massant doucement pendant 3 à 5 minutes. Laissez poser plusieurs heures ou toute la nuit pour un conditionnement prolongé.",
      },
      {
        question: "Sève Racine convient-elle à tous les types de cheveux ?",
        answer:
          "Oui. La formule est conçue pour soutenir la santé du cuir chevelu et l'état de la fibre capillaire, tous types et textures confondus.",
      },
      {
        question: "Qu'y a-t-il réellement dans la formule ?",
        answer:
          "Sève Racine est un mélange riche d'huiles et d'herbes botaniques, pressé à Buea. La liste complète des ingrédients est imprimée sur l'étiquette de chaque flacon.",
      },
      {
        question: "Dois-je faire un test cutané d'abord ?",
        answer:
          "Oui, surtout si vous avez la peau sensible ou des allergies végétales connues. Appliquez une petite quantité sur l'intérieur du bras ou derrière l'oreille et attendez 24 heures avant une utilisation complète.",
      },
      {
        question: "Le prix est-il négociable ?",
        answer:
          "Notre tarif reflète la qualité de nos ingrédients et le soin apporté à chaque flacon, aussi nous le maintenons fixe et équitable pour tous. Pour économiser sur de futures commandes, demandez-nous nos récompenses de parrainage et de fidélité.",
      },
      {
        question: "Ce produit fonctionne-t-il vraiment ?",
        answer:
          "Nous formulons Sève Racine avec des huiles et herbes botaniques choisies pour leur rôle dans la santé du cuir chevelu et de la fibre, et nous en répondons. Les résultats dépendent de la régularité. La plupart des clients remarquent une différence de confort du cuir chevelu et de douceur des cheveux en quelques semaines d'utilisation régulière. Vous pouvez lire de vrais retours clients sur notre page d'accueil.",
      },
      {
        question: "Comment commander ?",
        answer:
          "Les commandes se passent directement via WhatsApp. Écrivez-nous pour confirmer votre produit, votre zone de livraison et les détails de paiement.",
      },
      {
        question: "Comment payer ?",
        answer:
          "Nous acceptons MTN Mobile Money et Orange Money. Le paiement est requis avant la livraison.",
      },
    ],
  },
} as const;

const publicEn = {
  errors: {
    genericMessage: "Something went wrong. Reload the page or return through WhatsApp.",
    genericTitle: "The page could not load",
    notFoundBody: "This Maison Fondjo page is not available.",
    notFoundTitle: "Page not found",
  },
  metadata: {
    contact: {
      description:
        "Contact Maison Fondjo for Sève Racine, delivery in Cameroon, diagnostic follow-up and product safety questions.",
      title: "Contact | Maison Fondjo",
    },
    faq: {
      description:
        "Answers about Sève Racine, Cameroon delivery, product safety and WhatsApp assistance.",
      title: "FAQ | Maison Fondjo",
    },
    howToUse: {
      description:
        "How to use Sève Racine: a few drops, roots, lengths, beard and a measured gesture.",
      title: "How to use | Maison Fondjo",
    },
    origin: {
      description:
        "Maison Fondjo origin: Buea, Mount Cameroon, the Fondjo name and the meaning of Racine.",
      title: "Origin | Maison Fondjo",
    },
    orderConfirmation: {
      description:
        "Maison Fondjo order confirmation: payment, Mobile Money reference and delivery in Cameroon.",
      title: "Confirmation | Maison Fondjo",
    },
    privacy: {
      description:
        "How Maison Fondjo protects order, payment, delivery and diagnostic information.",
      title: "Privacy | Maison Fondjo",
    },
    returns: {
      description:
        "Maison Fondjo returns: personal product, damage verified at delivery, exchange reviewed.",
      title: "Returns | Maison Fondjo",
    },
    shipping: {
      description:
        "Sève Racine delivery in Cameroon: zones, fees confirmed before payment and WhatsApp coordination.",
      title: "Delivery | Maison Fondjo",
    },
    terms: {
      description:
        "Maison Fondjo terms for using the site, ordering Sève Racine and verifying payment.",
      title: "Terms | Maison Fondjo",
    },
  },
  orderConfirmation: {
    actions: {
      backHome: "My orders",
      newOrder: "Order again",
    },
    customer: "Customer",
    delivery: "Delivery",
    missing: {
      body: "Return to the Sève Racine order flow or contact WhatsApp assistance to recover your confirmation.",
      title: "Confirmation link missing",
    },
    paymentReference: "Reference",
    status: {
      cancelled: "This order has been cancelled.",
      confirmed: "Payment is confirmed. The order now moves into preparation.",
      delivered: "The order is marked as delivered.",
      fallback:
        "Your Maison Fondjo order has been received. Mobile Money payments are verified before confirmation.",
      packed: "The order is packed and awaiting delivery.",
      payment_submitted: "Payment confirmation is in progress automatically.",
      pending_payment: "The order is created. Send payment, then add your transaction reference.",
      refunded: "This order has been refunded.",
      shipped: "The order is out for delivery.",
    },
    title: "Order confirmation",
    total: "Total",
  },
  contactPage: {
    cards: {
      email: {
        label: "Email",
        title: "Press and administration",
      },
      safety: {
        label: "Safety",
        text: "External use. Patch test recommended.",
        title: "Product safety questions",
      },
      whatsapp: {
        label: "WhatsApp",
        title: "Delivery and product advice",
      },
    },
    heading: "Product advice, delivery in Cameroon, press and safety.",
    intro:
      "Maison Fondjo works from Buea. WhatsApp remains the most direct path to confirm a delivery zone, ask about Sève Racine or request follow-up after a diagnostic.",
    kicker: "Contact",
  },
  policies: {
    backHome: "Back home",
    kicker: "Policy",
    privacy: {
      title: "Privacy Policy",
      sections: [
        {
          heading: "What We Collect",
          paragraphs: [
            "When you place an order or complete our hair diagnostic, we may collect: your name, phone number, delivery address, hair concerns you share with us, and order/payment details.",
          ],
        },
        {
          heading: "How We Use It",
          bullets: [
            "To process and deliver your order",
            "To recommend the right product or consultation for your needs",
            "To follow up on your order and check in on your results",
            "To improve our products and service over time",
          ],
        },
        {
          heading: "How We Protect It",
          paragraphs: [
            "Your information is stored securely and is not sold to third parties. Access is limited to the Maison Fondjo team members who need it to fulfill your order.",
          ],
        },
        {
          heading: "Your Rights",
          paragraphs: [
            "You can ask us at any time to see what information we hold about you, correct it, or have it deleted. Contact us via WhatsApp, or by email at info@maisonfondjo.com, hello@maisonfondjo.com, or support@maisonfondjo.com.",
          ],
        },
        {
          heading: "Communication",
          paragraphs: [
            "We may message you via WhatsApp regarding your order, or with occasional updates about new products. You can ask to stop receiving these at any time.",
          ],
        },
      ],
    },
    returns: {
      title: "Returns & Refunds Policy",
      sections: [
        {
          heading: "Damage-Only Refund Policy",
          paragraphs: [
            "Because Sève Racine is a cosmetic product applied directly to the skin and scalp, we are unable to accept returns or exchanges once a bottle has been opened or used, except in the case of genuine damage during transport. Our bottles are matte black plastic, which can show scuffs or cracks clearly if mishandled in transit. Please inspect yours carefully upon arrival.",
          ],
        },
        {
          heading: "How to Report Damage",
          bullets: [
            "Inspect your bottle at the moment of delivery, with the delivery agent present if possible",
            "If damaged, take a clear photo immediately",
            "Contact us via WhatsApp or email within 24 hours of delivery with your order details and photo",
          ],
          paragraphs: [
            "Once we confirm the damage occurred during transport, we will send a replacement within 2 to 3 business days at no additional cost to you.",
          ],
        },
        {
          heading: "What Isn't Covered",
          paragraphs: [
            "Change of mind, incorrect self-diagnosis of hair concerns, or dissatisfaction with results after correct product use are not eligible for refund. We're happy to help you get the most from your product. Message us on WhatsApp with any questions before or during use.",
          ],
        },
      ],
    },
    shipping: {
      title: "Shipping Policy",
      sections: [
        {
          heading: "Delivery Coverage",
          paragraphs: [
            "We currently deliver nationwide across Cameroon. International shipping is coming soon.",
          ],
        },
        {
          heading: "Delivery Fees",
          paragraphs: [
            "Delivery fees start at 1,000 FCFA and increase depending on your distance from Buea. Your exact fee will be confirmed by our team when you place your order.",
          ],
        },
        {
          heading: "Delivery Timing",
          rows: [
            {
              label: "Buea, Douala, Yaoundé",
              value: "24 to 48 hours",
            },
            {
              label: "Other regions",
              value: "Confirmed at time of order, based on distance and courier availability",
            },
          ],
        },
        {
          heading: "Payment Before Delivery",
          paragraphs: [
            "Full payment via Mobile Money is required before your order is dispatched. Once payment is confirmed, we prepare and send your order promptly.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms & Conditions",
      sections: [
        {
          heading: "About These Terms",
          paragraphs: [
            "These Terms govern your use of maisonfondjo.com and any purchase made from Maison Fondjo. By placing an order, you agree to these Terms.",
          ],
        },
        {
          heading: "Products & Pricing",
          paragraphs: [
            "All prices are listed in Central African CFA francs (XAF) and are subject to change without prior notice. We make reasonable efforts to ensure product descriptions and pricing are accurate.",
          ],
        },
        {
          heading: "Orders & Payment",
          paragraphs: [
            "Orders are confirmed via WhatsApp. Payment must be completed via Mobile Money before your order is dispatched. We reserve the right to decline or cancel any order at our discretion, including in cases of suspected fraud or payment issues.",
          ],
        },
        {
          heading: "Intellectual Property",
          paragraphs: [
            "All content on this website, including text, images, branding, and the Sève Racine formula, is the property of Maison Fondjo and may not be copied, reproduced, or used without prior written permission.",
          ],
        },
        {
          heading: "Product Use & Disclaimer",
          paragraphs: [
            "Sève Racine is a cosmetic product intended for external use on the scalp and hair. It is not a medical treatment and is not intended to diagnose, treat, or cure any medical condition. If you have a scalp condition, allergy, or health concern, please consult a medical professional before use.",
          ],
        },
        {
          heading: "Limitation of Liability",
          paragraphs: [
            "To the extent permitted by law, Maison Fondjo is not liable for indirect or consequential damages arising from product use, delivery delays, or circumstances beyond our reasonable control.",
          ],
        },
        {
          heading: "Changes to These Terms",
          paragraphs: [
            "We may update these Terms from time to time. Continued use of our website or services after changes are posted constitutes acceptance of the updated Terms.",
          ],
        },
        {
          heading: "Resolving Concerns Together",
          paragraphs: [
            "If anything about your order or experience doesn't feel right, please reach out to us first. We genuinely want the chance to make it right. Most concerns can be resolved quickly and warmly through a direct conversation on WhatsApp or by email, before anything more formal is needed.",
          ],
        },
        {
          heading: "Governing Law",
          paragraphs: ["These Terms are governed by the laws of the Republic of Cameroon."],
        },
        {
          heading: "Contact",
          paragraphs: [
            "For any questions about these Terms, please reach us via WhatsApp, or by email at info@maisonfondjo.com, hello@maisonfondjo.com, or support@maisonfondjo.com.",
          ],
        },
      ],
    },
  },
  faqPage: {
    kicker: "FAQ",
    title: "Frequently Asked Questions",
    intro: "Answers about Sève Racine, Cameroon delivery, payment, and WhatsApp assistance.",
    items: [
      {
        question: "How fast will I see results?",
        answer:
          "Hair responds to consistent care over time rather than overnight. With regular use, most people begin noticing a difference in scalp comfort and hair softness within a few weeks. For visible changes in strength and fullness, we recommend committing to at least one full bottle of consistent use.",
      },
      {
        question: "Can I use it with braids or wigs?",
        answer:
          "Yes. Sève Racine is applied directly to the scalp, so it works well alongside braids, wigs, and other protective styles. Apply between sections or along the scalp part as needed.",
      },
      {
        question: "How often should I apply it?",
        answer:
          "We recommend applying a moderate amount to the scalp 2 to 4 times per week, massaging gently for 3 to 5 minutes. Leave it on for several hours or overnight for extended conditioning.",
      },
      {
        question: "Is Sève Racine suitable for all hair types?",
        answer:
          "Yes. The formula is designed to support scalp health and hair fibre condition across hair types and textures.",
      },
      {
        question: "What's actually in the formula?",
        answer:
          "Sève Racine is a rich blend of botanical oils and herbs, pressed in Buea. The complete ingredient list is printed on every bottle's label.",
      },
      {
        question: "Should I do a patch test first?",
        answer:
          "Yes, especially if you have sensitive skin or known plant allergies. Apply a small amount to your inner arm or behind the ear and wait 24 hours before full use.",
      },
      {
        question: "Is the price negotiable?",
        answer:
          "Our pricing reflects the quality of our ingredients and the care that goes into every bottle, so we keep it fixed and fair for everyone. If you'd like to save on future orders, ask us about our referral and loyalty rewards.",
      },
      {
        question: "Does this product actually work?",
        answer:
          "We formulate Sève Racine with botanical oils and herbs chosen for their role in scalp and hair fibre health, and we stand behind it. Results depend on consistency. Most customers notice a difference in scalp comfort and hair softness within a few weeks of regular use. You can read real customer experiences on our homepage.",
      },
      {
        question: "How do I order?",
        answer:
          "Orders are placed directly through WhatsApp. Message us to confirm your product, delivery zone, and payment details.",
      },
      {
        question: "How do I pay?",
        answer: "We accept MTN Mobile Money and Orange Money. Payment is required before delivery.",
      },
    ],
  },
} as const;

const advisorEn = {
  footerLinks: [
    ["Wholesale", "/grossistes"],
    ["Contact", "/contact"],
    ["Delivery", "/policies/shipping"],
  ],
  nav: buildMarketingNav("en"),
  botanique: {
    body: "This QR destination presents a rich blend of botanical oils and herbs, Latin names, plant origin and the reason each belongs in Sève Racine.",
    chosenFor: "Chosen for",
    description:
      "Maison Fondjo herbarium: Sève Racine ingredients, Latin names and botanical role.",
    eyebrow: "Digital herbarium",
    title: "A botanical blend. One precise language.",
  },
  diagnostic: {
    ...advisorFr.diagnostic,
    autreBack: "← Back",
    autrePrompt: "Describe what you're experiencing",
    notesContinue: "Continue",
    notesPlaceholder: "Optional",
    notesPrompt: "Anything else you'd like us to know?",
    eyebrow: "Maison Fondjo diagnostic",
    nextStep: "Your next step",
    privateBody:
      "Some signals need closer attention. The Private Consultation is offered at {price}, credited if a formula is then prepared.",
    privateTitle: "Private Consultation recommended.",
    redo: "Retake the diagnostic",
    standardBody:
      "Your main concern ({problem}) can be framed through Sève Racine with {botanicalOne} and {botanicalTwo}, without overload.",
    standardTitle: "Sève Racine can structure your ritual.",
    title: "Hair diagnostic | Maison Fondjo",
    description:
      "Maison Fondjo hair diagnostic in Buea before Sève Racine or a Private Consultation.",
    whatsapp: "Continue on WhatsApp",
    questions: [
      {
        id: "objectif",
        prompt: "What concerns you most today?",
        summaryLabel: "Concern",
        options: [
          { label: "Breakage", value: "casse" },
          { label: "Dryness", value: "secheresse" },
          { label: "Uncomfortable scalp", value: "cuir_chevelu" },
          {
            label: "Sudden shedding or sparse areas",
            severity: "serious",
            value: "chute_soudaine",
          },
          {
            label: "Other. Tell us",
            severity: "serious",
            value: "autre",
          },
        ],
      },
      {
        id: "texture",
        prompt: "Which description is closest to your hair?",
        summaryLabel: "Hair",
        options: [
          { label: "natural 4C", value: "naturels_4c" },
          { label: "Curly", value: "boucles" },
          { label: "Wavy", value: "ondules" },
          { label: "Fine or straight", value: "fins_lisses" },
        ],
      },
      {
        id: "routine",
        prompt: "Your current routine is mostly..",
        summaryLabel: "Routine",
        options: [
          { label: "Protective styles or braids", value: "protective_styles" },
          { label: "Regular wash day", value: "wash_day" },
          { label: "Beard and edges", value: "grooming" },
          { label: "Very irregular", value: "irreguliere" },
        ],
      },
      {
        id: "sensibilite",
        prompt: "Do you have pain, wounds, burning or a persistent reaction?",
        summaryLabel: "Scalp",
        options: [
          { label: "No", value: "non" },
          { label: "itching", value: "demangeaisons" },
          {
            label: "Yes, persistent pain or irritation",
            severity: "serious",
            value: "douleur_irritation",
          },
        ],
      },
      {
        id: "duree",
        prompt: "How long have you noticed this concern?",
        summaryLabel: "Duration",
        options: [
          { label: "less than one month", value: "moins_1_mois" },
          { label: "6 months", value: "6_mois" },
          { label: "more than one year", value: "plus_1_an" },
        ],
      },
    ],
  },
  grossistes: {
    cardMinimum: "Minimum order",
    cardPrice: "Professional unit price",
    cardValidation: "Direct validation",
    cta: "Contact on WhatsApp",
    description:
      "Maison Fondjo wholesale conditions: minimum 20, professional pricing and WhatsApp contact.",
    eyebrow: "Professional access",
    title: "Wholesalers and retailers.",
  },
  seveRacine: {
    ...advisorFr.seveRacine,
    alt: "Sève Racine bottle photographed in a reflective black studio",
    batchLine: "Botanical hair oil, 100 ml",
    cta: "Order now",
    description: "Sève Racine by Maison Fondjo: botanical hair oil, 100 ml, 15 000 F.",
    intro:
      "One bottle, one box, one simple recommendation: place the oil where the fibre and scalp actually need it.",
    payment: ["MTN Mobile Money", "Orange Money"],
    shippingCards: [
      {
        label: "Cameroon delivery",
        text: "Nationwide delivery from 1,000 FCFA. Payment before delivery.",
      },
      {
        label: "Refund",
        text: "Damage verified at delivery only.",
      },
      {
        label: "Founder Batch",
        text: "150 numbered boxes.",
      },
    ],
    steps: ["Warm a few drops", "Massage the roots", "Finish lengths or beard"],
    title: "Sève Racine",
    howToUse: {
      title: "How to use",
      steps: [
        {
          num: "01",
          title: "Apply",
          text: "A few drops directly to the scalp, target areas, or lengths.",
        },
        {
          num: "02",
          title: "Massage",
          text: "3 to 5 minutes to distribute the oil and activate microcirculation at the root.",
        },
        {
          num: "03",
          title: "Leave on",
          text: "Several hours or overnight for deeper care.",
        },
        {
          num: "04",
          title: "Frequency",
          text: "2 to 4 times per week. Patch test recommended on first use.",
        },
      ],
    },
  },
  shell: {
    cta: "Diagnostic",
    footer: "Maison Fondjo Rooted in nature. Made to last.",
    homeLabel: "Maison Fondjo home",
    logoAlt: "Maison Fondjo",
    place: "Buea, Cameroon",
  },
  texturePending: {
    body: "This area will host a Maison Fondjo photography series dedicated to real hair, without reusing one image for several textures.",
    label: "Real photography pending",
  },
  surMesure: {
    body: "Bespoke care gives structure to needs that require more than a standard bottle. It makes Sève Racine accessible, and the private formula exceptional.",
    cta: "Request a consultation",
    description: `Maison Fondjo bespoke care in Buea: diagnostic, Private Consultation and ${surMesurePrice} formula.`,
    eyebrow: "The premium ceiling",
    steps: [
      ["01", "Diagnostic", "Understand texture, rhythm, scalp and limits."],
      ["02", "Consultation", `${consultationPrice}, credited if the formula is prepared.`],
      ["03", "Formula", `Bespoke preparation at ${surMesurePrice}.`],
    ],
    title: "Diagnostic. Consultation. Formula.",
  },
  histoire: {
    description:
      "Maison Fondjo is a botanical hair care house rooted in Buea, Cameroon, home of Sève Racine and the Fondjo family name.",
    eyebrow: "About Us",
    title: "Rooted in nature. Made to last.",
    origin: {
      label: "The house",
      heading: "Buea, at the foot of Mount Cameroon.",
      body: "Maison Fondjo is a botanical hair care house rooted in Buea, Cameroon, at the foot of Mount Cameroon, where volcanic soil, altitude, and tropical rain shape the ingredients we work with.",
    },
    name: {
      label: "The name",
      heading: "Fondjo.",
      body: "Fondjo is a family name, not a brand invented to sound a certain way. It is the name carried on every label, and the standard we hold ourselves to with every bottle we make.",
    },
    product: {
      label: "The product",
      heading: "Sève Racine.",
      body: "Our flagship product, Sève Racine, was created from a simple belief: healthy hair starts with a healthy scalp. Rather than offering a quick fix, we formulate botanical oils and herbs to nourish the scalp, support the hair fibre, and help reduce breakage through consistent, patient care.",
    },
    family: {
      label: "The beginning",
      heading: "Founder Batch, 2026.",
      body: "Founded in 2026, every bottle is numbered as part of our Founder Batch, pressed and prepared in Buea. This is the beginning of the Maison Fondjo journey. Our vision is to keep building botanical hair care that people can trust, made with restraint and without shortcuts. Enracinée dans la nature. Faite pour durer. Rooted in nature. Made to last.",
    },
    cta: "Order Sève Racine",
    ctaSecondary: "See the botanical formula",
  },
};

const homeFr = {
  ...storefrontFr,
  formulaNote:
    "La liste n'est pas présentée comme un ordre de concentration ; l'ordre exact de l'étiquette attend confirmation du formulateur.",
  hero: {
    backgroundAlt: "Atmosphère botanique Maison Fondjo à Buea, près du Mont Cameroun",
    bottleAlt: "Flacon Sève Racine, huile capillaire botanique Maison Fondjo",
    eyebrow: "MAISON FONDJO. BUEA, CAMEROUN",
    primary: "Commencer mon diagnostic",
    secondary: "Découvrir Sève Racine",
    story: "Avant le flacon, nous commençons par vous écouter.",
    subtitle:
      "Découvrez des soins capillaires botaniques premium conçus pour nourrir le cuir chevelu, renforcer les cheveux et soutenir une apparence plus saine grâce à un soin régulier.",
    pending: "Photographie produit réelle en attente",
    titleFirst: "Racines fortes.",
    titleSecond: "Cheveux forts.",
    titleThird: "",
    trustLabel: "Repères du coffret Maison Fondjo",
    trustItems: [
      ["Coffret numéroté", "Lot Fondateur 2026, 150 exemplaires"],
      ["Ligne signature", "La famille Fondjo"],
      ["Marques paiement", "MTN Mobile Money + Orange Money"],
    ],
  },
  language: {
    bannerAccept: "Passer en français",
    bannerDismiss: "Continuer en anglais",
    bannerText: "On dirait que vous préférez le français",
  },
  footer: {
    brandBlurb:
      "Soins capillaires botaniques naturels, conçus au Cameroun pour des cheveux d’apparence plus saine.",
    brandLocation: "Buea, Cameroun",
    brandRights: "Tous droits réservés.",
    companyTitle: "Entreprise",
    companyLinks: [
      ["À propos", "/histoire"],
      ["Botanique", "/botanique"],
      ["FAQ", "/faq"],
      ["Contact", "/contact"],
    ] as const,
    cookies: "Cookies",
    newsletterBody: "Recevez les nouveautés produit, conseils capillaires et offres exclusives.",
    newsletterPlaceholder: "Adresse e-mail",
    newsletterSubmit: "S’abonner",
    newsletterTitle: "Restez informé",
    privacy: "Confidentialité",
    shopTitle: "Boutique",
    shopLinks: [
      ["Tous les produits", "/shop"],
      ["Sève Racine", "/products/seve-racine"],
    ] as const,
    shopSoon: [["Suivre une commande", "/account/orders"]] as const,
    socialTitle: "Nous suivre",
    supportHelp: "Besoin d’aide ?",
    supportTitle: "Assistance",
    supportLinks: [
      ["Livraison", "/policies/shipping"],
      ["Retours", "/policies/returns"],
      ["Confidentialité", "/policies/privacy"],
      ["Conditions", "/policies/terms"],
      ["Contacter le support", "/contact"],
    ] as const,
    supportSoon: [["Centre d’aide", "/faq"]] as const,
    terms: "Conditions",
    whatsapp: "WhatsApp",
  },
  shell: advisorFr.shell,
} as const;

const homeEn = {
  ...storefrontEn,
  formulaNote:
    "This list is not presented as concentration order; the exact label order awaits formulator confirmation.",
  hero: {
    backgroundAlt: "Maison Fondjo botanical atmosphere in Buea, near Mount Cameroon",
    bottleAlt: "Sève Racine bottle, Maison Fondjo botanical hair oil",
    eyebrow: "MAISON FONDJO. BUEA, CAMEROON",
    primary: "Start my diagnostic",
    secondary: "Discover Sève Racine",
    story: "Before the bottle, we begin by listening.",
    subtitle:
      "Discover premium botanical hair care designed to nourish the scalp, strengthen hair, and support healthier-looking hair through consistent care.",
    pending: "Real product photography pending",
    titleFirst: "Strong roots.",
    titleSecond: "Strong hair.",
    titleThird: "",
    trustLabel: "Maison Fondjo box trust signals",
    trustItems: [
      ["Numbered box", "Founder Batch 2026, 150 pieces"],
      ["Founder signature", "The Fondjo family"],
      ["Payment marks", "MTN Mobile Money + Orange Money"],
    ],
  },
  language: {
    bannerAccept: "Switch to English",
    bannerDismiss: "Continue in French",
    bannerText: "It looks like you prefer English",
  },
  footer: {
    brandBlurb:
      "Natural botanical hair care, crafted in Cameroon to support healthier-looking hair.",
    brandLocation: "Buea, Cameroon",
    brandRights: "All rights reserved.",
    companyTitle: "Company",
    companyLinks: [
      ["About Us", "/histoire"],
      ["Botanicals", "/botanique"],
      ["FAQs", "/faq"],
      ["Contact", "/contact"],
    ] as const,
    cookies: "Cookies",
    newsletterBody: "Get product updates, hair care tips, and exclusive offers.",
    newsletterPlaceholder: "Email address",
    newsletterSubmit: "Subscribe",
    newsletterTitle: "Stay Updated",
    privacy: "Privacy",
    shopTitle: "Shop",
    shopLinks: [
      ["All Products", "/shop"],
      ["Sève Racine", "/products/seve-racine"],
    ] as const,
    shopSoon: [["Track Order", "/account/orders"]] as const,
    socialTitle: "Follow Us",
    supportHelp: "Need help?",
    supportTitle: "Support",
    supportLinks: [
      ["Shipping", "/policies/shipping"],
      ["Returns", "/policies/returns"],
      ["Privacy Policy", "/policies/privacy"],
      ["Terms & Conditions", "/policies/terms"],
      ["Contact Support", "/contact"],
    ] as const,
    supportSoon: [["Help Center", "/faq"]] as const,
    terms: "Terms",
    whatsapp: "WhatsApp",
  },
  shell: advisorEn.shell,
} as const;

const diagnosticFr = {
  ...advisorFr.diagnostic,
  recommendation: {
    credited: "créditée",
    fallbackAnswer: "Non renseigné",
    for: "pour",
    privateDirection: "Consultation Privée recommandée",
    recommendationLabel: "Recommandation Sève Racine",
    recommendationText: "commencer par un rituel mesuré avec {botanicalOne} et {botanicalTwo}.",
    severityHigh: "élevée",
    severityStandard: "standard",
    summaryConcern: "Problème",
    summaryDirection: "Orientation",
    summaryHair: "Cheveux",
    summaryRoutine: "Routine",
    summaryScalp: "Cuir chevelu",
    summarySeverity: "Sévérité",
  },
} as const;

const diagnosticEn = {
  ...advisorEn.diagnostic,
  recommendation: {
    credited: "credited",
    fallbackAnswer: "Not provided",
    for: "for",
    privateDirection: "Private Consultation recommended",
    recommendationLabel: "Sève Racine recommendation",
    recommendationText: "start with a measured ritual using {botanicalOne} and {botanicalTwo}.",
    severityHigh: "high",
    severityStandard: "standard",
    summaryConcern: "Concern",
    summaryDirection: "Direction",
    summaryHair: "Hair",
    summaryRoutine: "Routine",
    summaryScalp: "Scalp",
    summarySeverity: "Severity",
  },
} as const;

export const copy = {
  en: {
    botanique: advisorEn.botanique,
    diagnostic: diagnosticEn,
    grossistes: advisorEn.grossistes,
    histoire: advisorEn.histoire,
    home: homeEn,
    seveRacine: advisorEn.seveRacine,
    surMesure: advisorEn.surMesure,
  },
  fr: {
    botanique: advisorFr.botanique,
    diagnostic: diagnosticFr,
    grossistes: advisorFr.grossistes,
    histoire: advisorFr.histoire,
    home: homeFr,
    seveRacine: advisorFr.seveRacine,
    surMesure: advisorFr.surMesure,
  },
} as const;

export type Locale = keyof typeof copy;

export type PublicCopy = typeof publicFr | typeof publicEn;

export function getPublicCopy(locale: Locale = "en"): PublicCopy {
  return locale === "fr" ? publicFr : publicEn;
}

/** @deprecated Prefer getPublicCopy(locale). Defaults to French for legacy imports. */
export const publicCopy = publicFr;
