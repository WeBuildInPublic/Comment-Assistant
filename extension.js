// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Comment Assistant has been activated!');

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

	inputCode = inputCode.replaceAll("\n", "\\n");
	inputCode = inputCode.replaceAll("\"", "\\\'");
	inputCode = inputCode.replaceAll("\'", "\\\'");
	inputCode = inputCode.replaceAll("\\", "\\\\");
	inputCode = inputCode.replaceAll("\t", "\\t");

	// invoke python script
	const terminal = vscode.window.createTerminal('Python Terminal');
	terminal.sendText(`python3 ${__dirname}\\main.py \"${__dirname}\" \"${inputCode}\" > ${filePath}`);

	// process text made by the python file
	const watcher = fs.watch(filePath, (eventType) => {
		if (eventType === 'change') {
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					console.error('Error reading file:', err);
					return;
				}
				if (data.length !== 0) {
					const rawText = data.toString();
					let cleanedText = '';
					for (let i = 2; i < rawText.length; i += 2) {
						cleanedText += rawText.charAt(i);
					}
					enterText(cleanedText);
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
