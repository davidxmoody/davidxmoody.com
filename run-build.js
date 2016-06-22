import build from './scripts/build'

const options = {
  srcDir: "./",
  buildDir: "./build",
  production: true,
}

build(options, err => console.log('BUILT', err))
