Repositorio creado para el desarrollo del videojuego de la práctica de Juegos en Red del curso 2023/24.

# Guía de instalación (Windows)
En esta sección se detallarán las instrucciones para la correcta compilación y ejecución del juego en una red local.

## Obtener el código fuente
Puedes descargar la última versión del código fuente `[CAMBIAR] poner-release-aqui-v1.x`, desde la sección de [_releases_](https://github.com/miguelrico2031/duelforthemagetower/releases).

O bien, puedes clonar el repositorio usando el siguiente comando:
```
git clone https://github.com/miguelrico2031/duelforthemagetower.git
```
> Puedes usar [Git for Windows](https://gitforwindows.org/) para clonar repositorios en Windows.

## Dependencias
· [Java 8](https://www.java.com/en/download/help/download_options.html) (o una versión superior)

· [Java JDK 17](https://www.oracle.com/java/technologies/downloads/#java17) (o una versión superior)

> Una vez instalados, puedes verificar la instalación mediante `java -version` en el Símbolo del sistema

## Compilación

A continuación, se va a detallar el proceso para compilar el código en el ordenador que hará de servidor del juego.

1. Extrae el código fuente del `.zip` descargado (o toma los ficheros clonados), y colócalos en una carpeta de fácil acceso, como `C:/DFTMT` o en una carpeta en tu escritorio.

2. Accede a la siguiente ruta para encontrar el archivo `duelforthemagetower-0.0.1-SNAPSHOT.jar` que permite lanzar el servidor de forma local:
```
"BASE"/duelforthemagetower/target
```
> Siendo `"BASE"/` la carpeta en la que has ubicado el código fuente; como `C:/DFTMT`, o el escritorio de tu ordenador.
> En este ejemplo, la ruta sería `D:/ezequ/Desktop/dftmt/duelforthemagetower/target`.

3. Una vez localizado el archivo mencionado, copia la ruta donde se encuentra guardado. Puedes hacerlo así:

![path img](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/path.png)

4. Lanza el Símbolo del sistema. Puedes hacerlo pulsando `Windows + R`, escribiendo **cmd**, y pulsando "Aceptar"; o buscándolo en la lista de programas de Windows.

5. En el terminal abierto, escribe `cd`, seguido de la ruta que copiamos anteriormente. Quedaría de una forma similar a esta:
```
cd D:/ezequ/Desktop/dftmt/duelforthemagetower/target
```

6. A continuación, copia el siguiente comando e introducelo en la consola:
```
java -jar duelforthemagetower-0.0.1-SNAPSHOT.jar
```

7. Si se ha realizado todo correctamente, debería de aparecer un mensaje similar al siguiente:

![server img](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/server.png)

## Ejecución

### Dirección IP

Para poder acceder al juego, es necesario conocer la dirección IP del ordenador que hace de servidor.

1. Desde el servidor, en una nueva ventana del Símbolo del sistema, ejecuta el comando `ipconfig`.
La cadena de cifras que se muestra tras `Dirección IPv4` es la dirección del servidor.

![ipconfig img](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/ipconfig.png)

> La dirección IP del servidor es el texto resaltado. En el caso de este ejemplo, es `192.168.1.135`

### Ejecutar el juego

1. A continuación, en un ordenador conectado a la misma red que el servidor, se debe abrir un navegador web. Recomendamos el uso de uno de los siguientes navegadores:

    · [_Microsoft Edge_](https://www.microsoft.com/es-es/edge/download?form=MA13FJ)
    
    · [_Mozilla Firefox_](https://www.mozilla.org/es-ES/firefox/new/)
    
    · [_Google Chrome_](https://www.google.com/chrome/)


2. En una nueva pestaña, introduce la **dirección IP** del servidor, seguido de `:8080`. Esto es el puerto en el que se establece la conexión.

En este ejemplo, quedaría así:
```
192.168.1.135:8080
```

3. Si se han seguido los pasos correctamente, el juego debería haber arrancado de forma exitosa:

![Juego img](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/gameloaded.png)



# Miembros del equipo
· Ezequiel García Díaz - e.garciad.2021@alumnos.urjc.es - [github.com/quiellll](https://github.com/quiellll)

· Gloria Blanca Llorente Pardo - gb.llorente.2021@alumnos.urjc.es - [github.com/gloriabllorente](https://github.com/gloriabllorente)

· Anatoli Nichei - a.nichei.2022@alumnos.urjc.es - [github.com/Tokpary](https://github.com/Tokpary)

· Miguel Rico Feo - m.rico.2021@alumnos.urjc.es - [github.com/miguelrico2031](https://github.com/miguelrico2031)

# **Duel for the Mage Tower**
En la batalla por la Torre de los Magos, dos hechiceros compiten saltando entre plataformas y lanzando proyectiles mágicos. El objetivo es eliminar al oponente evitando ser golpeado. El último mago en pie se adueña de la torre y gana la partida. ¡Que gane el mejor hechicero!

# Contenido

1. Introducción

    1.1. Concepto

    1.2. Características

    1.3. Género

    1.4. Propósito

    1.5. Público Objetivo 

    1.6. Estilo Visual

    1.7. Alcance

    1.8. Referencias

2. Mecánicas de Juego

    2.1. Jugabilidad

    2.2. Flujo de juego

    2.3. Controles

3. Interfaces

    3.1. Menú Principal

    3.2. Interfaz In-Game o HUD

    3.3. Menú de Pausa

    3.4. Menú de Game Over

4. Arte

    4.1. Personajes

    4.2. Escenario

    4.3. Interfaces

    4.4. Logo

5. Sonido

    5.1. Música
   
    5.2. Efectos de sonido

6. Diagrama de flujo entre pantallas

7. Funciones de red


# 1. Introducción

Esto es el documento de desarrollo de Duel for the Mage Tower. Como objetivo, se busca plasmar las ideas implementadas en el juego en este documento.

  
## 1.1. Concepto

Duel for the Mage Tower es un juego de peleas mágicas, en el que cada jugador controla a un mago, que puede lanzar hechizos al otro para hacerle daño. Ambos magos deberán lanzarse hechizos y esquivarlos, y el último que quede en pie ganará la partida.
  
## 1.2. Características

Entre los fundamentos del juego, se encuentran:

**Controles sencillos:** Permiten entender el juego rápidamente y jugar sin necesitar mucha preparación.

**Rejugabilidad:** Al ser partidas rápidas y con un ritmo frenético, permite jugar de forma seguida sin aburrimiento.

  
## 1.3. Género

Duel for the Mage Tower combina varios géneros para ofrecer una experiencia novedosa.

**Combate:** Los jugadores deben enfrentarse entre sí para ganar.

**Plataformas:** El escenario está repleto de plataformas que permiten una movilidad muy amplia.

**Disparos:** Los personajes se lanzan hechizos, en lugar de golpearse físicamente.

  
## 1.4. Propósito

El propósito de Duel for the Mage Tower es demostrar a los profesores y compañeros el desarrollo de un videojuego capaz de conectarse a la red. Sirve como proyecto de la asignatura y principalmente busca una buena conectividad antes que un buen juego. No obstante, como equipo, se busca hacer una experiencia divertida y funcional para poder demostrar las capacidades adquiridas a lo largo del grado.

  
## 1.5. Público Objetivo

Aun siendo un juego que combina varios géneros conocidos por requerir un alto nivel de dificultad, se intenta que Duel for the Mage Tower sea sencillo de comprender y de jugar, permitiendo que un público muy amplio pueda disfrutarlo. Además, el estilo visual descrito a continuación, permite que incluso niños jueguen sin ser expuestos a contenidos no aptos para su edad.

  
## 1.6. Estilo Visual

Duel for the Mage Tower cuenta con un estilo pixel art, con colores vivos para los elementos mágicos, y un escenario, aun siendo pixel art, bastante detallado. Todos los Assets visuales del juego son externos de uso libre no comercial, y están mencionados en los créditos.

  
## 1.7. Alcance

El objetivo principal es desarrollar un juego básico al que se puedan ir implementando mejoras conforme vaya pasando el curso académico. Para la segunda entrega, se busca un juego simple y multijugador de forma local.

  
## 1.8. Referencias

Algunos de los juegos en los que se ha encontrado inspiración para realizar el proyecto son:

- _Stickman Fight_
- _Super Smash Bros._
- _Wii Play_



# 2. Mecánicas de Juego

En esta sección se hablarán de todos los elementos que conforman el juego, así como de la forma en la que transcurre cada partida de Duel for the Mage Tower.

## 2.1. Jugabilidad

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/gameplay.png)
_Figura 1: captura de una partida del juego_

**Nivel**

Duel for the Mage Tower consta de un único nivel, en el cual los 2 jugadores deberán enfrentarse en un duelo de magia. Este nivel consta de un suelo y varias plataformas flotantes distribuidas por toda la pantalla, a las cuales los jugadores pueden subirse saltando sobre ellas.

En el centro del nivel hay un campo de fuerza que se extiende verticalmente formando una columna que abarca la totalidad de la pantalla de manera vertical. Este tiene la función de impedir que ninguno de los 2 jugadores cruce al lado opuesto del nivel. Los hechizos lanzados cruzan sin problema el campo de fuerza. Esto hace que el duelo se mantenga a rango y se deban apuntar bien los hechizos al lanzarlos a distancia.

**Magos**

Cada jugador controla a un personaje mago, que puede desplazarse caminando horizontalmente, y verticalmente saltando sobre las plataformas y tirándose de estas. El movimiento tiene la funcionalidad principal de permitir al jugador posicionarse bien para lanzar un hechizo, y poder esquivar los hechizos lanzados por el jugador enemigo. Cada mago tiene 6 puntos de vida, representados por 3 corazones en la interfaz, que al llegar a 0 causan su muerte, y la victoria del mago enemigo.

**Hechizos**

Cada mago tiene la capacidad de lanzar hechizos, que no son más que proyectiles que viajan cruzando el nivel, hasta impactar al jugador contrario o destruirse al chocar con la pared contraria. Estos hechizos viajan en línea recta, y al chocar con una plataforma rebotan.

Los jugadores pueden disparar hechizos en 3 direcciones: diagonal hacia delante – arriba, horizontal hacia delante, y diagonal hacia delante – abajo.

**Escudo**

Los magos tienen la capacidad de conjurar un escudo, que les protege de los proyectiles enemigos durante unos segundos. Mientras esté el escudo activo, el mago que lo activó no puede moverse ni lanzar hechizos. Cuando un hechizo enemigo choca con un escudo, este rebota en la dirección contraria, y puede dañar al mago que lo lanzó.

**Plataformas**

Distribuidas por todo el nivel, tienen el propósito de agregar verticalidad al juego al poder subirse los magos, así como de hacer rebotar a los hechizos, haciéndolos más impredecibles a la hora de esquivarlos.

**Objetivo del juego**

Bajar los puntos de vida del jugador enemigo lanzándole hechizos, antes de que el enemigo haga lo mismo, y así ganar la partida.

## 2.2. Flujo de juego

Una partida de Duel for the Mage Tower empieza con cada jugador (o mago) a su lado del nivel, uno a la izquierda y otro a la derecha del campo de fuerza. Entonces se podrán mover libremente, excepto para cruzar al lado opuesto debido al campo de fuerza en la mitad, y disparar hechizos en la dirección que elijan.

Cada jugador, según considere, irá lanzando hechizos y esquivando los hechizos del enemigo constantemente, hasta que uno de los 2 llegue a 0 puntos de vida, causando la victoria del jugador que quede vivo.


## 2.3. Controles

El juego es de tipo multijugador local, donde ambos jugadores comparten un teclado para jugar. Los controles disponibles son:

- Moverse: caminar horizontalmente y cuando corresponda moverse verticalmente (como en el caso de la polilla).
- Saltar: dar un salto.
- Disparar Arriba: lanzar un hechizo en dirección diagonal hacia delante – arriba.
- Disparar Centro: lanar un hechizo en dirección horizontal hacia adelante.
- Disparar Abajo: lanzar un hechizo en dirección diagonal hacia delante – abajo.
- Escudo: Activar el escudo.

**Teclado para 2 jugadores**

Jugador 1:

- Moverse: A - D
- Saltar: Espacio
- Disparar Arriba: W + Q
- Disparar Centro: Q
- Disparar Abajo: S + Q
- Escudo: E

Jugador 2:

- Moverse: Flechas izquierda - derecha
- Saltar: Shift Derecho
- Disparar Arriba: Flecha arriba + Enter
- Dispara Centro: Enter
- Disparar Abajo: Flecha abajo + Enter
- Escudo: P



# 3. Interfaces

En este apartado se comentan todas las interfaces que el juego requiere para su correcto funcionamiento, desde las ventanas de navegación o menús, hasta la UI que muestra el estado de los jugadores como por ejemplo la barra de vida.

  
## 3.1. Menú Principal

Esta es la primera pantalla que se muestra nada más iniciar el juego. En ella aparecen el título del juego, un fondo simple común a todos los menús del juego, un botón de desactivar el sonido, y 3 botones con las siguientes funcionalidades:

- **Jugar:** Con este botón se inicia una partida.
- **Cómo jugar:** Con este botón se abre la pantalla de tutorial, donde se explican brevemente los controles y objetivo del juego.
- **Créditos:** Con este botón se muestran los créditos de los desarrolladores y de los Assets externos usados.
- **Usuario:** Con este botón se accede a la pantalla de inicio de sesión.
  
![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/menu.jpeg)
_Figura 2: Menú principal del juego_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/tutorial.png)
_Figura 3: Pantalla de tutorial_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/credits.png)
_Figura 4: Pantalla de créditos_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/login.jpeg)
_Figura 5: Pantalla de inicio de sesión_

## 3.2. Interfaz _login_

Al pulsar el botón de usuario, se abrirá una pantalla que permite iniciar sesión con una cuenta existente o crear una nueva cuenta. Una vez iniciada la sesión, permite ver las estadísticas totales del usuario, modificar la contraseña, cerrar la sesión o eliminar la cuenta.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/statsTotales.jpeg)
_Figura 6: Pantalla de estadísticas y ajustes del usuario_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/modificar.jpeg)
_Figura 7: Pantalla de cambio de contraseña_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/borrar.jpeg)
_Figura 8: Pantalla de eliminar cuenta_
  
## 3.3. Interfaz In-Game o HUD

La interfaz In-Game es bastante sencilla. En esta se muestran las vidas correspondientes a cada jugador en forma de 3 corazones (cada uno representa 2 puntos de vida, al sufrir daño se quita medio corazón), y un icono animado con el personaje de cada jugador. La disposición de estos elementos en la pantalla serán en la esquina superior izquierda, para el jugador 1, y en la esquina superior derecha, para el jugador 2.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/hud1.png)

_Figura 9: Interfaz In-Game del jugador 1_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/hud2.png)

_Figura 10: Interfaz In-Game del jugador 2_

  
## 3.4. Menú de Pausa

En caso de pausar el juego en mitad de una partida, se despliega esta interfaz. Esta contiene 2 botones en el centro de la pantalla y un botón en la esquina superior derecha para silenciar el volumen del juego. Los botones correspondientes son **Continuar**, que permite continuar con la partida, y **Salir** , la cual lleva a los jugadores al menú principal.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/pause.png)
_Figura 11: Menú de pausa_


## 3.5. Menú de Game Over
Este menú aparece cuando uno de los jugadores llega a 0 puntos de vida, haciendo que termine la partida. Aparece a cada lado del menú una ilsutración mostrando a cada mago, si perdió, en el suelo derrotado; y si ganó, de pie. Debajo de cada una hay un texto indicando el mago que perdió y el que ganó. En el centro de la pantalla se encuentra un chat básico que permite al usuario comunicarse con su oponente mediante frases predeterminadas. Además, hay 3 botones en la parte inferior: **Ver estadísticas**, para ver los hechizos lanzados y esquivados durante el juego, **Jugar otra vez**, para iniciar una partida nueva, y **Menú**, para volver al menú principal.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/gameover.jpeg)
_Figura 12: Menú de Game Over_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/statsFin.jpeg)
_Figura 12: Menú de estadísticas_

