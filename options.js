(function () {
  const saveButton = document.getElementById('savebutton')
  const saveAllWindowsCheckbox = document.getElementById('save-all-windows')
  const infoOptionsSaved = document.getElementById('infooptionssaved')

  function save () {
    const options = {
      saveAllWindows: saveAllWindowsCheckbox.checked
    }

    chrome.storage.sync.set(options, () => {
      infoOptionsSaved.style.display = 'block'
    })
  }

  function restore () {
    const defaultOptions = {
      saveAllWindows: false
    }
    chrome.storage.sync.get(defaultOptions, options => {
      saveAllWindowsCheckbox.checked = options.saveAllWindows
    })
  }

  saveButton.onclick = save
  restore()
})()
