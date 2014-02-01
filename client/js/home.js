HomeController = RouteController.extend({
  template: "home",

  before: function () {
    Meteor.subscribe("tutors-for-subject", Session.get("subject"))

    Meteor.subscribe("subjects", function () {
      setupTypeahead("subjects", "#subject", Subjects.find(), onSubjectChange)
    })

    Session.set("country", "UK") // TODO: Localise

    Meteor.subscribe("city-locations", Session.get("country"), function () {
      setupTypeahead("places", "#place", findCityLocationsBySessionCountry(), onPlaceChange)
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

function findCityLocationsBySessionCountry () {
  return CityLocations.findByCountry(Session.get("country"))
}

/**
 * @param {String} name Unique name to give to the typeahead
 * @param {String} input CSS selector for the element that should become a typeahead
 * @param {Meteor.Collection.Cursor} suggestions Items to appear in the suggestions list
 * @param {Function} onSelected Function to call when a suggestion is selected
 */
function setupTypeahead (name, input, suggestions, onSelected) {
  console.log("Setting up typeahead for", suggestions.count(), name)

  setupTypeahead.lastId = setupTypeahead.lastId || 0

  $(input)
    .off("typeahead:selected")
    .typeahead("destroy")
    .typeahead({
        name: name + "-" + (setupTypeahead.lastId++),
        local: suggestions.fetch().map(function (s) { return s.name })
    })
    .on("typeahead:selected", onSelected)

  // Style tt-hint like a form-control
  $(".tt-hint").addClass("form-control")
}

function onSubjectChange (e) {
  e.preventDefault()

  var subject = $("#subject")

  if (!subject.val()) {
    return subject.focus()
  }

  Session.set("subject", subject.val())
}

function onSubjectKeypress (e) {
  if (e.keyCode == 13) {
    onSubjectChange(e)
  }
}

function onPlaceChange (e) {
  e.preventDefault()

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

function onPlaceKeypress (e) {
  var code = e.keyCode || e.which
  if (code == 13) {
    onPlaceChange(e)
  }
}

function showPlace (name, coords) {
  console.log("Showing", name, coords)
  App.location = {name: name, coords: App.normalizeCoords(coords)}
  App.showUserMarker(App.location)
}

Template.home.events({
  "change #place": onPlaceChange,
  "keypress #place": onPlaceKeypress,
  "change #subject": onSubjectChange,
  "keypress #subject": onSubjectKeypress,
  "submit #searchForm": onSubjectChange,
  "click #search": onSubjectChange,
  "click #findme": function () {
    App.locateUser(function (er, loc) {
      if (er) return console.error(er)
      App.showUserMarker(loc)
      $("#place").val(loc.name)
    })
  },
  "click #join": function (e) {
    e.preventDefault()
    Router.go("join")
  },
  "click #about": function (e) {
    e.preventDefault()
    Router.go("about")
  }
})

Template.home.rendered = function () {

  var subject = $("#subject")
  var place = $("#place")

  if (Session.get("subject")) {
    subject.val(Session.get("subject"))
  }

  if (Subjects.find().count()) {
    setupTypeahead("subjects", subject, Subjects.find(), onSubjectChange)
  }

  if (CityLocations.find().count()) {
    setupTypeahead("places", place, findCityLocationsBySessionCountry(), onPlaceChange)
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