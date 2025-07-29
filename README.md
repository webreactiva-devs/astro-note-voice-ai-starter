# 🎙️ Astro Note Voice AI Starter

> Versión de la plantilla sin la Autenticación generada. Sigue la propuesta del reto para crearla.

Descarga esta rama directamente:
````
git clone \
  --single-branch \
  --branch start-without-auth \
  https://github.com/webreactiva-devs/astro-note-voice-ai-starter.git
````

**Astro Note Voice AI Starter** es un template base para crear aplicaciones modernas de notas con inteligencia artificial y reconocimiento de voz. Este proyecto utiliza **Astro**, **React**, **Turso** y **shadcn/ui** como base tecnológica.

Este starter es tu punto de partida para el **reto Estrategas de la IA** en la comunidad de suscriptores de **[Web Reactiva](https://webreactiva.com)**, donde aprenderás a integrar tecnologías modernas para construir aplicaciones web potentes y escalables.

## 🎯 Tu Misión

En este proyecto aprenderás a implementar:

1. 🔐 **Sistema de autenticación completo** con Better Auth
2. 📝 **Gestión de notas** con interfaz moderna
3. 🎙️ **Reconocimiento de voz** para crear notas
4. 🤖 **Integración con IA** para procesar contenido
5. 🗄️ **Persistencia de datos** con Turso/LibSQL

## ✨ Lo que ya tienes configurado

- 🎨 **Interface base** con shadcn/ui y Tailwind CSS
- 🗄️ **Conexión a base de datos** Turso/LibSQL configurada
- 🧩 **Componentes base** con TypeScript
- 🚀 **Estructura del proyecto** optimizada con Astro
- 📱 **Diseño responsivo** preparado

## 🛠️ Stack Tecnológico

- **Runtime**: [Node.js](https://nodejs.org/) - v18.20.8, v20.3.0, v22.0.0 o superior *(v19 y v21 no son compatibles)*
- **Framework**: [Astro](https://astro.build/) - Generador de sitios web moderno
- **Frontend**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Base de datos**: [Turso](https://turso.tech/) - Base de datos SQLite distribuida
- **Query Builder**: [Kysely](https://kysely.dev/) - Constructor de consultas SQL type-safe

## 🚀 Configuración Inicial

### 1. Clonar el repositorio

```bash
git clone https://github.com/webreactiva-devs/astro-note-voice-ai-starter.git
cd astro-note-voice-ai-starter
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos Turso

1. **Crear cuenta en [Turso](https://turso.tech)**
2. **Crear una nueva base de datos**:
   ```bash
   turso db create tu-proyecto-notes
   ```
3. **Obtener la URL de conexión**:
   ```bash
   turso db show tu-proyecto-notes
   ```
4. **Crear token de autenticación**:
   ```bash
   turso db tokens create tu-proyecto-notes
   ```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Turso Database Configuration
TURSO_DATABASE_URL=libsql://tu-database-url.turso.io
TURSO_AUTH_TOKEN=tu-token-de-turso

# Configuraciones adicionales que añadirás más adelante
# BETTER_AUTH_SECRET=tu-clave-secreta-aqui
# BETTER_AUTH_URL=http://localhost:4321
# PUBLIC_BETTER_AUTH_URL=http://localhost:4321
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

🎉 **¡Listo para comenzar!** La aplicación base estará disponible en `http://localhost:4321`

## 📁 Estructura del Proyecto

```
📦 astro-note-voice-ai-starter/
├── 📂 src/
│   ├── 📂 components/           # Componentes React
│   │   ├── 📂 ui/              # Componentes shadcn/ui
│   │   └── 📄 Button.astro     # Componente base
│   ├── 📂 layouts/
│   │   └── 📄 main.astro       # Layout principal
│   ├── 📂 lib/
│   │   ├── 📄 turso.ts         # Configuración Turso
│   │   └── 📄 utils.ts         # Utilidades
│   ├── 📂 pages/
│   │   ├── 📂 api/
│   │   │   └── 📄 db-health.ts # Endpoint de salud DB
│   │   ├── 📄 index.astro      # Página principal
│   │   └── 📄 markdown-page.md # Ejemplo markdown
│   ├── 📂 styles/
│   │   └── 📄 global.css       # Estilos globales
│   └── 📄 env.d.ts            # Tipos TypeScript
├── 📂 documents/               # Documentación del proyecto
│   ├── 📄 project-plan.md      # Plan del proyecto
│   └── 📄 project-specs.md     # Especificaciones
├── 📄 astro.config.mjs         # Configuración Astro
├── 📄 tailwind.config.js       # Configuración Tailwind
├── 📄 components.json          # Configuración shadcn/ui
└── 📄 package.json
```


## 🌐 Endpoints Disponibles

| Ruta             | Descripción                      | Estado  |
| ---------------- | -------------------------------- | ------- |
| `/`              | Página principal                 | ✅ Listo |
| `/api/db-health` | Health check de la base de datos | ✅ Listo |
| `/markdown-page` | Ejemplo de página markdown       | ✅ Listo |

## 🔧 Herramientas Incluidas

### Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build para producción
npm run preview         # Preview del build

# Utilidades
npx shadcn@latest add [comp]     # Añadir componente UI
```

### Base de Datos

La conexión a Turso ya está configurada en `src/lib/turso.ts`. Puedes probar la conexión visitando `/api/db-health`.

### Componentes UI

shadcn/ui está preconfigurado. Añade nuevos componentes con:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
```

## 📚 Recursos para tu desarrollo

- [📖 Documentación de Astro](https://docs.astro.build)
- [🔐 Better Auth Docs](https://better-auth.com) - Para la autenticación
- [🎨 shadcn/ui Components](https://ui.shadcn.com) - Componentes UI
- [🗄️ Turso Documentation](https://docs.turso.tech) - Base de datos
- [⚡ Kysely Query Builder](https://kysely.dev) - Constructor de consultas
- [🎙️ Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Reconocimiento de voz

## 💡 Consejos para comenzar

1. **Empieza por la autenticación**: Es la base de tu aplicación
2. **Usa los documentos**: Revisa `documents/` para entender el proyecto
3. **Prueba la DB**: Visita `/api/db-health` para verificar la conexión
4. **Componentes graduales**: Añade shadcn/ui components según los necesites
5. **Commit frecuente**: Guarda tu progreso paso a paso

## 🤝 Contribuir

¿Has completado funcionalidades? ¡Comparte tu progreso!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**🎯 ¡Tu aventura de desarrollo comienza aquí!** 

> 💡 **Recuerda**: Este es tu proyecto para aprender. No hay prisa, cada funcionalidad que implementes te hará mejor desarrollador. ¡Disfruta el proceso!
