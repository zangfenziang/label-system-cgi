module.exports = {
  apps : [{
    name   : "cgi",
    script : "./dist/main.js",
    instances: 2
  }]
}
