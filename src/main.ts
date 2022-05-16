import {spawn} from "child_process";

var inquirer = require('inquirer');

export class Main {

	async start() {
		const podsNames = await this.getKubernetesPodsNames()
		const selectedPodName = await this.selectItemNameFromOptionsList(podsNames)
		this.runKubectlLog(selectedPodName)
	}

	async getKubernetesPodsNames(): Promise<string[]> {
		let kubernetesPodsNames: string[];
		let awkOutput: string = ""

		const kubectlGetPodsProcess = spawn("kubectl", ["get", "pods"])
		const awkProcess = spawn('awk', ['{print $1}'], {stdio: [kubectlGetPodsProcess.stdout, 'pipe', 'pipe']})

		return new Promise((resolve, reject) => {
			awkProcess.stdout.on('data', (data) => {
				awkOutput += data
			})

			awkProcess.stdout.on("close", async () => {

				kubernetesPodsNames = awkOutput.split('\n')
				kubernetesPodsNames.shift()

				//Removing empty strings
				kubernetesPodsNames = kubernetesPodsNames.filter((element) => {
					return element.length > 0
				})

				resolve(kubernetesPodsNames);
			})
		})

	}

	/***
	 * Shows a menu with a list of string options and asks the user to choose one.
	 * @param options A string array with the names that will be shown in the options list
	 * @return The string the user chooses from the options list
	 */
	async selectItemNameFromOptionsList(options: string[]): Promise<string> {

		return new Promise((resolve, reject) => {
			inquirer.prompt([
				{
					type: "list",
					name: "podName",
					message: "Select one item in the list. Select 'Exit' to quit.",
					choices: [...options, "Exit"],
				},
			]).then((answers: any) => {
				if (answers.Options == "Exit") {
					process.exit();
				}
				resolve(answers.podName)
			});
		})
	}

	/***
	 * Calls the 'kubectl log <POD_NAME> -f' command, where <POD_NAME> is te argument received in the function
	 * @param podName
	 */
	runKubectlLog(podName: string) {
		const kubectlLogProcess = spawn("kubectl", ["logs", podName, "-f"]);

		kubectlLogProcess.stdout.setEncoding("utf8");

		//Keeps infinitely receiving the kubectl log stream. Whenever found a carriage return symbol, then parse the string, convert to JSON and print the required properties
		kubectlLogProcess.stdout.on("data", (data) => {
			let paragraph = "";

			for (let i = 0; i < data.length; i++) {
				paragraph += data.charAt(i);

				if (data.charAt(i) == "\n") {
					try {
						const jsonLogParagraphAsObject = JSON.parse(paragraph);

						this.printJSONPropertiesInTheLog(jsonLogParagraphAsObject)
					} catch (e) {
					}

					paragraph = "";
				}
			}
		});
	}

	printJSONPropertiesInTheLog(jsonLogParagraphAsObject: any) {
		console.log(`${jsonLogParagraphAsObject.timestamp} ${jsonLogParagraphAsObject.message}`);
	}
}