# 4. Arte
  
En este apartado se describirá brevemente el arte visual del juego, que ha sido tomado enteramente de Assets eternos de uso libre no comercial. El estilo artístico del juego es pixel art, con una ambientación medieval fantástica bastante simple pero consistente entre los diferentes Assets usados.
  
## 4.1. Personajes

Esta fase de desarrollo del juego cuenta con 2 personajes: el Mago Azul y el Mago Rojo. Ambos pertenecen al mismo autor, y se nota que su diseño es similar. Ambos tienen animaciones de correr, saltar, lanzar un hechizo, activar el escudo, recibir daño y morir.
Los assets del proyectil y escudo son de otro autor, pero encajan bien en la estética. El escudo puede desentonar un poco más por la resolución del Asset. En entregas posteriores se buscará un Asset más consistente con el resto para el escudo.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/mage1.png)

_Figura 9: Personaje del jugador 1_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/mage2.png)

_Figura 10: Personaje del jugador 2_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/spell.png)

_Figura 11: Spritesheet del proyectil del mago 1_

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/shield.png)

_Figura 12: Mago 1 con el escudo activado_


## 4.2. Escenario

El juego consta de un único escenario con múltiples plataformas, sencillo, pero manteniendo la estética de magia y hechicería. Está ambientado en el interior de la torre que los personajes luchan por conseguir. El escenario y las plataformas pertenecen al mismo Asset, y se nota que es consistente con el resto del arte del juego. 

