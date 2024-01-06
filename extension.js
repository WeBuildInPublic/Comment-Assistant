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

		// Display a message box to the user
		vscode.window.showInformationMessage('Comments complete!');
	});

	// vscode.workspace.openTextDocument(uri).then((document) => {
	// 	let text = document.getText();
	//   });

	if(vscode.workspace.workspaceFolders !== undefined) {
		let wf = vscode.workspace.workspaceFolders[0].uri.path ;
		let f = vscode.workspace.workspaceFolders[0].uri.fsPath ; 
	
		message = `YOUR-EXTENSION: folder: ${wf} - ${f}` ;
	
		vscode.window.showInformationMessage(message);
		// addComment(wf);
	} 
	else {
		message = "YOUR-EXTENSION: Working folder not found, open a folder an try again" ;
	
		vscode.window.showErrorMessage(message);
	}



	context.subscriptions.push(disposable);
}

function addComment(wf) {

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
