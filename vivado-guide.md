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
# Bash Script (setup_structure.sh)
#!/bin/bash

# Salir en caso de error
set -e

# Crear directorio temporal para el clon
mkdir -p temp_repo

# Clonar el repositorio
git clone https://github.com/HalfS0ur/vivado_tcl_scripts.git temp_repo

# Crear la estructura de directorios necesaria
mkdir -p scripts \
         src \
         build/laboratorio1 \
         build/build_scripts \
         build/ejemplo1

# Copiar la carpeta scripts a la raíz
cp -r temp_repo/scripts/* scripts/

# Copiar los archivos de clean_tcl_scripts a las carpetas necesarias
cp -r temp_repo/clean_tcl_scripts/* build/laboratorio1/
cp -r temp_repo/clean_tcl_scripts/* build/build_scripts/
cp -r temp_repo/clean_tcl_scripts/* build/ejemplo1/

# Copiar el ejemplo1 del repositorio a src (ahora desde la ubicación correcta)
if [ -d "temp_repo/src/ejemplo1" ]; then
    cp -r temp_repo/src/ejemplo1 src/
    echo "Carpeta ejemplo1 copiada exitosamente a src"
else
    echo "AVISO: La carpeta ejemplo1 no se encontró en el repositorio (src/ejemplo1)"
fi

# Actualizar los archivos TCL en build/ejemplo1 para que apunten al ejemplo correcto
EJEMPLO_PATH="build/ejemplo1"
if [ -d "$EJEMPLO_PATH" ]; then
    # Actualizar create_project.tcl y update_project.tcl
    for file in create_project.tcl update_project.tcl; do
        if [ -f "$EJEMPLO_PATH/$file" ]; then
            sed -i "s/REPO_LAB/ejemplo1/g" "$EJEMPLO_PATH/$file"
            sed -i "s/ejercicioN/./g" "$EJEMPLO_PATH/$file"
        fi
    done
    echo "Archivos TCL actualizados para ejemplo1"
fi

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
# Bash Script (configure_vivado_project.sh)
#!/bin/bash

# Get current directory name as project name
PROJECT_NAME=$(basename "$(pwd)")

# Path to build directory and project directory
BUILD_PATH="../../build"
PROJECT_PATH="$BUILD_PATH/$PROJECT_NAME"

# Verify the build directory exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo "Error: Build directory for $PROJECT_NAME not found in $BUILD_PATH"
    exit 1
fi

# Get absolute paths
ROOT_PATH=$(realpath "../..")

# Update globals.tcl
sed -i "s|set ROOT_PATH \$PROJECT_PATH/../..|set ROOT_PATH \"$ROOT_PATH\"|" "$PROJECT_PATH/globals.tcl"

# Update create_project.tcl and update_project.tcl
for file in "create_project.tcl" "update_project.tcl"; do
    sed -i "s/REPO_LAB/$PROJECT_NAME/g" "$PROJECT_PATH/$file"
    sed -i "s/ejercicioN/./g" "$PROJECT_PATH/$file"
done

# Change to project directory and create project
cd "$PROJECT_PATH"
echo "Creating Vivado project..."
make create

echo "Setup complete! Project created in $PROJECT_PATH"
```

Para ejecutar el script:
```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
```

:::tip
La carpeta `build_scripts` sirve como template. Cuando necesites crear un nuevo laboratorio, puedes copiarla y renombrarla según necesites.
:::

### 6. Configuración de Proyectos Individuales
:::info
Una vez que hayas configurado el entorno de desarrollo, puedes usar estos scripts para configurar cada proyecto individual dentro de la estructura. Estos scripts deben colocarse en la carpeta del proyecto dentro de `src/`.
:::

:::warning
¡IMPORTANTE! Estos scripts deben ejecutarse desde dentro de la carpeta de tu proyecto en `src/`. El nombre de la carpeta donde ejecutes el script será usado como nombre del proyecto en la carpeta `build/`.
:::

#### Windows PowerShell
```powershell
# PowerShell Script (setup_vivado_project.ps1)
# Get current directory name as project name
$projectName = Split-Path -Leaf (Get-Location)

# Create build directory if it doesn't exist (two levels up)
$buildPath = "..\..\build"
if (-not (Test-Path $buildPath)) {
    Write-Host "Creating build directory..."
    New-Item -ItemType Directory -Path $buildPath | Out-Null
}

# Create project directory in build
$projectPath = Join-Path $buildPath $projectName
if (-not (Test-Path $projectPath)) {
    Write-Host "Creating project directory..."
    New-Item -ItemType Directory -Path $projectPath | Out-Null
}

# Download TCL scripts
$tclFiles = @(
    "globals.tcl",
    "create_project.tcl",
    "update_project.tcl",
    "Makefile"
)

$baseUrl = "https://raw.githubusercontent.com/HalfS0ur/vivado_tcl_scripts/main/clean_tcl_scripts"

foreach ($file in $tclFiles) {
    $url = "$baseUrl/$file"
    $outputPath = Join-Path $projectPath $file
    Write-Host "Downloading $file..."
    Invoke-WebRequest -Uri $url -OutFile $outputPath
}

# Update paths in TCL files
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
    $content = $content -replace "REPO_LAB", $projectName
    $content = $content -replace "ejercicioN", "."
    $content | Set-Content $filePath
}

# Change to project directory and create project
Set-Location $projectPath
Write-Host "Creating Vivado project..."
make create
Write-Host "Setup complete! Project created in $projectPath"
```

#### Linux/macOS Bash
```bash
#!/bin/bash

# Get current directory name as project name
PROJECT_NAME=$(basename "$(pwd)")

# Create build directory if it doesn't exist (two levels up)
BUILD_PATH="../../build"
if [ ! -d "$BUILD_PATH" ]; then
    echo "Creating build directory..."
    mkdir -p "$BUILD_PATH"
fi

# Create project directory in build
PROJECT_PATH="$BUILD_PATH/$PROJECT_NAME"
if [ ! -d "$PROJECT_PATH" ]; then
    echo "Creating project directory..."
    mkdir -p "$PROJECT_PATH"
fi

# Download TCL scripts
TCL_FILES=("globals.tcl" "create_project.tcl" "update_project.tcl" "Makefile")
BASE_URL="https://raw.githubusercontent.com/HalfS0ur/vivado_tcl_scripts/main/clean_tcl_scripts"

for file in "${TCL_FILES[@]}"; do
    echo "Downloading $file..."
    curl -s "$BASE_URL/$file" -o "$PROJECT_PATH/$file"
done

# Update paths in TCL files
ROOT_PATH=$(realpath "../..")

# Update globals.tcl
sed -i "s|set ROOT_PATH \$PROJECT_PATH/../..|set ROOT_PATH \"$ROOT_PATH\"|" "$PROJECT_PATH/globals.tcl"

# Update create_project.tcl and update_project.tcl
for file in "create_project.tcl" "update_project.tcl"; do
    sed -i "s/REPO_LAB/$PROJECT_NAME/g" "$PROJECT_PATH/$file"
    sed -i "s/ejercicioN/./g" "$PROJECT_PATH/$file"
done

# Change to project directory and create project
cd "$PROJECT_PATH"
echo "Creating Vivado project..."
make create
echo "Setup complete! Project created in $PROJECT_PATH"
```

:::success
Al ejecutar cualquiera de estos scripts en tu carpeta de proyecto:
1. Se creará una carpeta en `build/` con el mismo nombre que tu carpeta de proyecto
2. Se descargarán y configurarán los archivos TCL necesarios
3. Se actualizarán las rutas y nombres en los archivos para que coincidan con tu proyecto
4. Se ejecutará `make create` para inicializar el proyecto de Vivado
:::

:::info
Por ejemplo, si tu proyecto está en `src/mi_repo/proyecto1` y ejecutas el script desde esa ubicación:
- Se creará `build/proyecto1/` con todos los archivos necesarios
- Los archivos TCL se configurarán para usar el nombre "proyecto1"
- Las rutas se actualizarán para apuntar correctamente a tus archivos fuente
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


