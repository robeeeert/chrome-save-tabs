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
  const element = document.createElement('a');
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
  const header = `Tab list created by Save Tabs on ${new Date()}\r\n`
  handleSaveClick(tabs => {
    const text = tabs.reduce((text, currentTab) => {
      return `${text}\r\n${currentTab.url}`
    }, header || '')
    download(text, 'text/plain', 'txt')
  })
}

saveJsonButton.onclick = () => {
  const json = {
    date: `${new Date()}`,
    comment: 'Created by Save Tabs'
  }
  handleSaveClick(tabs => {
    const jsonTabs = tabs.reduce((json, currentTab) => {
      json[currentTab.title] = currentTab.url
      return json
    }, {})

    json.tabs = jsonTabs
    download(JSON.stringify(json), 'application/json', 'json')
  })
}
