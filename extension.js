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
							vscode.workspace.openTextDocument(selectedPath).then((document) => {
								const textContent = document.getText();
								
								// TODO: replace the log statement with the functionality that sends the text data to the OpenAI API so that comments are generated
								enterText();
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

// function addComment(f) {
// 	// var path = require('path');

// 	// var content = rec[rt.fields[field]];
// 	// var filePath = path.join(wf, selected.label + '.' + field);
// 	// fs.writeFileSync(filePath, content, 'utf8');

// 	var openPath = vscode.Uri.file(f + "/coin_toss0.py"); //A request file path
// 	vscode.workspace.openTextDocument(openPath).then(doc => {
// 	vscode.window.showTextDocument(doc);
// 	});
// }

function enterText() {
	let text = "hello";
    const editor = vscode.window.activeTextEditor;
    if (editor) {
		vscode.commands.executeCommand('editor.action.selectAll');
		vscode.commands.executeCommand('editor.action.clipboardCutAction');
		editor.edit(editBuilder => {
            editBuilder.insert(new vscode.Position(0, 0), text);
        });
    }
}

// This method is called when your extension is deactivated- just to clean everything up at the end
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
