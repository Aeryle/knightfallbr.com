import { DISCORD_URL } from "$env/static/private";
import { redirect } from "@sveltejs/kit";

export const load = () => {
  throw redirect(308, DISCORD_URL);
}
