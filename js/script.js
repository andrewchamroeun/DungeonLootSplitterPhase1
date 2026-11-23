// The array is the single source of truth for all loot added during this visit.
const lootItems = [];

const partySizeInput = document.getElementById("party-size");
const lootNameInput = document.getElementById("loot-name");
const lootValueInput = document.getElementById("loot-value");
const lootList = document.getElementById("loot-list");
const listTotal = document.getElementById("list-total");
const splitTotal = document.getElementById("split-total");
const perMember = document.getElementById("per-member");
const addMessage = document.getElementById("add-message");
const splitMessage = document.getElementById("split-message");
const addLootButton = document.getElementById("add-loot-button");
const splitLootButton = document.getElementById("split-loot-button");

// Recalculate from the array each time instead of storing a second total.
function calculateTotal() {
    let total = 0;

    for (let i = 0; i < lootItems.length; i++) {
        total += lootItems[i].value;
    }

    return total;
}

function renderLoot() {
    lootList.innerHTML = "";

    if (lootItems.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state";
        emptyItem.textContent = "No loot has been added yet.";
        lootList.appendChild(emptyItem);
    } else {
        for (let i = 0; i < lootItems.length; i++) {
            const listItem = document.createElement("li");
            listItem.textContent =
                lootItems[i].name + " — $" + lootItems[i].value.toFixed(2);
            lootList.appendChild(listItem);
        }
    }

    listTotal.textContent = "$" + calculateTotal().toFixed(2);
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "message " + type;
}

function addLoot() {
    const name = lootNameInput.value.trim();
    const rawValue = lootValueInput.value;
    const value = Number(rawValue);

    if (name === "") {
        showMessage(addMessage, "Please enter a loot name.", "error");
        lootNameInput.focus();
        return;
    }

    if (rawValue === "" || !Number.isFinite(value) || value < 0) {
        showMessage(addMessage, "Enter a valid loot value of $0.00 or more.", "error");
        lootValueInput.focus();
        return;
    }

    // Store each valid item as an object with a name and numeric value.
    lootItems.push({
        name: name,
        value: Math.round(value * 100) / 100
    });

    renderLoot();
    showMessage(addMessage, name + " was added to the loot list.", "success");
    lootNameInput.value = "";
    lootValueInput.value = "";
    lootNameInput.focus();

    // Clear old split results so they cannot be mistaken for the new total.
    splitTotal.textContent = "$" + calculateTotal().toFixed(2);
    perMember.textContent = "$0.00";
    splitMessage.textContent = "";
    splitMessage.className = "message";
}

function splitLoot() {
    const rawPartySize = partySizeInput.value;
    const partySize = Number(rawPartySize);

    if (rawPartySize === "" || !Number.isInteger(partySize) || partySize < 1) {
        showMessage(splitMessage, "Enter a whole-number party size of at least 1.", "error");
        partySizeInput.focus();
        return;
    }

    if (lootItems.length === 0) {
        showMessage(splitMessage, "Add at least one loot item before splitting.", "error");
        return;
    }

    const total = calculateTotal();
    // Work in cents to avoid floating-point rounding issues during the split.
    const totalCents = Math.round(total * 100);
    const baseShare = Math.floor(totalCents / partySize);
    const remainder = totalCents % partySize;
    const share = baseShare + (remainder / partySize);

    splitTotal.textContent = "$" + (totalCents / 100).toFixed(2);
    perMember.textContent = "$" + (share / 100).toFixed(2);
    showMessage(splitMessage, "Loot split calculated for " + partySize + " party member(s).", "success");
}

addLootButton.addEventListener("click", addLoot);
splitLootButton.addEventListener("click", splitLoot);

// Show the initial empty list and zero total when the page first loads.
renderLoot();
