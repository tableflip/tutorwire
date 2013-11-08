Subjects = new Meteor.Collection("subjects")

CityLocations = new Meteor.Collection("city-locations")

CityLocations.findByCountry = function (country) {
  return CityLocations.find({country: country || "UK"}, {sort: [["name", "ASC"]]})
}

Tutors = new Meteor.Collection("tutors")

Tutors.findBySubject = function (subject) {
  return Tutors.find({subject: new RegExp(subject, "gi")}, {sort: [["name", "ASC"]]})
}