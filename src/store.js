import { supabase } from './supabase.js'

export async function addLog(token, event, label = '') {
  await supabase.from('access_log').insert({ token, event, label })
}

export async function createConsent({ scopes, label, hours }) {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase()
  const finalLabel = label || 'Unnamed provider'
  const { error } = await supabase.from('consents').insert({
    token,
    scopes,
    label: finalLabel,
    expires_at: new Date(Date.now() + hours * 3600000).toISOString(),
  })
  if (error) {
    alert('Error: ' + error.message)
    return null
  }
  await addLog(token, 'granted', finalLabel)
  return token
}

function convert(row) {
  return {
    token: row.token,
    scopes: row.scopes,
    label: row.label,
    expiresAt: row.expires_at,
    revoked: row.revoked,
  }
}

export async function getConsent(token) {
  const { data } = await supabase
    .from('consents')
    .select('*')
    .eq('token', token)
    .maybeSingle()
  return data ? convert(data) : null
}

export async function getAllConsents() {
  const { data } = await supabase
    .from('consents')
    .select('*')
    .order('created_at', { ascending: false })
  return (data || []).map(convert)
}

export async function revokeConsent(token) {
  await supabase.from('consents').update({ revoked: true }).eq('token', token)
  await addLog(token, 'revoked')
}

export async function getLog() {
  const { data } = await supabase
    .from('access_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data || []).map((r) => ({
    token: r.token,
    event: r.event,
    label: r.label,
    time: r.created_at,
  }))
}