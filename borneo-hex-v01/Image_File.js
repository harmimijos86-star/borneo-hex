// Skrip Penjana 21 Fail Gambar (.jpg) untuk Folder ./images/ GitHub
(async function exportAllProductImages() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  for (const p of products) {
    const svgDataUrl = generateProductGraphic(p);
    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = svgDataUrl;
    });

    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const jpgUrl = canvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.href = jpgUrl;
    link.download = p.file.replace('./images/', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    await new Promise(r => setTimeout(r, 250)); // Jeda supaya pelayar tidak menyekat muat turun
  }
  alert('Kesemua 21 gambar telah dimuat turun! Sila pindahkan ke dalam folder "images/".');
})();