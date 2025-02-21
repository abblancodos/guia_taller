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

## 5. Scripts de Automatización
:::info
Los scripts de automatización se dividen en dos partes:
1. Scripts de inicialización: Crean la estructura básica del proyecto y configuran el ejemplo inicial
2. Scripts de configuración: Preparan el ambiente para nuevos repositorios clonados en src
:::

### 5.1 Estructura del Proyecto
La estructura que crearán los scripts será la siguiente:
```
~/Taller/                  # Carpeta base (puede tener cualquier nombre)
├── build/                 # Carpeta para archivos generados
│   └── ejemplo1/         # Archivos TCL y proyecto Vivado
├── scripts/              # Scripts del flujo de Vivado
└── src/                  # Código fuente
    └── ejemplo1/         # Sources del ejemplo
```

### 5.2 Inicialización de la Estructura
:::warning
¡IMPORTANTE! Antes de ejecutar el script de inicialización:
1. Crea una carpeta para el taller (ej: "Taller")
2. Colócate dentro de esa carpeta
3. Ejecuta el script correspondiente a tu sistema operativo
:::

#### PowerShell (Windows)
```powershell
$ErrorActionPreference = "Stop"

# Crear directorio temporal para el clon
New-Item -ItemType Directory -Path temp_repo -Force

# Clonar el repositorio
git clone https://github.com/HalfS0ur/vivado_tcl_scripts.git temp_repo

# Asegurarse que estamos en la carpeta base del taller (ej: ~/Taller)
$baseDir = Get-Location

# Crear la estructura de directorios necesaria
New-Item -ItemType Directory -Path scripts -Force
New-Item -ItemType Directory -Path src -Force
New-Item -ItemType Directory -Path build/ejemplo1 -Force

# Copiar la carpeta scripts a la raíz
Copy-Item -Path "temp_repo/scripts/*" -Destination "scripts" -Recurse -Force

# Copiar la carpeta ejemplo1 a src
Copy-Item -Path "temp_repo/src/ejemplo1" -Destination "src" -Recurse -Force

# Copiar los archivos TCL para ejemplo1
Copy-Item -Path "temp_repo/clean_tcl_scripts/*" -Destination "build/ejemplo1" -Recurse -Force

# Actualizar las rutas en los archivos TCL de ejemplo1
$projectPath = Join-Path $baseDir "build/ejemplo1"
$rootPath = $baseDir

# Update globals.tcl
$globalsPath = Join-Path $projectPath "globals.tcl"
$globalsContent = Get-Content $globalsPath -Raw
$globalsContent = $globalsContent -replace 'set ROOT_PATH \$PROJECT_PATH/../..', "set ROOT_PATH `"$rootPath`""
$globalsContent | Set-Content $globalsPath

