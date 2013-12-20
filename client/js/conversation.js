ConversationController = RouteController.extend({
  template: "conversation",

  data: function () {
    var conversation = Conversations.findOne({puid: this.params.puid})

    if (conversation.unread) {
        Conversations.update(conversation._id, {$set: {unread: 0}})
    }

    var users
    if (conversation && conversation.users){
      users = conversation.users.reduce(function (idMap, user) {
        idMap[user.userId] = user
        return idMap
      }, {})
      console.log(users)
    }
    return {
      bodyClass: "conversation",
      conversation: conversation,
      users: users
    }
  }
})

function resizeMessagesWindow () {
    var winHeight = $(window).height()
    $("#messages").height(winHeight - 180)
}

function scrollBottomMessagesWindow () {
    var msgs = $("#messages")
    msgs.animate({scrollTop: msgs.height()}, 500)
}

Template.conversation.rendered = function () {
    resizeMessagesWindow()
    scrollBottomMessagesWindow()
}

Template.conversation.isMe = function (userId) {
  return userId == Meteor.userId()
}

Template.conversation.username = function (userId, users) {
  return users[userId].name
}

Template.conversation.photo = function (userId, users) {
  return (users[userId].photo && users[userId].photo.url) || 'http://www.gravatar.com/avatar/?d=mm'
}

Template.conversation.events = {
  'click button': function (evt, tpl) {
    var text = tpl.find('input').value
    var fromId = Meteor.userId()

    // TODO: push this into sendMessage, we shouldn't have to unpick the other recipients each time.
    var users = this.conversation.users.filter(function(u){ return u._id != fromId})
    var toId = users && users[0] && users[0].userId // Erk, make nice.
    console.log('sending', text, toId, this)
    Conversations.sendMessage(toId, text, function(er){
      if (er) return console.error('Failed to send', er);
      console.log('sent message')
    })
  }
}
