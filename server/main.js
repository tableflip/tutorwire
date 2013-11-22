Meteor.publish("subjects", function () {
  return Subjects.find({}, {sort: [["name", "ASC"]]})
})

Meteor.publish("city-locations", function (country) {
  return CityLocations.findByCountry(country)
})

Meteor.publish("tutors-for-subject", function (subject) {
  return Tutors.findBySubject(subject)
})

Tutors.allow({
  insert: function (userId, tutor) {
    tutor.puid = shortid.generate()
    return true
  }
})