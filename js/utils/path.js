// js/utils/path.js
export function getTemplatePath(relativePath) {
  const isLocal = location.hostname === '127.0.0.1' || location.hostname === 'localhost';
  const repo = !isLocal ? location.pathname.split('/')[1] : '';
  const baseUrl = location.origin + (repo ? '/' + repo : '');

  return isLocal ? `/${relativePath}` : `${baseUrl}/${relativePath}`;
}
