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
const client = new glazewm_1.WmClient();
const action = () => __awaiter(void 0, void 0, void 0, function* () {
    const { monitors } = yield client.queryMonitors();
    const { workspaces } = yield client.queryWorkspaces();
    const { focused } = yield client.queryFocused();
    console.log("Monitors");
    console.log(monitors);
    console.log("\nWorkspaces");
    console.log(workspaces);
    console.log("\nfocused");
    console.log(focused);
});
client.onConnect(action);
