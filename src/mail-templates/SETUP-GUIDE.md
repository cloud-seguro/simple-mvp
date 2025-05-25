# Guía de Configuración - Templates de Email para Supabase

Esta guía te ayudará a configurar los templates de email de SIMPLE en tu proyecto de Supabase.

## 📋 Requisitos Previos

- Proyecto de Supabase activo
- Acceso al Dashboard de Supabase
- Permisos de administrador en el proyecto

## 🚀 Configuración Paso a Paso

### 1. Acceder a Email Templates

1. Ve a tu [Dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Authentication** > **Email Templates**

### 2. Configurar Templates de Autenticación

#### Confirm Signup (Confirmación de Registro)

```
Archivo: confirm-signup.html
Uso: Cuando un usuario se registra y necesita confirmar su email
Variables disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Confirm signup** en el dropdown
2. Copia el contenido completo de `confirm-signup.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `Confirma tu cuenta en SIMPLE - ¡Bienvenido! 🎉`

#### Magic Link (Enlace Mágico)

```
Archivo: magic-link.html
Uso: Para login sin contraseña
Variables disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Magic Link** en el dropdown
2. Copia el contenido de `magic-link.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `Tu enlace de acceso a SIMPLE 🔐`

#### Reset Password (Restablecer Contraseña)

```
Archivo: reset-password.html
Uso: Cuando un usuario solicita restablecer su contraseña
Variables disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Reset Password** en el dropdown
2. Copia el contenido de `reset-password.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `Restablecer tu contraseña de SIMPLE 🔑`

#### Invite User (Invitar Usuario)

```
Archivo: invite-user.html
Uso: Para invitar nuevos usuarios a la plataforma
Variables disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Invite User** en el dropdown
2. Copia el contenido de `invite-user.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `¡Te han invitado a SIMPLE! 🎉`

#### Change Email (Cambiar Email)

```
Archivo: change-email.html
Uso: Cuando un usuario cambia su dirección de email
Variables disponibles: {{ .ConfirmationURL }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Change Email Address** en el dropdown
2. Copia el contenido de `change-email.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `Confirma tu nuevo email en SIMPLE 📧`

#### Reauthentication (Reautenticación)

```
Archivo: reauthentication.html
Uso: Cuando un usuario necesita reautenticarse con un código de verificación
Variables disponibles: {{ .Token }}, {{ .SiteURL }}, {{ .Email }}
```

1. Selecciona **Reauthentication** en el dropdown
2. Copia el contenido de `reauthentication.html`
3. Pégalo en el editor
4. Personaliza el **Subject**: `Código de verificación para SIMPLE 🔐`

### 3. Configurar SMTP (Opcional pero Recomendado)

Para una mejor entregabilidad, configura tu propio servidor SMTP:

1. Ve a **Settings** > **Auth** en tu proyecto de Supabase
2. Busca la sección **SMTP Settings**
3. Configura tu proveedor de email (Resend, SendGrid, etc.)

#### Configuración recomendada con Resend:

```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Pass: [tu-api-key-de-resend]
Sender Name: SIMPLE
Sender Email: noreply@tudominio.com
```

### 4. Variables de Personalización

Puedes personalizar estas variables en cada template:

#### Variables de Supabase disponibles:

- `{{ .ConfirmationURL }}` - URL de confirmación
- `{{ .Token }}` - Token de autenticación
- `{{ .TokenHash }}` - Hash del token
- `{{ .SiteURL }}` - URL de tu sitio
- `{{ .Email }}` - Email del usuario
- `{{ .Data }}` - Datos adicionales
- `{{ .RedirectTo }}` - URL de redirección

#### Variables personalizables en los templates:

- URLs de contacto y soporte
- Información de la empresa
- Enlaces a redes sociales
- Términos y condiciones

### 5. Testing y Validación

#### Probar los Templates:

1. En el editor de templates, usa el botón **Send test email**
2. Ingresa un email de prueba
3. Verifica que el email se reciba correctamente
4. Revisa el formato en diferentes clientes de email

#### Checklist de Validación:

- [ ] Los enlaces funcionan correctamente
- [ ] Las imágenes se cargan (si las hay)
- [ ] El diseño es responsive en móvil
- [ ] Los colores coinciden con la marca SIMPLE
- [ ] El texto está en español y sin errores
- [ ] Las variables de Supabase se reemplazan correctamente

### 6. Configuración Avanzada

#### Personalizar el Remitente:

```
Nombre: SIMPLE - Ciberseguridad
Email: noreply@tudominio.com
```

#### Configurar Rate Limiting:

- Limita el número de emails por hora
- Configura cooldowns entre envíos

#### Configurar Redirects:

```javascript
// En tu aplicación Next.js
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
  options: {
    emailRedirectTo: "https://tudominio.com/auth/callback",
  },
});
```

## 🎨 Personalización Adicional

### Cambiar Colores de Marca:

Si necesitas ajustar los colores, modifica estas variables CSS en cada template:

```css
/* Colores principales */
--primary-color: #000000; /* Negro */
--accent-color: #facc15; /* Amarillo */
--background-color: #f8f9fa; /* Gris claro */
--text-color: #333333; /* Gris oscuro */
```

### Añadir Logo Personalizado:

Reemplaza el logo de texto con una imagen:

```html
<!-- Reemplazar esto: -->
<div class="logo-icon">S</div>
<div class="logo-text">SIMPLE</div>

<!-- Por esto: -->
<img src="https://tudominio.com/logo.png" alt="SIMPLE" style="height: 48px;" />
```

## 🔧 Troubleshooting

### Problemas Comunes:

#### Los emails no se envían:

- Verifica la configuración SMTP
- Revisa los logs en Supabase Dashboard
- Confirma que el dominio esté verificado

#### Los enlaces no funcionan:

- Verifica que `{{ .SiteURL }}` esté configurado correctamente
- Confirma las URLs de redirect en tu aplicación

#### Problemas de formato:

- Testa en diferentes clientes de email
- Verifica que el CSS inline esté correcto
- Usa herramientas como Litmus para testing

### Logs y Debugging:

1. Ve a **Logs** en tu Dashboard de Supabase
2. Filtra por **Auth** para ver logs de autenticación
3. Busca errores relacionados con envío de emails

## 📞 Soporte

Si necesitas ayuda adicional:

- Consulta la [documentación oficial de Supabase](https://supabase.com/docs/guides/auth/auth-email-templates)
- Revisa los logs de tu proyecto
- Contacta al equipo de soporte de Supabase

## ✅ Checklist Final

- [ ] Todos los templates están configurados
- [ ] SMTP está configurado (opcional)
- [ ] Se han enviado emails de prueba
- [ ] Los enlaces funcionan correctamente
- [ ] El diseño es responsive
- [ ] Los colores coinciden con la marca
- [ ] Las variables se reemplazan correctamente
- [ ] Los subjects están personalizados
- [ ] Se ha probado en diferentes clientes de email

¡Listo! Tus templates de email de SIMPLE están configurados y listos para usar. 🎉

**Actualizado para 2025**
