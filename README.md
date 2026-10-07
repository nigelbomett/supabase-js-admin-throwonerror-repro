# auth.admin methods ignore throwOnError

With `auth: { throwOnError: true }`, `auth.admin.*` methods return
`{ data, error }` on failure where other auth methods throw.

The server is mocked, so no Supabase project or key is needed.

## Run

```bash
npm install
node admin-throwonerror-repro.mjs
```

## Output

```
THREW     auth.signInWithPassword (control)  ->  AuthApiError: User not found
RETURNED  auth.admin.getUserById  ->  AuthApiError: User not found
RETURNED  auth.admin.deleteUser  ->  AuthApiError: User not found
RETURNED  auth.admin.updateUserById  ->  AuthApiError: User not found
RETURNED  auth.admin.listUsers  ->  AuthApiError: User not found
```

Expected: every line says THREW.

## Cause

`GoTrueClient` constructs `GoTrueAdminApi` without passing `throwOnError`,
and `GoTrueAdminApi.ts` never reads the setting.
