(() => {
  const carnets = window.CARNETS || [];
  const featured = carnets.find((carnet) => carnet.featured);
  const others = carnets.filter((carnet) => !carnet.featured);

  const video = (src, poster = '') => `
    <video controls muted loop playsinline preload="none"${poster ? ` poster="${poster}"` : ''} src="${src}"></video>`;

  if (featured) {
    document.getElementById('featured').innerHTML = `
      <div class="polaroid">
        <span class="tape"></span>
        <span class="stamp">${featured.featuredStamp}</span>
        <div class="ph">
          <img src="${featured.image}" alt="${featured.imageAlt || featured.title}" style="object-position:${featured.imagePosition || 'center'}">
          <span class="meta">${featured.meta}</span>
        </div>
        <span class="caption">${featured.featuredCaption}</span>
      </div>
      <div class="featured-txt">
        <span class="kicker">${featured.featuredKicker}</span>
        <h2>${featured.title}</h2>
        <p>${featured.excerpt}</p>
        <span class="margin-note">${featured.note}</span>
        <div class="pal-row" data-palette="${featured.palette.join(',')}"></div>
        <a class="readmore" href="${featured.url}">Lire le carnet →</a>
      </div>`;

    document.getElementById('featured-clips').innerHTML = featured.clips.map((clip) => `
      <div class="filmcard">
        <span class="tape"></span>
        <span class="rec">${clip.rec}</span>
        ${video(clip.src, clip.poster)}
        <span class="caption">${clip.caption}</span>
      </div>`).join('');
  }

  document.getElementById('posts').innerHTML = others.map((carnet) => {
    const mainMedia = carnet.video
      ? video(carnet.video, carnet.poster)
      : `<img src="${carnet.image}" alt="${carnet.imageAlt || carnet.title}">`;

    const clips = carnet.clips ? `
      <div class="duo">
        ${carnet.clips.map((clip) => `
          <div class="cell">
            ${video(clip.src, clip.poster)}
            <span class="cap">${clip.caption}</span>
          </div>`).join('')}
      </div>` : '';

    return `
      <article class="post">
        <span class="tape"></span>
        <div class="shot">
          ${mainMedia}
          <span class="meta">${carnet.meta}</span>
        </div>
        ${clips}
        <div class="body">
          <h3><a href="${carnet.url}">${carnet.title}</a></h3>
          <p class="excerpt">${carnet.excerpt}</p>
          <span class="hand-note">${carnet.note}</span>
          <p class="postmeta">${[carnet.date, carnet.read].filter(Boolean).join(' · ')}</p>
          <a class="readmore" href="${carnet.url}" style="margin-top:.5rem">Lire le carnet →</a>
          <div class="mini-pal" data-palette="${carnet.palette.join(',')}"></div>
        </div>
      </article>`;
  }).join('');

  document.getElementById('dest-list').innerHTML = carnets.map((carnet) => `
    <a class="dest" href="${carnet.url}">
      <span class="sw" style="background:${carnet.destinationColor}"></span>${carnet.destination}
    </a>`).join('');

  document.querySelectorAll('[data-carnet-count]').forEach((element) => {
    element.textContent = carnets.length;
  });
})();
