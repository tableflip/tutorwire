ContactController = RouteController.extend({
  template: 'contact',

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
  }
})

Template.contact.events({
  'click #tutor-contact':function (evt) {
    evt.preventDefault()
    var tutor = Tutors.findByPuid(Session.get("tutor-puid"))
      , msg = Template.contactMsg({location: App.location, tutor: tutor})
    Conversations.sendMessage(tutor.userId, msg, function (er, conversation) {
      if (er) return console.error(er)
      console.log("Message sent")
      Router.go("/conversation/" + conversation.puid)
    })
    $(this).addClass('disabled')
  }
})

Template.contact.rendered = function () {

}
