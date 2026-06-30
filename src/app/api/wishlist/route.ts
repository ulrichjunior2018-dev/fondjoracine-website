import { wishlistItemSchema } from "@/domain/commerce/schemas";
import { fail, ok } from "@/lib/api/responses";
import { parseJsonBody } from "@/lib/api/request";
import { requireApiUser } from "@/lib/auth/rbac";
import {
  addWishlistItem,
  getWishlist,
  removeWishlistItem,
} from "@/services/commerce/wishlist-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { supabase, user } = await requireApiUser();
    const wishlist = await getWishlist(supabase, user);

    return ok({ wishlist });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJsonBody(request, wishlistItemSchema);
    const { supabase, user } = await requireApiUser();
    const wishlist = await addWishlistItem(supabase, user, input);

    return ok({ wishlist }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const input = await parseJsonBody(request, wishlistItemSchema);
    const { supabase, user } = await requireApiUser();
    const wishlist = await removeWishlistItem(supabase, user, input);

    return ok({ wishlist });
  } catch (error) {
    return fail(error);
  }
}
