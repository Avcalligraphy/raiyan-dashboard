# Auth & RBAC Implementation – Todo List

Implement authentication and role-based access control for raiyan-dashboard, aligned with backend-raiyan (permission-based API). Approach: **Auth Context + permissions from API + Private/Public route guards + menu filtered by permission**.

---

## 1. Auth context & storage

- [x] Create auth context (e.g. `src/contexts/AuthContext.tsx` or `src/@core/contexts/AuthContext.tsx`)
  - State: `user`, `permissions` (string[]), `token`, `isAuthenticated`, `isLoading`
  - Methods: `login(payload)`, `logout()`, `setAuth(payload)`, `hasPermission(perm: string)`, `hasAnyPermission(perms: string[])`
  - Implemented: `src/@core/contexts/AuthContext.tsx` + `src/@core/hooks/useAuth.tsx`; `AuthProvider` wired in `Providers.tsx`
- [x] Define where to persist session: e.g. `localStorage` for token + user/permissions (or only token and fetch user on init)
  - Keys: `raiyan_auth_token`, `raiyan_auth_user`, `raiyan_auth_permissions`
- [x] On app init: read token from storage; if present, optionally validate (e.g. GET /me or decode JWT) and set user/permissions in context
  - Restore from localStorage on mount; validation/refresh can be added in a later step
- [x] Clear storage and context on `logout()`

---

## 2. Login flow

- [x] Add API base URL / env (e.g. `VITE_API_URL`) and use it for auth requests
  - Used in `src/services/authService.ts` via `import.meta.env.VITE_API_URL` (e.g. `http://localhost:9091`)
- [x] Create auth API service (e.g. `src/services/authService.ts`): `login(email, password)` calling backend login endpoint
  - `POST ${VITE_API_URL}/api/auth/login` with `{ email, password }`; returns `{ token, user, permissions }` for auth context
- [x] Ensure login response (or subsequent /me) includes **permissions** or role that can be mapped to backend permission strings
  - Backend returns `user.role_id`; `src/configs/permissions.ts` maps `super_admin` role ID to all permissions; other roles get `[]` until backend provides per-role permissions
- [x] In `Login.tsx`: wire form to auth context `login()`; on success redirect to `/` or `state.from`; on error show message
  - Controlled email/password, submit calls `authService.login` then `login(result)`, redirect to `location.state.from.pathname` or `/`, error in `<Alert>`
- [x] Optional: “Remember me” → Remember me — checkbox state wired; persistence uses localStorage (sessionStorage can be added later)

---

## 3. API client & 401 handling

- [x] Create a single API client (axios instance or fetch wrapper) that attaches `Authorization: Bearer <token>` from auth context
  - `src/services/apiClient.ts`: `apiFetch(path, options)`, `apiFetchJson<T>(path, options)`, `getApiUrl()`; token and 401 handler set via `configureApiClient(getToken, on401)`
- [x] On 401: clear auth (logout), redirect to `/login` (and optionally store `from` for post-login redirect)
  - `ApiClientConfig` in Providers calls `configureApiClient` with `() => token` and `() => { logout(); navigate('/login', { state: { from: location }, replace: true }); }`
- [x] Use this client for all backend calls so token and 401 handling are consistent
  - Use `apiFetch` or `apiFetchJson` from `@/services/apiClient` for authenticated requests; `authService.login` keeps raw fetch (no token, no 401 redirect). `getApiUrl()` shared from apiClient.

---

## 4. Route protection (guards)

- [x] Implement **PrivateRoute** (or equivalent): render children only if `isAuthenticated`; otherwise redirect to `/login` and pass `state: { from: location }`
  - `src/components/ProtectedRoute.tsx`: uses useAuth + useLocation; redirects when !isAuthenticated; shows nothing while isLoading
- [x] Implement **PublicRoute** for `/login`: if already authenticated, redirect to `/` (or `from`)
  - `src/components/PublicOnlyRoute.tsx`: redirects to from ?? '/' when isAuthenticated
- [x] Integrate with React Router v7 (`createBrowserRouter`): wrap dashboard routes in a layout/component that uses the guard; keep `/login` (and reset-password if any) as public
  - `src/router/routeWrappers.tsx`: LayoutWithProviders wraps Layout in ProtectedRoute; BlankLayoutWithProviders wraps children in PublicOnlyRoute
