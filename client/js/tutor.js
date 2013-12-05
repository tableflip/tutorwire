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

      $("#tutor-contact").attr("href", App.mailto({
        email: tutor.email,
        subject: "I'd like to learn " + tutor.subject,
        body: "Hi, I'm looking to learn " + tutor.subject + " and I found your profile on tutorwire.com"
      }))

      var lngLat = tutor.location.geometry.coordinates

      App.map.setView([lngLat[1], lngLat[0]], 8)
    }
  },

  unload: function () {
    App.clearMarkers()
  }
})