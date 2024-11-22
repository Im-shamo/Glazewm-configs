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
const console_1 = require("console");
let DELAY = 20; // ms
const CLIENT = new glazewm_1.WmClient();
CLIENT.onConnect(action);
(0, helper_functions_1.exit)(DELAY * 1000);
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        const { monitors } = yield CLIENT.queryMonitors();
        const { workspaces } = yield CLIENT.queryWorkspaces();
        const { focused } = yield CLIENT.queryFocused();
        if (monitors.length != 2) {
            console.log("There is should be 2 monitors");
            process.exit(1);
        }
        const focusedWorkspace = (0, helper_functions_1.getFocusedWorkspace)(workspaces);
        const focusedMonitor = (0, helper_functions_1.getFocusedMonitorFromWorkspace)(workspaces, monitors);
        const adjMonitor = monitors.find(m => focusedMonitor != m);
        if (!adjMonitor) {
            (0, console_1.assert)(adjMonitor != undefined, "adjMonitor should not be undefined");
            process.exit(1);
        }
        const adjWorkspace = (0, helper_functions_1.getWorkspaceShowingOnMonitor)(adjMonitor);
        if (!focusedWorkspace || !focusedMonitor || !adjMonitor || !adjWorkspace) {
            console.log("error"); // todo: add error massage
            process.exit(1);
        }
        if (focusedMonitor.x >= 0) {
            CLIENT.runCommand("move-workspace --direction left");
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("focus --workspace " + adjWorkspace.name));
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("move-workspace --direction right"));
        }
        else {
            CLIENT.runCommand("move-workspace --direction right");
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("focus --workspace " + adjWorkspace.name));
            (0, helper_functions_1.sleep)(DELAY).then(() => CLIENT.runCommand("move-workspace --direction left"));
        }
        console.log(`Focused workspace ${focusedWorkspace.name}`);
        (0, helper_functions_1.sleep)(DELAY * 10).then(() => CLIENT.runCommand(`focus --workspace ${focusedWorkspace.name}`));
        console.log(`Focused workspace ${adjWorkspace.name}`);
        (0, helper_functions_1.sleep)(DELAY * 15).then(() => CLIENT.runCommand(`focus --workspace ${adjWorkspace.name}`));
    });
}
