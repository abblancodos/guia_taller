# Guía de Scripts TCL para Vivado

Esta guía te ayudará a configurar y utilizar scripts TCL para automatizar flujos de trabajo en Vivado.

## Requisitos Previos

- Xilinx Vivado (Versión 2019.1 o superior)
- Git (para control de versiones)
- GNU Make (para Windows)
- GTKWave (opcional)

## Instalación en Windows

### 1. Instalar Git

Tienes dos métodos principales para instalar Git:

#### Método 1: Usando WinGet (Recomendado)

WinGet es el gestor de paquetes oficial de Windows que permite instalar aplicaciones de forma sencilla desde la línea de comandos.

> WinGet viene preinstalado en Windows 11 y versiones recientes de Windows 10. Si no lo tienes instalado, Windows te dirigirá automáticamente a la Microsoft Store para instalarlo.

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

### 2. Crear una llave SSH para GitLab

La configuración de llaves SSH te permite autenticarte con GitLab sin tener que introducir tu nombre de usuario y contraseña cada vez que realices operaciones Git.

1. Abre Git Bash (click derecho en cualquier carpeta > Git Bash Here)

2. Genera un nuevo par de llaves SSH:
```bash
ssh-keygen -t ed25519 -C "tu@email.com"
```

3. Cuando te pida la ubicación, puedes pulsar Enter para usar la ubicación predeterminada (`~/.ssh/id_ed25519`).

4. Te pedirá una contraseña (passphrase). Puedes establecer una para mayor seguridad o dejarla en blanco (menos seguro, pero más cómodo).

5. Inicia el agente SSH y añade tu llave:
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

6. Copia la llave pública:
```bash
cat ~/.ssh/id_ed25519.pub
```
   O para copiar directamente al portapapeles (en Windows):
```bash
cat ~/.ssh/id_ed25519.pub | clip
```

7. Ve a GitLab > Preferencias > Llaves SSH:
   - En la interfaz web de GitLab, haz clic en tu avatar (esquina superior derecha) > Preferencias
   - Navega a "SSH Keys" en el menú lateral
   - Pega tu llave pública en el campo "Key"
   - Dale un título descriptivo (ej: "Laptop Personal")
   - Haz clic en "Add key"

8. Verifica la conexión:
```bash
ssh -T git@gitlab.com
```
   Deberías recibir un mensaje de bienvenida de GitLab.

### 3. Instalar GNU Make

