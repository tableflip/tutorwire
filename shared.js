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

/**
 * @param {Object|String} conv A conversation object or the recipient ID
 * @param {String} text Message to send
 * @param {Function} cb
 */
Conversations.sendMessage = function (conv, text, cb) {
  var recipientId = null

  if (!conv) return cb(new Meteor.Error(400, 'No conversation or recipient id'))

  if (Object.prototype.toString.call(conv) == "[object String]") {
    recipientId = conv
    conv = null
  }

  var userId = Meteor.userId()

  if (!userId) return cb(new Meteor.Error(401, "Login to send messages"))

  var message = {
    text: text.trim(),
    by: userId,
    created: Date.now()
  }

  // Attempt to find an existing conversation, if a recipientId has been passed
  if (recipientId) {
    conv = Conversations.findOne({owner: userId, users: {$elemMatch: {userId: recipientId}}})
  }

  var sender = Meteor.user()

  if (!sender) return cb(new Meteor.Error(401, "Login to send messages"))

  // Create if not
  if (!conv) {
    console.log("Creating conversation between", sender.profile.name, "and", recipientId)
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
    console.log("Updating conversation between", conv.users.map(function (u) { return u.name }).join(" and "))
    Conversations.update(conv._id, {$push: {messages: message}}, function (er) {
        if (er) return cb(er)
        cb(null, Conversations.findOne(conv._id))
    })
  }
}

Qualifications = new Meteor.Collection("qualifications")

Qualifications.findBySubject = function (subject) {
  console.log("Finding qualifications by subject", subject)
  return Qualifications.find({
    $or: [
      {subjects: new RegExp(subject, "i")},
      {subjects: "*"}
    ]
  }, {sort: [["name", "ASC"]]})
}

Experiences = new Meteor.Collection("experiences")

Experiences.findBySubject = function (subject) {
  console.log("Finding experiences by subject", subject)
  return Experiences.find({
    $or: [
      {subjects: new RegExp(subject, "i")},
      {subjects: "*"}
    ]
  }, {sort: [["name", "ASC"]]})
}