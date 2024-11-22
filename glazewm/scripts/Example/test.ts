import { WmClient } from 'glazewm';

const client = new WmClient();

// Listen for connection events to the IPC server.
client.onConnect(() => console.log('Connected!'));
client.onDisconnect(() => console.log('Disconnected!'));
client.onError(() => console.log('Connection error!'));

// Get monitors, workspaces, windows, and the currently focused container.
const { monitors } = await client.queryMonitors();
const { workspaces } = await client.queryWorkspaces();
const { windows } = await client.queryWindows();
const { focused } = await client.queryFocused();

// Run a WM command.
await client.runCommand('focus --workspace 1');

// Run a WM command with a given subject container. This way we can target
// the container to operate on. If no subject container is specified, it
// defaults to the currently focused container.
await client.runCommand('move --direction left', windows[0].id);

// Listen to a WM event (e.g. whenever the focused container changes).
await client.subscribe(
  WmEventType.FOCUS_CHANGED,
  (event: FocusChangedEvent) => console.log(event),
);

// Listen to multiple WM events.
await client.subscribeMany(
  [WmEventType.WORKSPACE_ACTIVATED, WmEventType.WORKSPACE_DEACTIVATED],
  (event: WorkspaceActivatedEvent | WorkspaceDeactivatedEvent) =>
    console.log(event),
);