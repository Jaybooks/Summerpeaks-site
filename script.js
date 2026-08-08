const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjybggdv";

const form = document.getElementById("assessmentForm");
const statusEl = document.getElementById("formStatus");
const step2 = document.getElementById("step2");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusEl.textContent = "Submitting your assessment...";

  try {
    const formData = new FormData(form);

    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (response.ok) {
      form.reset();
      form.classList.add("hidden");
      step2.classList.remove("hidden");
      step2.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    } else {
      const data = await response.json();
      console.error(data);
      statusEl.textContent =
        "There was a problem submitting your assessment. Please try again.";
    }
  } catch (error) {
    console.error(error);
    statusEl.textContent =
      "There was a problem submitting your assessment. Please try again.";
  }
});
