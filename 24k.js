// ==UserScript==
// @name         24k
// @namespace    -
// @version      alpha
// @description  better than u
// @author       ehScripts
// @match        zombs.io/*
// @match        localhost
// @icon         https://cdn.discordapp.com/attachments/873589347314700359/985564558594826280/24k.png
// @require      https://kit.fontawesome.com/dfc55135f1.js
// @grant        none
// ==/UserScript==

for(const server of Array.from(document.querySelectorAll(".hud-intro-server > optgroup > option"))) {
    server.innerHTML += ` (${server.value})`;
};

document.getElementsByClassName("hud-intro-name")[0].maxLength = 29;

let savedTabs = [];
let gameServers = game.options.servers;

document.getElementsByClassName('hud-intro-guide')[0].innerHTML = `
<h1>Tab Saver</h1>
<br />
Tabs saved:<br />
<div id="savedTabs">
</div>
<hr />
<p style="width: 300px;">
To exit a saved tab and go back to the main menu, click the blank spell icon on the left side of the screen.
</p>
`;

document.getElementsByClassName('hud-chat')[0].style.width = "auto";
document.getElementsByClassName('hud-chat')[0].style.minWidth = "520px";

document.getElementsByClassName('hud-intro-form')[0].insertAdjacentHTML('beforeend', '<button class="btn btn-red hud-intro-play" id="hstb">Host Saved Tab</button>');

let stElem = document.getElementById('savedTabs');

let newPlayButton = document.getElementsByClassName("hud-intro-play")[0].cloneNode();

newPlayButton.classList.replace('hud-intro-play', 'longbtn')
newPlayButton.style.display = "none";
newPlayButton.style.marginTop = "10px";
newPlayButton.style.marginLeft = "-.5px";
newPlayButton.innerText = "Enter Saved Tab";
newPlayButton.style.width = "100%";
newPlayButton.style.height = "50px";
newPlayButton.classList.replace('btn-green', 'btn-facebook');

newPlayButton.addEventListener('click', function() {
    game.ui.components.Intro.componentElem.style.display = "none";
});

addEventListener('load', function() {
    document.querySelector(".hud-intro-guide").style.width = "auto";
});

document.getElementsByClassName('hud-intro-play')[0].insertAdjacentElement("beforebegin", newPlayButton);

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity3");
spell.classList.add("hud-zipp3-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

document.getElementsByClassName("hud-zipp3-icon")[0].addEventListener("click", function() {
    game.ui.components.PopupOverlay.showConfirmation('Are you sure you want to go back to the main menu? (This will not close your saved tabs.)', 5000, () => {
        if(window.parent !== window) {
            window.parent.ostb();
        };
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
            game.ui.components.Intro.componentElem.style.display = "block";
        }
    });
});

let realPlayButton = true

const switchPlayButtons = () => {
    realPlayButton = !realPlayButton;
    if(realPlayButton) {
        newPlayButton.style.display = "none";
        document.getElementsByClassName("hud-intro-play")[0].style.display = "block";
    } else {
        document.getElementsByClassName("hud-intro-play")[0].style.display = "none";
        newPlayButton.style.display = "block";
    };
};

const updateSavedTabs = () => {
    stElem.innerHTML = ``;
    let oneEnabled = false;
    for(let tabi in savedTabs) {
        let tab = savedTabs[tabi]
        let tabBtn = document.createElement('button');
        if(tab.enabled) { oneEnabled = true; }
        tabBtn.classList.add('btn', tab.enabled ? "btn-green" : "btn-red");
        tabBtn.innerText = savedTabs[tabi].id;
        stElem.appendChild(tabBtn);
        let xBtn = document.createElement('button')
        xBtn.classList.add('btn');
        xBtn.innerText = "X"
        xBtn.style.marginTop = "2.5px";
        xBtn.style.display = "inline-block";
        stElem.appendChild(xBtn);
        let writeBtn = document.createElement('button')
        writeBtn.classList.add('btn');
        writeBtn.innerHTML = "<i class='fa fa-pencil'></i>"
        writeBtn.style.marginTop = "2.5px";
        stElem.appendChild(writeBtn);
        writeBtn.style.display = "inline-block"
        let enterBtn = document.createElement('button')
        enterBtn.classList.add('btn');
        enterBtn.innerHTML = "<i class='fa fa-check'></i>"
        enterBtn.style.marginTop = "2.5px";
        enterBtn.style.display = "none";
        stElem.appendChild(enterBtn);
        let resetBtn = document.createElement('button')
        resetBtn.classList.add('btn');
        resetBtn.innerHTML = "<i class='fa fa-rotate-left'></i>"
        resetBtn.style.marginTop = "2.5px";
        resetBtn.style.display = "none";
        stElem.appendChild(resetBtn);
        let oldId;
        writeBtn.addEventListener('click', function() {
            if(this.dataset.editing) {
                updateSavedTabs();
            } else {
                resetBtn.style.display = "inline-block";
                resetBtn.classList.replace('btn', 'disabledBtn');
                enterBtn.style.display = "inline-block";
                enterBtn.classList.replace('btn', 'disabledBtn');
                oldId = savedTabs[tabi].id;
                tabBtn.innerHTML = `<input style="width:100px;" type="text" />`
               tabBtn.children[0].addEventListener('input', function() {
                   this.value = this.value.replaceAll(' ', '_');
                   if(this.value == oldId || this.value == "") {
                       if(this.value !== "") {
                           resetBtn.classList.replace('btn', 'disabledBtn');
                       };
                       if(this.value == "") {
                           enterBtn.classList.replace('btn', 'disabledBtn');
                       }
                   } else {
                       resetBtn.classList.replace('disabledBtn', 'btn');
                       enterBtn.classList.replace('disabledBtn', 'btn');
                   };
                   if(savedTabs.find(i => i.id == this.value)) {
                       enterBtn.classList.replace('btn', 'disabledBtn');
                   };
               })
                tabBtn.children[0].focus();
                tabBtn.children[0].value = savedTabs[tabi].id;
                tabBtn.setAttribute('disabled', true);
                this.innerHTML = "<i class='fa fa-square'>"
                xBtn.setAttribute('disabled', true)
                this.dataset.editing = true;
                xBtn.classList.replace('btn', 'disabledBtn');
            };
        });
        resetBtn.addEventListener('click', function() {
            tabBtn.children[0].value = oldId;
        });
        enterBtn.addEventListener('click', function() {
            savedTabs[tabi].id = tabBtn.children[0].value;
            updateSavedTabs();
        });
        xBtn.addEventListener('click', function() {
            let c = confirm('Are you sure you want to close this tab?');
            if(c) {
                tab.iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                updateSavedTabs();
            };
        })
        savedTabs[tabi].btn = tabBtn;
        tabBtn.addEventListener('click', function() {
            savedTabs[tabi].enabled = !savedTabs[tabi].enabled;
            tab.iframe.style.display = "block";
            document.getElementsByTagName('canvas')[0].style.display = "none";
            for(let component in game.ui.components) {
                if(component !== "Intro") {
                    game.ui.components[component].componentElem.style.display = "none";
                };
            };
            for(let tbi in savedTabs) {
                let tb = savedTabs[tbi];
                if((tb.serverId !== tab.serverId) || (tb.serverId == tab.serverId && tb.no !== tab.no)) {
                    tb.iframe.style.display = "none";
                    savedTabs[tbi].enabled = false;
                };
            };
            updateSavedTabs();
        })
        stElem.insertAdjacentHTML('beforeend', '<br />')
    };
    if(oneEnabled) {
        document.getElementsByTagName('canvas')[0].style.display = "none";
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "none";
            };
        };
        if(realPlayButton) {
            switchPlayButtons();
        };
    } else {
        document.getElementsByTagName('canvas')[0].style.display = "block";
        if(!realPlayButton) {
            switchPlayButtons();
        };
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
        for(let component in game.ui.components) {
            if(component !== "Intro") {
                game.ui.components[component].componentElem.style.display = "block";
            };
        };
    };
};

