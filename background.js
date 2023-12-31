async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['overlay.js']
    }).then(() => console.log("script injected"))
    .catch(() => console.log('Didnt work'))
  });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.action === "captureSection"){
        //capture the visible tab
        chrome.tabs.captureVisibleTab(null,{format:'png'}, function(dataUrl){
            //Convert the data URL to an image
            const image = new Image()
            image.onload = function(){
                //Create canvas to draw the image and extract the selected area
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                const selection = request.selection

                //Set canvas dimensions to the dimensions of the selection
                canvas.width = selection.width
                canvas.height = selection.height

                //Draw the image into canvas element cropping to the selected area
                context.drawImage(
                    image,
                    selection.x,
                    selection.y,
                    selection.width,
                    selection.height,
                    0,
                    0,
                    selection.width,
                    selection.height
                )

                //Get the cropped image data URL 
                const croppedImageUrl = canvas.toDataURL('image/png')
                sendResponse({ imageUrl: croppedImageUrl })
            }
            image.src = dataUrl
        })
        //return true to indicate that you wish to send a response asynchronously
        return true
    }
})