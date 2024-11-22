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
exports.sleep = sleep;
exports.getWorkspaceFromWindow = getWorkspaceFromWindow;
exports.getMonitorFromWorkspace = getMonitorFromWorkspace;
exports.getWorkspaceFromFocused = getWorkspaceFromFocused;
exports.getFocusedWorkspace = getFocusedWorkspace;
exports.getFocusedMonitorFromWorkspace = getFocusedMonitorFromWorkspace;
exports.getWorkspaceShowingOnMonitor = getWorkspaceShowingOnMonitor;
exports.fixCursorLocation = fixCursorLocation;
exports.exit = exit;
const glazewm_1 = require("glazewm");
function sleep(ms) {
    return new Promise(reslove => setTimeout(reslove, ms));
}
function getWorkspaceFromWindow(window, workspaces) {
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
function getMonitorFromWorkspace(workspace, monitors) {
    return monitors.find(m => m.id === workspace.parentId);
}
function getWorkspaceFromFocused(focused, workspaces) {
    if (focused.type === glazewm_1.ContainerType.WORKSPACE) {
        return focused;
    }
    return getWorkspaceFromWindow(focused, workspaces);
}
function getFocusedWorkspace(workspaces) {
    return workspaces.find(workspace => workspace.hasFocus);
}
function getFocusedMonitorFromWorkspace(workspaces, monitors) {
    return monitors.find(monitor => { var _a; return monitor.id === ((_a = getFocusedWorkspace(workspaces)) === null || _a === void 0 ? void 0 : _a.parentId); });
}
function getWorkspaceShowingOnMonitor(monitor) {
    const workspaces = monitor.children;
    return workspaces.find(workspace => workspace.id === monitor.childFocusOrder[0]);
}
function windowSearch(container, wid) {
    let found = false;
    for (let i = 0; i < container.children.length; i++) {
        let children = container.children[i];
        if (children.type === glazewm_1.ContainerType.SPLIT) {
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
    return found;
}
function fixCursorLocation(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const { monitors } = yield client.queryMonitors();
        const { workspaces } = yield client.queryWorkspaces();
        const focusedWorkspace = getFocusedWorkspace(workspaces);
        const focusedMonitor = getFocusedMonitorFromWorkspace(workspaces, monitors);
    });
}
function exit(ms) {
    setTimeout(() => {
        process.exit(0);
    }, ms);
}
