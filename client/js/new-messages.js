Template.newMessages.conversations = function (userId) {
  // TODO: subscription should filter to new ones
  return Conversations.find({})
}

// Get the other user in this conversation
Template.newMessages.otherUser = function (users) {
  var others = users.filter(function (user) {
    return user._id !== Meteor.userId()
  })

  return others[0] // TODO: First user that is not me... will have to pick the last message and find the user for that for multi chat.
}

Template.newMessages.events = {
  'click a': function (evt) {
    // `this` is the conversation object
    Router.go('conversation', {puid: this.puid})
  }
}