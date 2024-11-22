import { WmClient } from "glazewm";

const client = new WmClient();

const action = async () => {
    const { monitors } = await client.queryMonitors();
    const { workspaces } = await client.queryWorkspaces();
    const { focused } = await client.queryFocused();

    console.log("Monitors");
    console.log(monitors);

    console.log("\nWorkspaces");
    console.log(workspaces);
    
    console.log("\nfocused");
    console.log(focused);
}

client.onConnect(action);

