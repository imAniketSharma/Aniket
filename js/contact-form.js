// Static-site contact form: validates fields and opens the user's mail client.
    document.getElementById("contact-form").addEventListener("submit", function (event) {
      event.preventDefault();

      if (!this.checkValidity()) {
        this.reportValidity();
        return;
      }

      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var subject = document.getElementById("contact-subject").value.trim();
      var message = document.getElementById("contact-message").value.trim();

      var body =
        "Name: " + name + "\n" +
        "Email: " + email + "\n\n" +
        message;

      var mailto = "mailto:aniketsharma552@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;
    });
