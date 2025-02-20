# Guía de Scripts TCL para Vivado

Esta guía te ayudará a configurar y utilizar scripts TCL para automatizar flujos de trabajo en Vivado, basado en el repositorio https://github.com/pmendozap/vivado_tcl_tec

## Requisitos Previos

:::resources
!!!link
title: Git Official Website
description: Official website for Git, where you can download and learn more about Git.
jumpto: https://git-scm.com
!!!
!!!link
title: Git for Windows Download
description: Download the official Git installer for Windows.
jumpto: https://git-scm.com/download/win
!!!
!!!link
title: Windows Package Manager
description: Official Windows Package Manager (winget) from Microsoft Store.
jumpto: https://apps.microsoft.com/store/detail/app-installer/9NBLGGH4NNS1
!!!
!!!link
title: GNU Make for Windows
description: Download GNU Make utility for Windows to automate build processes.
jumpto: https://gnuwin32.sourceforge.net/packages/make.htm
!!!
:::

:::important
Antes de comenzar, asegúrate de tener instalado:
- Xilinx Vivado (Versión 2019.1 o superior)
- Git (para control de versiones)
- GNU Make (para Windows)
- GTKWave (opcional)
:::

## Instalación en Windows

### 1. Instalar Git

Tienes dos métodos principales para instalar Git:

#### Método 1: Usando WinGet (Recomendado)

WinGet es el gestor de paquetes oficial de Windows que permite instalar aplicaciones de forma sencilla desde la línea de comandos.

:::info
WinGet viene preinstalado en Windows 11 y versiones recientes de Windows 10. Si no lo tienes instalado, Windows te dirigirá automáticamente a la Microsoft Store para instalarlo.
:::

1. Abre PowerShell o la Terminal de Windows y verifica si tienes WinGet:
```powershell
winget --version
```

2. Si WinGet está instalado, instala Git con el siguiente comando:
```powershell
winget install --id Git.Git -e --source winget
```

#### Método 2: Instalador Tradicional

Si prefieres más control sobre las opciones de instalación:

1. Visita https://git-scm.com/downloads/win y descarga el instalador oficial.

2. Durante la instalación, configura las siguientes opciones:
   - En "Adjusting your PATH environment", selecciona "Git from the command line and also from 3rd-party software"
   - Para el editor por defecto, recomendamos Visual Studio Code si lo tienes instalado
   - En la opción de nombre de rama por defecto, selecciona "main"
   - Para el final de línea, elige "Checkout Windows-style, commit Unix-style line endings"

3. Una vez instalado, abre Git Bash o Windows Terminal y configura tu identidad:
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### 2. Instalar GNU Make

