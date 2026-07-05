export const publicCopy = {
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
        "Réponses sur Sève Racine, les 11 botaniques, la livraison au Cameroun, la sécurité produit et l'assistance WhatsApp.",
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
      backHome: "Retour à l'accueil",
      newOrder: "Commander à nouveau",
    },
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
      payment_submitted: "La référence de paiement est reçue et attend la vérification.",
      pending_payment:
        "La commande est créée. Envoyez le paiement, puis ajoutez votre référence de transaction.",
      refunded: "Cette commande a été remboursée.",
      shipped: "La commande est en livraison.",
    },
    title: "Confirmation de commande",
  },
  policies: {
    backHome: "Retour à l'accueil",
    kicker: "Politique",
    privacy: {
      body: [
        "Maison Fondjo collecte uniquement les informations nécessaires pour préparer Sève Racine, vérifier le paiement, coordonner la livraison au Cameroun, répondre sur WhatsApp et améliorer le diagnostic capillaire.",
        "Le paiement par carte, lorsqu'il est activé, est traité par Stripe. Les références MTN Mobile Money et Orange Money sont vérifiées avant confirmation.",
        "Pour corriger ou supprimer vos informations, contactez l'équipe par WhatsApp. Les dossiers utiles à la livraison, à la sécurité et au suivi client sont conservés avec mesure.",
      ],
      title: "Confidentialité",
    },
    returns: {
      body: [
        "Sève Racine est un soin personnel : un flacon ouvert ne peut pas être repris pour des raisons d'hygiène.",
        "Si un coffret arrive endommagé, incorrect ou incomplet, signalez-le à la livraison avec des photos claires. L'équipe étudie alors l'échange ou le remboursement.",
        "Les annulations sont examinées avant préparation. Après expédition, les conditions de livraison et d'hygiène limitent les options.",
      ],
      title: "Retours et échanges",
    },
    shipping: {
      body: [
        "La livraison est organisée au Cameroun. Le client fournit la ville, le quartier, le repère et le numéro WhatsApp avant validation.",
        "Les frais sont confirmés avant paiement selon la zone de livraison, entre 500 F et 3 000 F.",
      ],
      title: "Livraison au Cameroun",
    },
    terms: {
      body: [
        "En commandant Sève Racine ou en contactant Maison Fondjo, vous acceptez de fournir des informations exactes pour la livraison et la vérification du paiement.",
        "Sève Racine est une huile cosmétique à usage externe. Elle ne diagnostique pas, ne traite pas, ne guérit pas et ne remplace pas un dermatologue.",
        "Maison Fondjo peut refuser, annuler ou rembourser une commande si le paiement ne peut pas être vérifié, si le stock est indisponible ou si la livraison ne peut pas être réalisée.",
      ],
      title: "Conditions d'utilisation",
    },
  },
} as const;
