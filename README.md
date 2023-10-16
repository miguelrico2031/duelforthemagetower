# Juegos en Red
Repositorio creado para el desarrollo del videojuego de la práctica de Juegos en Red del curso 2023/24.

## Miembros del equipo
· Ezequiel García Díaz

· Gloria Blanca Llorente Pardo

· Anatoli Nichei

· Miguel Rico Feo

# 1. INTRODUCCIÓN A _NOMBREJUEGO_

Esto es el documento de desarrollo de _NOMBREJUEGO_. Como objetivo, se busca plasmar las ideas implementadas en el juego en este documento.

## 1.1 Concepto

_NOMBREJUEGO_ es un juego de peleas mágicas, en el que se controlan a unos pequeños animales con poderes especiales. El objetivo del juego es derrotar al contrincante haciendo uso de las habilidades de cada personaje y los potenciadores que aparecen a lo largo de la partida.

## 1.2 Características

Entre los fundamentos del juego, se encuentran:

**Controles** **sencillos**: Permiten entender el juego rápidamente y jugar sin necesitar mucha preparación.

**Rejugabilidad** : Al ser partidas rápidas y con un ritmo frenético, permite jugar de forma seguida sin aburrimiento.

**Dinamismo** : La cantidad de poderes permite dar la vuelta a la partida en cualquier momento, creando tensión y diversión.

**Diversidad** : Al haber varios personajes con habilidades diferentes, la cantidad de posibles enfrentamientos es mucho mayor.

## 1.3 Género

_NOMBREJUEGO_ combina varios géneros para ofrecer una experiencia novedosa.

**Combate** : Los jugadores deben enfrentarse entre sí para ganar.

**Plataformas** : El escenario está repleto de plataformas que permiten una movilidad muy amplia.

**Disparos** : Los personajes se lanzan hechizos, en lugar de golpearse físicamente.

## 1.4 Propósito

El propósito de _NOMBREJUEGO_ es demostrar a los profesores y compañeros el desarrollo de un videojuego capaz de conectarse a la red. Sirve como proyecto de la asignatura y principalmente busca una buena conectividad antes que un buen juego. No obstante, como equipo, se busca hacer una experiencia divertida y funcional para poder demostrar las capacidades adquiridas a lo largo del grado.

## 1.5 Público objetivo

Aun siendo un juego que combina varios géneros conocidos por requerir un alto nivel de dificultad, se intenta que _NOMBREJUEGO_ sea sencillo de comprender y de jugar, permitiendo que un público muy amplio pueda disfrutarlo. Además, el estilo visual descrito a continuación, permite que incluso niños jueguen sin ser expuestos a contenidos no aptos para su edad.

## 1.6 Estilo visual

_NOMBREJUEGO_ cuenta con un estilo dibujado a mano, colorido. Las animaciones, partículas y efectos dan movimiento y acción al juego.

## 1.7 Alcance

El objetivo principal es desarrollar un juego básico al que se puedan ir implementando mejoras conforme vaya pasando el curso académico. Para la primera entrega, se busca un juego simple y multijugador de forma local.

## 1.8 Referencias

Algunos de los juegos en los que se ha encontrado inspiración para realizar el proyecto son:

· _Stickman Fight_

· _Super Smash Bros._

· _Wii Play_


# 2. Mecánicas de Juego

En esta sección se hablarán de todos los elementos que conforman el juego, así como de la forma en la que transcurre cada partida de NOMBREJUEGO.

## 2.1. Jugabilidad

**Nivel**

NOMBREJUEGO consta de un único nivel, en el cual los 2 jugadores deberán enfrentarse en un duelo de magia. Este nivel consta de un suelo y varias plataformas flotantes distribuidas por toda la pantalla, a las cuales los jugadores pueden subirse saltando sobre ellas.

En el centro del nivel hay un campo de fuerza que se extiende verticalmente formando una columna que abarca la totalidad de la pantalla de manera vertical. Este tiene la función de impedir que ninguno de los 2 jugadores cruce al lado opuesto del nivel. Los hechizos lanzados cruzan sin problema el campo de fuerza. Esto hace que el duelo se mantenga a rango y se deban apuntar bien los hechizos al lanzarlos a distancia.

**Magos**

Cada jugador controla a un personaje mago, que puede desplazarse caminando horizontalmente, y verticalmente saltando sobre las plataformas y tirándose de estas. El movimiento tiene la funcionalidad principal de permitir al jugador posicionarse bien para lanzar un hechizo, y poder esquivar los hechizos lanzados por el jugador enemigo. Cada mago tiene unos puntos de vida, que al llegar a 0 causan su muerte, y la victoria del mago enemigo.

**Hechizos**

Cada mago tiene la capacidad de lanzar hechizos, que no son más que proyectiles que viajan cruzando el nivel, hasta impactar al jugador contrario o destruirse al chocar con la pared contraria. Estos hechizos viajan en línea recta, y al chocar con una plataforma rebotan.

Los jugadores pueden disparar hechizos en 3 direcciones: diagonal hacia delante – arriba, horizontal hacia delante, y diagonal hacia delante – abajo.

**Plataformas**