const hostSavedTab = serverId => {
    let iframe = document.createElement('iframe');
    iframe.src = `https://zombs.io/#/${serverId}/tabsession`;
    iframe.style.diplay = "none";
    iframe.style.width = "100%"
    iframe.style.height = "100%"
    iframe.style.position = 'absolute';
    iframe.style.display = "none";
    document.getElementsByClassName('hud')[0].append(iframe);
    iframe.onload = () => {
        if(iframe.dataset.loaded) { return; }
        iframe.dataset.loaded = true;
        if(gameServers[serverId].hostno) {
            gameServers[serverId].hostno++;
        } else {
            gameServers[serverId].hostno = 1;
        }
        let tabi = savedTabs.length;
        savedTabs.push({ serverId: serverId, serverName: game.options.servers[serverId].name, no: gameServers[serverId].hostno, iframe: iframe, id: `${game.options.servers[serverId].name.replaceAll(' ', '-')}_#${gameServers[serverId].hostno}` })
        updateSavedTabs();
        iframe.contentWindow.eval(`
           document.getElementsByClassName("hud-intro-play")[0].click()
           let hasJoined = false
           game.network.addEnterWorldHandler(() => {
               if(hasJoined) { return; }
               hasJoined = true;
           });
       `);
        setTimeout(() => {
            if(!iframe.contentWindow.game.world.inWorld) {
                iframe.remove();
                savedTabs.splice(tabi, tabi + 1);
                game.ui.components.Intro.componentElem.style.display = "block";
                updateSavedTabs();
            };
        }, 10000);
    };
};

document.getElementById('hstb').addEventListener('click', function() {
    hostSavedTab(document.getElementsByClassName('hud-intro-server')[0].value)
})

window.stOpt = {
    ust: updateSavedTabs,
    gst: () => savedTabs,
    spb: switchPlayButtons
}

window.ostb = () => {
    game.ui.components.Intro.componentElem.style.display = "block";
};

window.joinST = id => {
    let tab = savedTabs.find(i => i.id == id);
    if(tab) {
        for(let tb of savedTabs) {
            tb.iframe.style.display = "none"
        };
        tab.iframe.style.display = "block";
    };
};

document.body.style.overscrollBehavior = "none";

let lastMousePos = {};
let mouseDown = false;
let mousePos = {};
let dragBoxElem;
let dragBoxMenuElem;
let dragBoxMenuOpen;
let dragBoxMenuOpenWhenStarted;
let placingSelection;
let placingSelectionWhenStarted;
let placingSelectionId;
const dayNightOverlay = document.getElementById("hud-day-night-overlay");

const buildingModels = ["Wall", "Door", "SlowTrap", "GoldMine", "Harvester", "MagicTower", "CannonTower", "ArrowTower", "BombTower", "MeleeTower"];

const savedSelections = {};

Number.prototype.nearest = function(n) { return Math.round(this / n) * n; };

const options = {
    dayBright: {
        onUpdate: enabled => {
            if(enabled) {
                dayNightOverlay.style.display = "none";
            } else {
                dayNightOverlay.style.display = "block";
            };
        },
        enabled: false,
        name: "DayBright",
        id: "dayBright"
    },
    dragBox: {
        onUpdate: e => {
            if(!e) {
                if(dragBoxElem) { dragBoxElem.remove(); };
                if(dragBoxMenuElem) { dragBoxMenuElem.remove(); };
            };
        },
        enabled: false,
        name: "DragBox",
        id: "dragBox"
    },
    grapplingHook: {
        onUpdate: () => {},
        enabled: false,
        name: "Grappling Hook",
        id: "grapplingHook"
    },
    frss: {
        onUpdate: () => {},
        enabled: false,
        name: "Full RSS",
        id: "frss"
    }
};

window.optUpdate = (feature, enabled) => {
    options[feature].enabled = enabled;
    options[feature].onUpdate(enabled);
};

addEventListener('mousedown', function(e) {
    lastMousePos = { x: mousePos.x, y: mousePos.y };
    dragBoxMenuOpenWhenStarted = dragBoxMenuOpen;
    placingSelectionWhenStarted = placingSelection;
    if(placingSelection) {
        for(let index in game.ui.components.PlacementOverlay.overlayEntities) {
            const entity = game.ui.components.PlacementOverlay.overlayEntities[index];
            entity.setVisible(0);
            delete game.ui.components.PlacementOverlay.overlayEntities[index];
        };
        game.ui.components.PlacementOverlay.overlayEntities = game.ui.components.PlacementOverlay.overlayEntities.filter(i => !!i);
        const mousePos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        let buildingSchema = game.ui.getBuildingSchema();
        let mousePosition = game.ui.getMousePosition();
        let world = game.world;
        for(let building of savedSelections[placingSelectionId]) {
            let schemaData = buildingSchema[building.tower];
            let worldPos = game.renderer.screenToWorld(mousePosition.x, mousePosition.y);
            worldPos.x += building.x;
            worldPos.y += building.y;
            let cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
                width: schemaData.gridWidth,
                height: schemaData.gridHeight
            });
            let cellSize = world.entityGrid.getCellSize();
            let cellAverages = {
                x: 0,
                y: 0
            };
            for (let i in cellIndexes) {
                if (!cellIndexes[i]) {
                    return false;
                }
                let cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
                cellAverages.x += cellPos.x;
                cellAverages.y += cellPos.y;
            }
            cellAverages.x = cellAverages.x / cellIndexes.length;
            cellAverages.y = cellAverages.y / cellIndexes.length;
            let gridPos = {
                x: cellAverages.x * cellSize + cellSize / 2,
                y: cellAverages.y * cellSize + cellSize / 2
            };
            const rpc = {
                name: "MakeBuilding",
                x: gridPos.x,
                y: gridPos.y,
                type: building.tower,
                yaw: building.yaw
            };
            game.network.sendRpc(rpc);
        };
        placingSelection = false;
    } else if(options.dragBox.enabled && !dragBoxMenuOpen) {
        dragBoxElem = document.createElement('div');
        dragBoxElem.classList.add('dragBox');
        dragBoxElem.style.top = `${mousePos.y}px`;
        dragBoxElem.style.left = `${mousePos.x}px`;
        document.body.appendChild(dragBoxElem);
    };
    mouseDown = true;
});

