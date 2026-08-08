const config = window.SUMMER_PEAKS_CONFIG || {};
const form = document.getElementById("assessmentForm");
const statusEl = document.getElementById("formStatus");
const scheduler = document.getElementById("scheduler");
const calendarMount = document.getElementById("calendarMount");

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelector(".menu-toggle").addEventListener("click", e => {
  const nav = document.querySelector(".nav");
  const open = nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(a => a.addEventListener("click", () => {
  document.querySelector(".nav").classList.remove("open");
}));

function formToObject(form) {
  const fd = new FormData(form);
  const obj = {};
  for (const [key, value] of fd.entries()) {
    if (key === "company_website_extra") continue;
    if (obj[key]) obj[key] = Array.isArray(obj[key]) ? [...obj[key], value] : [obj[key], value];
    else obj[key] = value;
  }
  return obj;
}

function mountCalendar() {
  const url = (config.BOOKING_URL || "").trim();
  if (!url || url.includes("REPLACE-ME")) {
    calendarMount.innerHTML = `<div class="calendar-placeholder"><strong>Calendar setup needed.</strong><br>
      Add your public booking link in <code>assets/config.js</code>. Google Calendar Appointment Schedules,
      Calendly, Microsoft Bookings, or another embeddable scheduling page will work.</div>`;
    return;
  }
  const iframe = document.createElement("iframe");
  iframe.className = "calendar-frame";
  iframe.src = url;
  iframe.title = "Schedule a discovery call";
  iframe.loading = "lazy";
  iframe.setAttribute("frameborder","0");
  calendarMount.replaceChildren(iframe);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending your assessment…";
  const data = formToObject(form);
  try {
    const res = await fetch("/api/assessment", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Unable to submit");
    form.classList.add("hidden");
    scheduler.classList.remove("hidden");
    mountCalendar();
    scheduler.scrollIntoView({behavior:"smooth", block:"start"});
  } catch (err) {
    statusEl.textContent = "We couldn't send the assessment. Please call 202-450-7266 or email jay@summerpeaks.com.";
  }
});
