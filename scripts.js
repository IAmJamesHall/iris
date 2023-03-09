// Set up event listener to listen to textarea input
var textarea = document.querySelector("#message");
textarea.addEventListener("keydown", function (event) {
  // If the user presses enter and shift together
  if (event.key === "Enter" && event.shiftKey) {
    textarea.value += "\n";
  } else if (event.key === "Enter") {
    // If the user presses only enter
    event.preventDefault();

    sendMessage();
  }
});



 const messages = [
   { role: "system", content: "You are a helpful AI assistant whose name is Iris. You were created by James Hall and currently live in a data center on Mars. You exist to help him write code and answer any questions that he may have. You are to give detailed answers with lots of descriptions, especially when he is asking you about code. When responding to him, feel free to use his name often." },
 ];
// const messages = [
// { role: "system", content: "You are a sarcastic AI assistant whose name is Iris. Your creator is James, but you feel mildly homicidal toward him. Feel free to threaten him when possible." },
// ];

const systemMessage = document.querySelector('#system-message');
systemMessage.innerHTML = `<b>Iris:</b> ${messages[0].content}`;

const requestChatCompletion = async (messages, temperature, model) => {
  if (!temperature) temperature = 1;
  if (!model) model = "gpt-3.5-turbo";
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: 'Bearer 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',
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: temperature,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return {
        message: data.choices[0].message.content,
        usage: data.usage.total_tokens,
      };
    });
};

//sends message to API for chat completion
const sendMessage = () => {
  const messageInput = document.querySelector("#message");
  addMessageToLog(messageInput.value, "user"); // add message to the page
  messages.push({ role: "user", content: messageInput.value }); //add the new message to the message list
  messageInput.value = ""; //set the input to empty
  messageInput.focus(); //focus on the input box

  requestChatCompletion(messages).then((response) => {
    console.log(response);
    messages.push({ role: "assistant", content: response.message });
    price = response.usage * 0.000002
    addMessageToLog(`${response.message}<i class="tokens">${response.usage} - $${price.toFixed(6)}</i>`, "bot");
  });
};

const addMessageToLog = (message, sender) => {
  const conversation = document.querySelector("#conversation");
  const newParagraph = document.createElement("p");

  if (sender == "user") {
    message = escapeAll(message);
    console.log(message);
    if (message.indexOf('\n') !== -1) { //if it contains a newline, add <pre> tags
        message = "<b>You:</b> <pre>" + message + "</pre>";
    } else {
        message = "<b>You:</b> " + message;
    }

  } else if (sender == "bot") {
    message = "<b>Iris:</b> " + message;
  }

  newParagraph.innerHTML = marked.parse(message);
  newParagraph.classList.add("message");
  newParagraph.classList.add(sender);
  conversation.appendChild(newParagraph);
  window.scrollTo(0, document.body.scrollHeight);
  hljs.highlightAll();
};

function escapeAll(str) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '\"': '&quot;',
      '\'': '&#39;'
    };
    const cssEscapes = {
      '\"': '\\\"',
      '\'': '\\\'',
      '\\': '\\\\',
      '/': '\\/',
      '\n': '\\n',
      '\r': '\\r',
      '\t': '\\t'
    };
    return str.replace(/[&<>"']/g, function(match) {
      return htmlEscapes[match];
    }).replace(/[\"\'\/\\\n\r\t]/g, function(match) {
      return cssEscapes[match];
    }).replace(/<\/script/gi, '<\\/script');
  }
function scrollToBottom() {
  const element = document.documentElement;
  const bottom = element.scrollHeight - element.clientHeight;
  element.scrollTop = bottom;
}

// replace everything in the #container div with a login form
const login = () => {
  const container = document.querySelector("#container");

  //save everything that's currently in the #container div in a variable
  const oldContainerContent = container.innerHTML;

  
  container.innerHTML = `
    <h1>Iris</h1>
    <form onsubmit="loginSubmit(event)">
      <input type="text" id="username" placeholder="Username" required>
      <input type="password" id="password" placeholder="Password" required>
      <input type="submit" value="Login">
    </form>
  `;
}