const rebuilders = {
};

const untilRpc = rpcName => {
    return new Promise((res, rej) => {
        let resolved = false;
        game.network.addRpcHandler(rpcName, data => {
            if(!resolved) {
                res(data);
                resolved = true;
            };
        });
    });
};

game.network.addEntityUpdateHandler(() => {
    let buildingSchema = game.ui.getBuildingSchema();
    let mousePosition = game.ui.getMousePosition();
    let world = game.world;
    const schema = game.ui.getBuildingSchema();
    for(let entity of placementOverlay.overlayEntities) {
        let worldPos = game.renderer.screenToWorld(mousePosition.x, mousePosition.y);
        worldPos.x += entity.towerOffset.x;
        worldPos.y += entity.towerOffset.y;
        let cellIndexes = world.entityGrid.getCellIndexes(worldPos.x, worldPos.y, {
            width: schema[entity.tower].gridWidth,
            height: schema[entity.tower].gridHeight
        });
        let cellSize = world.entityGrid.getCellSize();
        let cellAverages = {
            x: 0,
            y: 0
        };
        let gridPos_1 = {};
        for (let i in cellIndexes) {
            if (!cellIndexes[i]) {
                continue;
            };
            let cellPos = world.entityGrid.getCellCoords(cellIndexes[i]);
            gridPos_1 = {
                x: cellPos.x * cellSize + cellSize / 2,
                y: cellPos.y * cellSize + cellSize / 2
            };
            cellAverages.x += cellPos.x;
            cellAverages.y += cellPos.y;
        }
        cellAverages.x = cellAverages.x / cellIndexes.length;
        cellAverages.y = cellAverages.y / cellIndexes.length;
        const newPos = game.renderer.worldToUi(gridPos_1.x, gridPos_1.y);
        entity.setPosition(newPos.x, newPos.y);
    };
    for(let id in rebuilders) {
        const rebuilder = rebuilders[id];
        let towers = {};
        for(let uid in game.world.entities) {
            const entity = game.world.entities[uid];
            if(buildingModels.includes(entity.fromTick.model)) {
                const building = entity.targetTick.position;
                if(
                    building.x > Math.min(rebuilder.from.x, rebuilder.to.x) &&
                    building.x < Math.max(rebuilder.from.x, rebuilder.to.x) &&
                    building.y > Math.min(rebuilder.from.y, rebuilder.to.y) &&
                    building.y < Math.max(rebuilder.from.y, rebuilder.to.y)
                ) {
                    towers[uid] = {
                        type: entity.fromTick.model,
                        x: building.x,
                        y: building.y,
                        tier: entity.targetTick.tier,
                        yaw: entity.targetTick.yaw
                    };
                };
            }
        };
        if(rebuilder.lastTowers) {
            if(JSON.stringify(rebuilder.lastTowers) != JSON.stringify(towers)) {
                for(const uid in rebuilder.lastTowers) {
                    if(!towers[uid]) {
                        const tower = rebuilder.lastTowers[uid];
                        const buildingRpc = {
                            name: "MakeBuilding",
                            x: tower.x,
                            y: tower.y,
                            yaw: tower.yaw,
                            type: tower.type
                        };
                        console.log(buildingRpc);
                        game.network.sendRpc(buildingRpc);
                        untilRpc("LocalBuilding").then(data => {
                            for(const localTower of data) {
                                let isTower = true;
                                for(let key in localTower) {
                                    if(["dead", "tier", "uid"].includes(key)) { continue; };
                                    if(localTower[key] != buildingRpc[key]) {
                                        isTower = false;
                                    };
                                };
                                if(isTower) {
                                    if(localTower.tier == tower.tier) { return; };
                                    const towerUid = localTower.uid;
                                    for(let i = 0; i < tower.tier; i++) {
                                        game.network.sendRpc({
                                            name: "UpgradeBuilding",
                                            uid: towerUid
                                        });
                                    };
                                };
                            };
                        });
                    };
                };
            };
        };
        rebuilders[id].lastTowers = towers;
    };
});

addEventListener('mouseup', function(e) {
    let newPos = { x: mousePos.x, y: mousePos.y };
    let oldPos = { x: lastMousePos.x, y: lastMousePos.y };
    if(options.dragBox.enabled && !dragBoxMenuOpenWhenStarted && !placingSelectionWhenStarted) {
        if(Math.hypot(newPos.x-oldPos.x, newPos.y-oldPos.y) < 10) {
            dragBoxElem.remove();
            return;
        };
        dragBoxMenuElem = document.createElement('div');
        dragBoxMenuElem.classList.add('dragBoxMenu');
        dragBoxMenuElem.style.top = `${mousePos.y}px`;
        dragBoxMenuElem.style.left = `${mousePos.x}px`;
        dragBoxMenuElem.innerHTML = `
        <button id="saveSelection">Save Towers</button>
        <div id="selectionIdPrompt" style="display: none;">
            <input type="text" id="selectionId" placeholder="Selection ID..." />
            <small style="color: red; display: none;" id="selectionIdErrorMessage">That selection ID is already taken. Please try again.</small>
            <button id="saveSelectionIdPrompt">Save</button>
            <button id="exitSelectionIdPrompt">Exit</button>
        </div>
        <button id="saveRebuilder">Save Rebuilder</button>
        <button id="cancelDragBox">Cancel</button>
        `;
        document.body.appendChild(dragBoxMenuElem);
        document.getElementById("cancelDragBox").addEventListener("click", function() {
            dragBoxMenuElem.remove();
            dragBoxElem.remove();
            dragBoxMenuOpen = false;
        });
        document.getElementById("saveSelection").addEventListener("click", function() {
            document.getElementById("selectionIdPrompt").style.display = "block";
            document.getElementById("selectionId").value = "";
        });
        document.getElementById("saveSelectionIdPrompt").addEventListener("click", function() {
            const selectionId = document.getElementById("selectionId").value;
            if(savedSelections[selectionId]) {
                document.getElementById("selectionIdErrorMessage").style.display = "block";
            } else {
                const pos1 = game.renderer.screenToWorld(oldPos.x, oldPos.y);
                const pos2 = game.renderer.screenToWorld(newPos.x, newPos.y);
                const centerPos = {
                    x: (pos1.x + pos2.x) / 2,
                    y: (pos1.y + pos2.y) / 2
                };
                let towers = [];
                for(let uid in game.world.entities) {
                    const entity = game.world.entities[uid];
                    if(buildingModels.includes(entity.fromTick.model)) {
                        const building = entity.targetTick.position;
                        if(
                            building.x > Math.min(pos1.x, pos2.x) &&
                            building.x < Math.max(pos1.x, pos2.x) &&
                            building.y > Math.min(pos1.y, pos2.y) &&
                            building.y < Math.max(pos1.y, pos2.y)
                        ) {
                            towers.push({
                                tower: entity.fromTick.model,
                                x: building.x - centerPos.x,
                                y: building.y - centerPos.y,
                                tier: entity.targetTick.tier,
                                yaw: entity.targetTick.yaw
                            });
                        };
                    }
                };
                savedSelections[selectionId] = towers;
                dragBoxMenuElem.remove();
                dragBoxElem.remove();
                dragBoxMenuOpen = false;
            };
        });
        document.getElementById("selectionId").addEventListener("keydown", function(e) {
            if(e.keyCode == 13) {
                document.getElementById("saveSelectionIdPrompt").click();
            };
        });
        document.getElementById("exitSelectionIdPrompt").addEventListener("click", function() {
            document.getElementById("selectionIdPrompt").style.display = "none";
        });
        document.getElementById("saveRebuilder").addEventListener("click", function() {
            rebuilders[Math.floor(Math.random() * 10000)] = {
                from: game.renderer.screenToWorld(oldPos.x, oldPos.y),
                to: game.renderer.screenToWorld(newPos.x, newPos.y)
            };
            dragBoxMenuElem.remove();
            dragBoxElem.remove();
            dragBoxMenuOpen = false;
        });
        dragBoxMenuOpen = true;
    };
    mouseDown = false;
});
addEventListener('mousemove', function(e) {
    mousePos = { x: e.pageX, y: e.pageY };
    if(mouseDown && options.dragBox.enabled && !dragBoxMenuOpenWhenStarted) {
        dragBoxElem.style.top = `${Math.min(mousePos.y, lastMousePos.y)}px`;
        dragBoxElem.style.left = `${Math.min(mousePos.x, lastMousePos.x)}px`;
        dragBoxElem.style.width = `${Math.abs(mousePos.x - lastMousePos.x)}px`;
        dragBoxElem.style.height = `${Math.abs(mousePos.y - lastMousePos.y)}px`;
    };
});

