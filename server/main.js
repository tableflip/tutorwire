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
  insert: function (userId, conv) {
    if (!userId) return false

    // TODO: Ensure conversation between userId and conv.users doesn't already exist

    conv.owner = userId
    conv.puid = shortid.generate()
    conv.users = conv.users || []
    conv.messages = conv.messages || []

    // Fill in the user details the client is allowed to see
    conv.users.forEach(function (u) {
      var user = Meteor.users.findOne(u.userId)
      if (!user) return console.warn("Cannot converse with", u.userId, "is not exists!")
      u.name = user.profile.name
      u.photo = user.profile.photo
    })

    conv.updated = Date.now()

    // Shallow clone a conversation giving it a new owner Id
    function cloneConversation (conv, ownerId) {
      return {
        owner: ownerId,
        puid: shortid.generate(),
        users: conv.users,
        messages: conv.messages,
        updated: conv.updated
      }
    }

    // Create reverse conversations
    conv.users.filter(function (u) {
      return u.userId != userId
    }).forEach(function (u) {
      Conversations.insert(cloneConversation(conv, u.userId))
    })

    return true
  },
  update: function (userId, conv, fieldNames, modifier) {
    // Only update your own conversations
    if (!Conversations.findOne({_id: conv._id, owner: userId})) return false
    // Only update messages
    if (fieldNames.length > 1 || fieldNames[0] != "messages") return false

    var now = Date.now()

    // New messages must be syndicated to other conversations
    if (modifier.$push && modifier.$push.messages) {
      conv.users.filter(function (u) {
        return u.userId != userId
      }).forEach(function (u) {
        var conv = Conversations.findOne({owner: u.userId, users: {$elemMatch: {userId: userId}}})
        if (!conv) return console.error("Reverse conversation not found", u.userId, userId)
        Conversations.update(conv._id, {$push: modifier.$push, $set: {updated: now}})
      })
    }

    conv.updated = now
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