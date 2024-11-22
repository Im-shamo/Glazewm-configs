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
const helper_functions_1 = require("./helper_functions");
const DELAY = 20; //ms
const CLIENT = new glazewm_1.WmClient();
CLIENT.onConnect(action);
(0, helper_functions_1.exit)(DELAY * 1000);
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        function cursorFix() {
            // Workaound for cursor not being on the correct screen
            if (!focusedWorkspace) {
                return;
            }
            (0, helper_functions_1.sleep)(DELAY * 10).then(() => CLIENT.runCommand(`focus --workspace ${focusedWorkspace.name}`));
            (0, helper_functions_1.sleep)(DELAY * 10).then(() => CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`));
        }
        const { monitors } = yield CLIENT.queryMonitors();
        const { workspaces } = yield CLIENT.queryWorkspaces();
        if (process.argv.length != 3) {
            console.log("Provide a workspace name");
            process.exit(1);
        }
        const focusedWorkspace = (0, helper_functions_1.getFocusedWorkspace)(workspaces);
        const focusedMonitor = (0, helper_functions_1.getFocusedMonitorFromWorkspace)(workspaces, monitors);
        const toBeFocusedWorkspaceName = process.argv[2];
        const toBeFocusedWorkspace = workspaces.find(w => w.name === toBeFocusedWorkspaceName);
        const toBeFocusedMonitor = toBeFocusedWorkspace === undefined ? undefined : (0, helper_functions_1.getMonitorFromWorkspace)(toBeFocusedWorkspace, monitors);
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
            CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
            return;
        }
        if (!toBeFocusedMonitor) {
            console.assert(toBeFocusedMonitor, "toBeFocusedMonitor is undfined");
            process.exit(1);
        }
        if (toBeFocusedMonitor.id === focusedMonitor.id) {
            CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`);
            return;
        }
        // console.log("----")
        // console.log(getWorkspaceShowingOnMonitor(toBeFocusedMonitor));
        // console.log("\n");
        // console.log(toBeFocusedWorkspace);
        // console.log("----");
        if (focusedMonitor.x >= toBeFocusedMonitor.x) {
            // move to Left
            if (((_a = (0, helper_functions_1.getWorkspaceShowingOnMonitor)(toBeFocusedMonitor)) === null || _a === void 0 ? void 0 : _a.id) === toBeFocusedWorkspace.id) {
                // Swap
                CLIENT.runCommand("move-workspace --direction left");
            }
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`));
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("move-workspace --direction right"));
            cursorFix();
        }
        else if (focusedMonitor.x < toBeFocusedMonitor.x) {
            // move to Right
            if (((_b = (0, helper_functions_1.getWorkspaceShowingOnMonitor)(toBeFocusedMonitor)) === null || _b === void 0 ? void 0 : _b.id) === toBeFocusedWorkspace.id) {
                // Swap
                CLIENT.runCommand("move-workspace --direction right");
            }
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand(`focus --workspace ${toBeFocusedWorkspaceName}`));
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("move-workspace --direction left"));
            cursorFix();
        }
    });
}