let mouseX, mouseY;
addEventListener('mousemove', function(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

const tfkStyles = `
button, input, select {
    transition: 125ms all;
}
input {
    cursor: text;
}
a:hover, input:focus {
    opacity: 0.7;
}
::selection {
    background-color: gold;
}
.hud-intro-form, .hud-intro-guide {
    background: rgba(255, 215, 0, 0.3) !important;
    box-shadow: 0px 0px 20px 20px rgba(255, 215, 0, 0.2);
}
.btn {
    cursor: pointer;
}
.btn-24k {
    background-color: #d4af37;
    box-shadow: 0px 0px 10px 10px rgba(212, 175, 55, 0.7);
}
.btn-24k:hover {
    background-color: rgba(212, 175, 55, 0.7);
    box-shadow: 0px 0px 10px 10px rgba(212, 175, 55, 0.5);
}
div.customPage {
    color: whitesmoke;
    padding: 15px;
}
.hud-intro::before {
    background: url("https://wallpaperaccess.com/full/4645975.jpg") !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
}
#sidebar {
    width: auto;
    display: inline-block;
    background-color: #111;
    height: 100%;
    padding: 25px;
    text-align: center;
    border-radius: inherit;
    float: left;
    position: sticky;
    overflow: auto;
}
#content {
    color: whitesmoke;
    height: 100%;
    width: auto;
    border-radius: inherit;
    padding: 15px;
    overflow: auto;
}
#hud-menu-settings {
    padding: 0px !important;
}
* {
    font-family: Hammersmith One;
}
.nav-btn {
    width: 100%;
}
h1 {
    text-align: center;
}
select.default {
    padding: 10px;
    display: inline-block;
    width: auto;
    height: 40px;
    line-height: 34px;
    padding: 8px 14px;
    background: #eee;
    border: 2px solid #eee;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
}
input[type='checkbox'] {
    cursor: default;
    display: inline-block;
}
.hud-party-member {
    color: whitesmoke !important;
    border: 2px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.3);
}
.dragBox {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.3);
    border: 3px solid rgba(0, 0, 0, 0.1);
}
.dragBoxMenu {
    background-color: whitesmoke;
    border-radius: 5px;
    color: #111;
    transform: translate(-50%, -50%);
    position: absolute;
    padding: 3px;
    width: auto;
}
.dragBoxMenu > button, .dragBoxMenu > input {
    width: 100%;
    background-color: whitesmoke;
    border: none;
    border-radius: 2px;
    cursor: default;
    transition: none;
}
.dragBoxMenu > button:hover, .dragBoxMenu > input:focus {
    background-color: grey;
    color: whitesmoke;
}
.dragBoxMenu > input:focus::placeholder {
    color: whitesmoke;
}
#topRight {
    float: right;
}
.topRight {
    text-decoration: none;
    opacity: 0.7;
    color: whitesmoke;
    margin: 25px;
}
.topRight:hover {
    opacity: 0.9;
}
.btn-label {
    cursor: text;
}
input[type='text'].default {
    padding: 11px 14px;
    margin: 10px 0px 0px 0px;
    background: #eee;
    border: none;
    font-size: 14px;
    border-radius: 4px;
}
#playerPerspInput, #perspType {
    display: block;
    width: 150px;
    height: 40px;
    line-height: 34px;
    padding: 8px 14px;
    margin: 0 5px 10px;
    background: #eee;
    border: 0;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
}
#perspType {
    cursor: pointer;
}
#perspType, #playerPersp, #resetPersp {
    margin: 5px;
    margin-top: 10px;
}
#anchorBtns {
    margin-top: 5px;
}
#anchorBtns > button {
    z-index: 5;
    background-color: orange;
    border: none;
    color: whitesmoke;
}
.hud-bottom-left {
    transform: scale(1.25);
    margin-left: 45px;
    margin-bottom: 45px;
}
`;
document.body.insertAdjacentHTML("beforeend", `<style>${tfkStyles}</style>`);

const playButton = document.getElementsByClassName("hud-intro-play")[0];

playButton.classList.replace("btn-green", "btn-24k");

document.querySelectorAll('.ad-unit, .hud-intro-wrapper > h2, .hud-intro-form > label, .hud-intro-stone, .hud-intro-tree, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right').forEach(el => el.remove());

document.getElementsByClassName("hud-intro-footer")[0].innerHTML = `
<span>© 2022 ehScripts, Inc.</span>
`;
document.querySelector(".hud-intro-left > a").style.visibility = "hidden";

document.querySelector(".hud-intro-wrapper > h1").innerHTML = "24<small>k</small>";

const sm = document.querySelector("#hud-menu-settings");
// MENU START
const menuHTML = `
<div id="sidebar">
<h1>24k</h1>
<div id="navigation">
</div>
</div>
<div id="content">
</div>
`;
// MENU END
sm.innerHTML = menuHTML;

const navElem = document.getElementById("navigation");
const contentElem = document.getElementById("content");

let activePage = "home";

const download = (filename, text) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
};

let mouseMove,
    follow = true,
    mirror,
    grapplingHook,
    idle;

const pages = {
    "home": {
        name: "Home",
        html: `
<h1>24k</h1>
<p>Welcome to <b>24k!</b></p>
<hr />
<h3>Options</h3>
<br />
__OPTIONS__
<br />
<label style="display:inline-block;margin-right:10px;">Anchor: </label>
<div id="anchorBtns" style="display:inline-block;">
<button style=\"border-top-left-radius: 25%; border-bottom-left-radius: 25%; \">←</button><button>→</button><button>↑</button><button style=\"border-top-right-radius: 25%; border-bottom-right-radius: 25%; \">↓</button>
</div>
        `,
        replacements: [{
            old: "__OPTIONS__",
            new: () => {
                return Object.values(options).map(option => {
                    return `
                    <label>${option.name}: </label>
                    <select onchange="window.optUpdate('${option.id}', !!parseInt(this.value))">
                    <option value=1${option.enabled ? " selected" : ""}>On</option>
                    <option value=0${option.enabled ? "" : " selected"}>Off</option>
                    </select>
                    `;
                }).join("<br />");
            }
        }],
        script: `
    const AnchorButtons = document.getElementById("anchorBtns");
    const anchor = (dir) => {
        eval(\`anchor\${dir}Interval = setInterval(() => { game.network.sendInput({ \${dir.toLowerCase()}: 1 }); });\`)
    };

    const unanchor = (dir) => {
        eval(\`clearInterval(anchor\${dir}Interval);\`);
        game.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
    };
    AnchorButtons.childNodes[1].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Left");
        } else {
            this.style.backgroundColor = "";
            unanchor("Left");
        };
    });

    AnchorButtons.childNodes[2].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Right");
        } else {
            this.style.backgroundColor = "";
            unanchor("Right");
        };
    });

    AnchorButtons.childNodes[3].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Up");
        } else {
            this.style.backgroundColor = "";
            unanchor("Up");
        };
    });

    AnchorButtons.childNodes[4].addEventListener('click', function() {
        if(this.style.backgroundColor == "") {
            this.style.backgroundColor = "green";
            anchor("Down");
        } else {
            this.style.backgroundColor = "";
            unanchor("Down");
        };
    });
        `
    },
    "ws": {
        name: "Socket",
        html: `
<h1>WebSockets</h1>
<button class="btn btn-label">Alt Name: </button>
<select class="default" id="altName">
<optgroup label="Alt Name">
<option value="24k">24k</option>
<option value=0>Custom...</option>
</optgroup>
</select>
<input type="text" class="default" id="customName" placeholder="Custom name..." style="display: none;" />
<hr />
<button class="btn btn-green" id="sendWs">Send Alt</button>
<hr />
<h2>Active Alts</h2>
<label>Global Movement: </label><select id="movement"><optgroup label="Movement"><option value="mousemove"${mouseMove ? " selected" : ""}>MouseMove</option><option value="mirror"${mirror ? " selected" : ""}>Mirror</option><option value="follow"${follow ? " selected" : ""}>Follow</option><option value="grapplingHook"${grapplingHook ? " selected" : ""}>Grappling Hook</option><option value="idle"${idle ? " selected" : ""}>Idle</option></optgroup></select>
<hr />
<div id="alts">
__ALTS__
</div>
`,
        script: `
const selectName = document.getElementById("altName");
const inputName = document.getElementById("customName");
document.getElementById("sendWs").addEventListener("click", function() {
    window.sendWs(selectName.value, inputName.value);
});
selectName.addEventListener("change", function() {
    if(this.value == 0) {
        inputName.style.display = "block";
    } else {
        inputName.style.display = "none";
    };
});
    document.getElementById("movement").addEventListener("change", function() {
        const mms = this.value;
        mouseMove = mms == "mouseMove";
        mirror = mms == "mirror";
        follow = mms == "follow";
        idle = mms == "idle";
        grapplingHook = mms == "grapplingHook";
        for(const ws of Object.values(webSockets)) {
            ws.mouseMove = mouseMove;
            ws.mirror = mirror;
            ws.follow = follow;
            ws.grapplingHook = grapplingHook;
            ws.idle = idle;
            ws.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
        };
    });
`,
        replacements: [{
            old: "__ALTS__",
            new: () => Object.entries(webSockets).map(i => `<button class="btn btn-red" onclick="window.altMenu(${i[0]});">#${i[0]} ${i[1].name}</button>`).join("<br />")
        }]
    },
    "base": {
        name: "Base",
        html: `
<h1>Base</h1>
<h2>Misc. Options</h2>
<label>AHRC: </label><select><optgroup label="AHRC"><option value=1__AHRC1__>On</option></option><option value=0__AHRC0__>Off</option></optgroup></select></select>
<hr />
<h2>Waves</h2>
<label>AITO: </label><select id="aito"><optgroup label="AITO"><option value=1__AITO1__>On</option></option><option value=0__AITO0__>Off</option></optgroup></select><br />
<hr />
<h2>Score</h2>
<label>Player Trick: </label><select onchange="window.playerTrickToggle = !!parseInt(this.value);"><optgroup label="Player Trick"><option value=1__PTON__>On</option></option><option value=0__PTOFF__>Off</option></optgroup></select><br />
<label>SPW Logger: </label><select onchange="window.scoreLogger = !!parseInt(this.value);"><optgroup label="SPW Logger"><option value=1__SLON__>On</option></option><option value=0__SLOFF__>Off</option></optgroup></select>
<hr />
<h2>Saved Tower Selections</h2>
__SELECTIONS__
`,
        replacements: [{
            old: "__SELECTIONS__",
            new: () => {
                return Object.entries(savedSelections).map(i => {
                    return `<em>${i[0]}</em> - <strong>${i[1].length}</strong> towers <a href="javascript:void(0);" onclick="window.placeSelection('${i[0]}');" style="color: turquoise;">Place</a>&nbsp;<a href="javascript:void(0);" onclick="window.deleteSelection('${i[0]}');" style="color: red;">Delete</a>`;
                }).join("<br />");
            },
        }, {
            old: "__SLON__",
            new: () => window.scoreLogger ? " selected" : ""
        }, {
            old: "__SLOFF__",
            new: () => window.scoreLogger ? "" : " selected"
        }, {
            old: "__PTON__",
            new: () => window.playerTrickToggle ? " selected" : ""
        }, {
            old: "__PTOFF__",
            new: () => window.playerTrickToggle ? "" : " selected"
        }, {
            old: "__AITO1__",
            new: () => window.startaito ? " selected" : ""
        }, {
            old: "__AITO0__",
            new: () => window.startaito ? "" : " selected"
        }, {
            old: "__AHRC1__",
            new: () => window.AHRC ? "" : " selected"
        }, {
            old: "__AHRC0__",
            new: () => window.AHRC ? "" : " selected"
        }],
        script: `
   let aitoInput = document.getElementById("aito");
   const toggleAito = () => {
       window.startaito = !window.startaito;
       if(window.startaito) {
           window.sendAitoAlt();
       };
   };
   aitoInput.addEventListener("change", function() {
       toggleAito(true);
   });
        `
    },
    "raid": {
        name: "Raid",
        html: `<h1>Raid</h1>`
    },
    "render": {
        name: "Render",
        html: `
<h1>Render</h1>
<h2>Entity Perspective</h2>
<hr />
<input type="text" id="playerPerspInput" style="margin-right:10px;" placeholder="Player name..." class="hud-intro-name" /><button class="btn btn-blue" id="playerPersp" style="margin-top:6px;">Entity Perspective</button><button class="btn btn-red" id="resetPersp" style="margin-top:6px;">Reset View</button>
<select id="perspType"><option value="name" selected>Player Name</option><option value="uid">UID</option></select>
<h2>Player Viewport</h2>
<hr />
<label style="display:inline-block;margin-right:10px;">FreeCam?</label><input type="checkbox" id="freecam" style="display:inline-block;" />
<br />
<label style="display:inline-block;margin-right:10px;">Ghost?</label><input type="checkbox" id="Ghost" style="display:inline-block;" />
<br />
<label style="display:inline-block;margin-right:10px;">Lock Camera?</label><input type="checkbox" id="lockCam" style="display:inline-block;" />
        `,
        script: `
const PlayerPerspectiveInput = document.getElementById("playerPerspInput");
const PlayerPerspectiveButton = document.getElementById("playerPersp");
const PlayerPerspectiveResetButton = document.getElementById("resetPersp");
let playerPerspectiveType = "name";
    const lookAtPlayer = name => {
        Object.values(game.world.entities)
            .forEach((entity => {
            if (entity.entityClass === "PlayerEntity") {
                if (entity.targetTick.name === name) {
                    game.renderer.followingObject = entity;
                };
            };
        }));
    };

    const lookAtEntity = uid => {
        Object.values(game.world.entities)
            .forEach((entity => {
            if (entity.uid === uid) {
                game.renderer.followingObject = entity;
            };
        }));
    };
    PlayerPerspectiveButton.addEventListener('click', function (event) {
        if(playerPerspectiveType === "name") {
            let PlayerNameVal = PlayerPerspectiveInput.value;
            lookAtPlayer(PlayerNameVal);
        } else {
            let EntityUidVal = PlayerPerspectiveInput.value;
            lookAtEntity(parseInt(EntityUidVal));
        };
    });
    const restoreView = () => {
        lookAtPlayer(game.world.localPlayer.entity.targetTick.name);
    };
    PlayerPerspectiveResetButton.addEventListener('click', function (event) {
        restoreView();
    });

    const PerspectiveTypeSelect = document.getElementById("perspType");
    PerspectiveTypeSelect.addEventListener('change', function(event) {
        switch(this.value) {
            case "uid":
                PlayerPerspectiveInput.placeholder = "Entity UID...";
                break;
            case "name":
                PlayerPerspectiveInput.placeholder = "Player Name...";
                break;
        };
        playerPerspectiveType = this.value;
    });
    const GhostInput = document.getElementById("Ghost");
    const FreecamInput = document.getElementById("freecam");
    const LockInput = document.getElementById("lockCam");
    const onGhost = event => {
        game.world.localPlayer.entity.targetTick.position = game.renderer.screenToWorld(event.clientX, event.clientY);
    };

    const toggleGhost = checked => {
        if(!checked) {
            removeEventListener('mousemove', onGhost);
        } else {
            addEventListener('mousemove', onGhost);
        };
    };
    GhostInput.addEventListener('change', function() {
        toggleGhost(this.checked);
    });

    const moveCameraTo = (x, y) => {
        game.renderer.follow({ getPositionX: () => x, getPositionY: () => y }); // The game doesn't even check if its an entity lol
    };

    const onFreecam = event => {
        let worldPos = game.renderer.screenToWorld(event.clientX, event.clientY);
        moveCameraTo(worldPos.x, worldPos.y);
    };

    const toggleFreecam = checked => {
        if(!checked) {
            removeEventListener('mousemove', onFreecam);
            game.renderer.followingObject = game.world.localPlayer.entity;
        } else {
            addEventListener('mousemove', onFreecam);
        };
    };

    FreecamInput.addEventListener('change', function() {
        toggleFreecam(this.checked);
    });

    const lockCamera = () => {
        let xSave = game.world.localPlayer.entity.getPositionX();
        let ySave = game.world.localPlayer.entity.getPositionY();
        window.lockCameraInterval = setInterval(() => {
            moveCameraTo(xSave, ySave);
        });
    };

    const unlockCamera = () => {
        clearInterval(window.lockCameraInterval);
        game.renderer.follow(game.world.localPlayer.entity);
    };

    LockInput.addEventListener('change', function() {
        if(this.checked) {
            lockCamera();
        } else {
            unlockCamera();
        };
    });

        `
    }
};

const updateNav = () => {
    navElem.innerHTML = "";
    let contentHTML = pages[activePage].html;
    if(pages[activePage].replacements) {
        for(let replacement of pages[activePage].replacements) {
            contentHTML = contentHTML.replaceAll(replacement.old, replacement.new());
        };
    };
    contentElem.innerHTML = contentHTML;
    eval(pages[activePage].script);
    for(let id in pages) {
        let page = pages[id];
        navElem.innerHTML += `
        <hr />
        <button class="btn nav-btn${id == activePage ? " btn-24k" : ""}" id="btn-${id}">${page.name}</button>
        `;
    };
    for(let id in pages) {
        document.getElementById(`btn-${id}`).addEventListener('click', function() {
            activePage = id;
            updateNav();
        });
    };
};

updateNav();

const hideMenu = () => {
    document.getElementById("hud-menu-settings").style.display = "none";
};

window.placeSelection = id => {
    hideMenu();
    game.ui.components.PlacementOverlay.addMouseOverlay(savedSelections[id]);
    placingSelection = true;
    placingSelectionId = id;
};

window.deleteSelection = id => {
    delete savedSelections[id];
    updateNav();
};

window.refreshPg = () => {
    updateNav();
};

const placementOverlay = game.ui.components.PlacementOverlay;

game.ui.components.PlacementOverlay.overlayEntities = [];

game.ui.components.PlacementOverlay.addMouseOverlay = function (towers) {
    placementOverlay.buildingId && placementOverlay.cancelPlacing();
    placementOverlay.overlayEntities = [];

    const schema = game.ui.getBuildingSchema();

    for (let tower of towers) {
        const mouseWorldPos = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
        const buildingType = schema[tower.tower],
              placeholderEntity = Game.currentGame.assetManager.loadModel(buildingType.modelName, {});
        placeholderEntity.setAlpha(0.5);
        placeholderEntity.setRotation(tower.yaw);
        placeholderEntity.setPosition(0, 0);
        placeholderEntity.towerOffset = { x: tower.x, y: tower.y };
        placeholderEntity.tower = tower.tower;

        Game.currentGame.renderer.ui.addAttachment(placeholderEntity);
        placementOverlay.overlayEntities.push(placeholderEntity);
    };
};

const webSockets = {};
let wsId = 0;

window.sendWs = (name, custom) => {
    name == 0 && (name = custom);
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:443`);
        ws.binaryType = 'arraybuffer';

        ws.onopen = (data) => {
            ws.network = new game.networkType();

            ws.network.sendPacket = (_event, _data) => {
                ws.send(ws.network.codec.encode(_event, _data));
            };

            ws.playerTick = {};

            ws.onRpc = (data) => {
                switch(data.name){
                    case 'Dead':
                        ws.network.sendPacket(3, { respawn: 1 });
                        break;
                };
            };

            ws.mouseMove = mouseMove;
            ws.mirror = mirror;
            ws.follow = follow;
            ws.grapplingHook = grapplingHook;

            ws.gameUpdate = () => {
                ws.moveToward = (position) => {
                    let x = Math.round(position.x);
                    let y = Math.round(position.y);

                    let myX = Math.round(ws.playerTick.position.x);
                    let myY = Math.round(ws.playerTick.position.y);

                    let offset = 100;

                    if (-myX + x > offset) ws.network.sendInput({ left: 0 }); else ws.network.sendInput({ left: 1 });
                    if (myX - x > offset) ws.network.sendInput({ right: 0 }); else ws.network.sendInput({ right: 1 });

                    if (-myY + y > offset) ws.network.sendInput({ up: 0 }); else ws.network.sendInput({ up: 1 });
                    if (myY - y > offset) ws.network.sendInput({ down: 0 }); else ws.network.sendInput({ down: 1 });
                };
                if(ws.mouseMove) {
                    ws.moveToward(game.renderer.screenToWorld(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y));
                };
                if(ws.follow) {
                    ws.moveToward(game.ui.playerTick.position);
                };
            };

            ws.onmessage = msg => {
                if (new Uint8Array(msg.data)[0] == 5){
                    game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                    let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                    ws.send(ws.network.codec.encode(4, { displayName: name, extra: data.extra}));
                    return;
                };

                ws.data = ws.network.codec.decode(msg.data);
                switch(ws.data.opcode) {
                    case 0:
                        for (let entityType in ws.data.entities[ws.playerTick.uid]) {
                            if (entityType === 'uid') continue;
                            ws.playerTick[entityType] = ws.data.entities[ws.playerTick.uid][entityType];
                        }

                        ws.gameUpdate();
                        break;
                    case 4:
                        ws.send(iframeWindow.game.network.codec.encode(6, {}));
                        iframe.remove();

                        ws.playerTick.uid = ws.data.uid;
                        ws.name = name;
                        (ws.joinMainParty = () => { ws.network.sendRpc({ name: "JoinPartyByShareKey", partyShareKey: game.ui.playerPartyShareKey }); })();
                        wsId++;
                        ws.id = wsId;
                        webSockets[wsId] = ws;
                        updateNav();
                        break;
                    case 9:
                        ws.onRpc(ws.data);
                        break;
                }
            }

            ws.onclose = e => {
                iframe.remove();
            };
        };
    });
};

const turnTowards = (x, y) => {
    let worldPos = game.renderer.worldToScreen(x, y);
    game.inputManager.emit('mouseMoved', { clientX: worldPos.x, clientY: worldPos.y });
};

let blockedNames = [];

window.blockPlayer = name => {
    game.ui.components.PopupOverlay.showConfirmation(`Are you sure you want to block ${name}?`, 3500, () => {
        blockedNames.push(name);
        for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
            if(msg.childNodes[2].innerText === name) {
                let bl = msg.childNodes[0];
                bl.innerHTML = "Unblock";
                bl.style.color = "red";
                bl.onclick = () => {
                    window.unblockPlayer(name);
                };
            };
        };
    }, () => {});
};

const getClock = () => {
    var date = new Date();
    var d = date.getDate();
    var d1 = date.getDay();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds()
    var session = "PM";

    if(h == 2){
        h = 12;
    };

    if(h < 13) {
        session = "AM"
    };
    if(h > 12){
        session = "PM";
        h -= 12;
    };

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    return `${h}:${m} ${session}`;
}

const kickAll = () => {
    for (let i in game.ui.playerPartyMembers) {
        if (game.ui.playerPartyMembers[i].playerUid == game.ui.playerTick.uid) continue;
        game.network.sendRpc({
            name: "KickParty",
            uid: game.ui.playerPartyMembers[i].playerUid
        });
    };
};

const joinAll = () => {
    for(let socket of webSockets) {
        if(!socket.removed) {
            for (let sck of webSockets) sck.joinMainParty();
        };
    };
};

let isDay,
    tickStarted,
    tickToEnd,
    hasKicked = false,
    hasJoined = false;

game.network.addEntityUpdateHandler(tick => {
    if(window.playerTrickToggle) {
        if (!hasKicked) {
            if (tick.tick >= tickStarted + 22 * (1000 / game.world.replicator.msPerTick)) {
                kickAll();
                hasKicked = true;
            };
        };
        if (!hasJoined) {
            if (tick.tick >= tickStarted + 118 * (1000 / game.world.replicator.msPerTick)) {
                joinAll();
                hasJoined = true;
            };
        };
    };
});

game.network.addRpcHandler("DayCycle", e => {
    if(window.playerTrickToggle) {
        isDay = !!e.isDay;
        if (!isDay) {
            tickStarted = e.cycleStartTick;
            tickToEnd = e.nightEndTick;
            hasKicked = false;
            hasJoined = false;
        };
    };
});

window.unblockPlayer = name => {
    blockedNames.splice(blockedNames.indexOf(name), 1);
    for(let msg of Array.from(document.getElementsByClassName("hud-chat-message"))) {
        if(msg.childNodes[2].innerText === name) {
            let bl = msg.childNodes[0];
            bl.innerHTML = "Block";
            bl.style.color = "red";
            bl.onclick = () => {
                window.blockPlayer(name);
            };
        };
    };
};

let oldScore = 0,
    newScore = 0;
Game.currentGame.network.addRpcHandler("DayCycle", () => {
    if (game.ui.components.DayNightTicker.tickData.isDay == 0 && window.scoreLogger) {
        newScore = game.ui.playerTick.score;
        game.network.sendRpc({ name:"SendChatMessage", message: `Wave: ${game.ui.playerTick.wave}, Score: ${(newScore - oldScore).toLocaleString("en")}`, channel: "Local" })
        oldScore = game.playerTick.score;
    };
});

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    if(blockedNames.includes(msg.displayName) || window.chatDisabled) { return; };
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = msg.displayName.replaceAll(/<(?:.|\n)*?>/gm, ''),
        c = msg.message.replaceAll(/<(?:.|\n)*?>/gm, '')
    if(c.startsWith("MjRr")) {
        // Encoded chat feature (finish in beta pls)
        const encodedMsg = atob(msg.message.slice(4)).split("").map(i => String.fromCharCode(i.charCodeAt(0) + 20)).join("");
        c = encodedMsg;
    };
    let d = a.ui.createElement(`<div class="hud-chat-message"><a href="javascript:void(0);" onclick="window.blockPlayer(\`${b.replaceAll(">", "").replaceAll("`", "").replaceAll(")", "").replaceAll("(", "")}\`)" style="color: red;">Block</a> <strong>${b}</strong> <small> at ${getClock()}</small>: ${c}</div>`);
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);

