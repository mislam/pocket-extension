const elCount = document.getElementById('count')
const elButton = document.getElementById('button')

chrome.storage.sync.get('count', ({ count }) => {
   elCount.innerText = count
})

function handleButtonClick() {
   let count = parseInt(elCount.innerText)
   count++
   elCount.innerText = count
   chrome.storage.sync.set({ count })
   console.log(`Count is now: ${count}`)
}

elButton.addEventListener('click', handleButtonClick)
