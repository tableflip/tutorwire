Emails = new Meteor.Collection("emails")

/**
 * Sends a notification email to the recipient if they are offline at the time the notifications are sent.
 */
Emails.notifyUnreadMessage = function (to, from, data) {
  if (!Emails.findOne({type: "unreadMessage", "to._id": to._id, "from._id": from._id})) {
    Emails.insert({type: "unreadMessage", to: to, from: from, data: data})
  }
}

function isOnline (user) {
  return !!Meteor.users.find({$and: [{_id: user._id}, {"status.online": true}]}).count()
}

function sendEmails () {
  var emails = Emails.find({}).fetch()

  if (!emails.length) return scheduleSendEmails()

  console.log("Sending queued emails")

  emails.forEach(function (email, i) {
    if (isOnline(email.to)) {
      console.log("Removing", email.type, "email for online user", email.to._id)
      return Emails.remove(email._id)
    }

    if (!handlers[email.type]) {
      return console.error("No handler for email", email.type)
    }

    handlers[email.type](email, function (er) {
      if (er) return console.error("Failed to send email", er)

      Emails.remove(email._id)

      console.log("Email to", email.to._id, "successfully sent")

      if (i == emails.length - 1) {
        console.log("All queued emails sent")

        emails.forEach(function (email) {
          Emails.remove(email._id)
        })

        scheduleSendEmails()
      }
    })
  })
}

function sendEmail (opts, cb) {
  try {
    Email.send(opts)
  } catch (er) {
    return cb(er)
  }
  cb()
}

// Handlers for various message types
var handlers = {
  unreadMessage: function (email, cb) {
    sendEmail({
      to: email.to.email,
      from: email.from.name + " (via TutorWire) <notify@tutorwire.org>",
      // TODO: Remove when Meteor adds support for server side templating
      subject: Handlebars.templates["unread-message-subject"](email),
      text: Handlebars.templates["unread-message-text"](email),
      html: Handlebars.templates["unread-message-html"](email)
    }, cb)
  }
}

function scheduleSendEmails () {
  Meteor.setTimeout(sendEmails, 1000 * 60 * 1)
}

scheduleSendEmails()