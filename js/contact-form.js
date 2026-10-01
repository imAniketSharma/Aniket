(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("contact-form-status");

  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.reportValidity()) return;

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var subject = form.elements.subject.value.trim().replace(/[\r\n]+/g, " ");
    var message = form.elements.message.value.trim();
    var body = "Name: " + name + "\r\nEmail: " + email + "\r\n\r\n" + message;
    var draftUrl = "mailto:aniketsharma552@gmail.com" +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    status.replaceChildren(
      document.createTextNode("Your draft is ready, but has not been sent. If your email app did not open, ")
    );

    var fallbackLink = document.createElement("a");
    fallbackLink.href = draftUrl;
    fallbackLink.textContent = "open the email draft";
    status.appendChild(fallbackLink);
    status.hidden = false;

    window.location.href = draftUrl;
  });
})();
