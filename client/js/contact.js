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

// Register ////////////////////////////////////////////////////////////////////////////////////////////////////////////
Template.registerToContact.events({
//    "click #register": function (evt) {
//
//    },
//    "click #register": function (evt) {
//
//    }
    "click #login": function (e) {
        e.preventDefault()
        // WTF? Doesn't get triggered unless in next tick
        setTimeout(function () { $("#account .dropdown-toggle").trigger("click") }, 0)
    }
})

Template.registerToContact.rendered = function () {
    $('form').validationEngine("attach", {
        onValidationComplete: function (form, valid) {
            console.log('registerToContact', arguments)
            if (!valid) return console.warn("Registration form invalid")

            var opts = {
                email: $('#email').val(),
                password: $('#password').val(),
                profile:{
                    name: $('#name').val(),
                    // TODO: grab location if we have it
                    photo:{
                      url: 'http://www.gravatar.com/avatar/' + $.md5($('#email').val()) + '?d=mm'
                    }
                }
            }

            console.log('createUser', opts)

            Accounts.createUser(opts, function (er) {
                if (er) return console.log(er)
            })
        }
    })
}