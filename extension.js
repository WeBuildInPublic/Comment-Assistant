// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-assistant" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('comment-assistant.commentCode', function () {

		// check if we have an active workspace
		if (vscode.workspace.workspaceFolders) {
			// Get all open text documents in the workspace
			const openDocuments = vscode.workspace.textDocuments;
						
			if (openDocuments.length > 0) {
				// Extract file paths from the open documents
				const filePaths = openDocuments.map((document) => document.uri.fsPath);
		
				// Show a quick pick dropdown with file paths
				vscode.window.showQuickPick(filePaths, {
					placeHolder: 'Select a file to open'
				}).then((selectedPath) => {
					if (selectedPath) {
						vscode.workspace.openTextDocument(selectedPath).then((document) => {
							const textContent = document.getText();
							getComments(textContent);
						}).catch((error) => {
							console.error('Error opening the document:', error);
						});
					}
				});
			} else {
				vscode.window.showInformationMessage('No open documents in the workspace.');
			}

		} else {
			// No active workspace
			vscode.window.showErrorMessage('No workspace opened.');
		}
	});
	context.subscriptions.push(disposable);
}

function enterText(text) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
		vscode.commands.executeCommand('editor.action.selectAll');
		vscode.commands.executeCommand('editor.action.clipboardCutAction');
		editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), text);
        });
    }
}

function getComments(inputCode) {
	const fs = require('fs');
	const filePath = __dirname + '\\results.txt';
	
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
					enterText(data.toString());
					vscode.window.showInformationMessage('Comments complete!');
				}
			});
		}
	});
}

// This method is called when your extension is deactivated- just to clean everything up at the end
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
