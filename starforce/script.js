function calculate() {
    let reqLevel = parseInt(document.getElementById("req_level").value);
    let autoStarforce = document.getElementById("auto_starforce").selectedIndex;
    let nxCost = document.getElementById("nx_cost").selectedIndex;
    let currentStars = parseInt(document.getElementById("current_stars").value);
    let targetStars = parseInt(document.getElementById("target_stars").value);
    let numTrials = parseInt(document.getElementById("num_trials").value);

    let upgradeCosts = [15000, 300000, 750000, 3000000];

    let outputString = "";

    // Cap targetStars to 25
    targetStars = Math.min(targetStars, 25);

    // Clamp currentStars to 0-24
    currentStars = Math.max(0, Math.min(currentStars, 24));

    if (targetStars <= currentStars) {
        targetStars = currentStars + 1;
    }

    // Update current/target stars
    document.getElementById("current_stars").value = currentStars;
    document.getElementById("target_stars").value = targetStars;

    if (nxCost == 0) {
        // Simulate all options
        for (let i = 0; i < upgradeCosts.length; i++) {
            outputString += simulateUpgrades(reqLevel, autoStarforce, currentStars, targetStars, numTrials, upgradeCosts[i], i);
        }
    } else {
        outputString += simulateUpgrades(reqLevel, autoStarforce, currentStars, targetStars, numTrials, upgradeCosts[nxCost - 1], nxCost - 1);
    }

    document.getElementById("output-window").textContent = outputString;
}

function simulateUpgrades(reqLevel, autoStarforce, currentStars, targetStars, numTrials, upgradeCost, nxOption) {
    const formatter = new Intl.NumberFormat("en-US");
    let totalNxCost = 0;
    let totalMesoCost = 0;
    let totalAttempts = 0;

    for (let j = 0; j < numTrials; j++) {
        let upgradedStars = currentStars;
        let failStreak = 0;
        while (upgradedStars < targetStars) {
            totalNxCost += upgradeCost;
            totalMesoCost += getMesoCost(reqLevel, upgradedStars);
            totalAttempts++;

            let upgradeChance = getUpgradeChance(upgradedStars, autoStarforce, nxOption);

            if (failStreak >= 2 || (Math.floor(Math.random() * 100) + 1) <= upgradeChance) {
                // Success!
                upgradedStars++;
                failStreak = 0;
            } else {
                // Failed!
                // If current stars is divisible by 5, won't downgrade
                if (upgradedStars % 5 != 0) {
                    upgradedStars--;
                }
                failStreak++;
            }
        }
    }
    
    const costStr = formatter.format(upgradeCost).padStart(9, ' ');
    const nxStr = formatter.format(Math.round(totalNxCost/numTrials)).padStart(11, ' ');
    const mesoStr = formatter.format(Math.round(totalMesoCost/numTrials)).padStart(14, ' ');
    const attemptsStr = formatter.format(Math.round(totalAttempts/numTrials)).padStart(3, ' ');
    return `${costStr} - NX: ${nxStr} | Meso: ${mesoStr} | Attempts: ${attemptsStr}\n`;
}

function getUpgradeChance(currentStars, autoStarforce, nxOption) {
    // manual @ 15000 NX - will be currentStars - 1
    const upgradeChances = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 45, 45, 40, 40, 40, 40, 35, 35, 35, 35, 30, 20];
    let upgradeChance = upgradeChances[currentStars - 1];
    if (autoStarforce) {
        upgradeChance -= 5;
    }
    
    return upgradeChance + 10 * nxOption;
}

function getMesoCost(reqLevel, currentStars) {
    if (currentStars < 10) {
        return 1000 + reqLevel ** 3 * (currentStars + 1) / 25;
    } else if (currentStars < 15) {
        return 1000 + reqLevel ** 3 * (currentStars + 1) ** 2.7 / 400;
    } else {
        return 1000 + reqLevel ** 3 * (currentStars + 1) ** 2.7 / 200;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calculate_button").addEventListener("click", function () {
        calculate();
    });
});