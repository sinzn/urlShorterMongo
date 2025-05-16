function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    const notification = document.getElementById('notification');
    notification.classList.remove('hidden');
    setTimeout(() => {
      notification.classList.add('hidden');
    }, 2000);
  });
}

