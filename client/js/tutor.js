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
      App.clearExitingMarkers([tutor])
      App.showEnteringTutorsOnMap([tutor])

      var lngLat = tutor.location.geometry.coordinates
      App.map.setView([lngLat[1], lngLat[0]], App.map.getZoom())
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
