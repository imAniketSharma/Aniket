/*
     * github-calendar keeps the original GitHub-style calendar, tooltips and
     * streak layout. Its old default proxy can return zero for the summary
     * counters, so refresh only those counters from a current contribution API.
     */
    (function () {
      var username = "imAniketSharma";
      var endpoint =
        "https://github-contributions-api.jogruber.de/v4/" +
        encodeURIComponent(username) + "?y=last";

      function formatDate(dateString) {
        var date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });
      }

      function shortDate(dateString) {
        var date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        });
      }

      function getStats(days) {
        var active = days
          .filter(function (d) { return d && d.date; })
          .sort(function (a, b) { return a.date.localeCompare(b.date); });

        var total = active.reduce(function (sum, d) {
          return sum + Number(d.count || 0);
        }, 0);

        var longestDays = 0;
        var longestStart = null;
        var longestEnd = null;
        var run = 0;
        var runStart = null;
        var previous = null;

        active.forEach(function (day) {
          var date = new Date(day.date + "T00:00:00");
          var consecutive = previous &&
            (date - previous === 24 * 60 * 60 * 1000);

          if (Number(day.count || 0) > 0) {
            if (!consecutive || run === 0) {
              run = 1;
              runStart = day.date;
            } else {
              run += 1;
            }

            if (run > longestDays) {
              longestDays = run;
              longestStart = runStart;
              longestEnd = day.date;
            }
          } else {
            run = 0;
            runStart = null;
          }

          previous = date;
        });

        var currentDays = 0;
        var currentStart = null;
        var currentEnd = null;

        // GitHub-style current streak: today if active; otherwise count back
        // from yesterday. Ignore future dates if an API includes one.
        var today = new Date();
        today.setHours(0, 0, 0, 0);

        var usable = active.filter(function (d) {
          return new Date(d.date + "T00:00:00") <= today;
        });

        if (usable.length) {
          var i = usable.length - 1;
          var lastDate = new Date(usable[i].date + "T00:00:00");

          if (lastDate.getTime() === today.getTime() &&
              Number(usable[i].count || 0) === 0) {
            i--;
          } else if (lastDate.getTime() < today.getTime()) {
            // Start from yesterday only when yesterday is the latest date.
            var yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastDate.getTime() !== yesterday.getTime()) {
              i = -1;
            }
          }

          if (i >= 0 && Number(usable[i].count || 0) > 0) {
            currentEnd = usable[i].date;
            currentStart = usable[i].date;
            currentDays = 1;

            for (var j = i - 1; j >= 0; j--) {
              var d1 = new Date(usable[j + 1].date + "T00:00:00");
              var d0 = new Date(usable[j].date + "T00:00:00");

              if ((d1 - d0) === 24 * 60 * 60 * 1000 &&
                  Number(usable[j].count || 0) > 0) {
                currentDays++;
                currentStart = usable[j].date;
              } else {
                break;
              }
            }
          }
        }

        return {
          total: total,
          longestDays: longestDays,
          longestStart: longestStart,
          longestEnd: longestEnd,
          currentDays: currentDays,
          currentStart: currentStart,
          currentEnd: currentEnd
        };
      }

      function updateCalendarStats(stats) {
        var columns = document.querySelectorAll(".calendar .contrib-column");
        if (columns.length < 3) return false;

        var values = [
          stats.total,
          stats.longestDays,
          stats.currentDays
        ];

        var ranges = [
          null,
          stats.longestStart && stats.longestEnd
            ? shortDate(stats.longestStart) + " – " + shortDate(stats.longestEnd)
            : "Rock - Hard Place",
          stats.currentStart && stats.currentEnd
            ? shortDate(stats.currentStart) + " – " + shortDate(stats.currentEnd)
            : "Rock - Hard Place"
        ];

        columns.forEach(function (column, index) {
          var number = column.querySelector(".contrib-number");
          if (number && values[index] !== undefined) {
            number.textContent = Number(values[index]).toLocaleString("en-US");
          }

          var muted = column.querySelectorAll(".text-muted");
          if (index > 0 && muted.length > 1 && ranges[index]) {
            muted[muted.length - 1].textContent = ranges[index];
          }
        });

        return true;
      }

      function refreshStats() {
        fetch(endpoint, {
          method: "GET",
          cache: "no-store",
          headers: { "Accept": "application/json" }
        })
          .then(function (response) {
            if (!response.ok) throw new Error("GitHub contribution API returned " + response.status);
            return response.json();
          })
          .then(function (data) {
            if (!data || !Array.isArray(data.contributions)) {
              throw new Error("Invalid contribution data");
            }

            var stats = getStats(data.contributions);

            // github-calendar renders asynchronously, so wait for its original
            // stats DOM before replacing only the incorrect numbers.
            var attempts = 0;
            var timer = setInterval(function () {
              attempts++;
              if (updateCalendarStats(stats) || attempts >= 30) {
                clearInterval(timer);
              }
            }, 250);
          })
          .catch(function (error) {
            console.warn("Unable to refresh GitHub contribution totals:", error);
          });
      }

      refreshStats();
    })();
