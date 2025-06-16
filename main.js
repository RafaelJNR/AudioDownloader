const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ytdl = require('youtube-dl-exec');

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
    if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return { 
      success: false, 
      error:  'Error: Enlace de Youtube no válido.' 
    };
    }

    // 2. Obtener metadatos del video
    const videoInfo = await ytdl(url, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      preferFreeFormats: true
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

    // 5. Descargar el audio
    await ytdl(url, {
      extractAudio: true,
      audioFormat: 'mp3',
      output: outputPath,
      noCheckCertificates: true
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
        ? 'Error: ffmpeg no encontrado. Verifica la instalación.' 
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