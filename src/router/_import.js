module.exports = (file, path) => {
  if (!path) path = 'components'
  return require(`../${path}/${file}.vue`)
}