El campo de fuerza que sepaara las 2 mitades del escenario está representado con una especia de rayo mágico animado. Este asset no es pixel art, así que no encaja con los demás. En entregas posteriores se reemplazará por un asset mejor.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/scene.png)
_Figura 13: Escenario del juego y campo de fuerza_


## 4.3. Interfaces

Los menús de pausa, Game Over y menú principal tienen el mismo estilo: Un panel de fondo que recuerda a un pergamino medieval, y unos botones minimalistas de 2 colores y con borde negro. 

Para el HUD o interfaz in-game, cada jugador tiene un icono con bordes animados y una imagen de su personaje.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/interface.png)
_Figura 14: Panel de las interfaces de los menús_

  
## 4.4. Logo

En la siguiente imagen se muestran distintas versiones del logo del juego.

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/logos.jpg)
_Figura 15: Variaciones del logo del juego_




# 5. Sonido

En esta sección se hablará brevemente de los efectos de sonido y música utilizadas en el juego. Al igual que el arte, todos los sonidos del juego son externos, de uso libre no comercial, y aparecen mencionados en los créditos del juego.


## 5.1. Música

Duel of the Mage Tower cuenta con 2 canciones: el tema del menú principal y el tema del juego.
Ambas son canciones muy similares, con un estilo retro y simple, que combinan adecuadamente con la estética visual pixel art que tiene el juego. 
Si los jugadores lo desean pueden desactivar el sonido del juego tanto en el menú principal como el menú de pausa.


## 5.2. Efectos de sonido

**Efectos de sonido del juego:** En el juego, hay efectos de sonido para las siguientes acciones, los cuales son bastante minimalistas y sencillos:
- Saltar
- Lanzar un hechizo
- Activar el escudo
- Ser golpeado por un hechizo

**Efectos de sonido de la interfaz:** Al pausar-reanudar el juego y pulsar y levantar los botones, se reproducen algunos sonidos para dar mayor feedback al jugador.


# 6. Diagrama de flujo entre pantallas

![](https://github.com/miguelrico2031/juegosenred/blob/main/Readme%20Images/flowchart.png)
_Figura 16: Diagrama de flujo entre las diferentes pantallas del juego_



