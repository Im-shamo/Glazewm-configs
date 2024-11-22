import { WmClient, Workspace, Window, ContainerType, SplitContainer, Monitor } from "glazewm"

export function sleep(ms: number) {
  return new Promise(reslove => setTimeout(reslove, ms));
}

export function getWorkspaceFromWindow(window: Window, workspaces: Array<Workspace>): Workspace | undefined {
  let wid = window.id;
  let workspace;
  for (let i = 0; i < workspaces.length; i++) {
    workspace = workspaces[i];
    if (windowSearch(workspace, wid)) {
      return workspace;
    }
  }
  return undefined;

}

export function getMonitorFromWorkspace(workspace: Workspace, monitors: Monitor[]): Monitor | undefined {
  return monitors.find(m => m.id === workspace.parentId);
}

export function getWorkspaceFromFocused(focused: Workspace | Window, workspaces: Array<Workspace>): Workspace | undefined{
  if (focused.type === ContainerType.WORKSPACE) {
    return focused;
  }

  return getWorkspaceFromWindow(focused, workspaces);

}

export function getFocusedWorkspace(workspaces: Workspace[]): Workspace | undefined {
  return workspaces.find(workspace => workspace.hasFocus);
}

export function getFocusedMonitorFromWorkspace(workspaces: Workspace[], monitors: Monitor[]): Monitor | undefined {
  return monitors.find(monitor => monitor.id === getFocusedWorkspace(workspaces)?.parentId);
}

export function getWorkspaceShowingOnMonitor(monitor: Monitor): Workspace | undefined{
  const workspaces = monitor.children;
  return workspaces.find(workspace => workspace.id === monitor.childFocusOrder[0]);
}

function windowSearch(container: Workspace | SplitContainer, wid: string): boolean {
  let found = false;
  for (let i = 0; i < container.children.length; i++) {
    let children = container.children[i];
    if (children.type === ContainerType.SPLIT) {
      found = windowSearch(children, wid);
      if (found) {
        return found;
      }
    }
    else {
      found = children.id === wid;
      if (found)
        return found;
    }
  }
  return found
}

export async function fixCursorLocation(client: WmClient) {
  const { monitors } = await client.queryMonitors();
  const { workspaces } = await client.queryWorkspaces();

  const focusedWorkspace = getFocusedWorkspace(workspaces);
  const focusedMonitor = getFocusedMonitorFromWorkspace(workspaces, monitors);

  

}

export function exit(ms: number) {
  setTimeout(() => {
    process.exit(0);
  }, ms);
}


