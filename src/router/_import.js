module.exports = (file, path) => {
  if (!path) path = 'components';
  return import(`../${path}/${file}.vue`)
}
