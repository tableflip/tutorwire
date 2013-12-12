Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId})
})

Meteor.publish("subjects", function () {
  return Subjects.find({}, {sort: [["name", "ASC"]]})
})

Meteor.publish("city-locations", function (country) {
  return CityLocations.findByCountry(country)
})

Meteor.publish("tutors-for-subject", function (subject) {
  return Tutors.findBySubject(subject)
})

Meteor.publish("tutor-by-id", function (id) {
  return Tutors.find({_id: id})
})

Meteor.publish("tutor-by-puid", function (puid) {
  return Tutors.find({puid: puid})
})

Meteor.publish("conversations", function () {
  // You only get to see your own conversations
  return Conversations.find({owner: this.userId}, {sort: [["updated", "DESC"]]})
})

Tutors.allow({
  insert: function (userId, tutor) {
    if (!userId) return false
    tutor.userId = userId
    tutor.puid = shortid.generate()
    return true
  }
})

Conversations.allow({
  insert: function (userId, doc) {
    if (!userId) return false

    doc.owner = userId
    doc.users = doc.users || []
    doc.messages = doc.messages || []

    // Fill in the user details the client is allowed to see
    doc.users.forEach(function (u) {
      var user = Meteor.users.findOne(u.userId)
      if (!user) return console.warn("Cannot converse with", u.userId, "is not exists!")
      u.name = user.name
      u.avatar = user.avatar
    })

    doc.updated = Date.now()
    return true
  },
  update: function (userId, doc) {
    // Only update your own conversations
    if (!Conversations.findOne({_id: doc._id, owner: userId})) return false
    doc.updated = Date.now()
    return true
  }
})

Meteor.methods({
  // TODO: Remove for productions!
  // Create a bunch of test tutors in the database
  testTutors: function () {
    // For each city, create a random number of tutors
    CityLocations.findByCountry("UK").forEach(function (c) {
      var numTutors = randomInt(1, 20)
      for (var i = 0; i < numTutors; i++) {
        Tutors.insert(createTutor(c))
      }
    })

    // Random number between min (inclusive) and max (inclusive)
    function randomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }

    function randomArbitrary(min, max) {
      return Math.random() * (max - min) + min
    }

    function randomName () {
      return ProperNames[randomInt(0, ProperNames.length - 1)]
    }

    function randomSubject () {
      var subjects = Subjects.find().fetch()
      return subjects[randomInt(0, subjects.length - 1)].name
    }

    function randomLocation (nearCity) {
      return {
        type: "Feature",
        properties: {name: nearCity.name},
        geometry: {
          type: "Point",
          coordinates: [
            nearCity.location.geometry.coordinates[0] + randomArbitrary(-1, 1),
            nearCity.location.geometry.coordinates[1] + randomArbitrary(-1, 1)
          ]
        }
      }
    }

    function createTutor (nearCity) {
      var forename = randomName()
        , surname = randomName()
        , tutor = {
          puid: shortid.generate(),
          name: forename + " " + surname,
          subject: randomSubject(),
          email: forename.toLowerCase() + "." + surname.toLowerCase() + "@example.com",
          location: randomLocation(nearCity)
        }

      console.log("Creating tutor", tutor.name, "(" + tutor.email + ")", "teaching", tutor.subject, "near", nearCity.name)

      return tutor
    }
  }
})