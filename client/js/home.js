HomeController = RouteController.extend({
  template: "home",

  waitOn: function () {
    console.log("waitOn")
    return Meteor.subscribe("subjects")
  },

  before: function () {
    console.log("before")
    Meteor.subscribe("tutors-for-subject", Session.get("subject"))
    Meteor.subscribe("city-locations", Session.get("city"))
  },

  data: function () {
    console.log("data")
    var data = {bodyClass: "home"}
    return data
  },

  after: function () {
    console.log(Subjects.find().fetch())

    if (Subjects.find().count()) {

      $("#subject").typeahead({
        name: "subjects",
        local: Subjects.find().fetch().map(function (s) { return s.name })
      })

      // Style tt-hint like a form-control
      $(".tt-hint").addClass("form-control")
    }

    App.showTutorsOnMap(Tutors.findBySubject(Session.get("subject")).fetch())
  },

  unload: function () {
    Session.set("subject", null)
    Session.set("city", null)
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

  Session.set("subject", subject.val())
}

Template.home.events({
  "change #subject": search,
  "typeahead:selected #subject": search,
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
}