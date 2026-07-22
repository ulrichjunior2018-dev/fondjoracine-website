-- Align published storefront CMS with Maison Fondjo / Sève Racine branding.
-- Replaces legacy FONDJO Hair Elixir copy and Unsplash OG images.

update public.storefront_content
set
  content = content
    || jsonb_build_object(
      'brand',
      'Maison Fondjo',
      'title',
      jsonb_build_object('en', 'Sève Racine', 'fr', 'Sève Racine'),
      'seo',
      jsonb_build_object(
        'title',
        jsonb_build_object(
          'en',
          'Sève Racine Hair Treatment Oil | Maison Fondjo',
          'fr',
          'Huile capillaire Sève Racine | Maison Fondjo'
        ),
        'description',
        jsonb_build_object(
          'en',
          'Sève Racine is a 100ml hair treatment oil by Maison Fondjo, founded and made in Buea, Cameroon.',
          'fr',
          'Sève Racine est une huile capillaire 100ml par Maison Fondjo, fondée et fabriquée à Buea, Cameroun.'
        )
      ),
      'images',
      jsonb_build_array(
        jsonb_build_object(
          'src',
          '/images/studio.png',
          'width',
          1086,
          'height',
          1448,
          'alt',
          jsonb_build_object(
            'en',
            'Sève Racine bottle in a reflective black studio',
            'fr',
            'Flacon Sève Racine en studio noir réfléchissant'
          )
        ),
        jsonb_build_object(
          'src',
          '/images/product-macro-pipette.png',
          'width',
          1086,
          'height',
          1448,
          'alt',
          jsonb_build_object(
            'en',
            'Sève Racine bottle and pipette macro detail',
            'fr',
            'Macro du flacon Sève Racine et pipette'
          )
        )
      )
    )
    || jsonb_build_object(
      'hero',
      coalesce(content->'hero', '{}'::jsonb)
        || jsonb_build_object(
          'eyebrow',
          jsonb_build_object('en', 'Maison Fondjo Sève Racine', 'fr', 'Maison Fondjo Sève Racine')
        )
    ),
  updated_at = now()
where key = 'fondjo-racine-seve';
