var coins = 100;
var betAmount = 1;
var minBet = 1;
var maxBet = 10;
var symbols = generateSymbols();

document.getElementById('coin-count').innerText = coins;

document.getElementById('min-bet').addEventListener('click', function() {
    betAmount = minBet;
    showNotification('Bet amount set to Min Bet: ' + betAmount);
});

document.getElementById('max-bet').addEventListener('click', function() {
    betAmount = maxBet;
    showNotification('Bet amount set to Max Bet: ' + betAmount);
});

document.getElementById('spin').addEventListener('click', function() {
    if (coins < betAmount) {
        showNotification('Not enough coins!');
        return;
    }
    coins -= betAmount;
    document.getElementById('coin-count').innerText = coins;
    spinSlots();
});

function spinSlots() {
    var slotElements = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3'), document.getElementById('slot4')// New Slot
    ];
    var finalSymbols = [null, null, null, null];
    // Updated to four slots
    var spinning = [true, true, true, true];
    // Updated to four slots

    var spinTimes = [1000, 1500, 2000, 2500];
    // Spin durations for each slot

    // Start spinning animations
    slotElements.forEach(function(slot, index) {
        slot.classList.add('spinning');
        let spinInterval = setInterval(function() {
            var randomSymbol = getRandomSymbol(symbols);
            displaySymbol(slot.id, randomSymbol);
        }, 100);

        // Stop spinning after spinTime
        setTimeout(function() {
            clearInterval(spinInterval);
            slot.classList.remove('spinning');
            var symbol = getRandomSymbol(symbols);
            finalSymbols[index] = symbol;
            displaySymbol(slot.id, symbol);
            spinning[index] = false;

            // Check if all slots have stopped spinning
            if (spinning.every(function(s) {
                return s === false;
            })) {
                // Determine winnings
                var winnings = calculateWinnings(finalSymbols);

                if (winnings > 0) {
                    coins += winnings;
                    document.getElementById('coin-count').innerText = coins;
                    showNotification('You win ' + winnings + ' coins!');
                } else {
                    showNotification('No win. Try again!');
                }
            }
        }, spinTimes[index]);
    });
}

function showNotification(message) {
    var notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;

    notification.addEventListener('click', function() {
        notification.remove();
    });

    document.body.appendChild(notification);

    // Automatically remove after 5 seconds
    setTimeout(function() {
        notification.remove();
    }, 5000);
}

function generateSymbols() {
    var symbols = [];

    var suits = {
        'Cups': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14'],
        'Pentacles': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'],
        'Swords': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14'],
        'Wands': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '13', '14']
    };

    for (var suit in suits) {
        var numbers = suits[suit];
        for (var i = 0; i < numbers.length; i++) {
            var number = numbers[i];
            var imageName = suit + number + '.png';
            symbols.push({
                name: suit + number,
                suit: suit,
                number: number,
                image: 'images/' + imageName
            });
        }
    }

    return symbols;
}

function getRandomSymbol(symbols) {
    var index = Math.floor(Math.random() * symbols.length);
    return symbols[index];
}

function displaySymbol(slotId, symbol) {
    var slot = document.getElementById(slotId);
    slot.innerHTML = '<img src="' + symbol.image + '" alt="' + symbol.name + '" />';
    slot.dataset.symbolName = symbol.name;
}

function calculateWinnings(symbols) {
    var winnings = 0;

    // Extract suits and names from symbols
    var suits = symbols.map(function(sym) {
        return sym.suit;
    });
    var names = symbols.map(function(sym) {
        return sym.name;
    });

    var uniqueNames = new Set(names);
    var uniqueSuits = new Set(suits);

    if (uniqueNames.size === 1) {
        // All four cards are identical - Jackpot!
        winnings = betAmount * 50;
    } else if (uniqueSuits.size === 1) {
        // All four suits match
        winnings = betAmount * 20;
    } else if (uniqueNames.size === 2 && (names.filter(n => n === names[0]).length === 2 || names.filter(n => n === names[0]).length === 3)) {
        // Two pairs of identical cards or three identical cards
        winnings = betAmount * 10;
    } else if (uniqueSuits.size === 2 && (suits.filter(s => s === suits[0]).length === 2 || suits.filter(s => s === suits[0]).length === 3)) {
        // Two pairs of suits or three matching suits
        winnings = betAmount * 5;
    } else if (uniqueNames.size === 3) {
        // Any two cards match
        winnings = betAmount * 2;
    }

    // No win if none of the above conditions are met
    return winnings;
}
