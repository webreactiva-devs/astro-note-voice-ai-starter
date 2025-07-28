# Requisitos Técnicos: Aplicación de Notas de Voz

## 1. Resumen del Proyecto

El objetivo es crear una aplicación web (Single Page Application) que permita a los usuarios grabar notas de voz, transcribirlas automáticamente usando IA, y luego clasificar y almacenar el texto resultante para su posterior consulta y gestión.

## 2. Stack Tecnológico

-   **Framework Principal**: [Astro](https://astro.build/) (para la construcción del sitio y la gestión de API Routes).
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/).
-   **Frontend y Estilos**:
    -   [Tailwind CSS](https://tailwindcss.com/) (para el diseño y la maquetación).
    -   [Shadcn/ui](https://ui.shadcn.com/) (para componentes de UI pre-construidos y accesibles).
-   **API de IA**: [Groq](https://groq.com/) (para la transcripción de audio a texto y la generación de títulos/tags).
-   **Base de Datos**: [SQLite](https://www.sqlite.org/index.html) alojada en [Turso](https://turso.tech/).
-   **Autenticación**: [Better-Auth](https://github.com/pilcrowonpaper/better-auth) (o una librería similar compatible con el stack).

## 3. Flujo de Usuario y Requisitos Funcionales

### 3.1. Autenticación de Usuario

1.  El acceso a la funcionalidad principal de la aplicación requiere que el usuario esté autenticado.
2.  Se deben ofrecer dos métodos de autenticación:
    -   **Autenticación por email**: El flujo clásico de registro/login con correo y contraseña.
    -   **Autenticación social**: Se debe implementar, como mínimo, el login a través de **GitHub**.

### 3.2. Pantalla de Grabación de Audio

1.  Una vez autenticado, el usuario accede a la pantalla principal de grabación.
2.  La interfaz debe contener:
    -   Un **botón de "Grabar"** principal para iniciar la captura de audio.
    -   Un **visualizador de onda de audio** (waveform) en tiempo real para dar feedback al usuario de que el micrófono está capturando sonido.
    -   Un **botón de "Pausar"** para detener temporalmente la grabación.
    -   Un **botón de "Parar/Terminar"** para finalizar la grabación por completo.
3.  **Contador de tiempo**:
    -   Se debe mostrar un contador de tiempo visible durante la grabación.
    -   La grabación estará **limitada a un máximo de 2 minutos** (120 segundos).
    -   El contador debe ser una cuenta atrás desde los 2 minutos. Al llegar a cero, la grabación se detiene automáticamente.

### 3.3. Proceso de Transcripción

1.  Al detener la grabación, el audio capturado se mantiene en el cliente.
2.  El usuario tiene las siguientes opciones antes de transcribir:
    -   **Reproducir** el audio grabado para verificarlo.
    -   **Descargar** el fichero de audio (.webm o .mp3).
    -   **Enviar a transcribir**.
3.  Al pulsar "Enviar a transcribir", el fichero de audio se envía a un endpoint de la API de Astro.
4.  Este endpoint se comunicará con la **API de Groq** para realizar la transcripción de audio a texto.
5.  La UI debe mostrar un estado de carga (loading) mientras se espera la respuesta de la transcripción.

### 3.4. Edición y Almacenamiento de la Nota

1.  Una vez recibida la transcripción, se mostrará en un **Popup/Modal**.
2.  El usuario podrá **editar el texto transcrito** directamente en este modal para corregir posibles errores.
3.  Al pulsar el botón **"Guardar"**, se desencadenan las siguientes acciones:
    -   **Llamada a la IA (Groq)**: Se envía el texto final (editado por el usuario) a la API de Groq para realizar dos tareas:
        1.  Generar un **título** conciso y relevante para la nota.
        2.  Generar una lista de **tags/categorías** relacionadas con el contenido.
    -   **Almacenamiento en Base de Datos**: Se guarda una nueva entrada en la tabla notes de la base de datos (Turso) con la siguiente información:
        -   ID del usuario activo (user_id).
        -   El texto final de la transcripción (content).
        -   El título generado por la IA (title).
        -   Los tags generados por la IA (tags).
        -   La fecha y hora de creación (created_at).

### 3.5. Dashboard y Visualización de Notas

1.  El usuario tendrá acceso a un Dashboard donde se listarán todas sus notas guardadas.
2.  Las notas deben aparecer **ordenadas** (por ejemplo, cronológicamente de forma descendente).
3.  El dashboard debe incluir funcionalidades de filtrado y búsqueda:
    -   Un **buscador de texto** para buscar por el **título** de las notas.
    -   Filtros para visualizar notas por **fecha** y/o por **categoría/tag**.

## 4. Modelo de Datos (Esquema de la Base de Datos)

Se necesitarán al menos dos tablas principales. La tabla users será gestionada por la librería de autenticación. La tabla notes la definiremos nosotros.

**Tabla: notes**

| Nombre de Columna | Tipo de Dato  | Descripción                                                                  |
| ----------------- | ------------- | ---------------------------------------------------------------------------- |
| id                | INTEGER/UUID  | Clave primaria de la nota.                                                   |
| user_id           | TEXT/UUID     | Clave foránea que referencia al usuario propietario de la nota.              |
| title             | TEXT          | Título de la nota, generado por la IA.                                       |
| content           | TEXT          | El contenido completo de la transcripción, posiblemente editado por el user. |
| tags              | TEXT (JSON)   | Un string JSON o texto delimitado por comas con los tags generados.          |
| created_at        | DATETIME/TEXT | Timestamp de cuándo se guardó la nota.                                       |

## 5. Endpoints de la API (Rutas de Astro)

Se proponen los siguientes endpoints a crear en el directorio /pages/api/.

-   POST /api/transcribe
    -   **Request**: FormData con el fichero de audio (blob).
    -   **Acción**: Envía el audio a la API de Groq.
    -   **Response**: JSON con el texto transcrito. { "transcription": "..." }.

-   POST /api/notes
    -   **Request**: JSON con el texto final. { "text": "..." }.
    -   **Acción**:
        1.  Llama a la API de Groq para generar título y tags.
        2.  Guarda la nota completa (user_id, título, texto, tags, fecha) en la base de datos de Turso.
    -   **Response**: JSON con la nota creada o un mensaje de éxito.

-   GET /api/notes
    -   **Request**: Petición GET autenticada. Puede aceptar parámetros de query para filtrar (?tag=..., ?q=...).
    -   **Acción**: Consulta la base de datos para obtener todas las notas del usuario logueado.
    -   **Response**: JSON con un array de objetos de nota.

## 6. Requisitos No Funcionales y Consideraciones

-   **No almacenamiento de audio**: La aplicación **no guardará los ficheros de audio** en el servidor ni en la base de datos. Se procesan y se descartan. El usuario solo tiene la opción de descargarlos en el cliente antes de la transcripción.
-   **Plan Gratuito**: El límite de 2 minutos de grabación está pensado para asegurar que el uso de la API de IA se mantenga dentro de los límites de un posible plan gratuito.
-   **Feedback de UI**: Es crucial proporcionar feedback visual constante al usuario (estados de carga, notificaciones de éxito/error, visualización de la onda de audio) para una buena experiencia de usuario.
-   **Seguridad**: Todas las rutas de la API que manejan datos de usuario deben estar protegidas y solo ser accesibles por usuarios autenticados.