- [ ] Optional: per-route permission check (e.g. “user-management” requires `users.read`) and redirect to 403 or `/` if missing

---

## 5. Menu filtering by permission

- [x] Add a `permission` (or `requiredPermission`) field to menu items in `verticalMenuData.tsx` / `horizontalMenuData.tsx` (e.g. `packages.read`, `blog.read`, `users.read`)
- [x] Filter menu items by `hasPermission(item.permission)` (or show all if no permission required) before passing to `GenerateMenu` / navigation
- [x] Ensure default route (e.g. dashboard overview) is visible to all authenticated users or has a permission the backend assigns to everyone
  - Implemented: `permission` on types and menu data; `filterMenuByPermission()` in `src/utils/menuFilter.ts`; filtering applied in `VerticalMenu.tsx` and `HorizontalMenu.tsx`. Overview has no `permission` so all authenticated users see it.

---

## 6. RBAC helpers & constants

- [x] Define permission constants (or reuse backend strings) in one place (e.g. `src/configs/permissions.ts`) so they match backend: `users.read`, `users.write`, `packages.read`, `packages.write`, `blog.read`, `blog.write`, `testimonials.read`, `testimonials.write`, `galleries.read`, `galleries.write`, `audit.read`, etc.
- [x] Expose `hasPermission(perm)` (and optionally `hasAnyPermission(perms)`) from auth context for use in components and menu filter
  - Constants and `Permission` type live in `src/configs/permissions.ts` (single source of truth). Menu types use `permission?: Permission`. Auth context exposes `hasPermission` and `hasAnyPermission`; use via `useAuth()` from `@core/hooks/useAuth`.

---

## 7. UI: hide actions by permission

- [x] In pages that have create/edit/delete (e.g. blog categories, packages, user management), conditionally show buttons or links using `hasPermission('blog.write')`, `hasPermission('users.write')`, etc.
- [x] Optional: disable instead of hide, with tooltip “You don’t have permission”
  - Implemented: `PermissionTooltip` in `src/components/PermissionTooltip.tsx` wraps buttons and disables them when the user lacks the required permission, with a tooltip explaining the missing permission (e.g. “This action requires the users.write permission.”). Applied to Add Customer (users.write), Add Facility / Add Category (blog.write), Add Product / Add Facility / Add Hotel (packages.write), Add Gallery (galleries.write), and Export on Testimonials (testimonials.read with custom tooltip).

---

## 8. User dropdown & logout

- [x] In `UserDropdown.tsx`: use auth context for display name and email (from `user`); call context `logout()` on Logout click instead of only navigating to `/login`
- [x] Ensure logout clears token and storage and redirects to `/login`
  - UserDropdown uses `useAuth()` for `user` and `logout`. Display name = `user?.name ?? user?.email ?? 'User'`, email = `user?.email`. Logout button calls `logout()` then `navigate('/login', { replace: true })`. Auth context `logout()` already clears token, user, permissions and storage.

---

## 9. Testing & edge cases

- [ ] Test: unauthenticated access to `/` redirects to `/login`
- [ ] Test: after login, redirect to `/` or previous `from` URL
- [ ] Test: expired token or 401 triggers logout and redirect to login
- [ ] Test: menu shows only items the user has permission for (e.g. login as different roles if backend supports it)
- [ ] Test: direct URL to a restricted page: either guard by permission and redirect or show “no access” message

---

## 10. Optional improvements

- [ ] Refresh token: if backend supports refresh token, store it and use API client to refresh on 401 before logging out
- [ ] JWT decode: if token contains permissions, decode once and cache in context to avoid extra /me call on reload
- [ ] 403 page: dedicated “You don’t have permission” page when user is authenticated but lacks permission for a route

---

## Backend alignment (reference)

- **Roles**: super_admin, marketing, sales, viewer (backend seed).
- **Permissions**: users.read/write, packages.read/write, blog.read/write, testimonials.read/write, galleries.read/write, audit.read, etc. (backend middleware uses these).
- **Endpoints**: login (returns token + user/role); optionally GET /me or GET /roles, GET /permissions for mapping role → permissions if not in login response.

---

*Last updated: implementation plan for raiyan-dashboard auth + RBAC.*
