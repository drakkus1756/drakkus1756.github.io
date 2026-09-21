const formatter = new Intl.NumberFormat("en-US");

function calculate() {
    let reqLevel = parseInt(document.getElementById("req_level").value);
    let autoStarforce = document.getElementById("auto_starforce").selectedIndex;
    let nxCost = document.getElementById("nx_cost").selectedIndex;
    let currentStars = parseInt(document.getElementById("current_stars").value);
    let targetStars = parseInt(document.getElementById("target_stars").value);
    let lowestChance = parseInt(document.getElementById("lowest_success_chance").value);
    let numTrials = parseInt(document.getElementById("num_trials").value);
    let outputs = [document.getElementById("calculation_15000"), document.getElementById("calculation_300000"), document.getElementById("calculation_750000"), document.getElementById("calculation_3000000")]

    let upgradeCosts = [15000, 300000, 750000, 3000000];
    let upgradeChances = [];
    if (autoStarforce) {
        upgradeChances = [lowestChance - 5, lowestChance + 5, lowestChance + 15, lowestChance + 25]
    }
    else {
        upgradeChances = [lowestChance, lowestChance + 10, lowestChance + 20, lowestChance + 30]
    }

    if (nxCost == 0) {
        // Do something here later
    }

    let outputString = "";

    for (let i = 0; i < upgradeCosts.length; i++) {
        let totalNxCost = 0;
        let totalMesoCost = 0;

        for (let j = 0; j < numTrials; j++) {
            let upgradedStars = currentStars;
            while (upgradedStars < targetStars) {
                totalNxCost += upgradeCosts[i];
                totalMesoCost += GetMesoCost(reqLevel, upgradedStars);

                if ((Math.floor(Math.random() * 100) + 1) <= upgradeChances[i] - ((upgradedStars - currentStars) * 5)) {
                    // Success!
                    upgradedStars += 1;
                } else {
                    // Failed!
                    // If current stars is divisible by 5, won't downgrade
                    if (upgradedStars % 5 != 0) {
                        upgradedStars -= 1;
                    }
                }
            }
        }
        
        const costStr = formatter.format(upgradeCosts[i]).padStart(9, ' ');
        const nxStr = formatter.format(Math.round(totalNxCost/numTrials)).padStart(12, ' ');
        const mesoStr = formatter.format(Math.round(totalMesoCost/numTrials)).padStart(14, ' ');
        outputString += `${costStr} NX: NX cost: ${nxStr} | Meso cost: ${mesoStr}\n`;
    }
    document.getElementById("output-window").textContent = outputString;
}

function GetMesoCost(reqLevel, currentStars) {
    if (currentStars < 10) {
        return 1000 + reqLevel ** 3 * (currentStars + 1) / 25
    } else if (currentStars < 15) {
        return 1000 + reqLevel ** 3 * (currentStars + 1) ** 2.7 / 400
    } else {
        return 1000+ reqLevel ** 3 * (currentStars + 1) ** 2.7 / 200
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate_button").addEventListener("click", function () {
        calculate();
    });
});