Distribuidas por todo el nivel, tienen el propósito de agregar verticalidad al juego al poder subirse los magos, así como de hacer rebotar a los hechizos, haciéndolos más impredecibles a la hora de esquivarlos.

**Objetivo del juego**

Bajar los puntos de vida del jugador enemigo lanzándole hechizos, antes de que el enemigo haga lo mismo, y así ganar la partida.

## 2.2. Flujo de juego

Una partida de NOMBREJUEGO empieza con cada jugador (o mago) a su lado del nivel, uno a la izquierda y otro a la derecha del campo de fuerza. Entonces se podrán mover libremente, excepto para cruzar al lado opuesto debido al campo de fuerza en la mitad, y disparar hechizos en la dirección que elijan.

Cada jugador, según considere, irá lanzando hechizos y esquivando los hechizos del enemigo constantemente, hasta que uno de los 2 llegue a 0 puntos de vida, causando la victoria del jugador que quede vivo.

A lo largo de la partida irán apareciendo varios objetos aleatoriamente, los cuales, al ser recogidos por un jugador, le darán a este un _Power Up_ o bonificación temporal.

## 2.3. Personajes

En NOMBREJUEGO cada jugador podrá elegir entre 3 personajes. Los 3 comparten la habilidad de lanzar el hechizo básico, descrito anteriormente, el cual rebota con las plataformas y daña al jugador enemigo al impactarlo. A parte, cada personaje tiene un aspecto único (detallado en la sección de ARTE) y una habilidad mágica única. Esta habilidad puede ser usada una vez cada cierto tiempo, a diferencia del hechizo normal. Los personajes con sus habilidades son:

**Armadillo**

Tiene la habilidad de escudarse cerrándose en una bola por un tiempo. Mientras esté en este estado, no podrá moverse, pero tampoco sufrirá daño por los hechizos del enemigo. En cambio, estos rebotarán en él y viajarán ahora en dirección opuesta, pudiendo impactar y dañar al enemigo que los lanzó.

**Gato**

Tiene la habilidad

**Polilla**

Tiene la habilidad de volar temporalmente. Cuando la activa, en vez de caminar y saltar, despliega sus alas y sus controles cambian: ahora podrá flotar en cualquier dirección sin ser afectada por la gravedad. Al aumentar así su movilidad le será más fácil esquivar los hechizos enemigos, y posicionarse para lanzar sus hechizos.

## 2.4. _Power Ups_

Los _Power Ups_ son objetos interactuables que irán apareciendo aleatoriamente, en cualquiera de los 2 lados del nivel, cada cierto tiempo a lo largo de la partida. Aparecerán en un lugar del nivel alcanzable para el jugador, ya sea en el suelo o encima de una plataforma. Estos permanecerán unos pocos segundos donde aparecieron, y si no son recogidos en ese tiempo, desaparecerán.

Si un jugador toca un _Power Up_, este último desaparecerá, y al jugador se le concederá un efecto positivo.

Hay 3 tipos de _Power Ups_ en NOMBREJUEGO:

**Curación**

Al tocarlo, el jugador recibe una curación de una determinada cantidad a sus puntos de vida.

**Mejora de Ataque**

Al tocarlo, el jugador recibe temporalmente un incremento en su velocidad de ataque. Es decir, podrá lanzar hechizos más rápidamente.

**Mejora de Movimiento**

Al tocarlo, el jugador recibe temporalmente un incremento a la velocidad de movimiento, así como a la fuerza de salto.

## 2.5. Controles

En NOMBREJUEGO habrá varios tipos de controles, depende de si se esté jugando una partida en modo local o modo en línea, así como de si los jugadores usan el teclado o conectan un mando.

Los controles tienen estos nombres:

- Moverse: caminar horizontalmente y cuando corresponda moverse verticalmente (como en el caso de la polilla).
- Saltar: dar un salto.
- Disparar Arriba: lanzar un hechizo en dirección diagonal hacia delante – arriba.
- Disparar Centro: lanar un hechizo en dirección horizontal hacia adelante.
- Disparar Abajo: lanzar un hechizo en dirección diagonal hacia delante – abajo.
- Habilidad: Activar la habilidad única de cada personaje.

**Teclado para 2 jugadores**

En este modo cada jugador tiene diferentes teclas, ya que ambos comparten un teclado.

Jugador 1:

- Moverse: WASD
- Saltar: Espacio
- Disparar Arriba: W + Q
- Disparar Centro: Q
- Disparar Abajo: S + Q
- Habilidad: E

Jugador 2:

- Moverse: Flechas de dirección
- Saltar: Shift Derecho
- Disparar Arriba: Flecha arriba + Enter
- Dispara Centro: Enter
- Disparar Abajo: Flecha abajo + Enter
- Habilidad: Control Derecho

**Teclado para 1 jugador**

- Moverse: WASD
- Saltar: Espacio
- Disparar Arriba: W + Enter
- Disparar Centro: Q Enter
- Disparar Abajo: S + Enter
- Habilidad: E

**Mando**

- Moverse: Joystick izquierdo
- Saltar: Botón Sur
- Disparar Arriba: Joystick izquierdo arriba + Botón Oeste
- Dispara Centro: Botón Oeste
- Disparar Abajo: Joystick izquierdo abajo + Botón Oeste
- Habilidad: Botón norte
