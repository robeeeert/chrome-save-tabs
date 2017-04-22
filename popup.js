(function () {
  const savePlaintextButton = document.getElementById('save-plaintext')
  const saveJsonButton = document.getElementById('save-json')
  const saveAllWindowsCheckbox = document.getElementById('save-all-windows')
  const openInNewWindowCheckbox = document.getElementById('open-in-new-window')
  var filename

  /**
   * Download a file with given content, mime type and extension.
   * Since the proper way does not work (requestQuota always grants 0 bytes),
   * this copy-pasted workaround from http://stackoverflow.com/a/18197341/2452585
   * does the trick
   * @param content {String} The content of the file
   * @param type {String} The complete mime type of the file, e.g. 'text/plain' or 'application/json'
   * @param ext {String} The extension part of the file name
   */
  function download(content, type, ext) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', `${filename}.${ext}`);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /**
   * Open a new window with the specified content
   */
  function open (content) {
    const win = window.open()
    win.document.write(content)
  }

  function save (content, type, ext) {
    if (openInNewWindowCheckbox.checked) {
      open(content, type)
    } else {
      download(content, type, ext)
    }
  }

  /**
   * Makes sure the right tabs are selected based on the chosen settings
   */
  function handleSaveClick (cb) {
    const query = {}
    if (!saveAllWindowsCheckbox.checked) {
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
      save(text, 'text/plain', 'txt')
    })
  }

  saveJsonButton.onclick = () => {
    const json = {
      date: `${new Date()}`,
      comment: 'Created by Save Tabs'
    }
    handleSaveClick(tabs => {
      const jsonTabs = tabs.reduce((json, currentTab) => {
        let key = currentTab.title
        if (json[key]) {
          let i = 1
          do {
            key = `${currentTab.title} -- ${i}`
            i++
          } while (json[key])
        }
        json[key] = currentTab.url
        return json
      }, {})

      json.tabs = jsonTabs
      save(JSON.stringify(json), 'application/json', 'json')
    })
  }

  // Load options
  chrome.storage.sync.get(DEFAULT_OPTIONS, options => {
    filename = options.filename
    saveAllWindowsCheckbox.checked = options.saveAllWindows,
    openInNewWindowCheckbox.checked = options.openInNewWindow
  })
})()
