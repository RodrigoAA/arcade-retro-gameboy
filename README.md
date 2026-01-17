# Arcade Retro - Estilo Game Boy

Una coleccion de juegos clasicos implementados con HTML5 Canvas y JavaScript vanilla, con estetica retro inspirada en la Game Boy original.

![Game Boy Style](https://img.shields.io/badge/Style-Game%20Boy-9bbc0f)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![No Dependencies](https://img.shields.io/badge/Dependencies-None-green)

## Juegos Disponibles

| Juego | Descripcion | Caracteristicas |
|-------|-------------|-----------------|
| **Tetris** | El clasico juego de piezas que caen | 7 piezas, ghost piece, 20 niveles |
| **Snake** | Controla una serpiente que crece | 10 niveles de velocidad, record persistente |
| **Simon** | Memoriza y repite secuencias | Secuencias infinitas, sonidos unicos por color |
| **Buscaminas** | Encuentra las minas sin explotar | 10x10 celdas, 10 minas, cronometro |
| **4 en Linea** | Conecta 4 fichas contra la CPU | IA con estrategia, contador de victorias |
| **Celta de Vigo** | Clasificacion historica de jugadores | Top 10 leyendas del RC Celta |

## Demo

Abre `index.html` en tu navegador para acceder al menu principal estilo Game Boy.

### GitHub Pages

Para acceder desde cualquier dispositivo (incluido movil):

1. Ve a la configuracion del repositorio en GitHub
2. Click en **Settings** > **Pages**
3. En **Source**, selecciona la rama **master** y carpeta **/ (root)**
4. Click en **Save**
5. Espera unos minutos y accede desde: `https://TU_USUARIO.github.io/arcade-retro-gameboy/`

## Tecnologias

- **HTML5 Canvas** - Renderizado de graficos 2D
- **JavaScript ES6+** - Logica de juegos con clases y modulos
- **CSS3** - Estilos y animaciones retro
- **Web Audio API** - Efectos de sonido 8-bit generados proceduralmente
- **Google Fonts** - Tipografia "Press Start 2P" para estilo pixelado
- **localStorage** - Persistencia de records y puntuaciones

## Estructura del Proyecto

```
arcade-retro-gameboy/
├── index.html              # Menu principal con selector de juegos
├── tetris.html             # Juego Tetris
├── snake.html              # Juego Snake
├── simon.html              # Juego Simon
├── minesweeper.html        # Juego Buscaminas
├── connect4.html           # Juego 4 en Linea
├── celta-vigo-ranking.html # Clasificacion historica Celta de Vigo
├── README.md               # Documentacion
│
├── css/
│   ├── styles.css          # Estilos compartidos de juegos
│   ├── menu.css            # Estilos del menu principal
│   └── celta-ranking.css   # Estilos de la clasificacion Celta
│
└── js/
    ├── audio.js            # Sistema de audio 8-bit (Web Audio API)
    │
    ├── constants.js        # Constantes de Tetris
    ├── pieces.js           # Definicion de tetrominos
    ├── board.js            # Logica del tablero Tetris
    ├── input.js            # Controles de Tetris
    ├── renderer.js         # Renderizado de Tetris
    ├── game.js             # Game loop de Tetris
    ├── main.js             # Inicializacion de Tetris
    │
    ├── snake/
    │   ├── constants.js    # Constantes de Snake
    │   ├── snake.js        # Logica de la serpiente
    │   ├── food.js         # Logica de la comida
    │   ├── renderer.js     # Renderizado de Snake
    │   ├── input.js        # Controles de Snake
    │   ├── game.js         # Game loop de Snake
    │   └── main.js         # Inicializacion de Snake
    │
    ├── simon/
    │   └── game.js         # Juego Simon completo
    │
    ├── minesweeper/
    │   └── game.js         # Juego Buscaminas completo
    │
    └── connect4/
        └── game.js         # Juego 4 en Linea completo
```

## Como Jugar

1. Abre `index.html` en un navegador moderno
2. Selecciona el juego que quieras jugar desde el menu
3. Usa **ESC** en cualquier juego para volver al menu
4. Usa **R** en cualquier juego para reiniciar

## Controles

### Tetris
| Tecla | Accion |
|-------|--------|
| ← → | Mover pieza horizontalmente |
| ↑ | Rotar pieza (sentido horario) |
| ↓ | Soft drop (caida suave) |
| Espacio | Hard drop (caida instantanea) |
| P | Pausar/Reanudar |
| R | Reiniciar partida |
| ESC | Volver al menu |

### Snake
| Tecla | Accion |
|-------|--------|
| ← ↑ → ↓ | Cambiar direccion |
| W A S D | Cambiar direccion (alternativo) |
| P | Pausar/Reanudar |
| R | Reiniciar partida |
| ESC | Volver al menu |

### Simon
| Accion | Control |
|--------|---------|
| Iniciar juego | Click en pantalla o ENTER |
| Seleccionar color | Click en el cuadrante |
| Reiniciar | R |
| Volver al menu | ESC |

### Buscaminas
| Accion | Control |
|--------|---------|
| Revelar celda | Click izquierdo |
| Poner/Quitar bandera | Click derecho |
| Reiniciar | R |
| Volver al menu | ESC |

### 4 en Linea
| Accion | Control |
|--------|---------|
| Soltar ficha | Click en columna |
| Nueva partida | Click (tras terminar) |
| Reiniciar | R |
| Volver al menu | ESC |

## Sistema de Audio

El proyecto incluye un sistema de audio retro que genera sonidos 8-bit en tiempo real usando Web Audio API:

### Sonidos por Juego

| Juego | Efectos de Sonido |
|-------|-------------------|
| **Menu** | Hover, Select |
| **Tetris** | Move, Rotate, Drop, Hard Drop, Clear Line, Tetris (4 lineas), Level Up, Pause, Game Over |
| **Snake** | Eat, Level Up, Pause, Game Over |
| **Simon** | Green, Red, Yellow, Blue (tonos unicos), Success, Error, Start |
| **Buscaminas** | Reveal, Flag, Explosion, Win |
| **4 en Linea** | Drop Chip, Win, Game Over |

### Control de Audio

```javascript
// Silenciar/Activar sonido
AudioManager.toggleMute();

// Verificar estado
AudioManager.isMuted();
```

## Caracteristicas Tecnicas

### Dificultad Progresiva
- **Tetris**: La velocidad aumenta cada 10 lineas completadas (20 niveles)
- **Snake**: La velocidad aumenta cada 5 comidas (10 niveles)
- **Simon**: Las secuencias crecen infinitamente
- **Buscaminas**: Dificultad fija (10 minas en 100 celdas)
- **4 en Linea**: IA con estrategia de bloqueo y preferencia central

### Persistencia de Datos
Los records se guardan automaticamente en localStorage:
- `snake_highscore` - Record de Snake
- `simon_highscore` - Record de Simon

### Paleta de Colores Game Boy
```css
--gb-lightest: #9bbc0f;  /* Verde claro */
--gb-light:    #8bac0f;  /* Verde medio claro */
--gb-dark:     #306230;  /* Verde oscuro */
--gb-darkest:  #0f380f;  /* Verde muy oscuro */
```

## Compatibilidad

Probado en navegadores modernos:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requiere soporte para:
- HTML5 Canvas
- ES6+ (Classes, Arrow Functions, Template Literals)
- Web Audio API

## Instalacion Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/arcade-retro-gameboy.git

# Entrar al directorio
cd arcade-retro-gameboy

# Abrir en navegador (no requiere servidor)
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

## Desarrollo

No se requieren dependencias ni proceso de build. Para modificar:

1. Edita los archivos HTML/CSS/JS directamente
2. Recarga el navegador para ver los cambios
3. Usa las DevTools del navegador para depurar

## Licencia

MIT License - Proyecto educativo de codigo abierto.

## Creditos

- Fuente: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P) por CodeMan38
- Inspiracion visual: Nintendo Game Boy (1989)

---

Desarrollado con Claude Code
