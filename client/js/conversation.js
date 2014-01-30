ConversationController = RouteController.extend({
  template: "conversation",

  data: function () {
    var conversation = Conversations.findOne({puid: this.params.puid})

    var users
    if (conversation && conversation.users) {
      if (conversation.unread) {
        Conversations.update(conversation._id, {$set: {unread: 0}})
      }

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

function resizeMessagesCt () {
  var winHeight = $(window).height()
  $("#messages-container").height(winHeight - 150)
}

function scrollBottomMessages () {
  $("#messages-container").prop("scrollTop", $("#messages").height())
}

Template.conversation.rendered = function () {
  resizeMessagesCt()
  scrollBottomMessages()
}

Template.conversationMsgs.isMe = function (userId) {
  return userId == Meteor.userId()
}

Template.conversationMsgs.username = function (userId, users) {
  return users[userId].name
}

Template.conversationMsgs.photo = function (userId, users) {
  return (users[userId].photo && users[userId].photo.url) || 'http://www.gravatar.com/avatar/?d=mm'
}

Template.conversationMsgs.other = function () {
  return this.conversation.users.filter(function(u){
    return u.userId != Meteor.userId()
  })[0]
}

Template.conversation.events = {
  'click button, submit': function (evt, tpl) {
    evt.preventDefault()

    var input = tpl.find('input')
    var text = input.value

    if (!text) return;

    Conversations.sendMessage(this.conversation, text, function (er) {
      if (er) return console.error('Failed to send', er)
      console.log('sent message')
    })

    input.value = ""
  }
}
