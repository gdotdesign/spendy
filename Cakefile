fs = require 'fs'
{exec} = require('child_process')
autoprefixer = require('autoprefixer')

task 'build', 'Build standalone html/js/css into build directory', ->
  exec "rm -rf ./build"
  exec "mkdir ./build"

  exec "cp -r ./* build"

  exec "dry -i dry/index.dry -o ./build/js/index.js"

  exec "rm -rf ./build/dry"
  exec "rm -rf ./build/Cakefile"
  exec "rm -rf ./build/build ./build/0"
  exec "rm -rf ./build/package.json"
  exec "rm -rf ./build/node_modules"

  index = fs.readFileSync('./build/index.html','utf-8')
  index = index.replace 'dry/index.dry', 'js/index.js'

  fs.writeFileSync('./build/index.html',index, 'utf-8')

  css = autoprefixer.compile fs.readFileSync('./build/style/style.css','utf-8')
  fs.writeFileSync('./build/style/style.css',css, 'utf-8')