
const styleElement = document.createElement('style')
styleElement.rel = 'stylesheet';
styleElement.href = chrome.runtime.getURL('overlay.css')
document.head || document.documentElement.appendChild(styleElement)

const createOverlay = () => {
    const overlay = document.createElement('div')
    overlay.className = 'screenShot-overlay'
    document.body.appendChild(overlay)

    //Attach the event listners to handle drawing the selection rectangle
    overlay.addEventListener('mousedown', startSelection)
    console.log('Create overlay')
}

function startSelection(event){
    //Record the start position of the mouse
    startX = event.pageX
    startY = event.pageY
    //create selection div
    const selectionDiv = document.createElement('div')
    selectionDiv.className = 'selection-box'
    selectionDiv.style.left = `${startX}px`
    selectionDiv.style.top = `${startY}px`
    overlay.appendChild(selectionDiv)

    //Attach event listners to handle the selection drawing
    overlay.addEventListener('mousemove', resizeSelection)
    overlay.addEventListener('mouseup', endSelection)

    function resizeSelection(event){
        //Calculate the width and height of the selection box
        const width = Math.abs(event.pageX - startX)
        const height = Math.abs(event.pageY - startY)

        //Update the dimensions and position of the selection box
        selectionDiv.style.width = `${width}px`
        selectionDiv.style.height = `${height}px`
        selectionDiv.style.left = `${event.pageX < startX ? event.pageX : startX}px`
        selectionDiv.style.top = `${event.pageY < startY ? event.pageY : startY}px`
    }

    function endSelection(event){
        //Remove the event listners as the selection is complete
        overlay.removeEventListner('musemove', resizeSelection)
        overlay.removeEventListner('mouseup', endSelection)

        //Calculation final dimensions of the selection
        const rect = selectionDiv.getBoundingClientRect()
        const captureDetails = {
            x: rect.left,
            y: rect.top,
            width:rect.width,
            height: rect.height
        }
        sendSelectionForCapture(captureDetails)

        //Cleanup remove the selection div and overlay div
        selectionDiv.remove()
        overlay.remove()
    }
}

function sendSelectionForCapture(selection) {
    //Message the background script to take a screenshot of the specified area
    chrome.runtime.sendMessage({action: "captureSection", selection: selection},
    function(response){
        if(response && response.imageUrl){
            //Handle the image URL (e.g show a preview, ask a question)
            console.log('Section captured', response.imageUrl)
        }
    })
}

createOverlay()