GNU Make es necesario para ejecutar los scripts de automatización. En la página de descarga (https://gnuwin32.sourceforge.net/packages/make.htm), busca el texto "If you download the Setup program of the package" y haz clic en el hipervínculo "Setup program" para descargar el instalador.

### 4. Instalar GTKWave a través de Icarus Verilog (Opcional)

GTKWave es un visualizador de formas de onda ligero y alternativo al de Vivado. La manera más sencilla de instalarlo en Windows es a través del instalador de Icarus Verilog.

1. Descarga el instalador de Icarus Verilog desde https://bleyer.org/icarus/
2. Ejecuta el instalador y sigue las instrucciones
3. Durante la instalación, asegúrate de que la opción de GTKWave esté seleccionada
4. El instalador configurará automáticamente las variables de entorno necesarias

Ventajas de instalar GTKWave a través de Icarus Verilog:
- Instalación más sencilla y directa
- Configuración automática de variables de entorno
- Incluye herramientas adicionales útiles para simulación de Verilog
- Actualizaciones y mantenimiento más consistentes

### 5. Configurar Variables de Entorno

Es crucial configurar correctamente las variables de entorno para que los comandos funcionen desde cualquier ubicación.

#### Pasos para configurar el PATH:

1. Busca "Variables de entorno" en el menú de inicio
2. En variables de usuario, localiza "Path"
3. Agrega las siguientes rutas:

```
C:\Xilinx\Vivado\2019.1\bin
C:\Xilinx\Vivado\2019.1\lib\win64.o
[Ruta donde instalaste Make]\bin
```

### 6. Verificar la Instalación

Abre una terminal y ejecuta estos comandos para verificar la instalación:
```bash
make -h    # Debería mostrar la ayuda de Make
vivado -h  # Debería mostrar la ayuda de Vivado
gtkwave -h # Debería mostrar la ayuda de GTKWave (si lo instalaste)
```

## Herramientas para Flujo de Diseño con Vivado

### Configuración del Proyecto

El script `prepare-workspace.ps1` permite configurar un proyecto de Vivado de forma automática, identificando los módulos top y testbench, y creando la estructura de carpetas necesaria.

### Ubicación de Ejecución

El script debe ejecutarse desde la **raíz del repositorio Git**. Es importante que estés posicionado en la carpeta principal del repositorio para que el script funcione correctamente.

```
MiRepositorio/
├── src/            # Aquí van tus archivos fuente (.sv, .v)
├── scripts/        # Scripts del proyecto
│   └── project_tcl_scripts/  # Scripts TCL base
└── build/          # Carpeta generada (ignorada por git)
```

### Ejecución del Script

Para ejecutar el script, abre PowerShell en la raíz del repositorio y utiliza el siguiente comando:

```powershell
.\prepare-workspace.ps1
```

Con opciones adicionales:

```powershell
.\prepare-workspace.ps1 -SetTopModule archivo.sv -SetSimTop archivo_tb.sv -Chip "XC7A35T"
```

### Errores de Permisos en PowerShell

Si encuentras errores relacionados con la política de ejecución de scripts en PowerShell, tienes varias opciones para solucionarlo:

#### Opción 1: Ejecutar con Bypass para la sesión actual

```powershell
powershell -ExecutionPolicy Bypass -File .\prepare-workspace.ps1
```

#### Opción 2: Cambiar la política de ejecución temporalmente

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\prepare-workspace.ps1
```

#### Opción 3: Desbloquear el archivo específico

```powershell
Unblock-File .\prepare-workspace.ps1
.\prepare-workspace.ps1
```

#### Opción 4: Cambiar la política de ejecución permanentemente (requiere privilegios de administrador)

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

> **Nota de seguridad**: Utiliza estas opciones con precaución, especialmente la opción 4, ya que modifica la configuración de seguridad de PowerShell de forma permanente.

## Estructura generada

Después de ejecutar el script, se creará la siguiente estructura:

```
MiRepositorio/
├── src/
│   ├── constraints/  # Archivos de restricciones
│   ├── ips/          # IPs personalizados
│   └── testbench/    # Archivos de testbench
├── scripts/
├── build/            # Archivos generados de Vivado
│   └── [NombreRepo]/ # Archivos específicos del proyecto
└── sim.conf          # Configuración de simulación
```

## Archivos de Configuración

- **sim.conf**: Contiene la configuración actual del proyecto, incluyendo los módulos top de diseño y simulación.
- **Makefile**: Proporciona comandos para trabajar con el proyecto desde la línea de comandos.

## Archivos Importantes

### globals.tcl
Este archivo contiene las variables globales del proyecto:
- Nombre del módulo TOP
- Nombre del módulo de simulación
- Configuraciones específicas del subproyecto

### create_project.tcl
Script para crear un nuevo proyecto de Vivado:
- Configuración de IP cores
- Definición de carpetas fuente
- Especificación de archivos de constraints

### update_project.tcl
Usado para actualizar proyectos existentes:
- Agregar nuevos archivos fuente
- Modificar configuraciones
- Actualizar constraints

## Comandos Disponibles

Estos son los comandos principales que puedes usar con `make`:

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

Para ejecutar un proyecto ejemplo:
1. Abre una terminal en la carpeta del proyecto
2. Ejecuta `make create` para crear el proyecto
3. **Importante:** Crea una carpeta llamada "rpt" dentro de la carpeta "build/[NombreRepo]/"
   ```bash
   mkdir -p build/[NombreRepo]/rpt
   ```
4. Ejecuta `make flow` para el flujo completo
5. Usa `make open` para abrir Vivado

## Pasos adicionales importantes

### Creación de la carpeta de reportes

Después de ejecutar `make create`, es **necesario** crear una carpeta llamada "rpt" dentro de la carpeta del proyecto en la estructura build:

```bash
# Ejemplo para un proyecto llamado "mi_proyecto"
mkdir -p build/mi_proyecto/rpt
```

Esta carpeta es utilizada por los scripts de Vivado para almacenar los reportes generados durante el proceso de síntesis y no se crea automáticamente. Si no existe, algunos comandos como `make flow` o `make logic_synth` pueden fallar.

## Solución de Problemas Comunes

### Errores en la ejecución de scripts

1. **El script no encuentra la carpeta de scripts TCL**
   - Asegúrate de que exista la carpeta `scripts/project_tcl_scripts/` con los siguientes archivos:
     - create_project.tcl
     - globals.tcl
     - update_project.tcl
     - Makefile

2. **No se detectan archivos SystemVerilog**
   - Verifica que tus archivos fuente (.sv, .v) estén en la carpeta `src/` y que tengan la extensión correcta.

3. **Errores al leer o escribir archivos**
   - Asegúrate de tener permisos suficientes en la carpeta del repositorio.

### Otros problemas comunes

1. **Error: Command not found**
   - Verifica las variables de entorno
   - Reinstala las herramientas necesarias

2. **Error en la síntesis**
   - Revisa los archivos de constraints
   - Verifica la jerarquía de módulos

3. **GTKWave no abre**
   - Comprueba la instalación
   - Verifica la variable de entorno
