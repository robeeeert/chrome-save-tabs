const savePlaintextButton = document.getElementById('save-plaintext')
const saveJsonButton = document.getElementById('save-json')
const allWindowsCheckbox = document.getElementById('save-all-windows')

// /**
//  * Copy-pasted from https://www.html5rocks.com/en/tutorials/file/filesystem/
//  */
// function errorHandler(e) {
//   var msg = '';
//
//   switch (e.code) {
//     case FileError.QUOTA_EXCEEDED_ERR:
//       msg = 'QUOTA_EXCEEDED_ERR';
//       break;
//     case FileError.NOT_FOUND_ERR:
//       msg = 'NOT_FOUND_ERR';
//       break;
//     case FileError.SECURITY_ERR:
//       msg = 'SECURITY_ERR';
//       break;
//     case FileError.INVALID_MODIFICATION_ERR:
//       msg = 'INVALID_MODIFICATION_ERR';
//       break;
//     case FileError.INVALID_STATE_ERR:
//       msg = 'INVALID_STATE_ERR';
//       break;
//     default:
//       msg = e;
//       break;
//   };
//
//   console.log('Error: ', msg);
// }
//
// /**
//  * This is fucking insane! Kudos go out to Eric Bidelmann for his excellent post:
//  * https://www.html5rocks.com/en/tutorials/file/filesystem/
//  *
//  */
// function saveFile (content) {
//   console.log('content', content.length)
//   // Only do this if there's actual data
//   if (content.length > 0) {
//     // Request some space to store our file to
//     navigator.webkitPersistentStorage.requestQuota(1024 * 1024, grantedBytes => {
//       console.log('granted bytes', grantedBytes)
//       // Only proceed if enough space has been granted
//       if (grantedBytes == content.length) {
//         // Obtain a reference to the file system
//         window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
//         window.requestFileSystem(window.PERSISTENT, content.length, fs => {
//           console.log('fs available');
//           // Create a new file (set exclusive to true if file name is unique)
//           fs.root.getFile('tmp', { create: true, exclusive: false }, fileEntry => {
//             const url = fileEntry.toUrl()
//             console.log('created file', url);
//             // Write contents to the file
//             fileEntry.createWriter(fileWriter => {
//               console.log('created filewriter');
//               // Show a save-as dialogue after the file's been written
//               fileWriter.onwriteend = () => {
//                 console.log('write finished, prompting download');
//                 chrome.downloads.download({
//                   url,
//                   saveAs: true
//                 })
//               }
//               const blob = new Blob([content], { type: 'text/plain' })
//               fileWriter.write(blob)
//             }, errorHandler) // file writer cb
//           }, errorHandler) // create file cb
//         }, errorHandler) // request fs cb
//       } // grantedBytes size check
//     }, errorHandler) // request quota cb
//   } // content length check
// }

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
