// Preserve the complete live Tableau canvas in overview and detail modes.
(() => {
  const panel = document.querySelector('.tableau-wrap');
  const frame = panel.querySelector('iframe');
  const toggle = document.querySelector('.dashboard-toggle');
  const controls = document.querySelector('.dashboard-pan');
  const left = document.getElementById('dashboard-left');
  const right = document.getElementById('dashboard-right');
  const slider = document.getElementById('dashboard-position');
  const positionLabel = document.getElementById('dashboard-position-label');
  let enlarged = false;
  function syncPosition() {
    const max = Math.max(0, panel.scrollWidth - panel.clientWidth);
    const position = max ? Math.round(panel.scrollLeft / max * 100) : 0;
    slider.value = String(position);
    const label = position === 0 ? 'Left edge' : position === 100 ? 'Right edge' : `${position}% across`;
    slider.setAttribute('aria-valuetext', label);
    positionLabel.textContent = label;
    left.disabled = panel.scrollLeft <= 1;
    right.disabled = panel.scrollLeft >= max - 1;
  }
  function resize() {
    const scale = Math.min(1, panel.clientWidth / 1500);
    panel.classList.toggle('is-fitted', !enlarged);
    panel.style.height = enlarged ? '' : `${900 * scale + 2}px`;
    frame.style.transform = enlarged ? '' : `scale(${scale})`;
    toggle.textContent = enlarged ? 'Fit the whole dashboard' : 'Enlarge for detail';
    toggle.setAttribute('aria-pressed', String(enlarged));
    controls.hidden = !enlarged;
    panel.setAttribute('aria-label', enlarged ? 'Scrollable enlarged finance dashboard' : 'Finance dashboard overview');
    syncPosition();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    enlarged = !enlarged;
    panel.scrollLeft = 0;
    resize();
  });
  left.addEventListener('click', () => { panel.scrollLeft -= panel.clientWidth * 0.8; syncPosition(); });
  right.addEventListener('click', () => { panel.scrollLeft += panel.clientWidth * 0.8; syncPosition(); });
  slider.addEventListener('input', () => {
    panel.scrollLeft = Number(slider.value) / 100 * (panel.scrollWidth - panel.clientWidth);
    syncPosition();
  });
  panel.addEventListener('scroll', syncPosition, { passive: true });
  new ResizeObserver(resize).observe(panel);
  resize();
})();
