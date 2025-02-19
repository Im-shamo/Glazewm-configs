# Glazewm-configs

Personal configuration of **Glzewm** and **Zebar**.

I have written a few scripts to add in some features that aren't in glazewm.

Zebar has not been customized yet as I am unfamiliar with HTML, CSS and JavaScript.

## Personal Scripts
### Description
- My own implememtation of workspace focus
  - Normal focus if workspace to be focus is on the monitor currently focused.
  - If the workpace to be focus is on another monitor,
    the scripts moves it to the monitor currently focused
    and swap if it is top on another monitor.

- Workspace swapping between Monitors
  - Swaps workspace between monitors
### Installation
1. **Install node.js**
   - I recomand installing nvm-windows: https://github.com/coreybutler/nvm-windows
     
2. **Install GlazeWM-js**
   - https://github.com/glzr-io/glazewm-js
     
3. **Get the scripts**
   - Download from release
   - Alternalively, git clone and build it yourself
     1. Navigate in to [glazewm/scripts](glazewm/scripts)
     2. Build the script you want with `tsc`

4. **Change glazewm config**
   - Follow my [glazewm config](glazewm/config.yaml)
