(() => {
  const toast = document.getElementById('toast');
  let timer;

  function message(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('show'), 1600);
  }

  function copyOldWay(text) {
    const area = document.createElement('textarea');
    area.value = text;
    area.readOnly = true;
    area.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    if (!copied) throw new Error('copie refusée');
  }

  async function copyColor(color) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(color);
      } else {
        copyOldWay(color);
      }
      message(`${color} copié ! (bon vol)`);
    } catch (error) {
      console.warn('Copie impossible', error);
      message(`Impossible de copier ${color}`);
    }
  }

  document.querySelectorAll('[data-palette]').forEach((palette) => {
    const colors = palette.dataset.palette.split(',').map((color) => color.trim());
    const row = palette.classList.contains('pal-row');
    const large = palette.classList.contains('swatches');

    colors.forEach((color, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.style.background = color;
      button.title = color;
      button.setAttribute('aria-label', `Copier ${color}`);

      if (row || large) {
        const angle = (index % 2 ? 1 : -1) * (row ? 1.5 + index : 1.5);
        button.style.setProperty('--r', `${angle}deg`);
      }
      if (large) button.innerHTML = `<b>${color}</b>`;

      button.addEventListener('click', () => copyColor(color));
      palette.appendChild(button);
    });
  });
})();
