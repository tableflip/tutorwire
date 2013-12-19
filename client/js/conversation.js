ConversationController = RouteController.extend({
  template: "conversation",

  data: function () {
      return {bodyClass: "conevrsation"}
  }
})

Template.conversation.events = {
  'click button': function (evt, tpl) {
    var text = tpl.find('input').value
    console.log('Send: ', text, this)
  }
}