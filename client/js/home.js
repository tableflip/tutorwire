HomeController = RouteController.extend({
  template: "home",

  data: function () {
    var data = {bodyClass: "home"}
    return data
  }
})

function search (event){
  event.preventDefault()
  var subject = $("#subject")
  
  if (!subject.val()) {
    return subject.focus()
  }
  
  App.getTutorsBySubject(subject.val(), function (er, tutors) {
    App.showTutorsOnMap(tutors)
  })
}

Template.home.events({
  "submit #searchForm": function () {
    
  }
})