window.altMenu = altId => {
    const ws = webSockets[altId];
    document.getElementById(`btn-${activePage}`).classList.remove("btn-24k");
    activePage = null;
    contentElem.innerHTML = `
    <h1>#${altId} ${ws.name}</h1>
    <label>Movement: </label><select id="movement"><optgroup label="Movement"><option value="mousemove"${ws.mouseMove ? " selected" : ""}>MouseMove</option><option value="mirror"${ws.mirror ? " selected" : ""}>Mirror</option><option value="follow"${ws.follow ? " selected" : ""}>Follow</option><option value="grapplingHook"${ws.grapplingHook ? " selected" : ""}>Grappling Hook</option><option value="idle"${ws.idle ? " selected" : ""}>Idle</option></optgroup></select>
    <hr />
    <button id="deleteAlt" class="btn btn-red">Delete Alt</button>
    `;
    document.getElementById("movement").addEventListener("change", function() {
        const mms = this.value;
        ws.mouseMove = mms == "mousemove";
        ws.mirror = mms == "mirror";
        ws.follow = mms == "follow";
        ws.grapplingHook = mms == "grapplingHook";
        ws.idle = mms == "idle";
        ws.network.sendInput({ left: 0, right: 0, up: 0, down: 0 });
    });
    document.getElementById("deleteAlt").addEventListener("click", function() {
        ws.close();
        delete webSockets[ws.id];
        activePage = "ws";
        updateNav();
    });
};

