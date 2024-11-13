let main = document.querySelector("main");
let form = document.querySelector("form");
let input = document.querySelector("input");
let button = document.querySelector("button");
let section = document.querySelector("section");
let prioritySelect = document.querySelector("#priority");

let errorMessage = document.createElement("p");
errorMessage.textContent = "Please enter your text 🗒";
errorMessage.style.cssText = `
color: red;
display: none;
`;
main.appendChild(errorMessage);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputText = input.value.trim();
  const priorityValue = prioritySelect.value;
  if (inputText === "") {
    errorMessage.style.display = "block";
    return;
  }
  errorMessage.style.display = "none";

  let paragraph = document.createElement("p");
  let spanText = document.createElement("span");
  let iconSpan = document.createElement("span");
  let timestamp = document.createElement("span");
  let completedTime = document.createElement("span");

  // Priority label (editable)
  let priorityLabel = document.createElement("span");
  priorityLabel.classList.add("priority");
  priorityLabel.innerText = priorityValue;
  setPriorityColor(priorityLabel, priorityValue);

  // Add the creation timestamp
  let createdAt = new Date();
  timestamp.innerText = ` (${formatDateTime(createdAt)})`;
  timestamp.style.marginLeft = "0.5rem";
  timestamp.style.fontSize = "0.5rem";
  timestamp.style.color = "#b3b3b3";

  // Icons for check, edit, and delete
  iconSpan.innerHTML = `
    <i class='fa fa-check'></i>
    <i class='fa fa-edit'></i>
    <i class='fa fa-trash'></i>
  `;

  spanText.innerText = inputText;

  // Append elements to paragraph
  paragraph.appendChild(priorityLabel);
  paragraph.appendChild(spanText);
  paragraph.appendChild(timestamp);
  paragraph.appendChild(iconSpan);
  paragraph.appendChild(completedTime); // Placeholder for completed time
  section.appendChild(paragraph);
  input.value = "";

  function toggleComplete(paragraph, completedTime) {
    paragraph.classList.toggle("completed");
    if (paragraph.classList.contains("completed")) {
      let completedAt = new Date();
      completedTime.innerText = ` (Completed: ${formatDateTime(completedAt)})`;
      completedTime.style.fontSize = "0.8rem";
      completedTime.style.color = "#00ff7f";
      // Remove line-through and italic text style on completed task
      paragraph.querySelector("span").style.textDecoration = "none";
    } else {
      completedTime.innerText = ""; // Clear completed time if unmarked
      // Re-add line-through and italic text style when task is uncompleted
      paragraph.querySelector("span").style.textDecoration = "line-through";
      paragraph.querySelector("span").style.fontStyle = "italic";
    }
  }

  // Mark task as completed
  iconSpan.querySelector(".fa-check").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleComplete(paragraph, completedTime);
  });

  // Edit task text
  iconSpan.querySelector(".fa-edit").addEventListener("click", (e) => {
    e.stopPropagation();
    if (paragraph.querySelector("input[type='text']")) return;

    let editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = spanText.innerText;
    editInput.style.marginRight = "0.5rem";

    paragraph.insertBefore(editInput, spanText);
    spanText.style.display = "none";
    editInput.focus();

    // Save changes on Enter
    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        spanText.innerText = editInput.value.trim() || spanText.innerText;
        spanText.style.display = "inline";
        paragraph.removeChild(editInput);
      }
    });

    // Cancel edit on blur
    editInput.addEventListener("blur", () => {
      spanText.style.display = "inline";
      paragraph.removeChild(editInput);
    });
  });

  // Delete task
  iconSpan.querySelector(".fa-trash").addEventListener("click", (e) => {
    e.stopPropagation();
    section.removeChild(paragraph);
  });

  // Edit priority on click
  priorityLabel.addEventListener("click", (e) => {
    e.stopPropagation();
    if (paragraph.querySelector("select")) return;

    let prioritySelect = document.createElement("select");
    prioritySelect.innerHTML = `
      <option value="H" ${priorityValue === "H" ? "selected" : ""}>High</option>
      <option value="N" ${
        priorityValue === "N" ? "selected" : ""
      }>Normal</option>
      <option value="L" ${priorityValue === "L" ? "selected" : ""}>Low</option>
    `;
    prioritySelect.style.marginRight = "0.5rem";
    priorityLabel.style.display = "none";

    paragraph.insertBefore(prioritySelect, priorityLabel);

    prioritySelect.addEventListener("change", () => {
      priorityLabel.innerText = prioritySelect.value;
      setPriorityColor(priorityLabel, prioritySelect.value);
      priorityLabel.style.display = "inline";
      paragraph.removeChild(prioritySelect);
    });

    prioritySelect.addEventListener("blur", () => {
      priorityLabel.style.display = "inline";
      paragraph.removeChild(prioritySelect);
    });

    prioritySelect.focus();
  });
});

// Toggle completed state and set completion timestamp
function toggleComplete(paragraph, completedTime) {
  paragraph.classList.toggle("completed");
  if (paragraph.classList.contains("completed")) {
    let completedAt = new Date();
    completedTime.innerText = ` (Completed: ${formatDateTime(completedAt)})`;
    completedTime.style.fontSize = "0.8rem";
    completedTime.style.color = "#00ff7f";
  } else {
    completedTime.innerText = ""; // Clear completed time if unmarked
  }
}

// Function to set priority label color based on value
function setPriorityColor(label, priority) {
  if (priority === "H") {
    label.style.color = "#ff4f4f";
  } else if (priority === "N") {
    label.style.color = "#ffd13f";
  } else if (priority === "L") {
    label.style.color = "#4affb1";
  }
}

// Helper function to format date and time
function formatDateTime(date) {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}
