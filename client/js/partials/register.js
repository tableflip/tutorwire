Template.register.events({
  "click #login": function (e) {
    e.preventDefault()
    // WTF? Doesn't get triggered unless in next tick
    setTimeout(function () { $("#account .dropdown-toggle").trigger("click") }, 0)
  }
})

Template.register.rendered = function () {
  $('form').validationEngine("attach", {
    onValidationComplete: function (form, valid) {
      console.log('registerToContact', arguments)
      if (!valid) return console.warn("Registration form invalid")

      $("#register").prop("disabled", true)

      var opts = {
        email: $('#email').val(),
        password: $('#password').val(),
        profile:{
          name: $('#name').val(),
          // TODO: grab location if we have it
          photo:{
            url: 'http://www.gravatar.com/avatar/' + $.md5($('#email').val()) + '?d=mm'
          }
        }
      }

      console.log('createUser', opts)

      Accounts.createUser(opts, function (er) {
        if (er) return console.log(er)
      })
    }
  })
}