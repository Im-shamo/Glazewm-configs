import { WmClient } from "glazewm";
import {
  sleep, exit, getFocusedWorkspace, getFocusedMonitorFromWorkspace, getMonitorFromWorkspace,
  getWorkspaceShowingOnMonitor
} from "./helper_functions"

const DELAY = 20; //ms
const CLIENT = new WmClient();

CLIENT.onConnect(action);
exit(DELAY * 1000);

async function action() {
  const { monitors } = await CLIENT.queryMonitors();
  const { workspaces } = await CLIENT.queryWorkspaces();

  if (process.argv.length != 3) {
    console.log("Provide a workspace name")
    process.exit(1)
  }

  const focusedWorkspace = getFocusedWorkspace(workspaces);
  const focusedMonitor = getFocusedMonitorFromWorkspace(workspaces, monitors);

  const toBeFocusedWorkspaceName = process.argv[2];
  const toBeFocusedWorkspace = workspaces.find(w => w.name === toBeFocusedWorkspaceName);
  const toBeFocusedMonitor = toBeFocusedWorkspace === undefined ? undefined : getMonitorFromWorkspace(toBeFocusedWorkspace, monitors);

  if (!focusedWorkspace || !focusedMonitor || !toBeFocusedWorkspaceName) {
    console.assert(focusedWorkspace, "focusedWorkspace is undefined");
    console.assert(focusedMonitor, "focusedMonitor is undefined");
    console.assert(toBeFocusedWorkspaceName, "toBeFocusedWorkspaceName is undefined");
    process.exit(1);
  }

  // console.log("------------ Debug ------------");
  // console.log(focusedWorkspace);
  // console.log(focusedMonitor);
  // console.log(toBeFocusedWorkspaceName);
  // console.log(toBeFocusedWorkspace);
  // console.log(toBeFocusedMonitor);
  // console.log("-------------------------------");

  if (!toBeFocusedWorkspace) {
    await CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
    return;
  }

  if (!toBeFocusedMonitor) {
    console.assert(toBeFocusedMonitor, "toBeFocusedMonitor is undfined");
    process.exit(1);
  }

  if (toBeFocusedMonitor.id === focusedMonitor.id) {
    await CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
    return;
  }

  // console.log("----")
  // console.log(getWorkspaceShowingOnMonitor(toBeFocusedMonitor));
  // console.log("\n");
  // console.log(toBeFocusedWorkspace);
  // console.log("----");

  if (focusedMonitor.x >= toBeFocusedMonitor.x) {
    // move to Left
    if (getWorkspaceShowingOnMonitor(toBeFocusedMonitor)?.id === toBeFocusedWorkspace.id) {
      // Swap
      await CLIENT.runCommand("move-workspace --direction left");
    }
    await CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
    await CLIENT.runCommand("move-workspace --direction right");
  } else if (focusedMonitor.x < toBeFocusedMonitor.x) {
    // move to Right
    if (getWorkspaceShowingOnMonitor(toBeFocusedMonitor)?.id === toBeFocusedWorkspace.id) {
      // Swap
      await CLIENT.runCommand("move-workspace --direction right");
    }
    await CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
    await CLIENT.runCommand("move-workspace --direction left");
  }
}

