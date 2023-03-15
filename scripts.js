const conversationSelector = document.getElementById("conversation-selector");
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");
const deleteBtn = document.getElementById("delete-btn");

let conversations = JSON.parse(localStorage.getItem("conversations")) || [];

function updateConversationSelector() {
  conversationSelector.innerHTML = `<option value="new">New Conversation</option>`;
  conversations.forEach((conversation, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `Conversation ${index + 1}`;
    conversationSelector.add(option);
  });
}

function displayConversation(index) {
  conversation.innerHTML = "";
  conversations[index].forEach(({ role, content }) => {
    const message = document.createElement("div");
    message.className = role;
    message.textContent = `${role}: ${content}`;
    conversation.appendChild(message);
  });
}

function addMessageToConversation(index, role, content) {
  const message = { role, content };
  if (index === "new") {
    conversations.push([message]);
  } else {
    conversations[index].push(message);
  }
  localStorage.setItem("conversations", JSON.stringify(conversations));
}

async function fetchAssistantReply(conversation, model, temperature) {
  const apiKey = "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";
  if (!temperature) temperature = 1;
  if (!model) model = "gpt-3.5-turbo";
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: conversation,
      temperature: temperature,
    }),
  })
    .then((response) => response.json())
    .then((data) => { return data.choices[0].message.content})
    .catch((error) => console.log(error));
}

conversationSelector.addEventListener("change", () => {
  const selectedIndex = conversationSelector.value;
  if (selectedIndex !== "new") {
    displayConversation(selectedIndex);
  } else {
    chatContainer.innerHTML = "";
  }
});

submitBtn.addEventListener("click", async () => {
  const selectedIndex = conversationSelector.value;
  const userMessage = userInput.value.trim();

  if (userMessage) {
    userInput.value = "";
    addMessageToConversation(selectedIndex, "user", userMessage);
    displayConversation(selectedIndex === "new" ? conversations.length - 1 : selectedIndex);

    const assistantReply = await fetchAssistantReply(conversations[selectedIndex === "new" ? conversations.length - 1 : selectedIndex]);
    addMessageToConversation(selectedIndex === "new" ? conversations.length - 1 : selectedIndex, "assistant", assistantReply);
    displayConversation(selectedIndex === "new" ? conversations.length - 1 : selectedIndex);

    if (selectedIndex === "new") {
      updateConversationSelector();
      conversationSelector.value = conversations.length - 1;
    }
  }
});

deleteBtn.addEventListener("click", () => {
  deleteCurrentConversation();
});


function deleteCurrentConversation() {
  const selectedConversation = conversationSelector.value;

  if (selectedConversation) {
    // Remove the conversation from local storage
    localStorage.removeItem(selectedConversation);

    // Remove the option from the dropdown menu
    const selectedOption = conversationSelector.querySelector(`option[value="${selectedConversation}"]`);
    conversationSelector.removeChild(selectedOption);

    // Clear the chat container
    chatContainer.innerHTML = '';

    // Load the new selected conversation (if any)
    loadConversation();
  }
}

updateConversationSelector();