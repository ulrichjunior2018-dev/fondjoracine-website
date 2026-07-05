insert into public.storefront_content (key, status, published_at, content)
values (
  'fondjo-racine-seve',
  'published',
  now(),
  '{
    "id": "fondjo-racine-seve",
    "brand": "FONDJO",
    "slug": "seve-hair-treatment-oil",
    "currency": "USD",
    "priceCents": 0,
    "priceXaf": "Configured in app",
    "title": {
      "en": "SEVE",
      "fr": "SEVE"
    },
    "hero": {
      "eyebrow": {
        "en": "Premium African botanical hair wellness",
        "fr": "Soin capillaire botanique africain premium"
      },
      "title": {
        "en": "The Cameroonian Hair Oil Backed by a 60-Day Results Guarantee",
        "fr": "L huile capillaire camerounaise avec garantie resultats 60 jours"
      },
      "primaryCta": {
        "en": "Start Free Hair Diagnosis on WhatsApp",
        "fr": "Demarrer le diagnostic gratuit sur WhatsApp"
      },
      "secondaryCta": {
        "en": "See the 60-day routine",
        "fr": "Voir la routine 60 jours"
      }
    },
    "product": {
      "eyebrow": { "en": "The product", "fr": "Le produit" },
      "title": { "en": "SEVE, 100ml.", "fr": "SEVE, 100ml." },
      "name": { "en": "SEVE", "fr": "SEVE" },
      "size": { "en": "100ml", "fr": "100ml" },
      "priceXaf": "Configured in app",
      "description": {
        "en": "A 100ml root-to-length botanical oil created for 60 days of consistent scalp massage, sealing, and visible polish.",
        "fr": "Une huile botanique 100ml racines-a-longueurs pour 60 jours de massage, scellage et finition visible."
      }
    },
    "innerCircle": {
      "eyebrow": { "en": "Inner Circle subscription", "fr": "Abonnement Inner Circle" },
      "title": { "en": "Stay consistent for less each month.", "fr": "Restez reguliere pour moins chaque mois." },
      "priceXaf": "Configured in app",
      "cta": { "en": "Join through WhatsApp", "fr": "Rejoindre via WhatsApp" },
      "benefits": [
        { "en": "Monthly 100ml replenishment", "fr": "Reassort mensuel 100ml" },
        { "en": "WhatsApp progress check-ins", "fr": "Suivi progres sur WhatsApp" },
        { "en": "Priority access to drops and bundles", "fr": "Acces prioritaire aux lancements et packs" }
      ]
    },
    "whatsapp": {
      "phone": "+19295046726",
      "label": { "en": "WhatsApp diagnosis", "fr": "Diagnostic WhatsApp" },
      "diagnosisCta": {
        "en": "Start Free Hair Diagnosis on WhatsApp",
        "fr": "Demarrer le diagnostic gratuit sur WhatsApp"
      },
      "finalCta": {
        "en": "Start my 60-day FONDJO plan",
        "fr": "Commencer mon plan FONDJO 60 jours"
      },
      "message": {
        "en": "Hello FONDJO, I want a free hair diagnosis for breakage, slow growth, dryness, or thinning. Please help me start the 60-day plan.",
        "fr": "Bonjour FONDJO, je veux un diagnostic gratuit pour casse, pousse lente, secheresse ou zones clairsemees. Aidez-moi a commencer le plan 60 jours."
      }
    }
  }'::jsonb
)
on conflict (key) do update
set
  content = public.storefront_content.content || excluded.content,
  status = 'published',
  published_at = coalesce(public.storefront_content.published_at, now()),
  updated_at = now();
