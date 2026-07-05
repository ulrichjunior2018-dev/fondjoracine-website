update public.storefront_content
set
  content = content
    || '{
      "inventory": {
        "stockCount": 250,
        "lowStockThreshold": 25
      },
      "socialLinks": {
        "instagram": "https://www.instagram.com/fondjoracine",
        "tiktok": "https://www.tiktok.com/@fondjoracine"
      },
      "launchAnnouncement": {
        "enabled": true,
        "badge": {
          "en": "Launch batch open",
          "fr": "Lot de lancement ouvert"
        },
        "eyebrow": {
          "en": "Now accepting diagnosis orders",
          "fr": "Diagnostics et commandes ouverts"
        },
        "title": {
          "en": "The first FONDJO SEVE batch is available now.",
          "fr": "Le premier lot FONDJO SEVE est disponible maintenant."
        },
        "intro": {
          "en": "Founder-led launch quantities are updated regularly so customers always see the current offer before they order.",
          "fr": "Les quantites de lancement sont mises a jour regulierement pour afficher l offre actuelle avant commande."
        },
        "cta": {
          "en": "Reserve your bottle",
          "fr": "Reserver votre flacon"
        }
      },
      "testimonials": {
        "eyebrow": {
          "en": "Customer notes",
          "fr": "Avis clientes"
        },
        "title": {
          "en": "Guided routines create calmer, more confident customers.",
          "fr": "Les routines accompagnees creent des clientes plus confiantes."
        },
        "items": [
          {
            "name": "Mireille",
            "location": {
              "en": "Douala, Cameroon",
              "fr": "Douala, Cameroun"
            },
            "quote": {
              "en": "The routine feels premium and simple. My scalp stays comfortable longer between wash days.",
              "fr": "La routine est premium et simple. Mon cuir chevelu reste confortable plus longtemps entre les soins."
            },
            "result": {
              "en": "Less dryness after protective styling",
              "fr": "Moins de secheresse apres coiffure protectrice"
            }
          },
          {
            "name": "Clarisse",
            "location": {
              "en": "Yaounde, Cameroon",
              "fr": "Yaounde, Cameroun"
            },
            "quote": {
              "en": "I like that the WhatsApp diagnosis made the oil feel guided, not random.",
              "fr": "J aime que le diagnostic WhatsApp rende l huile accompagnee, pas aleatoire."
            },
            "result": {
              "en": "More consistent application routine",
              "fr": "Rituel cuir chevelu plus regulier"
            }
          },
          {
            "name": "Ange",
            "location": {
              "en": "Buea, Cameroon",
              "fr": "Buea, Cameroun"
            },
            "quote": {
              "en": "The finish is polished without feeling heavy on my ends.",
              "fr": "Le fini est soigne sans alourdir mes pointes."
            },
            "result": {
              "en": "Softer ends and visible shine",
              "fr": "Pointes plus douces et brillance visible"
            }
          }
        ]
      }
    }'::jsonb,
  updated_at = now()
where key = 'fondjo-racine-seve';

comment on table public.storefront_content is
  'CMS content for FONDJO storefront pages. JSON documents are validated by the Next.js Zod schema before rendering.';

comment on column public.storefront_content.content is
  'Editable storefront JSON. Admin-editable fields include hero, products, pricing, ingredients, proof, testimonials, FAQ, founder, guarantee, payments, social links, inventory, subscriptions, and launch announcements.';
