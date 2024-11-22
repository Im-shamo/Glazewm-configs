import { Monitor, WmClient, Workspace } from "glazewm";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const client = new WmClient();
const delay = 10;

const action = async () => {
    const { monitors } = await client.queryMonitors();
    const { workspaces } = await client.queryWorkspaces();
    const { focused } = await client.queryFocused();

    let cur_focused_workspace: Workspace | undefined;
    let cur_focused_monitor: Monitor | undefined;
    let adj_workspace: Workspace | undefined;
    let adj_monitor: Monitor | undefined;

    cur_focused_workspace = focused.type === "workspace" ? focused : workspaces.find(workspace => workspace.id === focused.parentId);
    cur_focused_monitor = monitors.find(monitor => monitor.id === cur_focused_workspace?.parentId);

    adj_monitor = cur_focused_monitor === undefined ? undefined : monitors.find(monitor => monitor != cur_focused_monitor);
    adj_workspace = workspaces.find(workspace => workspace.id === adj_monitor?.childFocusOrder[0]);

    if (cur_focused_monitor && cur_focused_workspace && adj_workspace && adj_monitor) {
        if (cur_focused_monitor.x >= 0) {
            client.runCommand("move-workspace --direction left");
            await sleep(delay).then(() => client.runCommand("focus --workspace " + adj_workspace.name));
            await sleep(delay).then(() => client.runCommand("move-workspace --direction right"));
        }
        else {
            client.runCommand("move-workspace --direction right");
            await sleep(delay).then(() => client.runCommand("focus --workspace " + adj_workspace.name));
            await sleep(delay).then(() => client.runCommand("move-workspace --direction left"));
        }
    }

}

client.onConnect(action);
setTimeout(() => {
    process.exit(0);
}, delay * 100);

