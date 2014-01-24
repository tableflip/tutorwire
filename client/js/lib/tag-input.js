(function($) {

  // Unique ID given to tagInput instances
  var tagInputId = 0

  // Create a new tag with the specified text
  function createTag (text, inputCt) {
    var link = $("<a/>").attr("href", "#").addClass("label label-default")
    var x = $("<span/>").addClass("glyphicon glyphicon-remove")

    link.append(x).append(" ").append(text)

    var input = $("<input/>").attr({
      type: "hidden",
      name: "tag-" + inputCt.data("tagInput").id,
      value: text
    })

    return $("<span/>").addClass("tag").append(link).append(input)
  }

  function isString (str) {
    return Object.prototype.toString.call(str) == "[object String]"
  }

  // API exposed to via jQuery
  // e.g.
  // $("div").tagInput() // (Attach)
  // $("div").tagInput("clear") // Clear input and tags
  // $("div").tagInput("detach") // Unbind tagInput listeners on all elements
  var api = {
    attach: function (opts) {
      var inputCt = $(this)
      var outputCt = $(inputCt.data("output") || opts.output) || $()

      var input = inputCt.is("input") ? inputCt : $("input", inputCt)
      var inputBtn = $("button, input[type='submit']", inputCt)

      // tagInput data to be associated with the inputCt element
      var data = {
        id: tagInputId++,
        tags: $(),
        onInputEnterKeypress: function (e) {
          if (e.which == 13) {
            data.onInputBtnClick(e)
          }
        },
        onInputBtnClick: function (e) {
          e.preventDefault()

          var val = $.trim(input.val())

          if (!val) return

          var lowerVal = val.toLowerCase()

          // Is it a duplicate?
          var dupes = data.tags.filter(function () {
            return lowerVal == $("input[type=hidden]", this).val().toLowerCase()
          })

          // If dupe, act as though it has been added by clearing the input
          if (dupes.length) {
            input.val("")
            return
          }

          var tag = opts.createTag(val, inputCt)

          tag.click(function (e) {
            e.preventDefault()
            data.tags = data.tags.not(tag)
            tag.unbind("click").remove()
          })

          outputCt.append(tag)
          input.val("")
          data.tags = data.tags.add(tag)
        }
      }

      // re-enable existing tags if possible (have class name "tag")
      $(".tag", outputCt).each(function () {
        var tag = $(this)
        tag.click(function (e) {
          e.preventDefault()
          data.tags = data.tags.not(tag)
          tag.unbind("click").remove()
        })
        data.tags = data.tags.add(tag)
      })

      input.keypress(data.onInputEnterKeypress)
      inputBtn.click(data.onInputBtnClick)

      inputCt.data("tagInput", data)
    },

    detach: function () {
      var inputCt = $(this)

      var input = inputCt.is("input") ? inputCt : $("input", inputCt)
      var inputBtn = $("button, input[type='submit']", inputCt)

      var data = inputCt.data("tagInput")

      if (data) {
        input.unbind("keypress", data.onInputEnterKeypress)
        inputBtn.unbind("click", data.onInputBtnClick)
        data.tags.unbind("click")
      }

      inputCt.removeData("tagInput")
    },

    clear: function () {
      var inputCt = $(this)
      var input = inputCt.is("input") ? inputCt : $("input", inputCt)

      var data = inputCt.data("tagInput")

      if (data) {
        data.tags.unbind("click").remove()
        data.tags = $()
      }

      input.val("")
    }
  }

  $.fn.extend({
    /**
     * @param {String} [action]
     * @param {Object} [opts]
     * @param {String} [opts.action] API action to perform e.g. detach, clear
     * @param {Function} [opts.createTag] Function that'll create and return a tag (as a jQuery obj)
     * @param {Object} [opts.output] The element that new tags will be appended to (can also be specified as data-output)
     * @returns {*}
     */
    tagInput: function (action, opts) {
      if (!opts) {
        opts = action
      }

      opts = opts || {}

      if (isString(action)) {
        opts = {action: action}
      } else {
        opts.action = opts.action || "attach"
      }

      if (!api[opts.action]) {
        console.warn("Unsupported action: " + opts.action)
        return this
      }

      opts.createTag = opts.createTag || createTag

      return this.each(function () { api[opts.action].call(this, opts) })
    }
  })

})(jQuery)