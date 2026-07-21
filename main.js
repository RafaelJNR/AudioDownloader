const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const youtubeDlExec = require('youtube-dl-exec');

// Rutas a los binarios en tu carpeta 'bin'
const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe');
const ffmpegPath = path.join(__dirname, 'bin', 'ffmpeg.exe');

// Crear la instancia de ytdl apuntando a tu ejecutable local de yt-dlp
const ytdl = youtubeDlExec.create(ytDlpPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 600,
    resizable: false,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      devTools: false,
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('download-audio', async (event, url) => {
  try {
    // 1. Validar URL
    if (!url || (!url.includes('youtube.com') && !url.includes('youtu.be'))) {
      return { 
        success: false, 
        error: 'Error: Enlace de Youtube no válido.' 
      };
    }

    // Argumento para evitar la restricción SABR y bloqueos de cliente de YouTube
    const extractorArgsOption = 'youtube:player_client=ios,android,mweb';

    // 2. Obtener metadatos del video
    const videoInfo = await ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      preferFreeFormats: true,
      extractorArgs: extractorArgsOption
    });

    // 3. Limpiar y formatear el título
    const cleanTitle = (videoInfo.title || `audio_${Date.now()}`)
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '_') // Reemplazar espacios con _
      .substring(0, 50); // Limitar longitud

    // 4. Configurar ruta de descarga
    const outputPath = path.join(
      app.getPath('downloads'),
      `${cleanTitle}.mp3`
    );

    // 5. Descargar y convertir el audio a MP3 usando ffmpeg de la carpeta bin
    await ytdl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputPath,
      noCheckCertificates: true,
      extractorArgs: extractorArgsOption,
      ffmpegLocation: ffmpegPath
    });

    return { 
      success: true, 
      filePath: outputPath,
      fileName: `${cleanTitle}.mp3`
    };

  } catch (error) {
    return { 
      success: false, 
      error: error.message.includes('ENOENT') 
        ? 'Error: ffmpeg o yt-dlp no encontrado en la carpeta bin.' 
        : error.message 
    };
  }
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('minimize-app', () => {
  BrowserWindow.getFocusedWindow().minimize();
});