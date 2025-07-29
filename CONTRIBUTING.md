# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a **Astro Note Voice AI Starter**! Este template es parte del reto Estrategas de la IA en la comunidad de Web Reactiva, y tu contribución ayuda a mejorar la experiencia de aprendizaje para todos.

## 🚀 Configuración de Desarrollo

### Prerrequisitos

- Node.js 18+ 
- npm/pnpm/yarn
- Cuenta en [Turso](https://turso.tech)
- Git

### Setup Local

1. **Fork y clonar**:
   ```bash
   git clone https://github.com/tu-usuario/astro-note-voice-ai-starter.git
   cd astro-note-voice-ai-starter
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

4. **Migrar base de datos**:
   ```bash
   npx @better-auth/cli@latest migrate
   ```

5. **Iniciar desarrollo**:
   ```bash
   npm run dev
   ```

## 📝 Estándares de Código

### Estructura de Archivos

```
src/
├── components/     # Componentes React reutilizables
├── layouts/        # Layouts de Astro
├── lib/           # Utilidades y configuración
├── pages/         # Páginas de Astro
└── styles/        # Estilos globales
```

### Convenciones de Nombres

- **Componentes React**: `PascalCase.tsx`
- **Páginas Astro**: `kebab-case.astro`
- **Utilidades**: `camelCase.ts`
- **Estilos**: `kebab-case.css`

### TypeScript

- Usar tipos explícitos cuando sea necesario
- Evitar `any`, usar `unknown` si es necesario
- Definir interfaces para props complejas

### Componentes

```tsx
// ✅ Bueno
interface ButtonProps {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export function Button({ variant = "primary", children }: ButtonProps) {
  return <button className={`btn btn-${variant}`}>{children}</button>;
}

// ❌ Evitar
export function Button(props: any) {
  return <button>{props.children}</button>;
}
```

## 🎨 UI Guidelines

### shadcn/ui

- Usar componentes de shadcn/ui cuando sea posible
- Personalizar con Tailwind CSS
- Mantener consistencia visual

### Tailwind CSS

- Usar clases utilitarias
- Crear componentes para patrones repetidos
- Seguir el sistema de diseño existente

## 🔐 Autenticación

### Añadir Nuevas Funciones de Auth

1. **Extender configuración del servidor** (`src/lib/auth.ts`)
2. **Actualizar cliente** (`src/lib/auth-client.ts`)
3. **Crear componentes UI** necesarios
4. **Actualizar tipos** en `src/env.d.ts`

### Ejemplo: Añadir Reset Password

```ts
// src/lib/auth.ts
export const auth = betterAuth({
  // ... configuración existente
  emailVerification: {
    enabled: true,
  },
});
```

## 🗄️ Base de Datos

### Migraciones

- Usar CLI de Better Auth para cambios de esquema
- Documentar cambios importantes
- Testear migraciones en entorno local

### Nuevas Tablas

1. **Definir en configuración de Better Auth**
2. **Generar migración**: `npx @better-auth/cli generate`
3. **Aplicar**: `npx @better-auth/cli migrate`
4. **Documentar cambios**

## 🧪 Testing

### Principios

- Testear funcionalidades críticas
- Usar testing library para componentes React
- Mockear servicios externos

### Estructura

```
tests/
├── components/    # Tests de componentes
├── pages/        # Tests de páginas
├── lib/          # Tests de utilidades
└── fixtures/     # Datos de prueba
```

## 📦 Pull Requests

### Proceso

1. **Fork** el repositorio
2. **Crear branch**: `git checkout -b feature/nueva-funcionalidad`
3. **Desarrollar** con commits descriptivos
4. **Testear** localmente
5. **Push**: `git push origin feature/nueva-funcionalidad`
6. **Crear PR** con descripción detallada

### Template de PR

```markdown
## 📋 Descripción
Breve descripción de los cambios

## 🎯 Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## ✅ Testing
- [ ] Tests existentes pasan
- [ ] Nuevos tests añadidos
- [ ] Testeo manual completado

## 📷 Screenshots
(Si aplica)
```

### Checklist de PR

- [ ] Código sigue las convenciones del proyecto
- [ ] Tests pasan
- [ ] Documentación actualizada
- [ ] No hay console.logs olvidados
- [ ] Variables de entorno documentadas

## 🐛 Reportar Bugs

### Template de Issue

```markdown
## 🐛 Descripción del Bug
Descripción clara del problema

## 🔄 Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '...'
3. Ver error

## ✅ Comportamiento Esperado
Lo que debería pasar

## 📷 Screenshots
(Si aplica)

## 🌍 Entorno
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
```

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
## 🚀 Funcionalidad Propuesta
Descripción clara de la funcionalidad

## 🎯 Problema que Resuelve
¿Qué problema actual resuelve?

## 💡 Solución Propuesta
Cómo debería funcionar

## 🔄 Alternativas Consideradas
Otras soluciones que se evaluaron
```

## 📚 Documentación

### Actualizar Docs

- README.md para cambios generales
- AUTH_README.md para funciones de autenticación
- Comentarios en código para lógica compleja
- JSDoc para funciones públicas

## 🎉 Reconocimientos

Todos los contribuidores aparecerán en:
- README.md
- Página de créditos (cuando esté disponible)
- Releases notes

## 📞 Contacto

- **Issues**: Para bugs y features
- **Discussions**: Para preguntas generales
- **Discord**: [Enlace cuando esté disponible]

---

¡Gracias por contribuir! 🙌
