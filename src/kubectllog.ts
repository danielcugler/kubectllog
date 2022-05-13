/***
 * Author: Daniel Cugler
 * When using the Winston logger library to print logs it can be hard to read it since it adds converts the log to JSON format and also adds lots of extra information to that.
 * In order to make the log clearer and easier to read, this script reads the output from 'kubectl log', parses the JSONs received and prints only the 'timestamp' and 'message' attributes to the console.
 * Syntax: ts-node kubectllog.ts <POD_NAME>
 */

import { spawn } from "child_process";

const kubectlLogProcess = spawn("kubectl", ["logs", process.argv[2], "-f"]);

kubectlLogProcess.stdout.setEncoding("utf8");

kubectlLogProcess.stdout.on("data", (data) => {
  let dataAux = "";

  for (let i = 0; i < data.length; i++) {
    dataAux += data.charAt(i);

    if (data.charAt(i) == "\n") {
      try {
        const obj = JSON.parse(dataAux);

        console.log(`${obj.timestamp} ${obj.message}`);
      } catch (e) {}

      dataAux = "";
    }
  }
});
