(function () {
  function initProjectFilters() {
    var container = document.querySelector('#portfolio .portfolio-container');
    var filters = Array.prototype.slice.call(document.querySelectorAll('#portfolio-flters li'));
    if (!container || !filters.length) return;

    var items = Array.prototype.slice.call(container.querySelectorAll('.portfolio-item'));

    function applyFilter(filter) {
      var selector = filter.getAttribute('data-filter') || '*';
      filters.forEach(function (item) { item.classList.remove('filter-active'); });
      filter.classList.add('filter-active');

      items.forEach(function (item) {
        var matches = selector === '*' || item.matches(selector);
        item.classList.toggle('project-filter-visible', matches);
        item.classList.toggle('project-filter-hidden', !matches);
      });
    }

    filters.forEach(function (filter) {
      filter.addEventListener('click', function (event) {
        event.preventDefault();
        applyFilter(filter);
      });
      filter.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          applyFilter(filter);
        }
      });
    });

    var active = document.querySelector('#portfolio-flters li.filter-active') || filters[0];
    applyFilter(active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectFilters);
  } else {
    initProjectFilters();
  }
})();
