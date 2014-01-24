Subjects = new Meteor.Collection("subjects")

CityLocations = new Meteor.Collection("city-locations")

CityLocations.findByCountry = function (country) {
  return CityLocations.find({country: country || "UK"}, {sort: [["name", "ASC"]]})
}

Tutors = new Meteor.Collection("tutors")

Tutors.findBySubject = function (subject) {
  return Tutors.find({subject: new RegExp(subject, "i")}, {sort: [["name", "ASC"]]})
}

Tutors.findByPuid = function (puid) {
  return Tutors.findOne({puid: puid})
}

Conversations = new Meteor.Collection("conversations")

Conversations.sendMessage = function (recipientId, text, cb) {
  if (!recipientId) return cb(new Meteor.Error(400, 'No recipient id'))

  var userId = Meteor.userId()

  if (!userId) return cb(new Meteor.Error(401, "Login to send messages"))

  var message = {
    text: text.trim(),
    by: userId,
    created: Date.now()
  }

  var conv = Conversations.findOne({owner: userId, users: {$elemMatch: {userId: recipientId}}})
    , sender = Meteor.user()

  if (!sender) return cb(new Meteor.Error(401, "Login to send messages"))

  // Create if not
  if (!conv) {
    console.log("Creating conversation between", userId, "and", recipientId)
    Conversations.insert({
      owner: sender._id,
      users: [{
        userId: sender._id,
        name: sender.profile.name,
        photo: sender.profile.photo
      }, {
        // Add in the user ID and wait for the server to update the doc
        // with additional user details the client is allowed to see
        userId: recipientId
      }],
      messages: [message],
      updated: Date.now()
    }, function (er, id) {
        if (er) return cb(er)
        cb(null, Conversations.findOne(id))
    })

  } else {
    console.log("Updating conversation between", userId, "and", recipientId)
    Conversations.update(conv._id, {$push: {messages: message}}, function (er) {
        if (er) return cb(er)
        cb(null, Conversations.findOne(conv._id))
    })
  }
}

Qualifications = new Meteor.Collection("qualifications")

Qualifications.findBySubject = function (subject) {
  return Qualifications.find({subject: new RegExp(subject, "i")}, {sort: [["name", "ASC"]]})
}

Experiences = new Meteor.Collection("experiences")

Experiences.findBySubject = function (subject) {
  return Experiences.find({subject: new RegExp(subject, "i")}, {sort: [["name", "ASC"]]})
}