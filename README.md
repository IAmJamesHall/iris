# Iris 
## ChatGPT-Based Chat Bot
About:
Iris is a quick project I made as an interface to ChatGPT Turbo, without the excessive cost of a Plus subscription. This is a very quick-and-dirty project, only intended for personal use. However, it is very easy to set up, so I thought I would share it if others wanted to use it.

NOTE: To use Iris, you will need an API auth key from OpenAI

Quickstart
1. Clone this repo: `clone https://github.com/IAmJamesHall/iris.git`
2. In `scripts.js` on line 27, add your auth key from OpenAI (Leave 'Bearer' at the beginning of the string)
    Line 27 should look something like this:
    `"Bearer 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",`
3. Load `index.html` in your browser and start chatting with ChatGPT!

TODO:
- use cookies to remember:
    - total cost
    - other conversations
- get code rendering to work right (at least stop it from deleting whitespace)