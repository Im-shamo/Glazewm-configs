import { WmClient, WmEventType, WmEventData } from "glazewm"
import { exit } from "./helper_functions"

const client = new WmClient();
client.onConnect(action);
exit(10000);

async function action() {
	const { workspaces } = await client.queryWorkspaces();
	const { monitors } = await client.queryMonitors();
	const { windows } = await client.queryWindows();

	console.log("------------ Monitors ------------");
	monitors.forEach(print_item);

	console.log("\n------------ Workspaces ------------");
	workspaces.forEach(print_item);

	console.log("\n------------ Windows ------------");
	windows.forEach(print_item);


	const unlisten = await client.subscribe(
		WmEventType.FOCUS_CHANGED,
		subscribeAction
	);

	
}

function print_item(item: any, index: number) {
	console.log(item);
	console.log("");
}

function subscribeAction(event: WmEventData) {
	console.log(`------------ ${event.eventType} ------------`);
	console.log(event);
	console.log("");
}


