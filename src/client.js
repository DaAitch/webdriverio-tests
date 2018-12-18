'use strict';

(async () => {
  const res = await fetch('/api/motd');
  const motd = await res.json();

  document.getElementById('motd').innerText = motd;
})();