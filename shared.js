Subjects = new Meteor.Collection("subjects")

CityLocations = new Meteor.Collection("city-locations")

CityLocations.findByCountry = function (country) {
  console.log("Finding cities by country", country)
  return CityLocations.find({country: country || "UK"}, {sort: [["name", "ASC"]]})
}

Tutors = new Meteor.Collection("tutors")

Tutors.findBySubject = function (subject) {
  console.log("Finding tutors by subject", subject)
  var tutors = Tutors.find({subject: new RegExp(subject, "gi")}, {sort: [["name", "ASC"]]})
  console.log("Found", tutors.count(), "of", Tutors.find().count())
  return tutors
}

Tutors.findByPuid = function (puid) {
  return Tutors.findOne({puid: puid})
}