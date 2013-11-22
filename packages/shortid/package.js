Package.describe({summary: "Amazingly short non-sequential url-friendly unique id generator."})

// Can't use a semver range here!
Npm.depends({"shortid": "2.0.0"})

Package.on_use(function (api) {
  api.export("shortid")
  api.add_files("shortid.js", "server")
})