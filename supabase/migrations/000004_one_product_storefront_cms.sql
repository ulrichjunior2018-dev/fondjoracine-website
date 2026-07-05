do $$
begin
  create type public.storefront_content_status as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.storefront_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  status public.storefront_content_status not null default 'draft',
  content jsonb not null,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint storefront_content_key_format check (key ~ '^[a-z0-9-]+$'),
  constraint storefront_content_published_has_date check (
    status <> 'published' or published_at is not null
  )
);

alter table public.storefront_content enable row level security;

create policy "Published storefront content is public"
  on public.storefront_content
  for select
  using (status = 'published');

create policy "Admins read all storefront content"
  on public.storefront_content
  for select
  using (public.has_admin_permission('content.read'));

create policy "Admins write storefront content"
  on public.storefront_content
  for all
  using (public.has_admin_permission('content.write'))
  with check (public.has_admin_permission('content.write'));

create index if not exists storefront_content_key_status_idx
  on public.storefront_content (key, status);

insert into public.storefront_content (key, status, published_at, content)
values (
  'fondjo-racine-seve',
  'published',
  now(),
  -- TODO: Replace with real MTN MoMo number
  -- TODO: Replace with real Orange Money number
  '{
    "id": "fondjo-racine-seve",
    "brand": "FONDJO",
    "slug": "hair-elixir",
    "currency": "USD",
    "priceCents": 0,
    "priceXaf": "Configured in app",
    "title": { "en": "FONDJO Hair Elixir", "fr": "FONDJO Hair Elixir" },
    "description": {
      "en": "A concentrated botanical hair elixir created for dry scalp comfort, luminous length, and a polished luxury ritual in one bottle.",
      "fr": "Un elixir capillaire botanique concentre pour apaiser le cuir chevelu sec, illuminer les longueurs et transformer le soin en rituel premium."
    },
    "seo": {
      "title": { "en": "FONDJO Hair Elixir", "fr": "FONDJO Hair Elixir" },
      "description": {
        "en": "FONDJO Hair Elixir is a premium botanical hair oil for scalp comfort, shine, and luxury hair wellness with Stripe, MoMo, Orange Money, and WhatsApp ordering.",
        "fr": "FONDJO Hair Elixir est une huile capillaire botanique premium pour cuir chevelu, brillance et soin luxe avec Stripe, MoMo, Orange Money et WhatsApp."
      }
    },
    "hero": {
      "eyebrow": { "en": "FONDJO Hair Elixirs", "fr": "FONDJO Hair Elixirs" },
      "title": {
        "en": "Root-to-shine hair oil for a calmer scalp and luminous finish.",
        "fr": "Huile capillaire racine-a-brillance pour un cuir chevelu apaise et une finition lumineuse."
      },
      "primaryCta": { "en": "Order securely", "fr": "Commander en securite" },
      "secondaryCta": { "en": "Pay with MoMo or Orange", "fr": "Payer par MoMo ou Orange" }
    },
    "availability": {
      "en": "Small-batch availability for Cameroon delivery.",
      "fr": "Disponibilite en petites series pour le Cameroun."
    },
    "shipping": {
      "en": "Cameroon delivery coordination by WhatsApp. Card payments supported through Stripe when available.",
      "fr": "Livraison au Cameroun coordonnee par WhatsApp. Paiements par carte par carte via Stripe."
    },
    "whatsapp": {
      "phone": "+19295046726",
      "label": { "en": "Order on WhatsApp", "fr": "Commander sur WhatsApp" },
      "message": {
        "en": "Hello FONDJO, I want to order the Hair Elixir. Please confirm availability, delivery, and payment details.",
        "fr": "Bonjour FONDJO, je veux commander le Hair Elixir. Merci de confirmer la disponibilite, la livraison et le paiement."
      }
    },
    "images": [
      {
        "src": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1400&q=82",
        "width": 1200,
        "height": 1600,
        "alt": {
          "en": "Luxury botanical hair elixir bottle with warm editorial lighting",
          "fr": "Flacon d elixir capillaire botanique luxe en lumiere editoriale chaude"
        }
      },
      {
        "src": "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1400&q=82",
        "width": 1200,
        "height": 1200,
        "alt": {
          "en": "Nourishing botanical oil texture for hair and scalp",
          "fr": "Texture d huile botanique nourrissante pour cheveux et cuir chevelu"
        }
      }
    ],
    "highlights": [
      { "label": { "en": "Size", "fr": "Format" }, "value": { "en": "50 ml glass bottle", "fr": "Flacon en verre 50 ml" } },
      { "label": { "en": "Texture", "fr": "Texture" }, "value": { "en": "Lightweight oil serum", "fr": "Serum huile leger" } },
      { "label": { "en": "Use", "fr": "Usage" }, "value": { "en": "Scalp, edges, lengths", "fr": "Cuir chevelu, tempes, longueurs" } }
    ],
    "trust": [
      { "en": "Secure Stripe checkout", "fr": "Paiement Stripe securise" },
      { "en": "MTN MoMo and Orange Money", "fr": "MTN MoMo et Orange Money" },
      { "en": "WhatsApp order support", "fr": "Assistance commande WhatsApp" },
      { "en": "Bilingual customer journey", "fr": "Parcours client bilingue" }
    ],
    "proof": [
      {
        "label": { "en": "Luxury ritual", "fr": "Rituel luxe" },
        "text": {
          "en": "A low-fragrance, high-polish finish designed for daily use in humid climates.",
          "fr": "Un fini peu parfume et tres soigne, pense pour l usage quotidien en climat humide."
        }
      },
      {
        "label": { "en": "Cameroon ready", "fr": "Pret pour le Cameroun" },
        "text": {
          "en": "Mobile money support, WhatsApp ordering, and delivery-first customer flow.",
          "fr": "Paiement mobile money, commande WhatsApp et parcours client pense pour la livraison."
        }
      },
      {
        "label": { "en": "Card payments", "fr": "Paiements par carte" },
        "text": {
          "en": "Stripe checkout is prepared for cards and global payment methods.",
          "fr": "Stripe Checkout est pret pour cartes et moyens de paiement internationaux."
        }
      }
    ],
    "ritual": [
      {
        "step": { "en": "01", "fr": "01" },
        "title": { "en": "Root comfort", "fr": "Confort racines" },
        "text": {
          "en": "Part hair into sections and apply 2-4 drops directly to areas that feel dry or tight.",
          "fr": "Separez les cheveux et appliquez 2 a 4 gouttes sur les zones seches ou inconfortables."
        }
      },
      {
        "step": { "en": "02", "fr": "02" },
        "title": { "en": "Length polish", "fr": "Brillance longueurs" },
        "text": {
          "en": "Warm a small amount between palms and smooth through mid-lengths and ends.",
          "fr": "Chauffez une petite quantite entre les mains puis lissez les longueurs et pointes."
        }
      },
      {
        "step": { "en": "03", "fr": "03" },
        "title": { "en": "Consistent glow", "fr": "Eclat regulier" },
        "text": {
          "en": "Use three nights per week or as a pre-wash ritual for a richer treatment.",
          "fr": "Utilisez trois soirs par semaine ou avant le shampooing pour un soin plus profond."
        }
      }
    ],
    "ingredients": [
      {
        "name": { "en": "Baobab oil", "fr": "Huile de baobab" },
        "note": {
          "en": "Rich in fatty acids to soften dry strands without a heavy finish.",
          "fr": "Riche en acides gras pour assouplir les longueurs seches sans fini lourd."
        }
      },
      {
        "name": { "en": "Moringa seed oil", "fr": "Huile de moringa" },
        "note": {
          "en": "A polished emollient selected for shine, slip, and daily elegance.",
          "fr": "Un emollient raffine choisi pour la brillance, la glisse et l elegance quotidienne."
        }
      },
      {
        "name": { "en": "Mint botanical note", "fr": "Menthe" },
        "note": {
          "en": "A botanical note chosen for a fresh, invigorating sensorial profile.",
          "fr": "Un classique du rituel cuir chevelu pour une sensation fraiche et tonifiante."
        }
      }
    ],
    "manualPayments": {
      "heading": { "en": "Manual mobile money checkout", "fr": "Paiement mobile money manuel" },
      "intro": {
        "en": "Prefer local payment? Send the exact amount, then WhatsApp your payment screenshot and delivery details for confirmation.",
        "fr": "Vous preferez payer localement ? Envoyez le montant exact, puis partagez la capture et l adresse de livraison sur WhatsApp."
      },
      "methods": [
        {
          "label": "MTN MoMo",
          "number": "+237 6 70 00 00 00",
          "accountName": "FONDJO",
          "instructions": {
            "en": "Use merchant transfer, then include your full name and city in the WhatsApp message.",
            "fr": "Utilisez le transfert marchand, puis envoyez votre nom complet et votre ville sur WhatsApp."
          }
        },
        {
          "label": "Orange Money",
          "number": "",
          "accountName": "FONDJO",
          "instructions": {
            "en": "Use Orange Money transfer and keep the confirmation message until your order is confirmed.",
            "fr": "Utilisez le transfert Orange Money et gardez le message de confirmation jusqu a validation."
          }
        }
      ]
    }
  }'::jsonb
)
on conflict (key) do nothing;
