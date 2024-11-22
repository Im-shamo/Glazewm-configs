import { Monitor, WmClient, Workspace, SplitContainer, Window, ContainerType } from "glazewm";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const MAX_FOCUS_ATTEMPT = 20;
const client = new WmClient();
const delay = 10;
const workspace_name: string = process.argv[2];

async function action() {
    let { monitors } = await client.queryMonitors();
    let { workspaces } = await client.queryWorkspaces();
    let { focused } = await client.queryFocused();
    // Keep a reference to focused id, so that we can re-focus after we move them around
    const initialFocusedId = focused.id;

    // Get Current foucsed workspace
    let cur_focused_workspace = (focused.type === "workspace") ? focused : workspaces.find(workspace => workspace.id === focused.parentId);

    if (!cur_focused_workspace) {
        return;
    }

    // Find the current foucsed monitor
    let cur_focused_monitor = monitors.find(monitor => monitor.id === cur_focused_workspace.parentId);

    // Find the workspace with workspace_name
    let to_be_focused_workspace = workspaces.find(workspace => workspace.name === workspace_name);
    // Find the monitor that that workspace is on
    let to_be_focused_workspace_monitor = monitors.find(monitor => monitor.id === to_be_focused_workspace?.parentId);

    console.log(cur_focused_workspace);
    console.log(cur_focused_monitor);
    console.log(to_be_focused_workspace);
    console.log(to_be_focused_workspace_monitor);

    if (cur_focused_monitor && to_be_focused_workspace_monitor === undefined) {
        to_be_focused_workspace_monitor = cur_focused_monitor;
    }

    if ((to_be_focused_workspace === undefined || to_be_focused_workspace_monitor === cur_focused_monitor) && workspace_name) {
        client.runCommand("focus --workspace " + workspace_name);
    }
    else if (cur_focused_monitor && to_be_focused_workspace_monitor && to_be_focused_workspace && workspace_name) {
        if (cur_focused_monitor.x >= 0) {
            if (to_be_focused_workspace.id === to_be_focused_workspace_monitor.childFocusOrder[0]) {
                client.runCommand("move-workspace --direction left");
            }
            await sleep(delay).then(() => client.runCommand("focus --workspace " + workspace_name));
            await sleep(delay).then(() => client.runCommand("move-workspace --direction right"));
        }
        else {
            if (to_be_focused_workspace.id === to_be_focused_workspace_monitor.childFocusOrder[0]) {
                client.runCommand("move-workspace --direction right");
            }
            await sleep(delay).then(() => client.runCommand("focus --workspace " + workspace_name));
            await sleep(delay).then(() => client.runCommand("move-workspace --direction left"));
        }
    }
    
    // ({ focused } = await client.queryFocused());.
    const resQueryWorkspaces = await client.queryWorkspaces();
    workspaces = resQueryWorkspaces.workspaces;

    await sleep(100);
    const w = workspaces.find(workspace => workspace.id === cur_focused_workspace.id)!;
    await attemptFocusWindow(initialFocusedId, w);
    // if (focused.type === "window" && w) {
    //     await attemptFocusWindow(focused.id, w);
    // }
    await sleep(100).then(() => client.runCommand("focus --workspace " + workspace_name ))
}

async function find_workspace_from_window(w: Window) {

}

async function try_fix_cursor_location() {
    let { monitors } = await client.queryMonitors();
    let { workspaces } = await client.queryWorkspaces();
    let { focused } = await client.queryFocused();

    // See if there is any other workspaces in the current monitor and focus on that
    // if (cur_focused_monitor.childFocusOrder)
    const focused_workspace = (focused.type === "workspace") ? focused : workspaces.find(workspace => workspace.id === focused.parentId);
    let another_workspace: Workspace | undefined;

    if (!focused_workspace) {
        return;
    }

    for (let i = 0; i < monitors.length; i++) {
        if (monitors[i].childFocusOrder.length > 1) {
            another_workspace = monitors[i].children.find(workspace => workspace != focused_workspace);
            if (!another_workspace) {
                return;
            }
            console.log(another_workspace);
            console.log(focused_workspace);
            client.runCommand("focus --workspace " + another_workspace.name);
            await sleep(delay).then(() => client.runCommand("focus --workspace " + focused_workspace.name));
            return;
        }
    }
}

async function attemptFocusWindow(windowId: string, workspace: Workspace) {
    console.log('--- attempt focus window -- workspace ---');
    console.log(workspace);

    const targetWindow = getWindow(windowId, workspace);
    let attempts = 0;
    let done = false;
    while (!done && attempts < MAX_FOCUS_ATTEMPT) {
        const { focused } = await client.queryFocused();
        if (focused.id === windowId)
            done = true;
        else {
            if (focused.x > targetWindow.x)
                client.runCommand('focus --direction left');
            else if (focused.x < targetWindow.x)
                client.runCommand('focus --direction right');
            else if (focused.y > targetWindow.y)
                client.runCommand('focus --direction up');
            else if (focused.y < targetWindow.y)
                client.runCommand('focus --direction down');
            attempts += 1;
        }
    }
}

function getWindow(windowId: string, workspace: Workspace): Window {
    return getFlattenWindows(workspace.children).find(w => w.id === windowId)!;
}

/** Retrieve all windows from split-containers */
function getFlattenWindows(children: (SplitContainer | Window)[]): Window[] {
    const result: Window[] = [];
    for (let i = 0; i < children.length; i++) {
        const c = children[i];
        if (c.type === ContainerType.WINDOW)
            result.push(c);
        else {
            const windows = getFlattenWindows(c.children);
            result.push(...windows);
        }

    }
    return result;
}

client.onConnect(action);
setTimeout(() => {
    process.exit(0);
}, delay * 1000);
