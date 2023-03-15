let openAIKey = localStorage.openAIKey || prompt('Enter your OpenAI API key');
localStorage.openAIKey = openAIKey;

// Set up event listener to listen to textarea input
var textarea = document.querySelector("#message");
textarea.addEventListener("keydown", function (event) {
  // If the user presses enter and shift together
  if (event.key === "Enter" && event.shiftKey) {
    textarea.value += "\n"; //TODO: change this so the newline is added at cursor, not end of the box
  } else if (event.key === "Enter") {
    // If the user presses only enter
    event.preventDefault();
    sendMessage();
  } else if ((event.metaKey || event.ctrlKey) && event.key === "j") {
    event.preventDefault();
    clearChat();
  }
});


let conversations = JSON.parse(localStorage.getItem("conversations")) || [
  [{ role: "system", content: "You are a helpful AI assistant whose name is Iris." }]
];


const requestChatCompletion = async (messages, temperature, model) => {
  if (!temperature) temperature = 1;
  if (!model) model = "gpt-3.5-turbo";
  console.log(messages);
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      localStorage.usage = data.usage;
      return {
        message: data.choices[0].message.content,
      };
    });
};

const displayConversation = () => { //TODO: this is sloppy b/c we're rewriting the whole page every time
  console.log('displaying conversation');
  const conversation = document.querySelector("#conversation");
  conversation.innerHTML = "";
  conversations[0].forEach(({ role, content }) => { //TODO: change hard-coded index #
    const message = document.createElement("p");
    message.classList.add('message');
    let sender = "System";
    if (role == "assistant") { message.classList.add("bot"); sender = "Iris" }
    else if (role == "user") { message.classList.add("user"); sender = "You" }
    else if (role == "system") { message.classList.add("system"); sender = "System" }
    const cleanerContent = marked.parse(content); //TODO: add more sanitization here
    message.innerHTML = `<b>${sender}:</b> ${cleanerContent}`;
    conversation.appendChild(message);
  });
  window.scrollTo(0, document.body.scrollHeight);
  hljs.highlightAll();
}

function addMessageToConversation(index, role, content) {
  const message = { role, content };
  if (index === "new") {
    conversations.push([message]);
  } else {
    conversations[0].push(message); //TODO: replace w/ 'index' (also replace null value in calls)
  }
  localStorage.setItem("conversations", JSON.stringify(conversations));
}


//sends message to API for chat completion
const sendMessage = () => {
  const messageInput = document.querySelector("#message");
  addMessageToConversation(null, "user", messageInput.value, "user"); //TODO: replace null w/ index
  displayConversation();
  messageInput.value = ""; //set the input to empty
  messageInput.focus(); //focus on the input box

  requestChatCompletion(conversations[0]).then((response) => {
    console.log(response);
    addMessageToConversation(null, "assistant", response.message, "assistant"); //TODO: replace null w/ index
    displayConversation();

  });
};

const clearChat = () => {
  localStorage.conversations = JSON.stringify([
    [{ role: "system", content: "You are a helpful AI assistant whose name is Iris." }]
  ]);
  conversations = JSON.parse(localStorage.getItem("conversations"))
  displayConversation();
}

function scrollToBottom() {
  const element = document.documentElement;
  const bottom = element.scrollHeight - element.clientHeight;
  element.scrollTop = bottom;
}

displayConversation();


const systemMessage = document.querySelector('.system > p');
systemMessage.addEventListener('click', () => {
  systemMessage.contentEditable = true;
  systemMessage.focus();
})
systemMessage.addEventListener('input', () => {
  conversations[0][0].content = systemMessage.innerHTML;
  localStorage.setItem("conversations", JSON.stringify(conversations));
})

