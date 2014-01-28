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

  function addTag (text, inputCt) {
    inputCt = $(inputCt)

    var input = inputCt.is(".tag-input-control") ? inputCt : $(".tag-input-control", inputCt)

    var data = inputCt.data("tagInput")

    if (!data) return console.warn("Cannot add tag to detached tagInput")

    var outputCt = $(inputCt.data("tag-output") || data.opts.output) || $()

    text = $.trim(text)

    if (!text) return

    var lowerText = text.toLowerCase()

    // Is it a duplicate?
    var dupes = data.tags.filter(function () {
      return lowerText == $("input[type=hidden]", this).val().toLowerCase()
    })

    // If dupe, act as though it has been added by clearing the input
    if (dupes.length) {
      input.val("")
      inputCt.trigger("tag:dupe", {tag: dupes})
      return
    }

    var tag = data.opts.createTag(text, inputCt)

    tag.click(function (e) {
      e.preventDefault()
      data.tags = data.tags.not(tag)
      tag.unbind("click").remove()
      inputCt.trigger("tag:remove", {tag: tag})
    })

    outputCt.append(tag)
    input.val("")

    data.tags = data.tags.add(tag)
    inputCt.trigger("tag:add", {tag: tag})
  }

  // API exposed via jQuery
  // e.g.
  // $("div").tagInput() // (Attach)
  // $("div").tagInput("clear") // Clear input and tags
  // $("div").tagInput("detach") // Unbind tagInput listeners on all elements
  // $("div").tagInput("add", {text: "Tag Text"}) // Programatically add a tag
  var api = {
    attach: function (opts) {
      var inputCt = $(this)
      var outputCt = $(inputCt.data("tag-output") || opts.output) || $()

      var input = inputCt.is(".tag-input-control") ? inputCt : $(".tag-input-control", inputCt)
      var inputBtn = $("button, input[type='submit']", inputCt)

      // tagInput data to be associated with the inputCt element
      var data = {
        id: tagInputId++,
        opts: opts,
        tags: $(),
        onInputEnterKeypress: function (e) {
          if (e.which == 13) {
            e.preventDefault()
            addTag(input.val(), inputCt)
          }
        },
        onInputBtnClick: function (e) {
          e.preventDefault()
          addTag(input.val(), inputCt)
        }
      }

      // re-enable existing tags if possible (have class name "tag")
      $(".tag", outputCt).each(function () {
        var tag = $(this)

        tag.click(function (e) {
          e.preventDefault()
          data.tags = data.tags.not(tag)
          tag.unbind("click").remove()
          inputCt.trigger("tag:remove", {tag: tag})
        })

        data.tags = data.tags.add(tag)
        inputCt.trigger("tag:add", {tag: tag})
      })

      input.keypress(data.onInputEnterKeypress)
      inputBtn.click(data.onInputBtnClick)

      inputCt.data("tagInput", data)
    },

    detach: function () {
      var inputCt = $(this)

      var input = inputCt.is(".tag-input-control") ? inputCt : $(".tag-input-control", inputCt)
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
      var input = inputCt.is(".tag-input-control") ? inputCt : $(".tag-input-control", inputCt)

      var data = inputCt.data("tagInput")

      if (data) {
        var tags = data.tags

        tags.unbind("click").remove()
        data.tags = $()

        inputCt.trigger("tag:clear", {tags: tags})
      }

      input.val("")
    },

    add: function (opts) {
      console.log("Adding tag", opts)
      addTag(opts.text, this)
    }
  }

  $.fn.extend({
    /**
     * Turn an <input> or a element containing an <input> into a tagInput.
     *
     * The <input> MUST have the class "tag-input-control".
     *
     * Specify a selector for the element to put the tags in with a "data-tag-output" attribute.
     *
     * Events:
     *
     * tag:add
     * tag:remove
     * tag:clear
     * tag:dupe
     *
     * @param {String} [action]
     * @param {Object} [opts]
     * @param {String} [opts.action] API action to perform e.g. detach, clear
     * @param {Function} [opts.createTag] Function that'll create and return a tag (as a jQuery obj)
     * @param {Object} [opts.output] The element that new tags will be appended to
     * @returns {*}
     */
    tagInput: function (action, opts) {
      if (!opts) {
        opts = action
      }

      opts = opts || {}
      opts.action = action || opts.action || "attach"

      if (!api[opts.action]) {
        console.warn("Unsupported action: " + opts.action)
        return this
      }

      opts.createTag = opts.createTag || createTag

      return this.each(function () { api[opts.action].call(this, opts) })
    }
  })

})(jQuery)