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
const client = new glazewm_1.WmClient();
const delay = 10;
const action = () => __awaiter(void 0, void 0, void 0, function* () {
    const { monitors } = yield client.queryMonitors();
    const { workspaces } = yield client.queryWorkspaces();
    const { focused } = yield client.queryFocused();
    let cur_focused_workspace;
    let cur_focused_monitor;
    let adj_workspace;
    let adj_monitor;
    cur_focused_workspace = focused.type === "workspace" ? focused : workspaces.find(workspace => workspace.id === focused.parentId);
    cur_focused_monitor = monitors.find(monitor => monitor.id === (cur_focused_workspace === null || cur_focused_workspace === void 0 ? void 0 : cur_focused_workspace.parentId));
    adj_monitor = cur_focused_monitor === undefined ? undefined : monitors.find(monitor => monitor != cur_focused_monitor);
    adj_workspace = workspaces.find(workspace => workspace.id === (adj_monitor === null || adj_monitor === void 0 ? void 0 : adj_monitor.childFocusOrder[0]));
    if (cur_focused_monitor && cur_focused_workspace && adj_workspace && adj_monitor) {
        if (cur_focused_monitor.x >= 0) {
            client.runCommand("move-workspace --direction left");
            sleep(delay).then(() => client.runCommand("focus --workspace " + adj_workspace.name));
            sleep(delay).then(() => client.runCommand("move-workspace --direction right"));
        }
        else {
            client.runCommand("move-workspace --direction right");
            sleep(delay).then(() => client.runCommand("focus --workspace " + adj_workspace.name));
            sleep(delay).then(() => client.runCommand("move-workspace --direction left"));
        }
    }
});
client.onConnect(action);
setTimeout(() => {
    process.exit(0);
}, delay * 100);
