ConversationController = RouteController.extend({
  template: "conversation",

  data: function () {
      return {
        bodyClass: "conversation",
        conversation: Conversations.findOne({puid: this.params.puid})
      }
  }
})

Template.conversation.events = {
  'click button': function (evt, tpl) {
    var text = tpl.find('input').value
    var fromId = Meteor.userId()
    var users = this.conversation.users.filter(function(u){ return u._id != fromId})
    var toId = users && users[0] && users[0].userId // Erk, make nice.
    console.log('sending', text, toId, this)
    Conversations.sendMessage(toId, text, function(er){
      if (er) return console.error('Failed to send', er);
      console.log('sent message')
    })
  }
}
