document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn');
  const urlInput = document.getElementById('url');
  const spinner = document.getElementById('spinner');
  const status = document.getElementById('status');

  btn.disabled = true;
  status.style.border = "none";

  urlInput.addEventListener('input', () => {
    const hasText = urlInput.value.trim().length > 0;
    /*btn.disabled = !hasText;
    btn.style.opacity = hasText ? '1' : '0.7';
    btn.style.cursor = hasText ? 'pointer' : 'not-allowed';*/
    if(!hasText || urlInput.value.includes('youtube.com') || urlInput.value.includes('youtu.be')){
    btn.disabled = !hasText;
    btn.style.opacity = hasText ? '1' : '0.7';
    btn.style.cursor = hasText ? 'pointer' : 'not-allowed';
    }
  });

  btn.addEventListener('click', async () => {
    const url = urlInput.value;
    const spinner = document.getElementById("spinner");
    const status = document.getElementById("status");

    if (!url) {
      status.textContent = "Por favor, introduce una URL válida de Youtube.";
      status.style.color = "black";
      status.style.backgroundColor = "var(--danger-color)";
      status.style.border = "var(--border-border)";
      return;
    }

    spinner.classList.remove("hidden");
    status.textContent = "Descargando...";
    status.style.color = "black";
    status.style.backgroundColor = "var(--success-color)";
    status.style.border = "var(--border-border)";

    try {
      const result = await window.api.downloadAudio(url);
      if (result.success) {
        status.textContent = "Descargado: " + result.filePath;
        status.style.color = "black";
        status.style.backgroundColor = "var(--success-color)";
        status.style.border = "var(--border-border)";
      } else {
        status.textContent = "Error: URL no válida o descarga fallida.";
        status.style.color = "black";
        status.style.backgroundColor = "var(--danger-color)";
        status.style.border = "var(--border-border)";
      }
    } catch (error) {
      status.textContent = "Error: URL no válida o descarga fallida.";
      status.style.color = "var(--danger-color)";
      status.style.border = "var(--border-border)";
    } finally {
      spinner.classList.add("hidden");
    }
  });

   document.getElementById('exit-btn').addEventListener('click', () => {
    window.api.closeApp();
  });

  document.getElementById('minimize-btn').addEventListener('click', () => {
    window.api.minimizeApp();
  });

  
});

