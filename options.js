(function () {
  const saveButton = document.getElementById('savebutton')
  const filenameInput = document.getElementById('filename')
  const saveAllWindowsCheckbox = document.getElementById('save-all-windows')
  const openInNewWindowCheckbox = document.getElementById('open-in-new-window')
  const infoOptionsSaved = document.getElementById('infooptionssaved')

  function save () {
    const options = {
      filename: filenameInput.value,
      saveAllWindows: saveAllWindowsCheckbox.checked,
      openInNewWindow: openInNewWindowCheckbox.checked
    }

    chrome.storage.sync.set(options, () => {
      infoOptionsSaved.style.display = 'block'
    })
  }

  function restore () {
    chrome.storage.sync.get(DEFAULT_OPTIONS, options => {
      filenameInput.value = options.filename
      saveAllWindowsCheckbox.checked = options.saveAllWindows,
      openInNewWindowCheckbox.checked = options.openInNewWindow
    })
  }

  saveButton.onclick = save
  restore()
})()
