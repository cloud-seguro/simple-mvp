import matter from "gray-matter";
import { format } from "date-fns";
import es from "date-fns/locale/es";

// Define the BlogPost type
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: string;
};

// Mock data for blog posts
const MOCK_POSTS: Record<
  string,
  {
    content: string;
    data: {
      title: string;
      date: string;
      excerpt: string;
      author?: string;
      coverImage?: string;
      tags?: string[];
    };
  }
> = {
  "mejores-practicas-de-seguridad-informatica": {
    content: `# 5 Mejores Prácticas de Seguridad Informática para Empresas

La seguridad informática se ha convertido en una prioridad para cualquier empresa, independientemente de su tamaño o sector. En un mundo donde las amenazas cibernéticas evolucionan constantemente, proteger la información y los sistemas es crucial para garantizar la continuidad del negocio.

En este artículo, exploraremos cinco mejores prácticas de seguridad que toda empresa debería implementar para fortalecer su postura de seguridad.

## 1. Implementar autenticación multifactor (MFA)

La autenticación multifactor (MFA) añade una capa adicional de seguridad al proceso de inicio de sesión, requiriendo que los usuarios proporcionen dos o más verificaciones para acceder a sus cuentas.

\`\`\`javascript
// Ejemplo de implementación básica de MFA en una aplicación
function login(username, password, mfaCode) {
  // Verificar credenciales
  if (verifyCredentials(username, password)) {
    // Verificar código de autenticación
    if (verifyMfaCode(username, mfaCode)) {
      return grantAccess();
    }
  }
  return denyAccess();
}
\`\`\`

**Beneficios de MFA:**
- Reduce significativamente el riesgo de accesos no autorizados
- Protege contra ataques de phishing
- Cumple con requisitos regulatorios en muchas industrias

## 2. Establecer una política de gestión de parches

Mantener el software actualizado es una de las formas más efectivas de prevenir brechas de seguridad.`,
    data: {
      title: "5 Mejores Prácticas de Seguridad Informática para Empresas",
      date: "2023-03-15",
      excerpt:
        "Descubre las mejores prácticas de seguridad informática que toda empresa debería implementar para proteger sus datos y sistemas.",
      author: "SIMPLE",
      coverImage: "/blog/security-best-practices.jpg",
      tags: ["Ciberseguridad", "Mejores Prácticas", "Empresas"],
    },
  },
  "ransomware-prevencion-y-respuesta": {
    content: `# Ransomware: Cómo Prevenir y Responder a Ataques

El ransomware sigue siendo una de las amenazas más devastadoras para organizaciones de todos los tamaños. Este tipo de malware cifra los datos de la víctima y exige un rescate a cambio de la clave de descifrado. En este artículo, exploramos estrategias para prevenir ataques de ransomware y pasos a seguir si tu organización es afectada.

## ¿Qué es el ransomware?

El ransomware es un tipo de software malicioso que cifra los archivos del sistema atacado, haciendo que sean inaccesibles para los usuarios legítimos. Los atacantes luego exigen un pago (generalmente en criptomonedas) a cambio de la clave que permite descifrar los archivos.

Los ataques de ransomware generalmente se propagan a través de:

* Correos electrónicos de phishing
* Vulnerabilidades de seguridad no parcheadas
* Descargas maliciosas
* Conexiones de Escritorio Remoto (RDP) expuestas
* Ingeniería social`,
    data: {
      title: "Ransomware: Cómo Prevenir y Responder a Ataques",
      date: "2023-06-22",
      excerpt:
        "Aprende estrategias efectivas para prevenir ataques de ransomware y cómo responder si tu organización es víctima de uno.",
      author: "SIMPLE",
      coverImage: "/blog/ransomware-protection.jpg",
      tags: ["Ransomware", "Prevención", "Respuesta a Incidentes"],
    },
  },
};

export function getPostSlugs(): string[] {
  return Object.keys(MOCK_POSTS);
}

export function getPostBySlug(slug: string): BlogPost {
  try {
    const realSlug = slug.replace(/\.mdx$/, "");

    // Check if post exists in our mock data
    if (!MOCK_POSTS[realSlug]) {
      throw new Error(`Post not found: ${realSlug}`);
    }

    const { content, data } = MOCK_POSTS[realSlug];

    // Validate required fields
    if (!data.title || !data.date) {
      throw new Error(
        `Post ${realSlug} is missing required frontmatter fields (title, date)`
      );
    }

    // Calculate reading time (rough estimate: 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readingTime = `${Math.ceil(wordCount / 200)} min`;

    // Format the date
    const date = new Date(data.date);
    const formattedDate = format(date, "MMMM dd, yyyy", { locale: es });

    return {
      slug: realSlug,
      title: data.title,
      date: data.date,
      formattedDate,
      excerpt: data.excerpt || "",
      content,
      author: data.author || "SIMPLE",
      coverImage: data.coverImage,
      tags: data.tags || [],
      readingTime,
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    throw error; // Re-throw to let calling code handle it
  }
}

export function getAllPosts(): BlogPost[] {
  try {
    const slugs = getPostSlugs();
    const posts = slugs
      .map((slug) => getPostBySlug(slug))
      // Sort posts by date in descending order
      .sort((post1, post2) =>
        new Date(post1.date) > new Date(post2.date) ? -1 : 1
      );

    return posts;
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}