const moveTowards = (targetX, targetY, movesMade) => {
    let player = game.world.localPlayer.entity.targetTick.position;
    if (player.x <= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 0,
            down: 1
        });
    } else if (player.x >= targetX && player.y <= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 0,
            down: 1
        });
    } else if (player.x <= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 1,
            left: 0,
            up: 1,
            down: 0
        });
    } else if (player.x >= targetX && player.y >= targetY) {
        game.network.sendInput({
            right: 0,
            left: 1,
            up: 1,
            down: 0
        });
    };
    turnTowards(targetX, targetY);
    return movesMade + 1;
};

addEventListener('contextmenu', function(e) {
    e.preventDefault();
    let pos = game.renderer.screenToWorld(mouseX, mouseY);
    if(options.grapplingHook.enabled) {
        let grapplInterval = setInterval(() => {
            moveTowards(pos.x, pos.y, 0);
        }, 100);
        setTimeout(() => {
            game.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
            clearInterval(grapplInterval);
        }, 1800);
    };
    for(const id in webSockets) {
        const ws = webSockets[id];
        if(ws.grapplingHook) {
            let grapplInterval = setInterval(() => {
                ws.moveToward(pos);
            }, 100);
            setTimeout(() => {
                ws.network.sendInput({ right: 0, left: 0, up: 0, down: 0 });
                clearInterval(grapplInterval);
            }, 1800);
        };
    };
});

