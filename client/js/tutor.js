TutorController = RouteController.extend({
  template: "tutor",

  before: function () {
    Session.set("tutor-puid", this.params.puid)
    Meteor.subscribe("tutor-by-puid", this.params.puid)
  },

  data: function () {
    return Tutors.findByPuid(Session.get("tutor-puid"))
  },

  after: function () {
    var tutor = Tutors.findByPuid(Session.get("tutor-puid"))

    if (tutor) {
      App.clearMarkers()
      App.showTutorOnMap(tutor)
      var latlng = new L.LatLng(tutor.location.coords.lat, tutor.location.coords.lng)
      App.map.setView(latlng, 8)
    }
  },

  unload: function () {
    App.clearMarkers()
  }
})

Template.tutor.events({
    "click #tutor-contact": function (evt) {
        Router.go('contact', { puid: Session.get("tutor-puid")})
        return false
    }
})
