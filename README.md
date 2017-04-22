# Save Tabs

Save Tabs is a chrome extension that allows saving all opened tabs to json or plain text.

## Features

... or why yet another tab list extension?

- It requires minimal permissions
- It does not communicate with a server
- It works completely offline
- You can decide on the format of the files (plain text or JSON)
- You can choose between saving the list to a file or simply opening it in the specified format in a new tab

So, as you see it has a pretty strong focus on privacy. I think this is enough arguments.

## Installation

Download the zipped version of this repo and unzip it, or clone it to your local machine.
Then, follow these instructions: https://developer.chrome.com/extensions/getstarted#unpacked (It's only a few simple steps)

## Usage

After installing ithe extension, it will show an icon in the Chrome icon bar. If you click it, it opens a little window in which you can choose to save the tabs as plain text or JSON. You can also temporarily change a few options on the bottom of that window. Those changes are not persistent and are reset as soon as the window closes.

### Saving as plain text

Saving to plain text simply puts the URLs of all opened tabs underneath each other, separated by `\r\n` to satisfy all major operating systems. The file's first two lines contain meta information, which is currently that the list has been made with this extension and the date of the creation.

### Saving as JSON

The resulting JSON structure is the following:

```json
"date": "Date string",
"comment": "Created by Save Tabs",
"tabs": {
  "<TAB_TITLE>": "<TAB_URL>"
}
```
The `tabs` root entry maps to an object containing all saved tabs:
`<TAB_TITLE>` is replaced with the actual tab's title or, in the case of duplicate titles, it is appended with two dashes and an increasing integer.
`<TAB_URL>` is the URL of the tab.

### Options

If you right-cick the icon you can choose `Options...` to get to the options page.
You can change all values to your needs and when you hit the `Save` button on the bottom, these changes will be persisted and reflected the next time you use the extension by left-clicking on the icon.

## Now what?

Please share your suggestions or bugs. And if you have an eye for design, feel free.... :) I'd really appreciate it!
