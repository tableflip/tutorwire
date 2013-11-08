HomeController = RouteController.extend({
  template: "home",

  before: function () {
  },

  data: function () {
    var data = {bodyClass: "home"}
    return data
  },

  after: function () {
    var subject = Session.get("subject")
    Meteor.subscribe("tutors-for-subject", subject)
    App.showTutorsOnMap(Tutors.findBySubject(subject).fetch())
  },

  unload: function () {
    Session.set("subject", null)
    App.map.remove()
    App.map = null
  }
})

function search (event) {
  event.preventDefault()
  var subject = $("#subject")
  
  if (!subject.val()) {
    return subject.focus()
  }

  Session.set("subject", subject)
}

Template.home.events({
  "submit #searchForm": search,
  "click #search": search,
  "click #findme": function () {
    App.locateUser(function (location) {
      app.showUserMarker(location)
      $('#place').val(location.name)
    })
  }
})

Template.home.rendered = function () {
  App.initMap()
  $(".hide").removeClass("hide")
  $("#subject").unbind("typeahead:selected").typeahead("destroy")
}