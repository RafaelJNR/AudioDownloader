
# 🎵 YT Audio Downloader 🎧

Aplicación de escritorio para descargar audio de YT y reproducir tus archivos locales, construida con Electron.

## ✨ Características principales

| Función | Descripción |
|---------|-------------|
| ⚡ Descarga rápida | Obtén audio en formato MP3 desde YT |
| 🎧 Reproductor integrado | Escucha tus descargas directamente |
| 🎨 Diseño oscuro moderno y minimalista |
| 📂 Gestión de archivos | Selecciona y reproduce audios locales |
| 🛡️ Sin anuncios ni trackers |

## 🛠 Requisitos del sistema

- Node.js v16+
- npm v7+
- FFmpeg.exe (copiar en la carpeta bin)
- yt-dlp.exe (copiar en la carpeta bin)
- 100MB de espacio libre

## ⚙️ Configuración avanzada

    Archivo	                 Propósito
|------------|------------------------------------|
|index.html  | Interfaz gráfica de la aplicación. |
|styles.css	 | Personaliza los estilos. |
|main.js	 | Lógica de descarga. |
|music.js    | Lógica del reproductor de audio. |
|preload.js	 | Puente entre procesos. |
|renderer.js | Maneja la lógica de la interfaz de usuario y comunicación con main.js. |

## 🚀 Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/RafaelJNR/AudioDownloader.git
cd AudioDownloader

# 2. Crea la carpeta bin y añade los ejecutables
mkdir -p bin
# Coloca aquí los archivos ffmpeg.exe y yt-dlp.exe (Windows) (Descargar siempre de fuentes oficiales) o los binarios correspondientes para tu sistema

mkdir -p images
# Coloca aquí el archivo según las especificaciones de tu S.O. que servirá como icono de tu app. 

# 3. Instala dependencias de Node.js
npm install

# 4. Inicia la aplicación
npm start



