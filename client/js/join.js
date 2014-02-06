JoinController = RouteController.extend({
  template: "join",

  waitOn: function () {
    Session.set("country", "UK") // TODO: Localise
    return [Meteor.subscribe("subjects"), Meteor.subscribe("city-locations", Session.get("country"))]
  },

  // provide data to the template
  data: function () {
    return {bodyClass: "join"}
  },

  before: function () {
    var user = Meteor.user()
    if (user) {
      Session.set("photo", user.profile.photo)
    }
  },

  // Run once when loading a new route
  unload: function () {
    App.clearMarkers()
    $(".tag-input").tagInput("detach")
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
    setupTypeahead("qualifications", qualInput, Qualifications.findBySubject(subject), function (obj, datum) {
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
  })

  Meteor.subscribe("experiences-by-subject", subject, function () {
    var expInput = $("#experience")

    // Setup the typeahead with new data
    setupTypeahead("experiences", expInput, Experiences.findBySubject(subject), function (obj, datum) {
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
  })
}

Template.join.events({
  "change #place": onPlaceChange,
  "change #subject": onSubjectChange
})

Template.join.rendered = function () {
  setupTypeahead("subjects", "#subject", Subjects.find(), onSubjectChange)
  setupTypeahead("places", "#place", findCityLocationsBySessionCountry(), onPlaceChange)

  App.locateUser(function (er, loc) {
    if (er) return console.error("Failed to locate user", er)

    showPlace(loc.name, loc.coords)

    if (loc.name != "Unknown") {
      $("#place").typeahead("setQuery", loc.name)
    }
  })

  // Disable enter to submit, unless it is enter on the submit button
  $(this.find("form")).keypress(function (e) {
    var code = e.keyCode || e.which
    if (code == 13 && !$(e.target).is("input[type=submit]")) {
      e.preventDefault()
    }
  })

  $("form.tutor-profile").validationEngine("attach", {
    onValidationComplete: function (form, valid) {
      if (!valid) return console.warn("Registration form invalid")

      $("#addTutor").prop("disabled", true)

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
      target.addClass('dragEnter')
    },
    dragLeave: function () {
      target.removeClass('dragEnter')
    },
    onSuccess: function (fpfiles) {
      console.log(fpfiles)
      Session.set('photo', fpfiles[0])
      Session.set('photo-upload-percentage', null)
    },
    onError: function (type, message) {
      $("#localDropResult").text("(" + type + ") " + message)
    },
    onProgress: function (percentage) {
      Session.set('photo-upload-percentage', percentage)
    }
  })
}

Template.photoUpload.rendered = function () {
  addPhotoDropTarget(this.find('#photoDropTarget'))
}

Template.photoUpload.photo = function () {
  return Session.get('photo')
}

Template.photoUpload.progress = function () {
  return Session.get('photo-upload-percentage')
}