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

/*
messages:[
{
  timestamp: '',
  from: userId,
  text: 'woo',
}
]
*/
Meteor.methods({
  contact: function (recipientId, text) {
    if (!recipientId) throw new Meteor.Error(400, 'No recipient id')
    var message = { text: text }
    if (this.isSimulation) {
      message.timestamp = Date.now()
      message.to = recipientId
      Meteor.users.update(this.userId, {$push: { messages: message }}, function (er) {
        console.error(er)
      })
    } else {
      message.timestamp = Date.now()
      message.from = this.userId
      Meteor.users.update(recipientId, {$push: { messages: message }}, function (er) {
        console.error(er)
      })
    }
    console.log('Message', message)
  }
})