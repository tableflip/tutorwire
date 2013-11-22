HomeController = RouteController.extend({
  template: "home",

  waitOn: function () {
    Session.set("country", "UK") // TODO: Localise
    return [Meteor.subscribe("subjects"), Meteor.subscribe("city-locations", Session.get("country"))]
  },

  before: function () {
    Meteor.subscribe("tutors-for-subject", Session.get("subject"))
  },

  data: function () {
    return {bodyClass: "home"}
  },

  after: function () {
    var subjects = Subjects.find()

    if (subjects.count()) {
      var subjectInput = $("#subject")

      if (subjectInput.data("typeahead")) {
        subjectInput.unbind("typeahead:selected").typeahead("destroy")
      }

      subjectInput
        .typeahead({
          name: "subjects",
          local: subjects.fetch().map(function (s) { return s.name })
        })
        .on("typeahead:selected", onSubjectChange)
        .data("typeahead", true)
    }

    var locations = CityLocations.findByCountry(Session.get("country"))

    if (locations.count()) {
      var placeInput = $("#place")

      if (placeInput.data("typeahead")) {
        subjectInput.unbind("typeahead:selected").typeahead("destroy")
      }

      placeInput
        .typeahead({
          name: "city-names",
          local: locations.fetch().map(function (l) { return l.name })
        })
        .on("typeahead:selected", onPlaceChange)
        .data("typeahead", true)
    }

    // Style tt-hint like a form-control
    $(".tt-hint").addClass("form-control")

    App.showTutorsOnMap(Tutors.findBySubject(Session.get("subject")).fetch())
  },

  unload: function () {
    Session.set("subject", null)
    Session.set("country", null)
    App.map.remove()
    App.map = null
  }
})

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
      if (er) return console.error(er)

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
    App.locateUser(function (location) {
      App.showUserMarker(location)
      $('#place').val(location.name)
    })
  }
})

Template.home.rendered = function () {
  App.initMap()
  $(".hide").removeClass("hide")
  
  setTimeout(function () {
    App.type("Maths",
      function (chars) { $("#subject").attr("placeholder", chars) },
      function ()  {
        App.type("UK",
          function (chars) { $("#place").attr("placeholder", chars) },
          function ()  { $("#subject").focus() }
        )
      }
    )
  }, 500)
}