/* MY STUDENT uploading prototype
   Saves PDF data and metadata in localStorage on this browser/origin.
   For a shared production website, replace this storage layer with a backend. */
(() => {
  "use strict";

  const STORAGE_KEY = "myStudentUploadedResources_v1";
  const MAX_FILE_BYTES = 2 * 1024 * 1024;

  const form = document.getElementById("uploadForm");
  const typeInput = document.getElementById("resourceType");
  const titleInput = document.getElementById("resourceTitle");
  const semesterInput = document.getElementById("semester");
  const yearInput = document.getElementById("resourceYear");
  const fileInput = document.getElementById("pdfFile");
  const dateInput = document.getElementById("eventDate");
  const descriptionInput = document.getElementById("eventDescription");
  const status = document.getElementById("statusMessage");
  const filePreview = document.getElementById("filePreview");
  const list = document.getElementById("resourceList");

  function readResources() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error("Could not read resource library:", error);
      return [];
    }
  }

  function writeResources(resources) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
  }

  function setStatus(message, kind) {
    status.textContent = message;
    status.className = "status " + (kind || "");
  }

  function updateFields() {
    const isOther = typeInput.value === "OTHERS";
    document.getElementById("semesterField").classList.toggle("hidden", isOther);
    document.getElementById("yearField").classList.toggle("hidden", isOther);
    document.getElementById("eventDateField").classList.toggle("hidden", !isOther);
    document.getElementById("descriptionField").classList.toggle("hidden", !isOther);
    document.getElementById("fileOptional").textContent = isOther ? "(optional)" : "(required)";
    titleInput.placeholder = isOther ? "e.g. End Semester Examination" : "e.g. Data Structures";
    titleInput.previousElementSibling.textContent = isOther ? "Event / announcement title" : "Subject / resource name";
    titleInput.required = true;
    dateInput.required = isOther;
    descriptionInput.required = isOther;
    fileInput.required = !isOther;
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("The PDF could not be read."));
      reader.readAsDataURL(file);
    });
  }

  function safeText(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[char]));
  }

  function formatDate(value) {
    if (!value) return "No date";
    return new Date(value + "T00:00:00").toLocaleDateString(undefined, {
      year:"numeric", month:"short", day:"numeric"
    });
  }

  function renderList() {
    const resources = readResources().sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    if (!resources.length) {
      list.innerHTML = '<div class="empty">No resources uploaded yet.</div>';
      return;
    }

    list.innerHTML = resources.map(resource => {
      const meta = resource.type === "OTHERS"
        ? `${formatDate(resource.eventDate)} · Calendar announcement`
        : `${resource.semesterLabel || ""} · ${resource.year || "Year not set"} · ${resource.type}`;
      return `<article class="resource-item">
        <div class="resource-info">
          <h3>${safeText(resource.title)}</h3>
          <p>${safeText(meta)}</p>
          <p>${resource.fileName ? "PDF: " + safeText(resource.fileName) : "Details: " + safeText(resource.description || "")}</p>
        </div>
        <div class="resource-actions">
          ${resource.fileData ? `<button type="button" class="open-btn" data-open="${safeText(resource.id)}">Open PDF</button>` : ""}
          <button type="button" class="delete-btn" data-delete="${safeText(resource.id)}">Delete</button>
        </div>
      </article>`;
    }).join("");
  }

  function openPDF(id) {
    const resource = readResources().find(item => item.id === id);
    if (!resource || !resource.fileData) return;
    const link = document.createElement("a");
    link.href = resource.fileData;
    link.target = "_blank";
    link.rel = "noopener";
    link.click();
  }

  typeInput.addEventListener("change", updateFields);
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) {
      filePreview.classList.add("hidden");
      filePreview.textContent = "";
      return;
    }
    filePreview.classList.remove("hidden");
    filePreview.textContent = `${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    setStatus("", "");
    const type = typeInput.value;
    const title = titleInput.value.trim();
    const file = fileInput.files[0];
    const isOther = type === "OTHERS";

    if (!title) return setStatus("Please enter a subject or title.", "error");
    if (isOther && (!dateInput.value || !descriptionInput.value.trim())) {
      return setStatus("For OTHERS, enter the event date and announcement details.", "error");
    }
    if (!isOther && !file) return setStatus("Please select a PDF file.", "error");
    if (file) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return setStatus("Only PDF files are allowed.", "error");
      }
      if (file.size > MAX_FILE_BYTES) {
        return setStatus("This prototype accepts PDFs up to 2 MB. Use cloud storage for larger PDFs.", "error");
      }
    }

    const button = form.querySelector(".submit-btn");
    button.disabled = true;
    button.textContent = "Saving...";
    try {
      const resources = readResources();
      const fileData = file ? await fileToDataURL(file) : null;
      const resource = {
        id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)),
        type,
        title,
        semester: isOther ? "" : semesterInput.value,
        semesterLabel: isOther ? "" : semesterInput.options[semesterInput.selectedIndex].text,
        year: isOther ? "" : (yearInput.value || String(new Date().getFullYear())),
        eventDate: isOther ? dateInput.value : "",
        description: isOther ? descriptionInput.value.trim() : "",
        fileName: file ? file.name : "",
        fileData,
        createdAt: new Date().toISOString()
      };
      resources.push(resource);
      writeResources(resources);
      form.reset();
      updateFields();
      filePreview.classList.add("hidden");
      filePreview.textContent = "";
      setStatus("Saved successfully. The matching student page can now read this resource in this browser.", "success");
      renderList();
    } catch (error) {
      console.error(error);
      setStatus("Could not save. Browser storage may be full. Try a smaller PDF or use shared cloud storage.", "error");
    } finally {
      button.disabled = false;
      button.innerHTML = "<span>⬆</span> Save Resource";
    }
  });

  list.addEventListener("click", event => {
    const openButton = event.target.closest("[data-open]");
    const deleteButton = event.target.closest("[data-delete]");
    if (openButton) openPDF(openButton.dataset.open);
    if (deleteButton) {
      const id = deleteButton.dataset.delete;
      if (!confirm("Delete this uploaded resource?")) return;
      writeResources(readResources().filter(item => item.id !== id));
      renderList();
      setStatus("Resource deleted.", "success");
    }
  });

  document.getElementById("refreshBtn").addEventListener("click", renderList);
  updateFields();
  renderList();
})();