# kubectllog

Sometimes `kubectl logs <pod_name>` show logs in JSON format (e.g., when using the Winston library), which makes hard
for humans to read.

In addition, the logs in JSON format can also be showing unwanted information, e.g., cluster name, Datadog environment,
etc.

In order to make the log clearer and easier to read, this script reads the output from 'kubectl log', parses the JSONs
received and prints only the 'timestamp' and 'message' attributes to the console.

### Requirements

Make sure you have `kubectl` and `awk` installed in your machine. This software was tested on operational
system `Ubuntu 20.04.4 LTS`

### How to run

`yarn start`

### How to use it

When running the application, it will show you a list of kubernetes pods. Choose one using the up and down keyboard
keys, hit enter, and then the log will be shown.

### Choosing the properties that are printed in log

The current JSON properties being printed in the log are `message` and `timestamp`. If you want to change them, just
update the `src/index.ts/printJSONPropertiesInTheLog()` function.

### Improvements

- Check if the message being printed is a JSON. If so, format it accordingly before printing in the log
- Before showing the list of PODs on the screen, show a list of kubernetes clusters and allow the user choosing that. 