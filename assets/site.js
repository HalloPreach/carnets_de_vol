(() => {
  const toast = document.getElementById('toast');
  let toastTimer;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let copied = false;
    try {
      copied = document.execCommand('copy');
    } finally {
      textarea.remove();
    }

    if (!copied) {
      throw new Error('La copie de secours a échoué.');
    }
  }

  async function copyHex(hex) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(hex);
      } else {
        fallbackCopy(hex);
      }
      notify(`${hex} copié ! (bon vol)`);
      return true;
    } catch (error) {
      console.error('Impossible de copier la couleur :', error);
      notify(`Impossible de copier ${hex}`);
      return false;
    }
  }

  function createPaletteButton(color, index, type) {
    const button = document.createElement('button');
    button.type = 'button';
    button.style.background = color;
    button.title = color;
    button.setAttribute('aria-label', `Copier ${color}`);
    button.addEventListener('click', () => copyHex(color));

    if (type === 'row') {
      const direction = index % 2 ? 1 : -1;
      button.style.setProperty('--r', `${direction * (1.5 + index)}deg`);
    } else if (type === 'swatches') {
      const direction = index % 2 ? 1 : -1;
      button.style.setProperty('--r', `${direction * 1.5}deg`);
      const label = document.createElement('b');
      label.textContent = color;
      button.appendChild(label);
    }

    return button;
  }

  function populatePalettes(root = document) {
    root.querySelectorAll('[data-palette]').forEach((container) => {
      if (container.dataset.paletteReady === 'true') return;

      const colors = container.dataset.palette
        .split(',')
        .map((color) => color.trim())
        .filter(Boolean);

      const type = container.classList.contains('pal-row')
        ? 'row'
        : container.classList.contains('swatches')
          ? 'swatches'
          : 'mini';

      colors.forEach((color, index) => {
        container.appendChild(createPaletteButton(color, index, type));
      });

      container.dataset.paletteReady = 'true';
    });
  }

  window.CarnetsUI = {
    copyHex,
    notify,
    populatePalettes
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => populatePalettes(document));
  } else {
    populatePalettes(document);
  }
})();
