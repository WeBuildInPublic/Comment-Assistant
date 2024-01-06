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
		// The code you place here will be executed every time your command is executed

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
							// Open the text document
							vscode.workspace.openTextDocument(selectedPath).then((document) => {
								// Get the text content
								const textContent = document.getText();
								
								// Do something with the text content
								console.log('Text content:', textContent);
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

// This method is called when your extension is deactivated- just to clean everything up at the end
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
