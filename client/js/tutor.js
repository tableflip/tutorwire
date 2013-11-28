TutorController = RouteController.extend({
  template: "tutor",

  before: function () {
    Meteor.subscribe("tutor-by-puid", this.params.puid)
  },

  data: function () {
    return Tutors.findOne()
  },

  unload: function () {
    App.map.remove()
    App.map = null
  }
})

Template.tutor.rendered = function () {
  var map = App.initMap()
    , tutor = Tutors.findOne()

  if (!tutor) return;

  $("#tutor-contact").attr("href", App.mailto({
    email: tutor.email,
    subject: "I'd like to learn " + tutor.subject,
    body: "Hi, I'm looking to learn " + tutor.subject + " and I found your profile on tutorwire.com"
  }))

  var latlng = new L.LatLng(tutor.location.coords.lat, tutor.location.coords.lng)
  console.log('coords', latlng)

  new L.marker(latlng, {}).addTo(map)
  map.setView(latlng, 8)
}