# Update create_project.tcl y update_project.tcl
$files = @("create_project.tcl", "update_project.tcl")
foreach ($file in $files) {
    $filePath = Join-Path $projectPath $file
    $content = Get-Content $filePath -Raw
    # Reemplazar los paths para que coincidan con nuestra estructura
    $content = $content -replace "REPO_LAB/ejercicioN", "ejemplo1"
    $content = $content -replace "set REPORTS_FOLDR.*", "set REPORTS_FOLDR `"rpt`""
    $content | Set-Content $filePath
}

# Limpiar el directorio temporal
Remove-Item -Path temp_repo -Recurse -Force

Write-Host "Estructura de directorios creada exitosamente en $baseDir!"
```

#### Bash (Linux/MacOS)
```bash
#!/bin/bash
set -e

# Crear directorio temporal para el clon
mkdir -p temp_repo

# Clonar el repositorio
git clone https://github.com/HalfS0ur/vivado_tcl_scripts.git temp_repo

# Asegurarse que estamos en la carpeta base del taller (ej: ~/Taller)
BASE_DIR=$(pwd)

# Crear la estructura de directorios necesaria
mkdir -p scripts
mkdir -p src
mkdir -p build/ejemplo1

# Copiar la carpeta scripts a la raíz
cp -r temp_repo/scripts/* scripts/

# Copiar la carpeta ejemplo1 a src
cp -r temp_repo/src/ejemplo1 src/

# Copiar los archivos TCL para ejemplo1
cp -r temp_repo/clean_tcl_scripts/* build/ejemplo1/

# Actualizar las rutas en los archivos TCL de ejemplo1
PROJECT_PATH="$BASE_DIR/build/ejemplo1"
ROOT_PATH="$BASE_DIR"

# Update globals.tcl
sed -i "s|set ROOT_PATH \\\$PROJECT_PATH/../..|set ROOT_PATH \"$ROOT_PATH\"|" "$PROJECT_PATH/globals.tcl"

# Update create_project.tcl y update_project.tcl
for file in "create_project.tcl" "update_project.tcl"; do
    # Reemplazar los paths para que coincidan con nuestra estructura
    sed -i "s|REPO_LAB/ejercicioN|ejemplo1|g" "$PROJECT_PATH/$file"
    sed -i "s|set REPORTS_FOLDR.*|set REPORTS_FOLDR \"rpt\"|" "$PROJECT_PATH/$file"
done

# Limpiar el directorio temporal
rm -rf temp_repo

echo "Estructura de directorios creada exitosamente en $BASE_DIR!"
```

### 5.3 Configuración de Nuevos Repositorios
:::info
Después de clonar un nuevo repositorio en la carpeta `src`, necesitarás configurar los archivos TCL correspondientes en la carpeta `build`. Los siguientes scripts automatizan este proceso.
:::

#### PowerShell (Windows)
```powershell
# Script configure_tcl.ps1

# Get current directory name as project name
$projectName = Split-Path -Leaf (Get-Location)

# Path to build directory and project directory
$buildPath = "..\..\build"
$projectPath = Join-Path $buildPath $projectName

# Verify the build directory exists
if (-not (Test-Path $projectPath)) {
    Write-Host "Creando directorio $projectPath..."
    New-Item -ItemType Directory -Path $projectPath -Force
    # Copiar archivos TCL template desde ejemplo1
    Copy-Item -Path "..\..\build\ejemplo1\*" -Destination $projectPath -Recurse -Force
}

# Get absolute paths
$rootPath = Resolve-Path "..\.."

# Update globals.tcl
$globalsPath = Join-Path $projectPath "globals.tcl"
$globalsContent = Get-Content $globalsPath -Raw
$globalsContent = $globalsContent -replace 'set ROOT_PATH \$PROJECT_PATH/../..', "set ROOT_PATH `"$rootPath`""
$globalsContent | Set-Content $globalsPath

# Update create_project.tcl and update_project.tcl
$files = @("create_project.tcl", "update_project.tcl")
foreach ($file in $files) {
    $filePath = Join-Path $projectPath $file
    $content = Get-Content $filePath -Raw
    $content = $content -replace "REPO_LAB/ejercicioN", $projectName
    $content = $content -replace "ejercicioN", "."
    $content | Set-Content $filePath
}

# Change to project directory and create project
Set-Location $projectPath
Write-Host "Creating Vivado project..."
make create

Write-Host "Setup complete! Project created in $projectPath"
```

#### Bash (Linux/MacOS)
```bash
#!/bin/bash

# Get current directory name as project name
PROJECT_NAME=$(basename "$(pwd)")

# Path to build directory and project directory
BUILD_PATH="../../build"
PROJECT_PATH="$BUILD_PATH/$PROJECT_NAME"

# Verify the build directory exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo "Creando directorio $PROJECT_PATH..."
    mkdir -p "$PROJECT_PATH"
    # Copiar archivos TCL template desde ejemplo1
    cp -r ../../build/ejemplo1/* "$PROJECT_PATH/"
fi

# Get absolute paths
ROOT_PATH=$(realpath "../..")

# Update globals.tcl
sed -i "s|set ROOT_PATH \\\$PROJECT_PATH/../..|set ROOT_PATH \"$ROOT_PATH\"|" "$PROJECT_PATH/globals.tcl"

# Update create_project.tcl and update_project.tcl
for file in "create_project.tcl" "update_project.tcl"; do
    sed -i "s|REPO_LAB/ejercicioN|$PROJECT_NAME|g" "$PROJECT_PATH/$file"
    sed -i "s|ejercicioN|.|g" "$PROJECT_PATH/$file"
done

# Change to project directory and create project
cd "$PROJECT_PATH"
echo "Creating Vivado project..."
make create

echo "Setup complete! Project created in $PROJECT_PATH"
```

### 5.4 Uso de los Scripts
#### Inicialización del Proyecto
1. Crea una carpeta para el taller
2. Colócate dentro de ella
3. Ejecuta el script de inicialización (PowerShell o Bash)
4. Verifica que se creó la estructura básica:
```bash
ls
# Deberías ver: build/ scripts/ src/
```

#### Configuración de Nuevo Repositorio
1. Clona tu repositorio en la carpeta `src`:
```bash
cd src
git clone <tu-repositorio>
```

2. Copia el script de configuración a la carpeta del proyecto:
```bash
cd tu-repositorio
# Copia configure_tcl.ps1 o configure_tcl.sh aquí
```

3. Ejecuta el script:
```bash
# En Windows:
.\configure_tcl.ps1

# En Linux/MacOS:
chmod +x configure_tcl.sh
./configure_tcl.sh
```

### 5.5 Verificación
:::success
Para verificar que todo se configuró correctamente:

1. Verifica la estructura de directorios:
```bash
tree
~/Taller/
├── build/
│   ├── ejemplo1/
│   └── tu_proyecto/
├── scripts/
└── src/
    ├── ejemplo1/
    └── tu_proyecto/
```

2. Prueba el proyecto:
```bash
cd build/tu_proyecto
make create    # Debería crear el proyecto
make all       # Debería ejecutar el flujo completo
```
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


