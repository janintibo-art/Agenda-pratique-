'use strict';
(async () => {
  const repo = 'janintibo-art/Agenda-pratique-';
  const status = document.getElementById('release-status');
  const meta = document.getElementById('release-meta');
  const link = document.getElementById('apk');
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {headers:{Accept:'application/vnd.github+json'}});
    if (response.status === 404) { status.textContent = 'Aucune version publique disponible pour le moment.'; return; }
    if (!response.ok) throw new Error('API indisponible');
    const release = await response.json();
    const assets = (release.assets || []).filter(a => a.state === 'uploaded' && /\.apk$/i.test(a.name) && typeof a.browser_download_url === 'string' && a.browser_download_url.startsWith(`https://github.com/${repo}/releases/download/`));
    const apk = assets.find(a => a.name === 'mon-agenda.apk') || (assets.length === 1 ? assets[0] : null);
    if (!apk) { status.textContent = 'La dernière publication ne contient pas un APK identifiable. Consulte les versions sur GitHub.'; return; }
    status.textContent = `Dernière version : ${release.name || release.tag_name}`;
    const date = new Date(release.published_at);
    meta.textContent = `${(apk.size/1048576).toLocaleString('fr-FR',{maximumFractionDigits:1})} Mo · ${Number.isNaN(date.getTime())?'Date non indiquée':date.toLocaleDateString('fr-FR')}`;
    link.href = apk.browser_download_url;
    link.textContent = '↓ Télécharger mon APK';
  } catch (_) { status.textContent = 'La version ne peut pas être vérifiée actuellement. Consulte GitHub Releases.'; }
})();
