# Guía de Scripts TCL para Vivado

Esta guía te ayudará a configurar y utilizar scripts TCL para automatizar flujos de trabajo en Vivado, basado en el repositorio https://github.com/pmendozap/vivado_tcl_tec

## Requisitos Previos

::: important
Antes de comenzar, asegúrate de tener instalado:
- Xilinx Vivado (Versión 2019.1 o superior)
- GNU Make (para Windows)
- GTKWave (opcional)
:::

## Instalación en Windows

### 1. Instalar GNU Make

::: info
GNU Make es necesario para ejecutar los scripts de automatización. Puedes descargarlo de:
https://gnuwin32.sourceforge.net/packages.html
:::

### 2. Instalar GTKWave (Opcional)

::: tip
GTKWave es un visualizador de formas de onda ligero y alternativo al de Vivado. 
Descárgalo de: https://gtkwave.sourceforge.net/
:::

### 3. Configurar Variables de Entorno

::: warning
Es crucial configurar correctamente las variables de entorno para que los comandos funcionen desde cualquier ubicación.
:::

#### Pasos para configurar el PATH:

1. Busca "Variables de entorno" en el menú de inicio
2. En variables de usuario, localiza "Path"
3. Agrega las siguientes rutas:

```
C:\Xilinx\Vivado\2019.1\bin
C:\Xilinx\Vivado\2019.1\lib\win64.o
[Ruta donde instalaste Make]\bin
[Ruta donde instalaste GTKWave]
```

![Configuración de Variables de Entorno](https://placehold.co/600x400)
*Ventana de configuración de variables de entorno en Windows*

### 4. Verificar la Instalación

::: success
Abre una terminal y ejecuta estos comandos para verificar la instalación:
```bash
make -h    # Debería mostrar la ayuda de Make
vivado -h  # Debería mostrar la ayuda de Vivado
gtkwave -h # Debería mostrar la ayuda de GTKWave
```
:::

## Estructura del Proyecto

::: info
El proyecto sigue una estructura específica para organizar los archivos fuente, scripts y builds:
:::

```
## Estructura del proyecto:

    
    DIRECTORIO_DE_TRABAJO
            ├── build/
            │   ├── ejercicio1
            │   │    ├── Makefile
            │   │    ├── create_project.tcl
            │   │    ├── globals.tcl
            │   │    ├── update_project.tcl
            │   │    └── ... #Archivos generados sin rastrear
            │   ├── ejercicio2
            │   │    ├── Makefile
            │   │    ├── create_project.tcl
            │   │    ├── globals.tcl
            │   │    ├── update_project.tcl
            │   │    └── ... #Archivos generados sin rastrear
            │   ├── ejercicio3
            │   │    ├── Makefile
            │   │    ├── create_project.tcl
            │   │    ├── globals.tcl
            │   │    ├── update_project.tcl
            │   │    └── ... #Archivos generados sin rastrear
            │   └── ...
            ├── scripts
            │   └── ...
            └── src/                     
                └── REPOSITORIO_CLONADO/  # Archivos fuente rastreados
                     ├── ejercicio1/
                     │    ├── testing
                     │    │   └── ...
                     │    ├── synthesis
                     │    │   ├── *.xdc
                     │    │   └── ...
                     │    └── *.sv
                     ├── ejercicio2/
                     │    ├── testing
                     │    │   └── ...
                     │    ├── synthesis
                     │    │   ├── *.xdc
                     │    │   └── ...
                     │    └── *.sv
                     ├── ejercicio3/
                     │    ├── testing
                     │    │   └── ...
                     │    ├── synthesis
                     │    │   ├── *.xdc
                     │    │   └── ...
                     │    └── *.sv
                     └── ...

```

![Estructura del Proyecto en Explorer](https://placehold.co/600x400)
*Vista de la estructura del proyecto en Windows Explorer*

## Archivos Importantes

### globals.tcl
::: important
Este archivo contiene las variables globales del proyecto:
- Nombre del módulo TOP
- Nombre del módulo de simulación
- Configuraciones específicas del subproyecto
:::

### create_project.tcl
::: info
Script para crear un nuevo proyecto de Vivado:
- Configuración de IP cores
- Definición de carpetas fuente
- Especificación de archivos de constraints
:::

### update_project.tcl
::: tip
Usado para actualizar proyectos existentes:
- Agregar nuevos archivos fuente
- Modificar configuraciones
- Actualizar constraints
:::

## Comandos Disponibles

::: success
Estos son los comandos principales que puedes usar con `make`:
:::

| Comando | Descripción |
|---------|-------------|
| `make create` | Crea el ambiente de Vivado |
| `make update` | Actualiza el proyecto |
| `make open` | Abre el GUI de Vivado |
| `make logic_synth` | Ejecuta síntesis lógica |
| `make phy_synth` | Ejecuta síntesis física |
| `make program` | Programa la FPGA |
| `make behavioral_sim` | Ejecuta simulación de comportamiento |
| `make flow` | Ejecuta el flujo completo |
| `make clean` | Limpia archivos temporales |

![Ejecución de Comandos Make](https://placehold.co/600x400)
*Terminal mostrando la ejecución de comandos make*

## Ejemplo de Uso

::: tip
Para ejecutar un proyecto ejemplo:
1. Abre una terminal en la carpeta del proyecto
2. Ejecuta `make create` para crear el proyecto
3. Ejecuta `make flow` para el flujo completo
4. Usa `make open` para abrir Vivado
:::

## Troubleshooting

::: warning
Problemas comunes y soluciones:
1. **Error: Command not found**
   - Verifica las variables de entorno
   - Reinstala las herramientas necesarias

2. **Error en la síntesis**
   - Revisa los archivos de constraints
   - Verifica la jerarquía de módulos

3. **GTKWave no abre**
   - Comprueba la instalación
   - Verifica la variable de entorno
:::

::: video
https://placehold.co/600x400
*Video tutorial completo del proceso de instalación y uso*
:::
