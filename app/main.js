const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const windows = new Set();

const createWindow = () => {
  let newWindow = new BrowserWindow({ show: false });

  newWindow.loadFile('index.html');

  newWindow.once('read-to-show', () => {
    newWindow.show();
  });

  newWindow.on('closed', () => {
    window.delete(newWindow);
    newWindow = null;
  });

  windows.add(newWindow);
  return newWindow;
};


app.on('ready', () => {
  createWindow();
});

const openFile = (targetWindow, file) => {
  const content = fs.readFileSync(file).toString();
  targetWindow.webContents.send('file-opened', file, content);
};

const getFileFromUser = (targetWindow) => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt'] },
      { name: 'Markdown Files', extensions: ['md', 'markdown'] }
    ]

  });

  if (files) { openFile(files[0]); }
};


exports.createWindow = createWindow;
exports.getFileFromUser = getFileFromUser;
