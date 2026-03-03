# PaginaPorfolioHector
Estructura del proyecto:
    /project-root
    │
    ├── index.html
    ├── index.js
    │
    ├── /resources
    │   ├── main.glb
    │   ├── ring.glb
    │   ├── 1.glb → 20.glb
    │   └── otros modelos...
    │
    ├── /imagenes
    ├── /videos
    │
    └── /portfolio
        └── portfolio.html

Funcionamiento de la aplicación

Escena

    Fondo dinámico con cambio progresivo de color (HSL animado).

    Iluminación puntual activable.

    Suelo y modelos decorativos no seleccionables.

Cámara

    Cámara perspectiva (FOV dinámico).

    Control orbital con:

    Rotación limitada

    Zoom limitado

    Ángulo polar restringido

Interacción
    
    Click sobre objetos numerados (1–20)

    Se resalta el modelo

    Se hace zoom automático

    Se bloquea la rotación

    Tras 3 segundos aparece su InfoBox con:

        Imagen o video

        Título

        Descripción

    Click sobre el anillo central

        Activa / desactiva una luz puntual en la escena.

    Scroll del ratón

        Cancela modo foco

        Restaura cámara

        Quita resaltado

        Oculta InfoBoxes