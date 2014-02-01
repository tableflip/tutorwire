Meteor.startup(function () {
  App.initMap()

  var getIconUrl = L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.prototype._getIconUrl = function (name) {
    return name == "icon" ? "/images/marker-icon.svg" : getIconUrl.call(this, name)
  }

  Meteor.subscribe("userData")
  Meteor.subscribe("conversations")
})

Router.configure({layoutTemplate: 'layout'})

Router.map(function () {
  this.route("home", {path: "/", controller: HomeController})
  this.route("join", {path: "/join", controller: JoinController})
  this.route("tutor", {path: "/tutor/:puid", controller: TutorController})
  this.route("contact", {path: "/tutor/:puid/contact", controller: ContactController})
  this.route("conversation", {path: "/conversation/:puid", controller: ConversationController})
  this.route("about", {path: "/about", action: function () { this.redirect("http://about.tutorwire.org/") }})
})

Handlebars.registerHelper('isoTime', function (timestamp) {
  return moment(timestamp).toISOString()
})

Handlebars.registerHelper('fromNow', function (timestamp) {
  return moment(timestamp).fromNow()
})