import { supabase } from './supabase.js'

export async function addLog(token, event, label = '', abha = '') {
  await supabase.from('access_log').insert({ token, event, label, abha })
}

export async function createConsent({ abha, scopes, label, hours }) {
  const token = Math.random().toString(36).slice(2, 8).toUpperCase()
  const finalLabel = label || 'Unnamed provider'
  const { error } = await supabase.from('consents').insert({
    token,
    abha,
    scopes,
    label: finalLabel,
    expires_at: new Date(Date.now() + hours * 3600000).toISOString(),
  })
  if (error) {
    alert('Error: ' + error.message)
    return null
  }
  await addLog(token, 'granted', finalLabel, abha)
  return token
}

function convert(row) {
  return {
    token: row.token,
    abha: row.abha,
    scopes: row.scopes,
    label: row.label,
    expiresAt: row.expires_at,
    revoked: row.revoked,
  }
}

export async function getConsent(token) {
  const { data } = await supabase.from('consents').select('*').eq('token', token).maybeSingle()
  return data ? convert(data) : null
}

export async function getAllConsents(abha) {
  const { data } = await supabase
    .from('consents')
    .select('*')
    .eq('abha', abha)
    .order('created_at', { ascending: false })
  return (data || []).map(convert)
}

export async function revokeConsent(token, abha) {
  await supabase.from('consents').update({ revoked: true }).eq('token', token)
  await addLog(token, 'revoked', '', abha)
}

export async function getLog(abha) {
  const { data } = await supabase
    .from('access_log')
    .select('*')
    .eq('abha', abha)
    .order('created_at', { ascending: false })
    .limit(50)
  return (data || []).map((r) => ({ token: r.token, event: r.event, label: r.label, time: r.created_at }))
}

export async function addUpdate(token, abha, text) {
  await supabase.from('updates').insert({ token, abha, text })
}

export async function getUpdates(abha) {
  const { data } = await supabase
    .from('updates')
    .select('*')
    .eq('abha', abha)
    .order('created_at', { ascending: false })
    .limit(20)
  return data || []
}