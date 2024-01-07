// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-assistant" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('comment-assistant.commentCode', function () {	
		const fs = require('fs');
		const filePath = __dirname + '\\results.txt';
		
		inputCode = "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr";

		// create file for python script to write output to
		fs.writeFile(filePath, "", (err) => {
			if (err) {
				console.error('Error writing to file:', err);
				return;
			}
			console.log('Text file created successfully.');
		});

		// invoke python script
		const terminal = vscode.window.createTerminal('Python Terminal');
		terminal.sendText(`python3 ${__dirname}\\main.py \"${inputCode.replaceAll("\n", "\\n")}\" > ${filePath}`);

		// process text made by the python file
		const watcher = fs.watch(filePath, (eventType, filename) => {
			if (eventType === 'change') {
			    console.log(`${filename} has been modified.`);
			    fs.readFile(filePath, 'utf8', (err, data) => {
					if (err) {
						console.error('Error reading file:', err);
						return;
					}
					if (data.length !== 0) {
						console.log('File content:', data);
						vscode.window.showInformationMessage('Comments complete!');
					}
				});
			}
		});
	});

	context.subscriptions.push(disposable);
}


// This method is called when your extension is deactivated
function deactivate() {}


module.exports = {
	activate,
	deactivate
}
