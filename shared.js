Subjects = new Meteor.Collection("subjects")

CityLocations = new Meteor.Collection("city-locations")

CityLocations.findByCountry = function (country) {
  console.log("Finding cities by country", country)
  return CityLocations.find({country: country || "UK"}, {sort: [["name", "ASC"]]})
}

Tutors = new Meteor.Collection("tutors")

Tutors.findBySubject = function (subject) {
  console.log("Finding tutors by subject", subject)
  return Tutors.find({subject: new RegExp(subject, "gi")}, {sort: [["name", "ASC"]]})
}

Tutors.findByPuid = function (puid) {
  return Tutors.findOne({puid: puid})
}

Conversations = new Meteor.Collection("conversations")

Conversations.sendMessage = function (recipientId, text, cb) {
  Meteor.call("sendMessage", recipientId, text, cb)
}

Meteor.methods({
  sendMessage: function (recipientId, text) {
    if (!recipientId) throw new Meteor.Error(400, 'No recipient id')

    var message = {
      text: text,
      by: this.userId,
      created: Date.now()
    }

    var conv = null
      , sender = null
      , recipient = null

    if (Meteor.isClient()) {
      // Get the conversation if exists
      conv = Conversations.findOne({owner: this.userId, users: {$elemMatch: {userId: recipientId}}})

      // Create if not
      if (!conv) {
        sender = Meteor.users.findOne(this.userId)

        if (!sender) throw new Meteor.Error(401, "Login to send messages")

        conv = {
          owner: sender._id,
          users: [{
            userId: sender._id,
            name: sender.name,
            avatar: sender.avatar
          }, {
            // Add in the user ID and wait for the server to update the doc
            // with additional user details the client is allowed to see
            userId: recipientId
          }],
          messages: [message],
          updated: Date.now()
        }

        Conversations.insert(conv)
      } else {
        Conversations.update(conv._id, {$push: {messages: message}})
      }

    } else {
      // Get the reverse conversation if exists
      conv = Conversations.findOne({owner: recipientId, users: {$elemMatch: {userId: this.userId}}})

      // Create if not
      if (!conv) {
        recipient = Meteor.users.findOne(recipientId)

        if (!recipient) throw new Meteor.Error(404, "Recipient not found")

        sender = Meteor.users.findOne(this.userId)

        if (!sender) throw new Meteor.Error(401, "Login to send messages")

        conv = {
          owner: recipientId,
          users: [{
            userId: sender._id,
            name: sender.name,
            avatar: sender.avatar
          }, {
            userId: recipientId,
            name: recipient.name,
            avatar: recipient.avatar
          }],
          messages: [message],
          updated: Date.now()
        }

        Conversations.insert(conv)
      } else {
        Conversations.update(conv._id, {$push: {messages: message}})
      }
    }
  }
})