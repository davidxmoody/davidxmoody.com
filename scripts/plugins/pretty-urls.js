module.exports = () => files => {
  Object.keys(files).forEach(filename => {
    const newFilename = filename.replace(/([^/]+)\.html$/, (match, slug) => {
      return slug === "index" ? "index.html" : `${slug}/index.html`
    })

    if (filename !== newFilename) {
      if (files[newFilename])
        throw new Error("Pretty URLs plugin would overwrite another file", filename, newFilename)

      files[newFilename] = files[filename]
      delete files[filename]
    }
  })
}