window.sendAitoAlt = () => {
    let iframe = document.createElement('iframe');
    iframe.src = 'https://zombs.io';
    iframe.style.display = 'none';
    document.body.append(iframe);

    let iframeWindow = iframe.contentWindow;
    iframe.addEventListener("load", () => {
        let connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];
        iframeWindow.game.network.connectionOptions = connectionOptions;
        iframeWindow.game.network.connected = true;
        connectionOptions = game.network.connectionOptions ?? game.options.servers[document.getElementsByClassName('hud-intro-server')[0].value];

        let ws = new WebSocket(`wss://${connectionOptions.hostname}:443`);

        ws.binaryType = "arraybuffer";

        ws.onclose = () => {
            ws.isclosed = true;
        };

        ws.onmessage = msg => {
            if (new Uint8Array(msg.data)[0] == 5){
                game.network.codec.decodePreEnterWorldResponse = buffer => buffer;

                let data = iframeWindow.game.network.codec.decodePreEnterWorldResponse(game.network.codec.decode(msg.data));

                ws.network = new game.networkType();
                ws.send(ws.network.codec.encode(4, { displayName: "24K AITO", extra: data.extra}));

                ws.network.sendPacket = (_event, _data) => {
                    ws.send(ws.network.codec.encode(_event, _data));
                };
                return;
            };

            ws.data = ws.network.codec.decode(msg.data);

            if (ws.data.uid) {
                ws.uid = ws.data.uid;
            };

            if (ws.data.name) {
                ws.dataType = ws.data;
            };

            if (!window.startaito && !ws.isclosed) {
                ws.isclosed = true;

                ws.close();
            };

            if (ws.verified) {
                if (!ws.isDay && !ws.isclosed) {
                    ws.isclosed = true;

                    ws.close();

                    window.sendAitoAlt();
                };
            };

            if (ws.data.name == "DayCycle") {
                ws.isDay = ws.data.response.isDay;

                if (ws.isDay) {
                    ws.verified = true;
                };
            };

            if (ws.data.name == "Dead") {
                ws.network.sendRpc({
                    respawn: 1
                });
            };

            if (ws.data.name == "Leaderboard") {
                ws.lb = ws.data;

                if (ws.psk) {
                    ws.network.sendRpc({
                        name: "JoinPartyByShareKey",
                        partyShareKey: game.ui.getPlayerPartyShareKey()
                    });

                    if (ws.psk.response.partyShareKey == game.ui.getPlayerPartyShareKey()) {
                        ws.network.sendRpc({
                            name: "BuyItem",
                            itemName: "Pause",
                            tier: 1
                        });
                    };
                };
            };

            if (ws.data.name == "PartyShareKey") {
                ws.psk = ws.data;
            };
        };
    });
};

