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
    CLIENT.runCommand("move-workspace --direction left");
    sleep(DELAY).then(() => CLIENT.runCommand("focus --workspace " + adjWorkspace.name));
    sleep(DELAY).then(() => CLIENT.runCommand("move-workspace --direction right"));
  }
  else {
    CLIENT.runCommand("move-workspace --direction right");
    sleep(DELAY).then(() => CLIENT.runCommand("focus --workspace " + adjWorkspace.name));
    sleep(DELAY).then(() => CLIENT.runCommand("move-workspace --direction left"));
  }

  console.log(`Focused workspace ${focusedWorkspace.name}`);
  sleep(DELAY * 10).then(() => CLIENT.runCommand(`focus --workspace ${focusedWorkspace.name}`));
  console.log(`Focused workspace ${adjWorkspace.name}`);
  sleep(DELAY * 15).then(() => CLIENT.runCommand(`focus --workspace ${adjWorkspace.name}`));
  
}

