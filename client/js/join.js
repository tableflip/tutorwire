JoinController = RouteController.extend({
  template: "join",

  waitOn: function () {
    Session.set("country", "UK") // TODO: Localise
    return [Meteor.subscribe("subjects"), Meteor.subscribe("city-locations", Session.get("country"))]
  },

  // Runs before the action, every time the data changes.
  before: function () {

  },
  // provide data to the template
  data: function () {
    return {bodyClass: "join"}
  },

  // Runs after the action, every time the data changes.
  after: function () {
    var subjects = Subjects.find()

    if (subjects.count()) {
      $("#subject")
        .off("typeahead:selected")
        .typeahead("destroy")
        .typeahead({
          name: "subjects-" + subjects.count(),
          local: subjects.fetch().map(function (s) { return s.name })
        })
        .on("typeahead:selected", onSubjectChange)
    }

    var locations = CityLocations.findByCountry(Session.get("country"))

    if (locations.count()) {
      $("#place")
        .off("typeahead:selected")
        .typeahead("destroy")
        .typeahead({
          name: "city-names-" + locations.count(),
          local: locations.fetch().map(function (l) { return l.name })
        })
        .on("typeahead:selected", onPlaceChange)
    }

    // Style tt-hint like a form-control
    $(".tt-hint").addClass("form-control")
  },

  // Run once when route is matched. Is *NOT* re-run on hot code re-load
  load: function () {
    if (Meteor.user()){
      Session.set('photo', Meteor.user().profile.photo)
    }
  },

  // Run once when loading a new route
  unload: function () {
    App.clearMarkers()
    $(".tag-input").tagInput("detach")
  }
})

function showPlace (name, coords) {
  console.log('Showing', name, coords)

  App.location = {name: name, coords: App.normalizeCoords(coords)}

  App.showUserMarker(App.location)
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

function onSubjectChange () {
  var subject = $("#subject").val()

  Meteor.subscribe("qualifications-by-subject", subject, function () {
    var qualInput = $("#qualification")

    // Setup the typeahead with new data
    qualInput
      .off("typeahead:selected")
      .typeahead("destroy")
      .typeahead({
        name: "qualifications-" + subject,
        local: Qualifications.findBySubject(subject).fetch().map(function (q) { return q.name })
      })
      .on("typeahead:selected", function (obj, datum) {
        qualInput.closest(".tag-input").tagInput("add", {text: datum.value})
      })

    // When tagInput adds a tag, clear the typeahead query
    function onTagAdd () {
      if ($.contains(this, qualInput[0])) {
        qualInput.typeahead("setQuery", "")
      }
    }

    qualInput
      .closest(".tag-input")
      .off("tag:add").off("tag:dupe")
      .on("tag:add", onTagAdd).on("tag:dupe", onTagAdd)

    // Style tt-hint like a form-control
    $(".tt-hint").addClass("form-control")
  })

  Meteor.subscribe("experiences-by-subject", subject, function () {
    var expInput = $("#experience")

    // Setup the typeahead with new data
    expInput
      .off("typeahead:selected")
      .typeahead("destroy")
      .typeahead({
        name: "experiences-" + subject,
        local: Experiences.findBySubject(subject).fetch().map(function (q) { return q.name })
      })
      .on("typeahead:selected", function (obj, datum) {
        expInput.closest(".tag-input").tagInput("add", {text: datum.value})
      })

    // When tagInput adds a tag, clear the typeahead query
    function onTagAdd () {
      if ($.contains(this, expInput[0])) {
        expInput.typeahead("setQuery", "")
      }
    }

    expInput
      .closest(".tag-input")
      .off("tag:add").off("tag:dupe")
      .on("tag:add", onTagAdd).on("tag:dupe", onTagAdd)

    // Style tt-hint like a form-control
    $(".tt-hint").addClass("form-control")
  })
}

Template.join.events({
  "change #place": onPlaceChange,
  "change #subject": onSubjectChange
})

Template.join.rendered = function () {

  App.locateUser(function (er, loc) {
    if (er) return console.error("Failed to locate user", er)

    showPlace(loc.name, loc.coords)

    if (loc.name != "Unknown") {
      $("#place").typeahead("setQuery", loc.name)
    }
  })

  $("form.tutor-profile").validationEngine("attach", {

    onValidationComplete: function (form, valid) {
      if (!valid) return console.warn("Registration form invalid")

      var tutor = {
        photo: Session.get('photo'),
        name: $('#name').val(),
        email: $('#email').val(),
        subject: $('#subject').val(),
        desc: $('#desc').val(),
        location: L.marker([App.location.coords.lat, App.location.coords.lng]).toGeoJSON(),
        qualifications: $("#qualification-tags-output input").toArray().map(function (t) { return $(t).val() }),
        experiences: $("#experience-tags-output input").toArray().map(function (t) { return $(t).val() })
      }

      tutor.location.properties.name = App.location.name

      createTutorAndView(tutor)

      return false
    }
  })

  $(".tag-input").tagInput()
}

function createTutorAndView (tutor) {
  if (!Meteor.userId) return console.error('Must be logged in to create a tutor profile')

  Tutors.insert(tutor, function (er, id) {
    if (er) return console.error("Failed to create tutor profile", er)

    Meteor.subscribe("tutor-by-id", id, function (er) {
      if (er) return console.error("Failed to subscribe to tutor-by-id", er)
      Router.go("/tutor/" + Tutors.findOne({_id: id}).puid)
    })
  })
}

function addPhotoDropTarget (target) {
  if (!target) return console.error("No target")
  target = $(target)

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
      console.log(fpfiles)
      Session.set('photo', fpfiles[0])
    },
    onError: function (type, message) {
      $("#localDropResult").text("(" + type + ") " + message)
    },
    onProgress: function (percentage) {
      target.text("Uploading (" + percentage + "%)")
    }
  })
}

Template.photoUpload.rendered = function () {
  addPhotoDropTarget(this.find('#photoDropTarget'))
}

Template.photoUpload.photo = function () {
  return Session.get('photo')
}