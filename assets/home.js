(() => {
  const carnets = Array.isArray(window.CARNETS) ? window.CARNETS : [];
  const ui = window.CarnetsUI;

  function createMedia(carnet) {
    if (carnet.video) {
      const video = document.createElement('video');
      video.src = carnet.video;
      video.controls = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      if (carnet.poster) video.poster = carnet.poster;
      return video;
    }

    if (carnet.image) {
      const image = document.createElement('img');
      image.src = carnet.image;
      image.alt = carnet.imageAlt || carnet.title;
      return image;
    }

    return null;
  }

  function renderFeatured() {
    const featured = carnets.find((carnet) => carnet.featured);
    const zone = document.getElementById('featured');
    const clipsBox = document.getElementById('featured-clips');
    if (!featured || !zone || !clipsBox) return;

    const polaroid = document.createElement('div');
    polaroid.className = 'polaroid';

    const tape = document.createElement('span');
    tape.className = 'tape';
    polaroid.appendChild(tape);

    const stamp = document.createElement('span');
    stamp.className = 'stamp';
    stamp.innerHTML = featured.featuredStamp;
    polaroid.appendChild(stamp);

    const photo = document.createElement('div');
    photo.className = 'ph';
    const image = document.createElement('img');
    image.src = featured.image;
    image.alt = featured.imageAlt || featured.title;
    image.style.objectPosition = featured.imagePosition || 'center';
    photo.appendChild(image);

    const meta = document.createElement('span');
    meta.className = 'meta';
    meta.textContent = featured.meta;
    photo.appendChild(meta);
    polaroid.appendChild(photo);

    const caption = document.createElement('span');
    caption.className = 'caption';
    caption.textContent = featured.featuredCaption;
    polaroid.appendChild(caption);

    const content = document.createElement('div');
    content.className = 'featured-txt';

    const kicker = document.createElement('span');
    kicker.className = 'kicker';
    kicker.textContent = featured.featuredKicker;
    content.appendChild(kicker);

    const title = document.createElement('h2');
    title.textContent = featured.title;
    content.appendChild(title);

    const excerpt = document.createElement('p');
    excerpt.textContent = featured.excerpt;
    content.appendChild(excerpt);

    const note = document.createElement('span');
    note.className = 'margin-note';
    note.textContent = featured.note;
    content.appendChild(note);

    const palette = document.createElement('div');
    palette.className = 'pal-row';
    palette.dataset.palette = featured.palette.join(',');
    content.appendChild(palette);

    const link = document.createElement('a');
    link.className = 'readmore';
    link.href = featured.url;
    link.textContent = 'Lire le carnet →';
    content.appendChild(link);

    zone.append(polaroid, content);

    (featured.clips || []).forEach((clip) => {
      const card = document.createElement('div');
      card.className = 'filmcard';

      const clipTape = document.createElement('span');
      clipTape.className = 'tape';
      card.appendChild(clipTape);

      const rec = document.createElement('span');
      rec.className = 'rec';
      rec.textContent = clip.rec;
      card.appendChild(rec);

      const video = document.createElement('video');
      video.controls = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'none';
      video.src = clip.src;
      if (clip.poster) video.poster = clip.poster;
      card.appendChild(video);

      const clipCaption = document.createElement('span');
      clipCaption.className = 'caption';
      clipCaption.textContent = clip.caption;
      card.appendChild(clipCaption);

      clipsBox.appendChild(card);
    });
  }

  function renderCards() {
    const grid = document.getElementById('posts');
    if (!grid) return;

    carnets.filter((carnet) => !carnet.featured).forEach((carnet) => {
      const card = document.createElement('article');
      card.className = 'post';

      const tape = document.createElement('span');
      tape.className = 'tape';
      card.appendChild(tape);

      const shot = document.createElement('div');
      shot.className = 'shot';
      const media = createMedia(carnet);
      if (media) {
        shot.appendChild(media);
      } else if (carnet.fallback) {
        shot.style.background = carnet.fallback;
      }

      const meta = document.createElement('span');
      meta.className = 'meta';
      meta.textContent = carnet.meta;
      shot.appendChild(meta);
      card.appendChild(shot);

      if (Array.isArray(carnet.clips)) {
        const duo = document.createElement('div');
        duo.className = 'duo';

        carnet.clips.forEach((clip) => {
          const cell = document.createElement('div');
          cell.className = 'cell';

          const video = document.createElement('video');
          video.src = clip.src;
          video.controls = true;
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.preload = 'none';
          if (clip.poster) video.poster = clip.poster;
          cell.appendChild(video);

          const cap = document.createElement('span');
          cap.className = 'cap';
          cap.textContent = clip.caption;
          cell.appendChild(cap);
          duo.appendChild(cell);
        });

        card.appendChild(duo);
      }

      const body = document.createElement('div');
      body.className = 'body';

      const heading = document.createElement('h3');
      const headingLink = document.createElement('a');
      headingLink.href = carnet.url;
      headingLink.textContent = carnet.title;
      heading.appendChild(headingLink);
      body.appendChild(heading);

      const excerpt = document.createElement('p');
      excerpt.className = 'excerpt';
      excerpt.textContent = carnet.excerpt;
      body.appendChild(excerpt);

      const note = document.createElement('span');
      note.className = 'hand-note';
      note.textContent = carnet.note;
      body.appendChild(note);

      const postMeta = document.createElement('p');
      postMeta.className = 'postmeta';
      postMeta.textContent = [carnet.date, carnet.read].filter(Boolean).join(' · ');
      body.appendChild(postMeta);

      const readMore = document.createElement('a');
      readMore.className = 'readmore';
      readMore.href = carnet.url;
      readMore.style.marginTop = '.5rem';
      readMore.textContent = 'Lire le carnet →';
      body.appendChild(readMore);

      const palette = document.createElement('div');
      palette.className = 'mini-pal';
      palette.dataset.palette = carnet.palette.join(',');
      body.appendChild(palette);

      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  function renderDestinations() {
    const box = document.getElementById('dest-list');
    if (!box) return;

    carnets.forEach((carnet) => {
      const link = document.createElement('a');
      link.className = 'dest';
      link.href = carnet.url;

      const swatch = document.createElement('span');
      swatch.className = 'sw';
      swatch.style.background = carnet.destinationColor;
      link.append(swatch, document.createTextNode(carnet.destination));
      box.appendChild(link);
    });
  }

  function updateCounts() {
    document.querySelectorAll('[data-carnet-count]').forEach((node) => {
      node.textContent = String(carnets.length);
    });
  }

  renderFeatured();
  renderCards();
  renderDestinations();
  updateCounts();
  if (ui) ui.populatePalettes(document);
})();