:::info
GNU Make es necesario para ejecutar los scripts de automatización. En la página de descarga (https://gnuwin32.sourceforge.net/packages/make.htm), busca el texto "If you download the Setup program of the package" y haz clic en el hipervínculo "Setup program" para descargar el instalador.
:::

### 3. Instalar GTKWave (Opcional)

:::tip
GTKWave es un visualizador de formas de onda ligero y alternativo al de Vivado. 
Descárgalo de: https://gtkwave.sourceforge.net/
:::

### 4. Configurar Variables de Entorno

:::warning
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


### 4. Verificar la Instalación

:::success
Abre una terminal y ejecuta estos comandos para verificar la instalación:
```bash
make -h    # Debería mostrar la ayuda de Make
vivado -h  # Debería mostrar la ayuda de Vivado
gtkwave -h # Debería mostrar la ayuda de GTKWave
```
:::

## Scripts de Automatización


:::info
Para facilitar la creación de la estructura del proyecto, puedes utilizar uno de los siguientes scripts según tu sistema operativo:
:::

:::warning
¡IMPORTANTE! Antes de ejecutar cualquiera de estos scripts, asegúrate de estar ubicado en el directorio donde deseas tener todos los proyectos del taller. Los scripts crearán la estructura de directorios en la ubicación donde los ejecutes.
:::


### Script para Bash (Linux/Mac/Git Bash)
Para crear el script:
```bash
nano setup.sh
```
Copia y pega el siguiente contenido (en nano puedes usar Ctrl+Shift+V para pegar):
```bash
#!/bin/bash

# Crear directorio temporal para el clon
mkdir -p temp_repo

# Clonar el repositorio
git clone https://github.com/HalfS0ur/vivado_tcl_scripts.git temp_repo

# Crear la estructura de directorios necesaria
mkdir -p scripts src build/laboratorio1 build/build_scripts

# Copiar la carpeta scripts a la raíz
cp -r temp_repo/scripts .

# Copiar los archivos de clean_tcl_scripts a ambas carpetas
cp -r temp_repo/clean_tcl_scripts/* build/laboratorio1/
cp -r temp_repo/clean_tcl_scripts/* build/build_scripts/

# Limpiar el directorio temporal
rm -rf temp_repo

echo "Estructura de directorios creada exitosamente!"
```

Para guardar el archivo en nano:
1. Presiona `Ctrl + X` para salir
2. Presiona `Y` para confirmar que quieres guardar
3. Presiona `Enter` para confirmar el nombre del archivo

Para ejecutar el script:
```bash
chmod +x setup.sh
./setup.sh
```

### Script para PowerShell (Windows)

:::tip
Hay varias formas de abrir PowerShell en la carpeta deseada:

1. **Usando el Explorador de Windows**:
   - Navega a la carpeta donde quieres crear el proyecto
   - Mantén presionada la tecla Shift
   - Haz clic derecho en un espacio vacío de la carpeta
   - Selecciona "Abrir la ventana de PowerShell aquí"
   - *Nota*: En Windows 11, primero selecciona "Mostrar más opciones" y luego verás la opción de PowerShell

2. **Desde la barra de direcciones**:
   - Navega a la carpeta en el Explorador de Windows
   - Haz clic en la barra de direcciones
   - Escribe "powershell" y presiona Enter
:::

Para crear el script, en PowerShell ejecuta:
```powershell
notepad setup.ps1
```

Copia y pega el siguiente contenido en el Notepad que se abrirá:
```powershell
$ErrorActionPreference = "Stop"

# Crear directorio temporal para el clon
New-Item -ItemType Directory -Path temp_repo -Force

# Clonar el repositorio
git clone https://github.com/HalfS0ur/vivado_tcl_scripts.git temp_repo

# Crear la estructura de directorios necesaria
New-Item -ItemType Directory -Path scripts -Force
New-Item -ItemType Directory -Path src -Force
New-Item -ItemType Directory -Path build/laboratorio1 -Force
New-Item -ItemType Directory -Path build/build_scripts -Force

# Copiar la carpeta scripts a la raíz
Copy-Item -Path "temp_repo/scripts/*" -Destination "scripts" -Recurse -Force

# Copiar los archivos de clean_tcl_scripts a ambas carpetas
Copy-Item -Path "temp_repo/clean_tcl_scripts/*" -Destination "build/laboratorio1" -Recurse -Force
Copy-Item -Path "temp_repo/clean_tcl_scripts/*" -Destination "build/build_scripts" -Recurse -Force

# Limpiar el directorio temporal
Remove-Item -Path temp_repo -Recurse -Force

Write-Host "Estructura de directorios creada exitosamente!"
```

Para ejecutar el script:
```powershell
.\setup.ps1
```

:::tip
La carpeta `build_scripts` sirve como template. Cuando necesites crear un nuevo laboratorio, puedes copiarla y renombrarla según necesites.
:::

## Estructura del Proyecto

:::info
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


## Archivos Importantes

### globals.tcl
:::important
Este archivo contiene las variables globales del proyecto:
- Nombre del módulo TOP
- Nombre del módulo de simulación
- Configuraciones específicas del subproyecto
:::

### create_project.tcl
:::info
Script para crear un nuevo proyecto de Vivado:
- Configuración de IP cores
- Definición de carpetas fuente
- Especificación de archivos de constraints
:::

### update_project.tcl
:::tip
Usado para actualizar proyectos existentes:
- Agregar nuevos archivos fuente
- Modificar configuraciones
- Actualizar constraints
:::

## Comandos Disponibles

:::success
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



## Ejemplo de Uso

:::tip
Para ejecutar un proyecto ejemplo:
1. Abre una terminal en la carpeta del proyecto
2. Ejecuta `make create` para crear el proyecto
3. Ejecuta `make flow` para el flujo completo
4. Usa `make open` para abrir Vivado
:::

## Troubleshooting

:::warning
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


