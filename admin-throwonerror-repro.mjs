// auth.admin.* ignores throwOnError. No Supabase project needed: the server is mocked.
// Setup:  npm install
// Run:    node admin-throwonerror-repro.mjs
import { createClient } from '@supabase/supabase-js'

// Every request gets the same 404 "user not found" error back.
const mockFetch = async () =>
  new Response(JSON.stringify({ code: 404, error_code: 'user_not_found', msg: 'User not found' }), {
    status: 404,
    headers: { 'content-type': 'application/json' },
  })

const supabase = createClient('http://localhost:54321', 'test-key', {
  auth: { throwOnError: true, autoRefreshToken: false, persistSession: false },
  global: { fetch: mockFetch },
})

const id = '00000000-0000-0000-0000-000000000000'
const cases = [
  ['auth.signInWithPassword (control)', () => supabase.auth.signInWithPassword({ email: 'a@b.co', password: 'x' })],
  ['auth.admin.getUserById', () => supabase.auth.admin.getUserById(id)],
  ['auth.admin.deleteUser', () => supabase.auth.admin.deleteUser(id)],
  ['auth.admin.updateUserById', () => supabase.auth.admin.updateUserById(id, { email: 'a@b.co' })],
  ['auth.admin.listUsers', () => supabase.auth.admin.listUsers()],
]

for (const [label, call] of cases) {
  try {
    const { error } = await call()
    console.log(`RETURNED  ${label}  ->  ${error?.name}: ${error?.message}`)
  } catch (e) {
    console.log(`THREW     ${label}  ->  ${e.name}: ${e.message}`)
  }
}
console.log('\nExpected with throwOnError: true -> every line says THREW.')
