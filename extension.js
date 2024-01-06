// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "comment-assistant" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('comment-assistant.commentCode', async function () {
		// The code you place here will be executed every time your command is executed

		// set code to be commented
		// inputCode = "";
		// inputCode = "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr";

		// create python program
		// const spawn = require("child_process").spawn;
		// const { spawnSync } = require('child_process');
		// const pythonProcess = spawnSync('python', ["main.py", inputCode]);
		// if (pythonProcess.error) {
		// 	console.error(`Error executing Python script: ${pythonProcess.error}`);
		// } else {
		// 	console.log(`Python script output: ${pythonProcess.stdout.toString()}`);
		// }
		// const { PythonShell } = require('python-shell');

		// let options = {
		// 	mode: 'text',
		// 	pythonPath: 'python',
		// 	args: [inputCode],
		// };

		// PythonShell.run(__dirname + '\\main.py', options, (err, result) => {
		// 	console.log("HERE");
		// 	if (err) {
		// 		console.error('Error executing Python script:', err);
		// 	} else {
		// 		console.log('Python script output:', result);
		// 	}
		// });

		// console.log("HERE 1");
		// text = await runPythonScript([inputCode]);
		// console.log("HERE 2");
		// console.log(text);

		// const { PythonShell } = require('python-shell');
		// let options = {
		// 	mode: 'text',
		// 	pythonPath: 'python',
		// 	args: ["testing"],
		// };

		// async function runPythonScript() {
		// 	const { success, err = '', results } = await new Promise((resolve, reject) => {
		// 			PythonShell.run(__dirname + '\\main.py', options, function (err, results) {
		// 					if (err) {
		// 						reject({ success: false, err });
		// 					}
		// 					console.log('PythonShell results: %j', results);
		// 					resolve({ success: true, results });
		// 				}
		// 			);
		// 		}
		// 	);

		// 	console.log("python call ends");
		// 	if (! success) {
		// 		console.log("Test Error: " + err);
		// 		return;
		// 	}
		// 	console.log("The result is: " + results);
		// 	console.log("end runTest()");
		// }
		// console.log('start ...');
		// await runPythonScript();
		// console.log('... end main');

		// pythonProcess.stdout.on('data', (data) => {
		// 	console.log("HERE X");
		// 	vscode.window.showInformationMessage(data.toString());
		// 	console.log(data.toString());
		// });

		// console.log("HERE Y");
		// Display a message box to the user
		// temperature-listener.js

		// const { spawn } = require('child_process');
		// const temperatures = []; // Store readings

		// const sensor = spawn('python', ['sensor.py']);
		// console.log("after");
		// sensor.stdout.on('data', function(data) {
		// 	// convert Buffer object to Float
		// 	temperatures.push(parseFloat(data));
		// 	console.log(temperatures);
		// });

		const fs = require('fs');
		// Function to run a Python script in the VSCode terminal and capture output
		function runPythonScriptInTerminal() {
		const outputFilePath = __dirname + '\\results.txt'; // Path to a temporary output file

		// Create an empty output file (if it doesn't exist)
		fs.closeSync(fs.openSync(outputFilePath, 'w'));

		return new Promise((resolve, reject) => {
			// Create a terminal
			const terminal = vscode.window.createTerminal('Python Terminal');

			// Run the Python script and redirect output to a temporary file
			terminal.sendText(`python3 ${__dirname + '\\main.py'} > ${outputFilePath}`);
			terminal.show(); // Show the terminal panel

			// while (true) {
			// 	fs.readFile(outputFilePath, 'utf8', (readErr, data) => {
			// 		if (readErr) {
			// 			console.log("FAILURE");
			// 			reject(readErr);
			// 			break;
			// 		} else {
			// 			console.log("SUCCESS");
			// 			resolve(data);
			// 		}
			// 	});
			// }

			// Wait for the file to be created or modified
			const watcher = fs.watch(outputFilePath, { encoding: 'utf8' }, (eventType) => {
					if (eventType === 'change') {
						// Check if the file exists and read its content
						fs.access(outputFilePath, fs.constants.F_OK, (err) => {
							if (!err) {
								fs.readFile(outputFilePath, 'utf8', (readErr, data) => {
									if (readErr) {
										reject(readErr);
										return;
									}
									resolve(data);
									watcher.close(); // Close the watcher once the output is captured
								});
							} else {
								reject(err);
							}
						});
					}
				});
			});
		}

		// Usage of the function
		runPythonScriptInTerminal()
		.then((outputData) => {
			// Process the output data here
			console.log('Output received:', outputData);
			// Continue with further actions using the outputData
		})
		.catch((error) => {
			console.error('Error:', error);
			// Handle errors here
		});

		vscode.window.showInformationMessage('Comments complete!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}


// function runPythonScript(args) {
//     const { PythonShell } = require('python-shell');

//     let options = {
//         mode: 'text',
//         pythonPath: 'python',
//         args: args,
//     };

//     return new Promise((resolve, reject) => {
//         PythonShell.run(__dirname + '\\main.py', options, (err, result) => {
//             if (err) {
//                 console.error('Error executing Python script:', err);
//                 reject(err); // Reject the promise on error
//             } else {
//                 console.log('Python script output:', result);
//                 resolve(result); // Resolve the promise with the result
//             }
//         });
//     });
// }


module.exports = {
	activate,
	deactivate
}
