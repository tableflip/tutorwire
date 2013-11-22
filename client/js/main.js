Router.configure({layoutTemplate: 'layout'})

Router.map(function () {
  this.route("home", {path: "/", controller: HomeController})
  this.route("join", {path: "/join", controller: JoinController})
  this.route("tutor", {path: "/tutor/:puid", controller: TutorController})
})