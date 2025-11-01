// Fill #playground-presets-form
const playgroundPresetsElements = document.querySelectorAll("#playground-presets-fallback h3, #playground-presets-fallback h4, #playground-presets-fallback pre");
let lastFieldset = null;
let nextInputHTML = "";
let nextInputValue = "";
const playgroundCode = {};
for(let i = 0; i < playgroundPresetsElements.length; i++) {
    const tagName = playgroundPresetsElements[i].tagName.toLowerCase();
    if(tagName == "h3") {
        // Start new fieldset
        if(lastFieldset != null) document.getElementById("playground-presets-form").append(lastFieldset);
        lastFieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.innerHTML = playgroundPresetsElements[i].innerHTML;
        lastFieldset.append(legend);
    } else if(tagName == "h4") {
        // Name new input
        nextInputHTML = playgroundPresetsElements[i].innerHTML;
        if(playgroundPresetsElements[i].id.substring(0, 18) != "playground-preset-") throw new Error("Editor preset fallback has a h4 element with a non playground-preset-name id ('"+playgroundPresetsElements[i].id+"')");
        nextInputValue = playgroundPresetsElements[i].id.substring(18); // Remove playground-preset-
    } else if(tagName == "pre") {
        if(nextInputHTML == "") throw new Error("Editor preset fallback has a pre element before its h4 title");
        if(lastFieldset == null) throw new Error("Editor preset fallback has a pre element before its category's h3 title");
        // Add new input
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "preset";
        input.value = nextInputValue;
        label.append(input);
        label.innerHTML += nextInputHTML;
        lastFieldset.append(label);
        const br = document.createElement("br");
        lastFieldset.append(br);
        playgroundCode[nextInputValue] = playgroundPresetsElements[i].textContent;
    }
}

if(lastFieldset != null) document.getElementById("playground-presets-form").append(lastFieldset);
document.querySelector("#playground-presets-form input").checked = true; // Select first playground

document.getElementById("playground-presets-form").style.display = "block";
document.getElementById("playground-presets-fallback").style.display = "none";
// #playground-preset- will fill that playground
function checkHash() {
    if(window.location.hash.substring(0, 19) == "#playground-preset-") {
        let preset = document.location.hash.substring(19);
        document.querySelector("#playground-presets-form input[value="+preset+"]").click(); // Preset alphanumeric so no need to escape
        document.getElementById("playground-presets-form").scrollIntoView();
    }
}
checkHash();
window.addEventListener("load", function() {
    const anchorElems = document.querySelectorAll("a");
    for(let i = 0; i < anchorElems.length; i++) {
        anchorElems[i].addEventListener("click", function(event) {
            if(event.ctrlKey) return true; // Open in new tab
            window.location.href = this.href; // Follow link
            checkHash(); // If still here check hash
            return false; // Prevent normal link behaviour
        });
    }
});

codeInput.registerTemplate("playground-in", new codeInput.templates.Hljs(hljs, [
    // Keystrokes
    new codeInput.plugins.Indent(true, 4),
    new codeInput.plugins.AutoCloseBrackets({"<": ">", '"': '"'}),
    // Code tools
    new codeInput.plugins.FindAndReplace(),
    new codeInput.plugins.GoToLine(),
]));
function updateDemo() {
    document.getElementById("playground-out").style.display = "block";
    const lastSrc = document.getElementById('playground-out').src;
    if(lastSrc !== "data:text/html,Loading") {
        URL.revokeObjectURL(lastSrc); // Reduces memory usage
    }
    document.getElementById('playground-out').src = URL.createObjectURL(new Blob([document.getElementById('playground-in').value], {type: "text/html"}));
}
function loadDemo(name) {
    document.getElementById('playground-in').value = playgroundCode[name]; // From playgrounds.js
    // Don't update demo here so external resources not loaded until user accepts
    if(!document.getElementById('playground-message').open) updateDemo();
}
loadDemo(new FormData(document.getElementById("playground-presets-form")).get("preset"));
    document.getElementById("playground-presets-form").addEventListener("change", function() {
    loadDemo(new FormData(document.getElementById("playground-presets-form")).get("preset"));
});
