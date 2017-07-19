// const pdf = require("html-pdf")
// const httpServer = require("http-server")
// const fs = require("fs")
const path = require("path")

const pathPrefix = path.join(__dirname, "..")
const source = path.join(pathPrefix, "src/cv.md")
const target = path.join(pathPrefix, "build/cv/david-moody-cv.pdf")
const cssPath = path.join(pathPrefix, "src/css/pdf.css")

// const PORT = 3033

// const options = {
//   base: `http://localhost:${PORT}`,
//   format: "A4",
//   border: "1in",
// }

// const html = fs.readFileSync(source).toString()

// // Massive hack to create a server here because reading CSS files from the
// // filesystem with the base option does not work with root-relative URLs.
// const server = httpServer.createServer({root: pathPrefix})
// server.listen(PORT)

// pdf.create(html, options).toFile(target, (err, res) => {
//   server.close()
//   console.log("PDF generated", err, res)
// })

const markdownpdf = require("markdown-pdf")

const options = {cssPath}

markdownpdf(options).from(source).to(target, () => {
  console.log("Done")
})
