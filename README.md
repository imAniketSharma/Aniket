# Aniket Sharma Portfolio

A static portfolio site. Edit the files served by the browser directly; there is no Node.js build step.

## Files

- `index.html` — page content, project cards, and project detail modals
- `css/agency.min.css` — base theme styles
- `css/overrides.css` — portfolio-specific styles
- `js/` — page behavior and interactions
- `img/` — profile, blog, and project images
- `vendor/` — third-party browser libraries and icon fonts used by the page

## Preview

Open `index.html` in a browser, or serve this directory with any static file server. For example, if Python is installed:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

To add a project, add its card and matching modal to `index.html`, and put its image under `img/portfolio/`.
