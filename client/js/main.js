Meteor.startup(function () {
  App.initMap()

  var getIconUrl = L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.prototype._getIconUrl = function (name) {
    return name == "icon" ? "/images/marker-icon.svg" : getIconUrl.call(this, name)
  }
})

Router.configure({layoutTemplate: 'layout'})

Router.map(function () {
  this.route("home", {path: "/", controller: HomeController})
  this.route("join", {path: "/join", controller: JoinController})
  this.route("tutor", {path: "/tutor/:puid", controller: TutorController})
  this.route("contact", {path: "/tutor/:puid/contact", controller: ContactController})
})

Meteor.subscribe("userData");