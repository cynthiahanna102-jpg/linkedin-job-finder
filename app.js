/* ============================================================
   JobMatch AI — front-end logic
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.JOBMATCH_CONFIG || {};
  var form = document.getElementById("job-form");
  var fileInput = document.getElementById("cv");
  var fileDrop = document.getElementById("fileDrop");
  var fileLabel = document.getElementById("fileLabel");
  var submitBtn = document.getElementById("submitBtn");
  var formError = document.getElementById("formError");

  var formView = document.getElementById("form-view");
  var loadingView = document.getElementById("loading-view");
  var resultsView = document.getElementById("results-view");
  var loadingStep = document.getElementById("loadingStep");

  var jobList = document.getElementById("jobList");
  var noJobs = document.getElementById("noJobs");
  var resultsSummary = document.getElementById("resultsSummary");
  var analysisCard = document.getElementById("analysisCard");
  var candidateSummary = document.getElementById("candidateSummary");
  var salaryAssessment = document.getElementById("salaryAssessment");
  var restartBtn = document.getElementById("restartBtn");

  var MAX_BYTES = 5 * 1024 * 1024;

  /* ---------- file input UX ---------- */
  fileInput.addEventListener("change", function () {
    var f = fileInput.files[0];
    if (!f) { resetFile(); return; }
    if (f.type !== "application/pdf" && !/\.pdf$/i.test(f.name)) {
      showError("Please upload a PDF file."); resetFile(); return;
    }
    if (f.size > MAX_BYTES) {
      showError("That PDF is larger than 5 MB. Please upload a smaller file."); resetFile(); return;
    }
    hideError();
    fileDrop.classList.add("has-file");
    fileLabel.textContent = f.name + "  (" + (f.size / 1024 / 1024).toFixed(1) + " MB)";
  });

  ["dragenter", "dragover"].forEach(function (ev) {
    fileDrop.addEventListener(ev, function (e) { e.preventDefault(); fileDrop.classList.add("drag"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    fileDrop.addEventListener(ev, function (e) { e.preventDefault(); fileDrop.classList.remove("drag"); });
  });
  fileDrop.addEventListener("drop", function (e) {
    if (e.dataTransfer && e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change"));
    }
  });

  function resetFile() {
    fileInput.value = "";
    fileDrop.classList.remove("has-file");
    fileLabel.innerHTML = "Drag &amp; drop or <u>browse</u>";
  }

  /* ---------- helpers ---------- */
  function showError(msg) { formError.textContent = msg; formError.hidden = false; }
  function hideError() { formError.hidden = true; }
  function show(el) { el.hidden = false; }
  function hide(el) { el.hidden = true; }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var STEPS = [
    "Extracting experience from your CV",
    "Building a tailored LinkedIn search",
    "Searching live LinkedIn postings",
    "Scoring each job against what you want",
  ];
  var stepTimer = null;
  function runSteps() {
    var i = 0;
    loadingStep.textContent = STEPS[0];
    stepTimer = setInterval(function () {
      i = Math.min(i + 1, STEPS.length - 1);
      loadingStep.textContent = STEPS[i];
    }, 2600);
  }
  function stopSteps() { if (stepTimer) { clearInterval(stepTimer); stepTimer = null; } }

  /* ---------- submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideError();

    if (!fileInput.files[0]) { showError("Please attach your CV as a PDF."); return; }

    if (!CFG.DEMO_MODE && (!CFG.WEBHOOK_URL || /REPLACE_WITH_YOUR/.test(CFG.WEBHOOK_URL))) {
      showError("This page isn't connected yet — set WEBHOOK_URL in config.js (or turn on DEMO_MODE).");
      return;
    }

    var fd = new FormData(form);

    submitBtn.disabled = true;
    hide(formView); show(loadingView); runSteps();

    var work = CFG.DEMO_MODE ? demoResponse() : postToBackend(fd);

    work.then(function (data) {
      stopSteps();
      renderResults(data || {});
      hide(loadingView); show(resultsView);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }).catch(function (err) {
      stopSteps();
      submitBtn.disabled = false;
      hide(loadingView); show(formView);
      showError(err && err.message ? err.message : "Something went wrong. Please try again.");
    });
  });

  function postToBackend(fd) {
    var ctrl = new AbortController();
    var t = setTimeout(function () { ctrl.abort(); }, 90000);
    return fetch(CFG.WEBHOOK_URL, { method: "POST", body: fd, signal: ctrl.signal })
      .then(function (res) {
        clearTimeout(t);
        if (!res.ok) throw new Error("Backend returned " + res.status + ". Check the n8n workflow is active.");
        return res.json();
      })
      .catch(function (err) {
        clearTimeout(t);
        if (err.name === "AbortError") throw new Error("The search timed out. Try again in a moment.");
        if (err instanceof TypeError) throw new Error("Couldn't reach the backend. Check the webhook URL and that CORS is allowed.");
        throw err;
      });
  }

  /* ---------- render ---------- */
  function renderResults(data) {
    var jobs = data.jobs || data.rankedJobs || [];
    var assessment = data.assessment || {};
    var summaryText = assessment.candidateSummary || data.overallAdvice || "";
    var salaryText = assessment.salaryAssessment || "";

    if (summaryText || salaryText) {
      show(analysisCard);
      candidateSummary.textContent = summaryText;
      salaryAssessment.textContent = salaryText;
      salaryAssessment.hidden = !salaryText;
    } else {
      hide(analysisCard);
    }

    jobList.innerHTML = "";
    if (!jobs.length) {
      show(noJobs);
      resultsSummary.textContent = "0 postings found.";
      return;
    }
    hide(noJobs);

    jobs.sort(function (a, b) { return (b.matchScore || 0) - (a.matchScore || 0); });
    resultsSummary.textContent =
      jobs.length + " posting" + (jobs.length === 1 ? "" : "s") + " found" +
      (data.query && data.query.keywords ? ' for "' + data.query.keywords + '"' : "") + ".";

    jobs.forEach(function (job) {
      var score = Math.max(0, Math.min(100, Math.round(job.matchScore || 0)));
      var band = score >= 75 ? "good" : score >= 50 ? "mid" : "low";
      var url = job.url || "#";

      var card = document.createElement("article");
      card.className = "job-card";
      card.innerHTML =
        '<div>' +
          '<h3><a href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(job.title || "Untitled role") + "</a></h3>" +
          '<div class="job-meta">' +
            esc(job.company || "Unknown company") +
            (job.location ? " &middot; " + esc(job.location) : "") +
            (job.postedDate ? " &middot; " + esc(job.postedDate) : "") +
          "</div>" +
          '<a class="apply-link" href="' + esc(url) + '" target="_blank" rel="noopener">View on LinkedIn &rarr;</a>' +
        "</div>" +
        '<div class="score ' + band + '"><div class="num">' + score + '</div><div class="lbl">match</div></div>' +
        (job.reasoning
          ? '<div class="job-reason">' + esc(job.reasoning) +
            (job.salaryFit ? '<span class="salary-fit">Salary: ' + esc(job.salaryFit) + "</span>" : "") +
            "</div>"
          : "");
      jobList.appendChild(card);
    });
  }

  restartBtn.addEventListener("click", function () {
    submitBtn.disabled = false;
    hide(resultsView); show(formView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- demo data ---------- */
  function demoResponse() {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          query: { keywords: "Senior Data Analyst SQL Python" },
          assessment: {
            candidateSummary:
              "6 years in analytics with strong SQL, Python and dashboarding. Best positioned for mid–senior analytics roles in product or growth teams.",
            salaryAssessment:
              "Your 75,000 EUR/year target is realistic for Berlin mid–senior analyst roles; senior titles at larger firms can reach 85–95k.",
          },
          jobs: [
            { title: "Senior Data Analyst", company: "Zalando", location: "Berlin, Germany", url: "https://www.linkedin.com/jobs", postedDate: "2 days ago", matchScore: 89, reasoning: "Direct match on SQL + Python + product analytics; team works on growth experiments you mentioned.", salaryFit: "In range" },
            { title: "Analytics Engineer", company: "N26", location: "Berlin (Hybrid)", url: "https://www.linkedin.com/jobs", postedDate: "5 days ago", matchScore: 72, reasoning: "Leans more toward dbt / pipeline work than your dashboard focus, but strong SQL overlap.", salaryFit: "Slightly above range" },
            { title: "Junior BI Analyst", company: "HelloFresh", location: "Berlin, Germany", url: "https://www.linkedin.com/jobs", postedDate: "1 week ago", matchScore: 41, reasoning: "Below your experience level and likely below salary target.", salaryFit: "Below range" },
          ],
        });
      }, 1800);
    });
  }
})();
