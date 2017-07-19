const pdf = require("html-pdf")
const fs = require("fs")
const path = require("path")
const httpServer = require("http-server")

const pathPrefix = path.join(__dirname, "../build")
const source = path.join(pathPrefix, "cv/index.html")
const target = path.join(pathPrefix, "cv/david-moody-cv.pdf")

const PORT = 3033

const options = {
  base: `http://localhost:${PORT}`,
}

const html = fs.readFileSync(source).toString()

// Massive hack to create a server here because reading CSS files from the
// filesystem with the base option does not work with root-relative URLs.
const server = httpServer.createServer({root: pathPrefix})
server.listen(PORT)

pdf.create(html, options).toFile(target, (err, res) => {
  server.close()
  console.log("PDF generated", err, res)
})
