# Mail Templates for SIMPLE

This directory contains email templates for Supabase authentication and other email communications that match the SIMPLE brand identity.

## Brand Guidelines

- **Primary Color**: Black (#000000)
- **Accent Color**: Yellow (#facc15, #ffca28)
- **Typography**: Clean, modern sans-serif
- **Style**: Minimalist, professional

## Templates Included

### Authentication Templates

- `confirm-signup.html` - Email confirmation for new user registration
- `invite-user.html` - User invitation email
- `magic-link.html` - Magic link login email
- `change-email.html` - Email change confirmation
- `reset-password.html` - Password reset email
- `reauthentication.html` - Re-authentication verification code

### Notification Templates

- `welcome.html` - Welcome email for new users
- `evaluation-results.html` - Evaluation results notification
- `subscription-update.html` - Subscription changes notification

## How to Use with Supabase

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Email Templates
3. Select the template type you want to customize
4. Copy the HTML content from the corresponding file in this directory
5. Paste it into the Supabase template editor
6. Update any placeholder variables as needed

## Template Variables

Supabase provides these variables that you can use in your templates:

- `{{ .ConfirmationURL }}` - Confirmation link
- `{{ .Token }}` - Authentication token
- `{{ .TokenHash }}` - Token hash
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .Data }}` - Additional data object
- `{{ .RedirectTo }}` - Redirect URL

## Customization

All templates are designed to be responsive and work across different email clients. The inline CSS ensures maximum compatibility.

To customize:

1. Update colors in the CSS variables section
2. Modify the logo and branding elements
3. Adjust content and messaging as needed
4. Test across different email clients

## Testing

Before deploying:

1. Test templates in Supabase's preview feature
2. Send test emails to different email providers
3. Check rendering on mobile and desktop
4. Verify all links work correctly

**Last updated: 2025**
