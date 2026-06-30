import type { SupabaseClient } from "@supabase/supabase-js";

import type { CreateProductInput } from "@/domain/commerce/schemas";
import type { Category, Collection, ProductDetail, ProductSummary } from "@/domain/commerce/types";
import { AppError } from "@/lib/errors/app-error";

const productSelect = `
  id,
  title,
  slug,
  subtitle,
  status,
  seo_title,
  seo_description,
  product_variants (
    id,
    title,
    sku,
    price_cents,
    compare_at_price_cents,
    currency,
    is_active
  ),
  product_images (
    id,
    url,
    alt,
    position
  )
`;

const productDetailSelect = `
  id,
  title,
  slug,
  subtitle,
  description,
  status,
  ingredients,
  usage_instructions,
  seo_title,
  seo_description,
  product_variants (
    id,
    title,
    sku,
    price_cents,
    compare_at_price_cents,
    currency,
    is_active
  ),
  product_images (
    id,
    url,
    alt,
    position
  ),
  reviews (
    id,
    rating,
    title,
    body,
    is_verified_purchase,
    created_at
  )
`;

type ProductListOptions = {
  category?: string | undefined;
  collection?: string | undefined;
  limit: number;
  offset: number;
  q?: string | undefined;
};

async function resolveProductIdsForFilter(supabase: SupabaseClient, options: ProductListOptions) {
  const productIds = new Set<string>();
  let constrained = false;

  if (options.category) {
    constrained = true;
    const { data, error } = await supabase
      .from("product_categories")
      .select("product_id, categories!inner(slug)")
      .eq("categories.slug", options.category)
      .returns<{ product_id: string }[]>();

    if (error) {
      throw new AppError("INTERNAL", "Unable to filter products by category.", { expose: false });
    }

    data.forEach((item) => productIds.add(item.product_id));
  }

  if (options.collection) {
    constrained = true;
    const { data, error } = await supabase
      .from("collection_products")
      .select("product_id, collections!inner(slug)")
      .eq("collections.slug", options.collection)
      .returns<{ product_id: string }[]>();

    if (error) {
      throw new AppError("INTERNAL", "Unable to filter products by collection.", { expose: false });
    }

    const collectionIds = new Set(data.map((item) => item.product_id));

    if (productIds.size > 0) {
      [...productIds].forEach((productId) => {
        if (!collectionIds.has(productId)) {
          productIds.delete(productId);
        }
      });
    } else {
      collectionIds.forEach((productId) => productIds.add(productId));
    }
  }

  if (constrained && productIds.size === 0) {
    return [];
  }

  return constrained ? [...productIds] : null;
}

export async function listProducts(supabase: SupabaseClient, options: ProductListOptions) {
  const productIds = await resolveProductIdsForFilter(supabase, options);

  if (productIds && productIds.length === 0) {
    return [];
  }

  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("status", "active")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(options.offset, options.offset + options.limit - 1);

  if (options.q) {
    query = query.ilike("title", `%${options.q}%`);
  }

  if (productIds) {
    query = query.in("id", productIds);
  }

  const { data, error } = await query.returns<ProductSummary[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to list products.", { expose: false });
  }

  return data;
}

export async function getProductBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(productDetailSelect)
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle<ProductDetail>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load product.", { expose: false });
  }

  if (!data) {
    throw new AppError("NOT_FOUND", "Product not found.");
  }

  return data;
}

export async function listRelatedProducts(
  supabase: SupabaseClient,
  product: ProductSummary,
  limit = 4,
) {
  const products = await listProducts(supabase, { limit: limit + 1, offset: 0 });

  return products.filter((item) => item.id !== product.id).slice(0, limit);
}

export async function getCollectionBySlug(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, hero_image_url, position")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<Collection>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to load collection.", { expose: false });
  }

  if (!data) {
    throw new AppError("NOT_FOUND", "Collection not found.");
  }

  return data;
}

export async function listCollections(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, description, hero_image_url, position")
    .eq("is_active", true)
    .order("position")
    .returns<Collection[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to list collections.", { expose: false });
  }

  return data;
}

export async function listCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, parent_id, name, slug, description, image_url, position")
    .eq("is_active", true)
    .order("position")
    .returns<Category[]>();

  if (error) {
    throw new AppError("INTERNAL", "Unable to list categories.", { expose: false });
  }

  return data;
}

export async function createProduct(supabase: SupabaseClient, input: CreateProductInput) {
  const { variants, ...product } = input;

  const { data: createdProduct, error: productError } = await supabase
    .from("products")
    .insert(product)
    .select("id, title, slug")
    .single<{ id: string; title: string; slug: string }>();

  if (productError) {
    throw new AppError("BAD_REQUEST", productError.message);
  }

  const { error: variantError } = await supabase.from("product_variants").insert(
    variants.map((variant) => ({
      ...variant,
      product_id: createdProduct.id,
    })),
  );

  if (variantError) {
    throw new AppError("BAD_REQUEST", variantError.message);
  }

  return createdProduct;
}
