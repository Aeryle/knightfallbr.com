import { redirect } from '@sveltejs/kit'

type Scope =
  | 'identify'
  | 'email'
  | 'connections'
  | 'guilds'
  | 'guilds.join'
  | 'guilds.members.read'
  | 'guilds.channels.read'
  | 'gdm.join'
  | 'bot'
  | 'rpc'
  | 'rpc.notifications.read'
  | 'rpc.voice.read'
  | 'rpc.voice.write'
  | 'rpc.video.read'
  | 'rpc.video.write'
  | 'rpc.screenshare.read'
  | 'rpc.screenshare.write'
  | 'rpc.activities.write'
  | 'webhook.incoming'
  | 'messages.read'
  | 'applications.builds.upload'
  | 'applications.builds.read'
  | 'applications.commands'
  | 'applications.store.update'
  | 'applications.entitlements'
  | 'activities.read'
  | 'activities.write'
  | 'activities.invites.write'
  | 'relationships.read'
  | 'relationships.write'
  | 'voice'
  | 'dm_channels.read'
  | 'role_connections.write'
  | 'presences.read'
  | 'presences.write'
  | 'openid'
  | 'dm_channels.messages.read'
  | 'dm_channels.messages.write'
  | 'gateway.connect'
  | 'account.global_name.update'
  | 'payment_sources.country_code'
  | 'sdk.social_layer_presence'
  | 'sdk.social_layer'
  | 'lobbies.write'
  | 'applications.commands.permissions.update'

export const GET = async ({ locals: { supabase }, url }) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: new URL('/auth/callback', url.origin).toString(),
      scopes: encodeURIComponent((['guilds.join'] satisfies Scope[]).join(' ')),
    },
  })
  if (error) {
    console.error(error)
    throw redirect(303, '/auth/error')
  }

  throw redirect(303, data.url)
}
