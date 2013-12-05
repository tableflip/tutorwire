ContactController = RouteController.extend({
    template: 'contact',

    before: function () {
        Session.set("tutor-puid", this.params.puid)
        Meteor.subscribe("tutor-by-puid", this.params.puid)
    },

    data: function () {
        return Tutors.findByPuid(Session.get("tutor-puid"))
    },

    after: function () {
        var tutor = Tutors.findByPuid(Session.get("tutor-puid"))

    }
})

Template.contact.events({

})

Template.contact.rendered = function () {

}

// Register ////////////////////////////////////////////////////////////////////////////////////////////////////////////
Template.registerToContact.events({
//    "click #register": function (evt) {
//
//    },
//    "click #register": function (evt) {
//
//    }
})

Template.registerToContact.rendered = function () {
    $('form').validationEngine("attach", {
        onValidationComplete: function (form, valid) {
            console.log('registerToContact', arguments)
            if (!valid) return console.warn("Registration form invalid")

            var opts = {
                email: $('#email').val(),
                password: $('#password').val(),
                profile:{
                    name: $('#name').val()
                    // TODO: grab location if we have it
                }
            }

            console.log('createUser', opts)

            Accounts.createUser(opts, function (er) {
                if (er) return console.log(er)
                console.log("Go contact them")
            })

        }
    })
}