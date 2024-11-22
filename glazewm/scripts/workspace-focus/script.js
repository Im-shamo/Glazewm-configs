"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const glazewm_1 = require("glazewm");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const MAX_FOCUS_ATTEMPT = 20;
const client = new glazewm_1.WmClient();
const delay = 10;
const workspace_name = process.argv[2];
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        let { monitors } = yield client.queryMonitors();
        let { workspaces } = yield client.queryWorkspaces();
        let { focused } = yield client.queryFocused();
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
        let to_be_focused_workspace_monitor = monitors.find(monitor => monitor.id === (to_be_focused_workspace === null || to_be_focused_workspace === void 0 ? void 0 : to_be_focused_workspace.parentId));
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
                yield sleep(delay).then(() => client.runCommand("focus --workspace " + workspace_name));
                yield sleep(delay).then(() => client.runCommand("move-workspace --direction right"));
            }
            else {
                if (to_be_focused_workspace.id === to_be_focused_workspace_monitor.childFocusOrder[0]) {
                    client.runCommand("move-workspace --direction right");
                }
                yield sleep(delay).then(() => client.runCommand("focus --workspace " + workspace_name));
                yield sleep(delay).then(() => client.runCommand("move-workspace --direction left"));
            }
        }
        // ({ focused } = await client.queryFocused());.
        const resQueryWorkspaces = yield client.queryWorkspaces();
        workspaces = resQueryWorkspaces.workspaces;
        yield sleep(100);
        const w = workspaces.find(workspace => workspace.id === cur_focused_workspace.id);
        yield attemptFocusWindow(initialFocusedId, w);
        // if (focused.type === "window" && w) {
        //     await attemptFocusWindow(focused.id, w);
        // }
        yield sleep(100).then(() => client.runCommand("focus --workspace " + workspace_name));
    });
}
function try_fix_cursor_location() {
    return __awaiter(this, void 0, void 0, function* () {
        let { monitors } = yield client.queryMonitors();
        let { workspaces } = yield client.queryWorkspaces();
        let { focused } = yield client.queryFocused();
        // See if there is any other workspaces in the current monitor and focus on that
        // if (cur_focused_monitor.childFocusOrder)
        const focused_workspace = (focused.type === "workspace") ? focused : workspaces.find(workspace => workspace.id === focused.parentId);
        let another_workspace;
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
                yield sleep(delay).then(() => client.runCommand("focus --workspace " + focused_workspace.name));
                return;
            }
        }
    });
}
function attemptFocusWindow(windowId, workspace) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('--- attempt focus window -- workspace ---');
        console.log(workspace);
        const targetWindow = getWindow(windowId, workspace);
        let attempts = 0;
        let done = false;
        while (!done && attempts < MAX_FOCUS_ATTEMPT) {
            const { focused } = yield client.queryFocused();
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
    });
}
function getWindow(windowId, workspace) {
    return getFlattenWindows(workspace.children).find(w => w.id === windowId);
}
/** Retrieve all windows from split-containers */
function getFlattenWindows(children) {
    const result = [];
    for (let i = 0; i < children.length; i++) {
        const c = children[i];
        if (c.type === glazewm_1.ContainerType.WINDOW)
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
