document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  const urlInput = document.getElementById('url');
  const spinner = document.getElementById('spinner');
  const status = document.getElementById('status');

  btn.disabled = true;

  // Función para comprobar si es una URL válida de YouTube
  const isValidYouTubeUrl = (url) => {
    const val = url.trim();
    return val.length > 0 && (val.includes('youtube.com/') || val.includes('youtu.be/'));
  };

  urlInput.addEventListener('input', () => {
    const isValid = isValidYouTubeUrl(urlInput.value);
    btn.disabled = !isValid;
  });

  btn.addEventListener('click', async () => {
    const url = urlInput.value.trim();

    if (!isValidYouTubeUrl(url)) {
      status.textContent = "Por favor, introduce una URL válida de YouTube.";
      status.className = "status-message status-danger";
      return;
    }

    spinner.classList.remove("hidden");
    status.textContent = "Descargando...";
    status.className = "status-message status-success";

    try {
      // Timeout de seguridad de 2 minutos para dar margen a descargas o conversiones largas
      const downloadPromise = window.api.downloadAudio(url);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tiempo de espera agotado")), 120000)
      );

      const result = await Promise.race([downloadPromise, timeoutPromise]);

      if (result && result.success) {
        status.textContent = "Descargado con éxito: " + (result.fileName || "");
        status.className = "status-message status-success";
      } else {
        throw new Error(result?.error || "Descarga fallida");
      }
    } catch (error) {
      status.textContent = "Error: " + (error.message || "URL no válida o descarga fallida.");
      status.className = "status-message status-danger";
    } finally {
      spinner.classList.add("hidden");
    }
  });

  // Controles para la barra de título personalizada
  document.getElementById('exit-btn').addEventListener('click', () => {
    window.api.closeApp();
  });

  document.getElementById('minimize-btn').addEventListener('click', () => {
    window.api.minimizeApp();
  });
});