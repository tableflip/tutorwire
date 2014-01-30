HomeController = RouteController.extend({
  template: "home",

  before: function () {
    Meteor.subscribe("tutors-for-subject", Session.get("subject"))

    Meteor.subscribe("subjects", function () {
      setupTypeahead("#subject", Subjects, onSubjectChange)
    })

    Session.set("country", "UK") // TODO: Localise

    Meteor.subscribe("city-locations", Session.get("country"), function () {
      setupTypeahead("#place", CityLocations, onPlaceChange)
    })
  },

  data: function () {
    return {bodyClass: "home"}
  },

  after: function () {
    var tutors = Tutors.findBySubject(Session.get("subject")).fetch()
    App.clearExitingMarkers(tutors)
    App.showEnteringTutorsOnMap(tutors)
  },

  unload: function () {
    App.clearMarkers()
  }
})

function setupTypeahead (input, collection, onSelected) {
  var items = collection.find()
  console.log("Setting up typeahead for", items.count(), collection._name)

  $(input)
    .off("typeahead:selected")
    .typeahead("destroy")
    .typeahead({
        name: collection._name + "-" + collection.find().count(),
        local: collection.find().fetch().map(function (s) { return s.name })
    })
    .on("typeahead:selected", onSelected)

  // Style tt-hint like a form-control
  $(".tt-hint").addClass("form-control")
}

function onSubjectChange (event) {
  event.preventDefault()
  var subject = $("#subject")

  if (!subject.val()) {
    return subject.focus()
  }

  Session.set("subject", subject.val())
}

function onPlaceChange () {
  var name = $("#place").val()
    , location = CityLocations.findOne({name: name})

  console.log("Place changed", name, location)

  if (!location) {
    console.log("Geocoding", name)

    App.geocoder().query(name, function (er, response) {
      if (er) return console.error("Failed to geocode", name, er)

      console.log("Geocoded", name, response)

      var latlng = response.latlng

      showPlace(name, {lat: latlng[0], lng: latlng[1]}) // latlng is an array
    })

  } else {
    showPlace(name, location.location)
  }
}

function showPlace (name, coords) {
  console.log("Showing", name, coords)
  App.location = {name: name, coords: App.normalizeCoords(coords)}
  App.showUserMarker(App.location)
}

Template.home.events({
  "change #place": onPlaceChange,
  "change #subject": onSubjectChange,
  "submit #searchForm": onSubjectChange,
  "click #search": onSubjectChange,
  "click #findme": function () {
    App.locateUser(function (er, loc) {
      if (er) return console.error(er)
      App.showUserMarker(loc)
      $('#place').val(loc.name)
    })
  },
  "click #join": function () { Router.go('join') },
  "click #about": function () { Router.go('about') }
})

Template.home.rendered = function () {

  var subject = $("#subject")
  var place = $("#place")

  if (Session.get("subject")) {
    subject.val(Session.get("subject"))
  }

  if (Subjects.find().count()) {
    setupTypeahead(subject, Subjects, onSubjectChange)
  }

  if (CityLocations.find().count()) {
    setupTypeahead(place, CityLocations, onPlaceChange)
  }

  if (Session.get("country") != "UK") {
    place.val(Session.get("country"))
  }

  setTimeout(function () {
    $(".hide").removeClass("hide")
    setTimeout(function () {
      App.type("Maths",
        function (chars) { subject.attr("placeholder", chars) },
        function ()  {
          App.type("UK",
            function (chars) { place.attr("placeholder", chars) },
            function ()  { subject.focus() }
          )
        }
      )
    }, 500)
  }, 500)
}