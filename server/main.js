Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {'messages': 1}});
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

Tutors.allow({
  insert: function (userId, tutor) {
    tutor.puid = shortid.generate()
    return true
  }
})