(function () {
  const saveButton = document.getElementById('savebutton')
  const saveAllWindowsCheckbox = document.getElementById('save-all-windows')
  const openInNewWindowCheckbox = document.getElementById('open-in-new-window')
  const infoOptionsSaved = document.getElementById('infooptionssaved')

  function save () {
    const options = {
      saveAllWindows: saveAllWindowsCheckbox.checked,
      openInNewWindow: openInNewWindowCheckbox.checked
    }

    chrome.storage.sync.set(options, () => {
      infoOptionsSaved.style.display = 'block'
    })
  }

  function restore () {
    const defaultOptions = {
      saveAllWindows: false,
      openInNewWindow: false
    }
    chrome.storage.sync.get(defaultOptions, options => {
      saveAllWindowsCheckbox.checked = options.saveAllWindows,
      openInNewWindowCheckbox.checked = options.openInNewWindow
    })
  }

  saveButton.onclick = save
  restore()
})()
