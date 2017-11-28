import mainNpm from "main-files"
import * as gulp from "gulp"
import chalk from "chalk"
const path = require("path")
const concat = require("gulp-concat")
const wrap = require("gulp-wrap")
const uglify = require("gulp-uglify")
const uglifyCss = require("gulp-uglifycss")
const fs = require("fs")
const rename = require("gulp-rename")
const sass = require("gulp-sass")
gulp.watch = require("gulp-watch")

const log = (...params) => {
  console.log(...params)
}

// wrapping Syntax for wrapping the files
const wrapSyntaxJs = "/* <%= file.path %> */\n\n; <%= contents %>\n\n"
const wrapSyntaxCss = "/* <%= file.path %> */\n\n <%= contents %>\n\n"

const appPath = path.join(__dirname, "dist")

// this function is to stop node from crashing on error
function swallowError(error) {
  // If you want details of the error in the console
  console.log(chalk.red(error.toString()))
  this.emit("end")
}

gulp.task("inject:npm:js", () => {
  return gulp.src(mainNpm())
  .pipe(uglify())
  .pipe(wrap(wrapSyntaxJs))
  .pipe(concat("libs.bundled.js"))
  .pipe(gulp.dest(appPath))
})

gulp.task("inject:npm:css", () => {
  return gulp.src(mainNpm({what: "css"}))
  .pipe(uglifyCss())
  .pipe(wrap(wrapSyntaxCss))
  .pipe(concat("libs.bundled.css"))
  .pipe(gulp.dest(appPath))
  .on("error", swallowError)
})

// combining inject tasks
gulp.task("inject:npm", ["inject:npm:js", "inject:npm:css"])

gulp.task("build:js", () => {
  return gulp.src("./src/**/*.js")
  .pipe(uglify())
  .pipe(wrap(wrapSyntaxJs))
  .pipe(concat("client.bundled.js"))
  .pipe(gulp.dest("dist"))
  .on("error", swallowError)
})

gulp.task("build:scss", () => {
  return gulp.src("./src/**/*.scss")
  .pipe(sass().on("error", swallowError))
  .pipe(uglifyCss())
  .pipe(wrap(wrapSyntaxCss))
  .pipe(concat("client.bundled.css"))
  .pipe(gulp.dest(appPath))
  .on("error", swallowError)
})

gulp.task("build", ["build:js", "build:scss"])

gulp.task("watch", ["inject:npm", "build"], () => {
  
  log(chalk.blue("Starting Watchers"))

  gulp.watch(["package.json"], () => {
    log(chalk.green("package.json is changed. Running inject:npm..."))
    gulp.start("inject:npm")
  })


  gulp.watch(["./src/**/*.js"], (f) => {
    log(chalk`{green ${f.path} -> ${f.type}; running build:js}`)
    gulp.start("build:js")
  })

  gulp.watch(["./src/**/*.scss"], (f) => {
    log(chalk`{green ${f.path} -> ${f.type}; running build:scss}`)
    gulp.start("build:scss")
  })
})
