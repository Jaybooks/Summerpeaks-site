// Replace ONLY this value after you create your free Formspree form.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjybggdv";

const form = document.getElementById("assessmentForm");
const statusEl = document.getElementById("formStatus");
const step2 = document.getElementById("step2");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (FORMSPREE_ENDPOINT.includes("REPLACE_WITH")) {
    statusEl.textContent = "Email connection is the last setup step. The calendar is already connected.";
    return;
  }

  statusEl.textContent = "Sending your assessment…";

  const data = new FormData(form);

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Submission failed");

    form.classList.add("hidden");
    step2.classList.remove("hidden");
    step2.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch (error) {
    statusEl.textContent = "We couldn't send your assessment. Please email jay@summerpeaks.com or call 202-450-7266.";
  }
});
