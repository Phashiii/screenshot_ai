chrome.runtime.onMessage.addListener((obj, sender, response) => {
    
    if(imageUrl in obj){
        const imageDisplay = document.createElement('div')
        imageDisplay.className='display-image'
        
        const inputHolder = document.createElement('div')

        const screenshot = document.createElement('img')
        screenshot.src = obj

        const form = document.createElement('form')
        form.setAttribute("method", "post")
        form.setAttribute("action", "submit")

        const message = document.createElement('input')
        message.setAttribute("type", "text")
        message.setAttribute("name", "message")
        message.setAttribute("placeholder", "what would you like to know about the screenshot :)")

        var sendButton = document.createElement("button");
        sendButton.setAttribute("type", "submit");
        sendButton.setAttribute("value", "send");

        form.appendChild(message)
        form.appendChild(sendButton)
        inputHolder.appendChild(form)
        
        document.body.appendChild(imageDisplay)
        document.body.appendChild(inputHolder)
    }
})

console.log('Works')