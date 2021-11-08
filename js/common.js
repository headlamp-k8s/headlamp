$('.mobile-menu').on('click', function(e) {
  $('body').toggleClass("mobile-menu_open");
});

$('.docs-menu').on('click', function(e) {
  $('body').toggleClass("show");
});

function closeMenu(elem) {
  if($("body").hasClass("mobile-menu_open")) {
    if(!elem.classList.contains("dropdown-toggle")) {
      $('.mobile-menu').click();
    }
  }
}

  document.querySelectorAll(".nav-item.dropdown .nav-link").forEach(function(item) {
    item.addEventListener("click", function(e) {
      e.preventDefault();
      if($("body").hasClass("mobile-menu_open")) {
        if(!this.classList.contains("nav-link_selected")) {
          document.querySelectorAll(".nav-link").forEach(function(elem) {
            elem.classList.remove("nav-link_selected");
          });
          this.classList.add("nav-link_selected");
        } else {
          this.classList.remove("nav-link_selected");
        }
      }
    })
  });

  document.querySelectorAll(".nav-item.dropdown .nav-link").forEach(function(item) {
    if(!$("body").hasClass("mobile-menu_open")) {
      item.addEventListener("focus", function(e) {
        item.parentElement.classList.add("focus");
      });

      // This logic is based on https://www.a11ywithlindsey.com/blog/create-accessible-dropdown-navigation
      item.parentElement.querySelectorAll(".dropdown-menu").forEach(function(dropdown) {
        const subMenuLinks = dropdown.querySelectorAll('a')
        const lastLink = subMenuLinks[subMenuLinks.length - 1]

        lastLink.addEventListener('blur', function() {
          item.parentElement.classList.remove('focus')
        })
      });
    }
  });

  [".nav-link", ".dropdown-item"].forEach(className =>
    document.querySelectorAll(className).forEach(function(item) {
      item.addEventListener("click", function(e) {
        closeMenu(this);
      })
    })
  );


// Cookies

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.querySelectorAll(".contact-cookies-consent-notice").forEach(
  function (item) {
    if (getCookie("cookieconsent_status") !== "allow") {
      item.classList.remove("d-none");
    }
  }
);
