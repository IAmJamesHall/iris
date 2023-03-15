const conversationSelector = document.getElementById("conversation-selector");
const chatContainer = document.getElementById("chat-container");
const userInput = document.getElementById("user-input");
const submitBtn = document.getElementById("submit-btn");

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

async function fetchAssistantReply(conversation) {
  const apiKey = "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";
  const url = "https://api.openai.com/v1/engines/gpt-3.5-turbo/completions";
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };

  const messages = conversation.map(message => {
    return {
      role: message.role,
      content: message.content,
    };
  });

  const requestBody = {
    model: "gpt-3.5-turbo",
    messages,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching assistant reply:", error);
    return "I'm sorry, I cannot provide a response at the moment.";
  }
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

updateConversationSelector();