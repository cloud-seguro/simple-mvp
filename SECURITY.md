# Security Implementation

## Protection Against IDOR Vulnerabilities

This application implements a multi-layered approach to prevent Insecure Direct Object Reference (IDOR) vulnerabilities:

### 1. Database-Level Protection with Supabase RLS

Row Level Security (RLS) policies have been implemented in the database to restrict data access at the source:

- Users can only access their own data
- Non-predictable UUIDs are used as primary keys (CUIDs)
- Role-based permissions (FREE, PREMIUM, SUPERADMIN)

To apply RLS policies, run the SQL script at `src/lib/supabase/security/rls_policies.sql`.

### 2. API-Level Authorization

All API endpoints implement authorization checks:

- User validation on every request
- Resource ownership verification
- Role-based access control
- Strict validation of request parameters

The permission verification utilities are in `src/lib/auth/permission-checks.ts`.

### 3. Route Protection Middleware

The application uses middleware to:

- Authenticate all requests to protected routes
- Validate JWT tokens
- Restrict access to sensitive areas
- Track suspicious activity

## Authorization Patterns

### Resource-Based Authorization

For each resource type (profile, evaluation, blog post, etc.), authorization follows these rules:

1. Users can access only their own resources
2. SuperAdmins can access all resources
3. Public access is only allowed to explicitly published resources

### Implementation Pattern

Each API route follows this pattern:

```typescript
// 1. Authenticate the user
const currentUser = await getCurrentUser();
if (!currentUser) {
  return unauthorized();
}

// 2. Verify resource ownership or permission
const hasAccess = await canAccessResource(
  currentUser.id,
  resourceType,
  resourceId
);

if (!hasAccess) {
  return forbidden();
}

// 3. Only then process the request
```

## Security Best Practices

1. Always use non-sequential identifiers (CUIDs/UUIDs)
2. Verify resource ownership on every request
3. Apply principle of least privilege
4. Use multi-layered security (DB + API + client)
5. Keep security checks separate from business logic

## Testing for IDOR Vulnerabilities

Always test API endpoints to verify authorization:

1. Try accessing other users' resources with a different user token
2. Try changing user IDs in requests
3. Test that non-admin users cannot access admin resources