let ahrcInterval = setInterval(() => {
    if(window.AHRC) {
        for(const uid in game.world.entities) {
            const obj = game.world.entities[uid];
            if(obj.fromTick.model == "Harvester") {
                game.network.sendRpc({
                    name: "AddDepositToHarvester",
                    uid: uid,
                    deposit: 500
                });
                game.network.sendRpc({
                    name: "CollectHarvester",
                    uid: uid
                });
            };
        };
    };
}, 20);

const fullRSS = () => {
    if(!options.frss.enabled) { return; };
    let resources = ["wood", "stone", "gold"];
    let pt = game.ui.playerTick;
    let rc = game.ui.components.Resources;
    for(let i = 0; i < resources.length; i++) {
        let rs = resources[i];
        rc[`${rs}Elem`].innerHTML = Math.round(pt[rs]).toLocaleString("en");
    };
    rc.tokensElem.innerHTML = Math.round(pt.token).toLocaleString("en");
};

game.network.addEnterWorldHandler(() => {
    game.ui.addListener('playerTickUpdate', fullRSS);
});

game.network.sendPacket2 = game.network.sendPacket;
game.network.sendPacket = (opcode, packet) => {
    if(opcode == 3) {
        for(const ws of Object.values(webSockets)) {
            if(ws.mirror) {
                ws.network.sendInput(packet);
            };
        };
    };
    game.network.sendPacket2(opcode, packet);
};