# kubectllog

Sometimes `kubectl logs <pod_name>` show logs in JSON format (e.g., when using the Winston library), which makes hard
for humans to read.

In addition, the logs in JSON format can also be showing unwanted information, e.g., cluster name, Datadog environment,
etc.

In order to make the log clearer and easier to read, this script reads the output from 'kubectl log', parses the JSONs
received and prints only the 'timestamp' and 'message' attributes to the console.

How to run:
`yarn start`