const savePlaintextButton = document.getElementById('save-plaintext')
const saveJsonButton = document.getElementById('save-json')
const allWindowsCheckbox = document.getElementById('save-all-windows')

/**
 * Since the proper way does not work (requestQuota always grants 0 bytes),
 * this copy-pasted workaround from http://stackoverflow.com/a/18197341/2452585
 * does the trick
 */
function download(content, type, ext) {
  const filename = `tablist.${ext}`
  var element = document.createElement('a');
  element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

/**
 * Makes sure the right tabs are selected based on the chosen settings
 */
function handleSaveClick (cb) {
  const query = {}
  if (!allWindowsCheckbox.checked) {
    query.windowId = chrome.windows.WINDOW_ID_CURRENT
  }
  chrome.tabs.query(query, cb)
}

savePlaintextButton.onclick = () => {
   handleSaveClick(tabs => {
    const text = tabs.reduce((text, currentTab) => {
      return `${text}\r\n${currentTab.url}`
    }, '')
    download(text, 'text/plain', 'txt')
  })
}

saveJsonButton.onclick = () => {
   handleSaveClick(tabs => {
    const json = tabs.reduce((json, currentTab) => {
      json[currentTab.title] = currentTab.url
      return json
    }, {})
    download(JSON.stringify(json), 'application/json', 'json')
  })
}
