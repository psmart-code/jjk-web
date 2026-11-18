'use strict';
const eventUrl = new URL('page.html', window.location.href).href;
const invitation = '🥋 Torneo de Confraternización de Taekwondo y Kickboxing. Por la sonrisa de nuestros adultos mayores.\n📅 Sábado 19 de diciembre de 2026, 16:00.\n📍 Academia Kangs.\n❤️ Entrada: pañales, toallas húmedas, cepillos de dientes, pasta dental, jaboncillos u otros artículos de higiene.\n¡Te esperamos!';
function announce(message) { document.querySelectorAll('[data-status]').forEach(element => { element.textContent = message; }); }
async function copyInvitation() {
  try { await navigator.clipboard.writeText(eventUrl); announce('Enlace copiado. ¡Gracias por compartir!'); }
  catch { window.prompt('Copia este enlace para compartir la invitación:', eventUrl); }
}
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', copyInvitation));
document.querySelectorAll('[data-share]').forEach(button => button.addEventListener('click', async () => {
  if (!navigator.share) return copyInvitation();
  try { await navigator.share({title: 'Torneo de Confraternización 2026', text: invitation, url: eventUrl}); }
  catch (error) { if (error.name !== 'AbortError') await copyInvitation(); }
}));
document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.href = `https://wa.me/?text=${encodeURIComponent(`${invitation}\n${eventUrl}`)}`;
  link.target = '_blank'; link.rel = 'noopener noreferrer';
});

// Los métodos se activan únicamente cuando se configuran los destinos de esta campaña.
const donationConfig = window.donationConfig || {};
if (donationConfig.bankQr) {
  document.querySelectorAll('[data-bank-qr]').forEach(container => {
    const image = document.createElement('img');
    image.className = 'bank-qr';
    image.alt = 'Código QR bancario para apoyar la campaña por nuestros adultos mayores';
    image.src = donationConfig.bankQr;
    const download = document.createElement('a');
    download.className = 'button secondary';
    download.href = donationConfig.bankQr;
    download.download = 'qr-apoyo-adultos-mayores';
    download.textContent = 'Descargar QR';
    image.addEventListener('error', () => {
      const message = document.createElement('p');
      message.textContent = 'No pudimos cargar el QR. Intenta nuevamente más tarde.';
      container.replaceChildren(message);
    });
    container.replaceChildren(image, download);
  });
}
if (donationConfig.walletUrl) {
  try {
    const walletUrl = new URL(donationConfig.walletUrl);
    if (walletUrl.protocol === 'https:') {
      document.querySelectorAll('[data-wallet]').forEach(container => {
        const link = document.createElement('a');
        link.href = walletUrl.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'button primary';
        link.textContent = donationConfig.walletLabel || 'Apoyar desde el exterior';
        const note = document.createElement('p');
        note.className = 'note';
        note.textContent = 'El enlace se abrirá en la plataforma de pago para que puedas completar tu aporte.';
        container.replaceChildren(link, note);
      });
    }
  } catch { /* Mantener el aviso de disponibilidad si el enlace no es válido. */ }
}
