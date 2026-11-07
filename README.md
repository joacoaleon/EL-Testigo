# El Testigo: Crónicas de la Promesa

Código fuente TypeScript/React para un prototipo de aventura 3D ambientado en el Jardín del Edén.

## Estructura

```text
src/
├── components/
│   ├── camera/       # Movimiento del jugador y cámara
│   ├── characters/   # Modelos y animaciones de personajes
│   ├── scenes/       # Escenarios 3D y prólogo cinematográfico
│   └── ui/           # Menú, prólogo y pantallas de interfaz
├── content/          # Capítulos, misiones, NPC y diálogos
├── database/         # Firebase y guardado local
├── engine/           # Estado global y sonido
└── types/            # Tipos compartidos del juego
```

## Estado actual

Estos archivos son módulos de un proyecto mayor, no una aplicación ejecutable aislada. Faltan el punto de entrada, la configuración de Vite/React, dependencias y recursos externos del proyecto original.

La carpeta `_backup_originales/` conserva los archivos tal como fueron descargados, antes de la reorganización.

## Controles previstos

- `WASD` o flechas: movimiento.
- `Shift`: correr.
- `Espacio`: saltar.
- `E`: interactuar.
- `V`: alternar cámara.
- `F`: animación de acción.
