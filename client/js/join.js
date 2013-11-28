JoinController = RouteController.extend({
  template: "join",

  waitOn: function () {
    Session.set("country", "UK") // TODO: Localise
    return [Meteor.subscribe("subjects"), Meteor.subscribe("city-locations", Session.get("country"))]
  },

  before: function () {

  },

  data: function () {
    return {bodyClass: "join"}
  },

  after: function () {
    var subjects = Subjects.find()

    if (subjects.count()) {
      var subjectInput = $("#subject")

      if (subjectInput.data("typeahead")) {
        subjectInput.typeahead("destroy")
      }

      subjectInput
        .typeahead({
          name: "subjects",
          local: subjects.fetch().map(function (s) { return s.name })
        })
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
  },

  unload: function () {
    App.clearMarkers()
  }
})

var placeMarker = null

function showPlace (name, coords) {
  console.log('Showing', name, coords)

  if (placeMarker) {
    App.map.removeLayer(placeMarker)
  }

  placeMarker = L.marker(coords)
  placeMarker.addTo(App.map)

  App.map.setView(coords, 8)

  App.location = {name: name, coords: App.normalizeCoords(coords)}
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

Template.join.events({
  "change #place": onPlaceChange
})

Template.join.rendered = function () {
  var map = App.map

  map.on("locationfound", function (event) {
    showPlace("Unknown", event.latlng)

    map.setView(event.latlng, 8)

    App.geocoder().reverseQuery(event.latlng, function (er, response){
      if (er) return console.error(er)

      var city = response.results[0][0].name

      $("#place").typeahead("setQuery", city)

      App.location.name = city
    })
  })

  map.locate()

  $("form").validationEngine("attach", {
    onValidationComplete: function (form, valid) {
      if (!valid) return console.warn("Registration form invalid")

      var tutor = {
          photo: App.photo
        , name: $('#name').val()
        , email: $('#email').val()
        , subject: $('#subject').val()
        , location: App.location
      }

      Tutors.insert(tutor, function (er, id) {
        if (er) return console.error("Failed to create tutor profile", er)

        Meteor.subscribe("tutor-by-id", id, function (er) {
          if (er) return console.error("Failed to subscribe to tutor-by-id", er)
          Router.go("/tutor/" + Tutors.findOne({_id: id}).puid)
        })
      })
    }
  })

  addPhotoDropTarget()
}

function addPhotoDropTarget () {
  var target = $("#photoDropTarget")

  filepicker.setKey('AeYGxADbBSoe2uvUCJHBWz')
  filepicker.makeDropPane(target[0], {
    multiple: true,
    dragEnter: function () {
      target.html("Drop to upload")
    },
    dragLeave: function () {
      target.html("Drop files here")
    },
    onSuccess: function (fpfiles) {
      target.empty()
      console.log(fpfiles)
      App.photo = fpfiles[0]
      $("<img>").attr("src", App.photo.url).appendTo(target)
    },
    onError: function (type, message) {
      $("#localDropResult").text("(" + type + ") " + message)
    },
    onProgress: function (percentage) {
      target.text("Uploading (" + percentage + "%)")
    }
  })
}