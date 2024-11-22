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
const client = new glazewm_1.WmClient();
client.onConnect(action);
(0, helper_functions_1.exit)(10000);
function action() {
    return __awaiter(this, void 0, void 0, function* () {
        const { workspaces } = yield client.queryWorkspaces();
        const { monitors } = yield client.queryMonitors();
        const { windows } = yield client.queryWindows();
        console.log("------------ Monitors ------------");
        monitors.forEach(print_item);
        console.log("\n------------ Workspaces ------------");
        workspaces.forEach(print_item);
        console.log("\n------------ Windows ------------");
        windows.forEach(print_item);
        const unlisten = yield client.subscribe(glazewm_1.WmEventType.FOCUS_CHANGED, subscribeAction);
        console.log("test");
    });
}
function print_item(item, index) {
    console.log(item);
    console.log("");
}
function subscribeAction(event) {
    console.log(`------------ ${event.eventType} ------------`);
    console.log(event);
    console.log("");
}
