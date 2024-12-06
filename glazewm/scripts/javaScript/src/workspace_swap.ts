import { WmClient } from "glazewm";
import { getFocusedWorkspace, exit, getFocusedMonitorFromWorkspace, getWorkspaceShowingOnMonitor, sleep, fixCursorLocation } from "./helper_functions"
import { assert } from "console";

let DELAY = 20; // ms

const CLIENT = new WmClient();
CLIENT.onConnect(action);

exit(DELAY * 1000);

async function action() {
  const { monitors } = await CLIENT.queryMonitors();
  const { workspaces } = await CLIENT.queryWorkspaces();
  const { focused } = await CLIENT.queryFocused();

  if (monitors.length != 2) {
    console.log("There is should be 2 monitors");
    process.exit(1);
  }

  const focusedWorkspace = getFocusedWorkspace(workspaces);
  const focusedMonitor = getFocusedMonitorFromWorkspace(workspaces, monitors);
  const adjMonitor = monitors.find(m => focusedMonitor != m);

  if (!adjMonitor) {
    assert(adjMonitor != undefined, "adjMonitor should not be undefined");
    process.exit(1);
  }

  const adjWorkspace = getWorkspaceShowingOnMonitor(adjMonitor);

  if (!focusedWorkspace || !focusedMonitor || !adjMonitor || !adjWorkspace) {
    console.log("error"); // todo: add error massage
    process.exit(1);
  }

  if (focusedMonitor.x >= 0) {
    await CLIENT.runCommand("move-workspace --direction left");
    await CLIENT.runCommand("focus --workspace " + adjWorkspace.name);
    await CLIENT.runCommand("move-workspace --direction right");
  }
  else {
    await CLIENT.runCommand("move-workspace --direction right");
    await CLIENT.runCommand("focus --workspace " + adjWorkspace.name);
    await CLIENT.runCommand("move-workspace --direction left");
  }  
}

