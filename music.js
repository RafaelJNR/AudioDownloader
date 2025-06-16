const audioElement = document.getElementById('audio');

document.getElementById("customFileButton").addEventListener("click", function() {
document.getElementById("audioFile").click();
});

document.getElementById("audioFile").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (file) {
    const file = this.files[0];
    if (file) {
        const ObjectURL = URL.createObjectURL(file);
        audioElement.src = ObjectURL;
        audioElement.play().catch(error => {
            alert('Tipo de audio no soportado');
        });
    }
  }
});