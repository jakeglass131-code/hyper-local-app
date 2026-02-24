import { redirect } from "next/navigation";

export default function FavouritesRedirectPage() {
  redirect("/consumer/reservations/favourite-businesses");
}
