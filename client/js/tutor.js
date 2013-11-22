TutorController = RouteController.extend({
  template: "tutor",

  waitOn: function () {
    return Meteor.subscribe("tutor-by-puid", this.params.puid)
  }
})