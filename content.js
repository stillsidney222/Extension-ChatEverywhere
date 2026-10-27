(function () {
  "use strict";

  // Prevent duplicate injection.
  if (document.getElementById("fc-floating-btn")) return;

  // FLOATING BUTTON
  const btn = document.createElement("button");
  btn.id = "fc-floating-btn";
  btn.type = "button";
  btn.setAttribute("aria-label", "Open chat");
  btn.textContent = "💬";
  document.body.appendChild(btn);

  // CHATBOX STRUCTURE
  const chatbox = document.createElement("div");
  chatbox.id = "fc-chatbox";
  chatbox.style.display = "none";

  chatbox.innerHTML = `
    <div id="fc-chatbox-header">
      <span>Chat Everywhere</span>
      <button id="fc-chatbox-close" type="button" aria-label="Close chat">✕</button>
    </div>

    <div id="fc-chat-layout">
      <div id="fc-left-section">
        <div id="fc-tabs">
          <button class="fc-tab active" data-tab="chats" type="button">Chats</button>
          <button class="fc-tab" data-tab="media" type="button">Media</button>
          <button class="fc-tab" data-tab="groups" type="button">Groups</button>
          <button class="fc-tab" data-tab="tools" type="button">Tools</button>
        </div>

        <div id="fc-tab-content">
          <div id="fc-chats" class="fc-tab-panel active">
            <div class="fc-chat-item">
              <div class="fc-avatar">A</div>
              <div><strong>Alex</strong><p>Hello! How are you?</p></div>
            </div>
            <div class="fc-chat-item">
              <div class="fc-avatar">J</div>
              <div><strong>Jamie</strong><p>See you later!</p></div>
            </div>
            <div class="fc-chat-item">
              <div class="fc-avatar">M</div>
              <div><strong>Maria</strong><p>Thank you!</p></div>
            </div>
          </div>

          <div id="fc-media" class="fc-tab-panel">
            <div class="fc-media-section">
              <div class="fc-media-heading">
                <div>
                  <div class="fc-media-title">Photos & Videos</div>
                  <small class="fc-media-subtitle">Save and organize your favorite videos.</small>
                </div>
                <button id="fc-add-video" type="button">+ Add</button>
              </div>
              <div id="fc-video-drop" class="fc-video-drop">
                <span>＋</span>
                <p>Drag a YouTube link here</p>
                <small>Or click Add to paste a link</small>
              </div>
              <div id="fc-media-grid" class="fc-media-grid"></div>
              <div class="fc-media-title fc-files-title">Files</div>
              <div class="fc-file-list"></div>
            </div>
          </div>

          <div id="fc-groups" class="fc-tab-panel">
            <div class="fc-group-item">
              <div class="fc-avatar">BS</div>
              <div><strong>BSIT Group</strong><p>12 members</p></div>
            </div>
            <div class="fc-group-item">
              <div class="fc-avatar">PR</div>
              <div><strong>Project Group</strong><p>8 members</p></div>
            </div>
            <div class="fc-group-item">
              <div class="fc-avatar">CL</div>
              <div><strong>Classmates</strong><p>25 members</p></div>
            </div>
          </div>

          <div id="fc-tools" class="fc-tab-panel">
            <div class="fc-tools-container">
              <div class="fc-tools-header">
                <div>
                  <h2>Quick Notes</h2>
                  <p>Capture important information while browsing.</p>
                </div>
              </div>

              <div class="fc-note-composer">
                <textarea id="fc-note-input" maxlength="500"
                  placeholder="Write your note here..."></textarea>
                <div class="fc-note-composer-footer">
                  <span id="fc-character-count">0 / 500</span>
                  <button id="fc-add-note" type="button">+ Add Note</button>
                </div>
              </div>

              <div class="fc-notes-section-header">
                <div><h3>Recent Notes</h3><p>Your saved notes</p></div>
                <span id="fc-note-total">0 notes</span>
              </div>
              <div id="fc-notes-list"></div>
              <div id="fc-no-notes" class="fc-no-notes">
                <div class="fc-empty-icon">📝</div>
                <strong>No notes yet</strong>
                <p>Your saved notes will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        <div id="fc-chat-conversation">
          <div id="fc-chatbox-messages"></div>
          <div id="fc-chatbox-input-row">
            <input id="fc-chatbox-input" type="text" placeholder="Type a message..." />
            <button id="fc-chatbox-send" type="button">Send</button>
          </div>
        </div>
      </div>

      <div id="fc-shares-section">
        <div id="fc-shares-header">Shares</div>
        <div class="fc-share-item">
          <div class="fc-share-icon">📄</div>
          <div><strong>Project Document</strong><p>Shared file</p></div>
        </div>
        <div class="fc-share-item">
          <div class="fc-share-icon">🔗</div>
          <div><strong>Website Link</strong><p>Shared link</p></div>
        </div>
        <div class="fc-share-item">
          <div class="fc-share-icon">📷</div>
          <div><strong>Photo</strong><p>Shared image</p></div>
        </div>
        <div class="fc-share-item">
          <div class="fc-share-icon">📁</div>
          <div><strong>Assignment</strong><p>Shared file</p></div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(chatbox);

  // GET ELEMENTS
  const messages = chatbox.querySelector("#fc-chatbox-messages");
  const input = chatbox.querySelector("#fc-chatbox-input");
  const sendBtn = chatbox.querySelector("#fc-chatbox-send");
  const closeBtn = chatbox.querySelector("#fc-chatbox-close");
  const tabs = chatbox.querySelectorAll(".fc-tab");
  const panels = chatbox.querySelectorAll(".fc-tab-panel");

  let isOpen = false;

  // OPEN AND CLOSE CHAT
  function toggleChat() {
    isOpen = !isOpen;
    chatbox.style.display = isOpen ? "flex" : "none";
    if (isOpen) input.focus();
  }

  function closeChat() {
    isOpen = false;
    chatbox.style.display = "none";
  }

  btn.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", closeChat);

  // TAB SWITCHING
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) =>
        panel.classList.toggle("active", panel.id === `fc-${tabName}`)
      );
    });
  });

  // CHAT MESSAGES
  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `fc-message ${sender}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(() => addMessage("...", "bot"), 300);
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  // DRAG AND DROP LINK INTO CHAT INPUT
  input.addEventListener("dragover", (event) => {
    event.preventDefault();
    input.classList.add("fc-drag-over");
  });

  input.addEventListener("dragleave", () => {
    input.classList.remove("fc-drag-over");
  });

  input.addEventListener("drop", (event) => {
    event.preventDefault();
    input.classList.remove("fc-drag-over");
    const data = event.dataTransfer;
    const droppedText = data.getData("text/uri-list") || data.getData("text/plain");
    const url = droppedText.split(/\r?\n/).map((line) => line.trim())
      .find((line) => line.startsWith("http"));
    if (url) {
      input.value = url;
      input.focus();
    }
  });

  // MEDIA: SAVE YOUTUBE LINKS
  const mediaGrid = chatbox.querySelector("#fc-media-grid");
  const addVideoBtn = chatbox.querySelector("#fc-add-video");
  const videoDrop = chatbox.querySelector("#fc-video-drop");
  const VIDEO_STORAGE_KEY = "fc_saved_youtube_videos";

    function getYouTubeVideoId(url) {
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      if (host === "youtu.be") {
        return parsed.pathname.split("/").filter(Boolean)[0] || null;
      }

      if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)) {
        if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
        const parts = parsed.pathname.split("/").filter(Boolean);
        if (["shorts", "embed", "live"].includes(parts[0])) return parts[1] || null;
      }
    } catch (error) {
      return null;
    }
    return null;
  }

  function getSavedVideos() {
    return new Promise((resolve) => {
      chrome.storage.local.get([VIDEO_STORAGE_KEY], (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
          resolve([]);
          return;
        }
        resolve(result[VIDEO_STORAGE_KEY] || []);
      });
    });
  }

  async function saveYouTubeVideo(url) {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) {
      alert("Please enter a valid YouTube link.");
      return;
    }

    const videos = await getSavedVideos();
    if (videos.some((video) => video.id === videoId)) {
      alert("This video is already saved.");
      return;
    }

    videos.unshift({
      id: videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      savedAt: Date.now()
    });

    chrome.storage.local.set({ [VIDEO_STORAGE_KEY]: videos }, () => {
      if (chrome.runtime.lastError) {
        alert("Unable to save video.");
        return;
      }
      renderSavedVideos();
    });
  }

  async function renderSavedVideos() {
    const videos = await getSavedVideos();
    mediaGrid.innerHTML = "";

    videos.forEach((video) => {
      const card = document.createElement("div");
      card.className = "fc-saved-video";

      const thumbnail = document.createElement("img");
      thumbnail.src = `https://img.youtube.com/vi/${encodeURIComponent(video.id)}/mqdefault.jpg`;
      thumbnail.alt = "YouTube thumbnail";

      const link = document.createElement("a");
      link.href = video.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open YouTube video";

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "fc-remove-video";
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", async () => {
        const remaining = (await getSavedVideos()).filter((item) => item.id !== video.id);
        chrome.storage.local.set({ [VIDEO_STORAGE_KEY]: remaining }, () => {
          if (chrome.runtime.lastError) {
            alert("Unable to remove video.");
            return;
          }
          renderSavedVideos();
        });
      });

      card.append(thumbnail, link, removeBtn);
      mediaGrid.appendChild(card);
    });
  }

  addVideoBtn.addEventListener("click", () => {
    const url = prompt("Paste a YouTube video link:");
    if (url && url.trim()) saveYouTubeVideo(url.trim());
  });

  videoDrop.addEventListener("dragover", (event) => {
    event.preventDefault();
    videoDrop.classList.add("fc-video-drop-active");
  });

  videoDrop.addEventListener("dragleave", () => {
    videoDrop.classList.remove("fc-video-drop-active");
  });

  videoDrop.addEventListener("drop", (event) => {
    event.preventDefault();
    videoDrop.classList.remove("fc-video-drop-active");
    const data = event.dataTransfer;
    const droppedText = data.getData("text/uri-list") || data.getData("text/plain");
    const url = droppedText.split(/\r?\n/).map((line) => line.trim())
      .find((line) => line.startsWith("http"));
    if (url) saveYouTubeVideo(url);
    else alert("Please drag a YouTube link.");
  });

  renderSavedVideos();

  // QUICK NOTES
  const noteInput = chatbox.querySelector("#fc-note-input");
  const addNoteBtn = chatbox.querySelector("#fc-add-note");
  const notesList = chatbox.querySelector("#fc-notes-list");
  const characterCount = chatbox.querySelector("#fc-character-count");
  const noteTotal = chatbox.querySelector("#fc-note-total");
  const noNotes = chatbox.querySelector("#fc-no-notes");
  const NOTES_STORAGE_KEY = "chatEverywhereNotes";

  function loadNotes() {
    try {
      const saved = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      console.error("Unable to load notes:", error);
      return [];
    }
  }

  let notes = loadNotes();

  function updateCharacterCount() {
    characterCount.textContent = `${noteInput.value.length} / 500`;
  }

  function formatNoteDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "Date unavailable";
    return date.toLocaleString([], {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit"
    });
  }

  function updateNoteTotal() {
    noteTotal.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;
  }

  function saveNotes() {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return true;
    } catch (error) {
      console.error("Unable to save notes:", error);
      alert("Unable to save your note.");
      return false;
    }
  }

  function displayNotes() {
    notesList.innerHTML = "";
    updateNoteTotal();

    if (notes.length === 0) {
      noNotes.style.display = "flex";
      return;
    }

    noNotes.style.display = "none";

    notes.forEach((note) => {
      const noteCard = document.createElement("div");
      noteCard.className = "fc-note-card";

      const noteTop = document.createElement("div");
      noteTop.className = "fc-note-card-top";

      const noteIcon = document.createElement("div");
      noteIcon.className = "fc-note-icon";
      noteIcon.textContent = "📝";

      const noteDate = document.createElement("span");
      noteDate.className = "fc-note-date";
      noteDate.textContent = formatNoteDate(note.createdAt);
      noteTop.append(noteIcon, noteDate);

      const noteText = document.createElement("div");
      noteText.className = "fc-note-text";
      noteText.textContent = note.text;

      const noteActions = document.createElement("div");
      noteActions.className = "fc-note-actions";

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "fc-note-action";
      copyButton.textContent = "Copy";
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(note.text);
          copyButton.textContent = "Copied!";
          setTimeout(() => { copyButton.textContent = "Copy"; }, 1200);
        } catch (error) {
          console.error("Copy failed:", error);
          alert("Unable to copy this note.");
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "fc-note-action delete";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        const previous = notes;
        notes = notes.filter((item) => item !== note);
        if (saveNotes()) displayNotes();
        else notes = previous;
      });

      noteActions.append(copyButton, deleteButton);
      noteCard.append(noteTop, noteText, noteActions);
      notesList.appendChild(noteCard);
    });
  }

  function addNote() {
    const text = noteInput.value.trim();
    if (!text) {
      noteInput.focus();
      return;
    }

    notes.unshift({
      id: Date.now(),
      text,
      createdAt: new Date().toISOString()
    });

    if (saveNotes()) {
      noteInput.value = "";
      updateCharacterCount();
      displayNotes();
    }
  }

  noteInput.addEventListener("input", updateCharacterCount);
  addNoteBtn.addEventListener("click", addNote);
  noteInput.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      addNote();
    }
  });

  updateCharacterCount();
  displayNotes();

  // ADDITIONAL TOOLS
  const toolsContainer = chatbox.querySelector(".fc-tools-container");
  const extraTools = document.createElement("div");
  extraTools.id = "fc-extra-tools";

  extraTools.innerHTML = `
    <style>
      #fc-extra-tools {
        margin-top: 24px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 14px;
        color: #283044;
      }
      #fc-extra-tools .fc-tool-card {
        background: #fff;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
        min-width: 0;
      }
      #fc-extra-tools h3 { margin: 0 0 8px; font-size: 16px; }
      #fc-extra-tools p { font-size: 12px; color: #73798a; }
      #fc-extra-tools input, #fc-extra-tools button { box-sizing: border-box; font: inherit; }
      #fc-extra-tools input {
        width: 100%; min-width: 0; padding: 9px; border: 1px solid #dedfe6;
        border-radius: 7px; margin: 5px 0;
      }
      #fc-extra-tools button {
        cursor: pointer; padding: 8px 11px; margin: 3px 2px 3px 0;
        border: 0; border-radius: 7px; background: #f4dce8; color: #58364a;
      }
      #fc-extra-tools button:hover { background: #edc6da; }
      #fc-extra-tools .fc-tool-list { margin-top: 10px; }
      #fc-extra-tools .fc-tool-row {
        display: flex; align-items: center; gap: 7px; padding: 8px 0;
        border-bottom: 1px solid #f0f0f3; overflow-wrap: anywhere;
      }
      #fc-extra-tools .fc-tool-row span { flex: 1; min-width: 0; }
      #fc-extra-tools .fc-done { text-decoration: line-through; opacity: .55; }
      #fc-extra-tools .fc-small-btn { padding: 5px 7px; font-size: 11px; }
      #fc-extra-tools .fc-timer-display {
        font-size: 34px; font-weight: 700; text-align: center; margin: 18px 0;
        font-variant-numeric: tabular-nums;
      }
      #fc-extra-tools .fc-bookmark-link { color: #8b466b; text-decoration: underline; overflow-wrap: anywhere; }
      #fc-extra-tools .fc-image-preview { margin: 12px 0; text-align: center; }
      #fc-extra-tools .fc-image-preview img {
        max-width: 100%; max-height: 220px; object-fit: contain; border-radius: 8px;
      }
      #fc-extra-tools .fc-tool-status { overflow-wrap: anywhere; }
    </style>


<section class="fc-tool-card" id="fc-daily-planner">
  <h3>📅 Daily Planner</h3>
  <p>Plan your schedule and organize your day.</p>

  <input
    id="fc-plan-time"
    type="time"
    aria-label="Activity time"
  >

  <input
    id="fc-plan-activity"
    type="text"
    maxlength="150"
    placeholder="Enter your activity..."
    aria-label="Activity"
  >

  <button id="fc-add-plan" type="button">+ Add Activity</button>

  <div id="fc-plan-progress">0 activities completed</div>
  <div id="fc-plan-list" class="fc-tool-list"></div>
</section>


    <section class="fc-tool-card">
      <h3> Pomodoro Timer</h3>
      <p>Focus on your work with a minute timer.</p>
      <div id="fc-timer-display" class="fc-timer-display">25:00</div>
      <div style="text-align:center">
        <button id="fc-timer-start" type="button">Start</button>
        <button id="fc-timer-pause" type="button">Pause</button>
        <button id="fc-timer-reset" type="button">Reset</button>
      </div>
      <p id="fc-timer-status" class="fc-tool-status" aria-live="polite">Ready to focus!</p>
    </section>

    <section class="fc-tool-card">
      <h3>🔖 Website Bookmarks</h3>
      <p>Save useful websites for quick access later.</p>
      <input id="fc-bookmark-title" type="text" maxlength="100" placeholder="Website name">
      <input id="fc-bookmark-url" type="url" maxlength="2000" placeholder="https://example.com">
      <button id="fc-add-bookmark" type="button">+ Save Bookmark</button>
      <div id="fc-bookmark-list" class="fc-tool-list"></div>
    </section>

    <section class="fc-tool-card" id="fc-image-downloader">
      <h3>🖼️ Image Downloader</h3>
      <p>Preview and download an image using its URL, or select an image on this webpage.</p>
      <input id="fc-image-url" type="url" placeholder="Paste image URL here..." aria-label="Image URL">
      <div id="fc-image-preview" class="fc-image-preview"><p>Your image preview will appear here.</p></div>
      <button id="fc-preview-image" type="button">Preview Image</button>
      <button id="fc-download-image" type="button">Download Image</button>
      <button id="fc-select-page-image" type="button">Select Page Image</button>
      <p id="fc-image-status" class="fc-tool-status" role="status"></p>
    </section>
  `;

  toolsContainer.appendChild(extraTools);

  function loadToolData(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Could not load tool data:", error);
      return [];
    }
  }

  function saveToolData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Could not save tool data:", error);
      alert("Unable to save. Browser storage may be full.");
      return false;
    }
  }

  function createToolButton(label, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    if (className) button.className = className;
    button.addEventListener("click", onClick);
    return button;
  }

  // TO-DO LIST

  // DAILY PLANNER
  const PLAN_KEY = "fc_daily_planner";
  const planTime = extraTools.querySelector("#fc-plan-time");
  const planActivity = extraTools.querySelector("#fc-plan-activity");
  const planList = extraTools.querySelector("#fc-plan-list");
  const planProgress = extraTools.querySelector("#fc-plan-progress");

  let plans = loadToolData(PLAN_KEY);

  function renderPlans() {
    planList.replaceChildren();

    const completed = plans.filter((plan) => plan.done).length;

    planProgress.textContent =
      `${completed} of ${plans.length} activities completed`;

    const sortedPlans = [...plans].sort((a, b) =>
      a.time.localeCompare(b.time)
    );

    if (sortedPlans.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No activities planned yet.";
      planList.appendChild(empty);
      return;
    }

    sortedPlans.forEach((plan) => {
      const row = document.createElement("div");
      row.className = "fc-tool-row";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = Boolean(plan.done);
      checkbox.style.width = "auto";
      checkbox.style.margin = "0";
      checkbox.setAttribute("aria-label", `Complete ${plan.activity}`);

      checkbox.addEventListener("change", () => {
        const previous = plan.done;
        plan.done = checkbox.checked;

        if (saveToolData(PLAN_KEY, plans)) {
          renderPlans();
        } else {
          plan.done = previous;
          checkbox.checked = previous;
        }
      });

      const details = document.createElement("span");
      details.textContent =
        `${plan.time || "No time"} — ${plan.activity}`;

      if (plan.done) {
        details.classList.add("fc-done");
      }

      const remove = createToolButton("Delete", "fc-small-btn", () => {
        const previous = plans;
        plans = plans.filter((item) => item.id !== plan.id);

        if (saveToolData(PLAN_KEY, plans)) {
          renderPlans();
        } else {
          plans = previous;
        }
      });

      row.append(checkbox, details, remove);
      planList.appendChild(row);
    });
  }

  function addPlan() {
    const activity = planActivity.value.trim();
    const time = planTime.value;

    if (!activity) {
      planActivity.focus();
      return;
    }

    const newPlan = {
      id: `${Date.now()}-${Math.random()}`,
      time,
      activity,
      done: false
    };

    plans.push(newPlan);

    if (saveToolData(PLAN_KEY, plans)) {
      planActivity.value = "";
      planTime.value = "";
      renderPlans();
    } else {
      plans = plans.filter((plan) => plan.id !== newPlan.id);
    }
  }

  extraTools.querySelector("#fc-add-plan")
    .addEventListener("click", addPlan);

  planActivity.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addPlan();
    }
  });

  renderPlans();

    // POMODORO TIMER
  const timerDisplay = extraTools.querySelector("#fc-timer-display");
  const timerStatus = extraTools.querySelector("#fc-timer-status");
  const FOCUS_SECONDS = 25 * 60;
  let secondsRemaining = FOCUS_SECONDS;
  let timerInterval = null;

  function renderTimer() {
    const minutes = Math.floor(secondsRemaining / 60);
    const seconds = secondsRemaining % 60;
    timerDisplay.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  extraTools.querySelector("#fc-timer-start").addEventListener("click", () => {
    if (timerInterval !== null) return;
    if (secondsRemaining <= 0) {
      secondsRemaining = FOCUS_SECONDS;
      renderTimer();
    }
    timerStatus.textContent = "Focus time — you've got this!";
    timerInterval = setInterval(() => {
      secondsRemaining -= 1;
      renderTimer();
      if (secondsRemaining <= 0) {
        stopTimer();
        secondsRemaining = 0;
        renderTimer();
        timerStatus.textContent = "Focus session complete!";
        alert("Your 25-minute focus session is complete!");
      }
    }, 1000);
  });

  extraTools.querySelector("#fc-timer-pause").addEventListener("click", () => {
    stopTimer();
    timerStatus.textContent = "Timer paused.";
  });

  extraTools.querySelector("#fc-timer-reset").addEventListener("click", () => {
    stopTimer();
    secondsRemaining = FOCUS_SECONDS;
    renderTimer();
    timerStatus.textContent = "Timer reset. Ready to focus!";
  });

  renderTimer();

  // WEBSITE BOOKMARKS
  const BOOKMARK_KEY = "fc_tool_bookmarks";
  const bookmarkTitle = extraTools.querySelector("#fc-bookmark-title");
  const bookmarkURL = extraTools.querySelector("#fc-bookmark-url");
  const bookmarkList = extraTools.querySelector("#fc-bookmark-list");
  let bookmarks = loadToolData(BOOKMARK_KEY);

  function renderBookmarks() {
    bookmarkList.replaceChildren();

    bookmarks.forEach((bookmark) => {
      const row = document.createElement("div");
      row.className = "fc-tool-row";

      const info = document.createElement("span");
      const link = document.createElement("a");
      link.className = "fc-bookmark-link";
      link.textContent = bookmark.title;
      link.href = bookmark.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      const domain = document.createElement("small");
      domain.style.display = "block";
      try {
        domain.textContent = new URL(bookmark.url).hostname;
      } catch {
        domain.textContent = bookmark.url;
      }
      info.append(link, domain);

      const remove = createToolButton("Delete", "fc-small-btn", () => {
        const previous = bookmarks;
        bookmarks = bookmarks.filter((item) => item.id !== bookmark.id);
        if (saveToolData(BOOKMARK_KEY, bookmarks)) renderBookmarks();
        else bookmarks = previous;
      });

      row.append(info, remove);
      bookmarkList.appendChild(row);
    });
  }

  extraTools.querySelector("#fc-add-bookmark").addEventListener("click", () => {
    const title = bookmarkTitle.value.trim();
    const rawURL = bookmarkURL.value.trim();

    if (!title || !rawURL) {
      alert("Please enter both a website name and URL.");
      return;
    }

    let parsedURL;
    try {
      parsedURL = new URL(rawURL);
    } catch {
      alert("Please enter a valid URL, such as https://example.com");
      return;
    }

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      alert("Only HTTP and HTTPS website links are allowed.");
      return;
    }

    if (bookmarks.some((item) => item.url === parsedURL.href)) {
      alert("This website is already bookmarked.");
      return;
    }

    bookmarks.unshift({
      id: `${Date.now()}-${Math.random()}`,
      title,
      url: parsedURL.href
    });

    if (saveToolData(BOOKMARK_KEY, bookmarks)) {
      bookmarkTitle.value = "";
      bookmarkURL.value = "";
      renderBookmarks();
    } else {
      bookmarks.shift();
    }
  });

  renderBookmarks();

  // IMAGE DOWNLOADER
  const imageTool = extraTools.querySelector("#fc-image-downloader");
  const imageURLInput = imageTool.querySelector("#fc-image-url");
  const imagePreview = imageTool.querySelector("#fc-image-preview");
  const imageStatus = imageTool.querySelector("#fc-image-status");
  let previewedImageURL = "";

  imageTool.querySelector("#fc-preview-image").addEventListener("click", () => {
    const rawURL = imageURLInput.value.trim();
    let parsedURL;

    try {
      parsedURL = new URL(rawURL);
      if (!["http:", "https:"].includes(parsedURL.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      imageStatus.textContent = "Please enter a valid HTTP or HTTPS image URL.";
      return;
    }

    imageStatus.textContent = "Loading image preview...";
    imagePreview.replaceChildren();
    previewedImageURL = "";

    const img = document.createElement("img");
    img.alt = "Image preview";
    img.style.cssText =
      "max-width:100%;max-height:220px;object-fit:contain;border-radius:8px";

    img.onload = () => {
      previewedImageURL = parsedURL.href;
      imageStatus.textContent = "Image loaded. You can download it now.";
    };

    img.onerror = () => {
      imagePreview.replaceChildren();
      imageStatus.textContent =
        "Unable to preview this image. Check the URL or website permissions.";
    };

    img.src = parsedURL.href;
    imagePreview.appendChild(img);
  });

  imageTool.querySelector("#fc-download-image").addEventListener("click", async () => {
    if (!previewedImageURL) {
      imageStatus.textContent = "Preview an image before downloading.";
      return;
    }

    try {
      imageStatus.textContent = "Preparing download...";
      const response = await fetch(previewedImageURL);
      if (!response.ok) throw new Error("Image request failed");

      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) {
        throw new Error("The URL did not return an image");
      }

      const objectURL = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const pathname = new URL(previewedImageURL).pathname;
      let filename = pathname.split("/").pop() || "downloaded-image";

      try {
        filename = decodeURIComponent(filename);
      } catch {
        // Keep the original filename if URL decoding fails.
      }

      filename = filename.replace(/[\\/:*?"<>|]/g, "_");
      if (!/\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(filename)) {
        const extensionByType = {
          "image/jpeg": ".jpg",
          "image/png": ".png",
          "image/gif": ".gif",
          "image/webp": ".webp",
          "image/svg+xml": ".svg",
          "image/avif": ".avif",
          "image/bmp": ".bmp"
        };
        filename = `downloaded-image${extensionByType[blob.type] || ".png"}`;
      }

      anchor.href = objectURL;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectURL), 30000);
      imageStatus.textContent = "Download requested. Check your browser downloads.";
    } catch (error) {
      console.error("Image download failed:", error);
      imageStatus.textContent =
        "The website blocked direct downloading. Try another image URL.";
    }
  });

  imageTool.querySelector("#fc-select-page-image").addEventListener("click", () => {
    imageStatus.textContent =
      "Now click an image outside the floating chat window.";

    const handleImageClick = (event) => {
      const target = event.target;

      if (
        !(target instanceof HTMLImageElement) ||
        chatbox.contains(target) ||
        target === btn ||
        target.naturalWidth === 0
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      document.removeEventListener("click", handleImageClick, true);
      imageURLInput.value = target.currentSrc || target.src;
      imageTool.querySelector("#fc-preview-image").click();
    };

    document.addEventListener("click", handleImageClick, true);
  });

  // Stop the timer if the injected chat UI is removed from the page.
  const toolCleanupObserver = new MutationObserver(() => {
    if (!document.body.contains(chatbox)) {
      stopTimer();
      toolCleanupObserver.disconnect();
    }
  });

  toolCleanupObserver.observe(document.body, { childList: true, subtree: true });

})();