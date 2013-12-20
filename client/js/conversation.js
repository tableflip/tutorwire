ConversationController = RouteController.extend({
  template: "conversation",

  data: function () {
      return {bodyClass: "conversation"}
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
