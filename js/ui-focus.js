// Prevent mouse clicks from leaving buttons/links in their persistent :focus state.
    // Keyboard users retain normal focus styling and accessibility.
    document.addEventListener("mouseup", function (event) {
      if (event.button !== 0) return;

      var target = event.target.closest("a, button, .btn, #portfolio-flters li");
      if (target && document.activeElement === target) {
        target.blur();
      }
    });
