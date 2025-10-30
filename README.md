#  PrepAI - Tu Entrenador de Entrevistas con IA

## Descripción general

**PrepAI** es un agente interactivo diseñado para ayudar a los ingenieros de software a prepararse para entrevistas técnicas. La aplicación resuelve el problema de la falta de práctica estructurada y feedback personalizado, guiando a los usuarios a través de un flujo de estudio, evaluando su rendimiento con simulaciones y permitiendo el seguimiento de su progreso.

Este proyecto utiliza la API de **Google Gemini** para generar contenido dinámico y personalizado, como temas de estudio, explicaciones, preguntas de entrevista y feedback.

## Enlace de la aplicación

[Ver la app en Google AI Studio](https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221RhKi5Q1pVlIn5ZnIA65GrdqSok0nduML%22%5D,%22action%22:%22open%22,%22userId%22:%22101312042603741897089%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing)

## Características principales

-   **Generación de Temas Personalizados**: Crea una lista de temas de estudio relevantes basada en el rol de ingeniería especificado por el usuario.
-   **Revisión Guiada de Conceptos**: Ofrece explicaciones detalladas, conceptos clave, casos de uso y ejemplos de código para cada tema.
-   **Simulación de Entrevistas**: Realiza entrevistas de opción múltiple con un número de preguntas configurable.
-   **Feedback Instantáneo con IA**: Proporciona un análisis de fortalezas, áreas de mejora y recursos de estudio sugeridos después de cada simulación.
-   **Sugerencias de Carrera**: Recomienda roles alternativos de alta demanda basados en las habilidades del perfil seleccionado.
-   **Seguimiento de Progreso**: Guarda los resultados de cada entrevista en una hoja de cálculo de Google Sheets para un seguimiento a largo plazo.

## Tecnologías utilizadas

-   **Google AI Studio**: Plataforma de desarrollo y hosting de la aplicación.
-   **Google Gemini API (`gemini-2.5-flash`)**: Modelo de IA para la generación de todo el contenido.
-   **React & TypeScript**: Para la construcción de la interfaz de usuario.
-   **Tailwind CSS**: Para el diseño y estilo de la aplicación.
-   **Google Apps Script & Google Sheets**: Para la automatización y almacenamiento de datos.
-   **Zapier**: Para la automatización de flujos de trabajo (envío de correos).

## Configuración del proyecto

Para replicar y ejecutar este proyecto, sigue estos pasos:

1.  **Clonar o Duplicar el Proyecto**: Abre este proyecto en Google AI Studio y crea tu propia copia.
2.  **Configurar la API de Google Sheets**: La aplicación guarda el progreso en una hoja de cálculo. Para que funcione, necesitas configurar un backend simple con Google Apps Script.
    -   Crea una nueva **Hoja de Cálculo** en Google Sheets con las siguientes columnas en la primera fila: `timestamp`, `userName`, `email`, `role`, `topics`, `score`, `result`, `areasToReinforce`.
    -   Ve a `Extensiones > Apps Script`.
    -   Pega el código de un script que acepte peticiones `POST` para agregar filas a la hoja. Puedes encontrar ejemplos de este tipo de script en la web.
    -   **Implementa** el script como una **aplicación web**, otorgando acceso a "cualquier usuario".
    -   Copia la URL de la aplicación web implementada.
3.  **Actualizar la URL en el Código**: Abre el archivo `services/googleSheetsService.ts` y reemplaza el valor de la constante `GOOGLE_SCRIPT_URL` con la URL que obtuviste en el paso anterior.

## Uso / Flujo de la aplicación

1.  **Inicio**: El usuario inicia la aplicación y es recibido con una pantalla de bienvenida.
2.  **Selección de Rol**: Elige un rol predefinido o introduce uno personalizado (ej: "Ingeniero de Machine Learning").
3.  **Selección de Temas**: La IA genera temas clave para ese rol. El usuario selecciona los que desea estudiar.
4.  **Revisión de Conceptos**: La aplicación muestra explicaciones detalladas para cada tema seleccionado en un formato de acordeón.
5.  **Simulación de Entrevista**: El usuario elige el número de preguntas y comienza la simulación. Responde a preguntas de opción múltiple.
6.  **Resultados y Feedback**: Al finalizar, se muestra la puntuación, feedback detallado y una revisión de las preguntas.
7.  **Guardar Progreso**: El usuario puede introducir su nombre y correo para guardar los resultados en Google Sheets.
8.  **Sugerencias de Carrera**: Finalmente, la IA ofrece sugerencias de otros roles profesionales que podrían ser de interés.

## Estructura del repositorio

```
/
├── components/
│   ├── CareerSuggestions.tsx
│   ├── GuidedReviewScreen.tsx
│   ├── InterviewScreen.tsx
│   ├── LoadingSpinner.tsx
│   ├── ResultsScreen.tsx
│   ├── RoleSelectionScreen.tsx
│   ├── TopicSelectionScreen.tsx
│   └── WelcomeScreen.tsx
├── services/
│   ├── geminiService.ts
│   └── googleSheetsService.ts
├── App.tsx
├── constants.ts
├── index.html
├── index.tsx
├── metadata.json
├── types.ts
└── README.md
```

## Automatización e integraciones

Este proyecto cuenta con dos integraciones clave para automatizar el flujo de datos:

1.  **Google Sheets vía Apps Script**: La aplicación envía los resultados de cada entrevista a un script de Google Apps, que los almacena en una hoja de cálculo. Esto crea un registro histórico sin necesidad de una base de datos tradicional.

2.  **Zapier**: El proyecto se conecta con una automatización en Zapier que se activa con cada nuevo registro en Google Sheets. Dependiendo del resultado de la entrevista:
    -   Si el usuario **aprueba**, se le envía un correo electrónico con ofertas de empleo relevantes.
    -   Si **no aprueba**, recibe un correo con un resumen de los temas a mejorar.
    -   Este feedback automatizado también se registra en la hoja de Google Sheets para un seguimiento completo.

## Próximos pasos (Roadmap)

-   [ ] **Entrevistas por Voz**: Integrar las capacidades de audio de Gemini para simular entrevistas habladas.
-   [ ] **Preguntas de Código**: Añadir un componente donde el usuario pueda escribir código y la IA lo evalúe.
-   [ ] **Planes de Estudio Personalizados**: Generar una hoja de ruta de estudio basada en el historial de rendimiento.
-   [ ] **Dashboard de Progreso**: Crear una vista para visualizar las estadísticas y la mejora a lo largo del tiempo.

## Autora

-   **Lilian Estefania Maradiago**
