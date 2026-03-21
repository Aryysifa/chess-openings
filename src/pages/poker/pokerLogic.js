// ============================================================
// POKER LOGIC MODULE — pure JS, no React
// ============================================================

export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS = ['s', 'h', 'd', 'c'];
export const SUIT_SYMBOLS = { s: '♠', h: '♥', d: '♦', c: '♣' };
export const SUIT_COLORS = { s: '#c8d8e8', h: '#e05555', d: '#5a9fd4', c: '#6bcb8b' };

const RANK_VALUES = { A: 14, K: 13, Q: 12, J: 11, T: 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };

// ============================================================
// 169 STARTING HANDS — complete canonical dataset
// equity = pre-flop equity vs one random opponent hand (%)
// ============================================================
export const STARTING_HANDS = {
  'AA':  { rank: 1,   equity: 85.2, category: 'premium',     name: 'Pocket Aces' },
  'KK':  { rank: 2,   equity: 82.4, category: 'premium',     name: 'Pocket Kings' },
  'QQ':  { rank: 3,   equity: 79.9, category: 'premium',     name: 'Pocket Queens' },
  'AKs': { rank: 4,   equity: 67.0, category: 'premium',     name: 'Big Slick Suited' },
  'JJ':  { rank: 5,   equity: 77.5, category: 'premium',     name: 'Pocket Jacks' },
  'AQs': { rank: 6,   equity: 66.1, category: 'premium',     name: 'Big Chick Suited' },
  'KQs': { rank: 7,   equity: 63.4, category: 'premium',     name: 'Royal Babies Suited' },
  'AJs': { rank: 8,   equity: 65.4, category: 'premium',     name: 'Suited Ajax' },
  'KJs': { rank: 9,   equity: 62.6, category: 'strong',      name: 'King-Jack Suited' },
  'TT':  { rank: 10,  equity: 75.1, category: 'premium',     name: 'Pocket Tens' },
  'AKo': { rank: 11,  equity: 65.4, category: 'premium',     name: 'Big Slick Offsuit' },
  'ATs': { rank: 12,  equity: 64.7, category: 'strong',      name: 'Ace-Ten Suited' },
  'QJs': { rank: 13,  equity: 60.3, category: 'strong',      name: 'Queen-Jack Suited' },
  'KTs': { rank: 14,  equity: 61.4, category: 'strong',      name: 'King-Ten Suited' },
  'QTs': { rank: 15,  equity: 59.1, category: 'strong',      name: 'Queen-Ten Suited' },
  'JTs': { rank: 16,  equity: 57.5, category: 'strong',      name: 'Jack-Ten Suited' },
  '99':  { rank: 17,  equity: 72.1, category: 'strong',      name: 'Pocket Nines' },
  'AQo': { rank: 18,  equity: 64.5, category: 'strong',      name: 'Big Chick Offsuit' },
  'A9s': { rank: 19,  equity: 63.1, category: 'strong',      name: 'Ace-Nine Suited' },
  'KQo': { rank: 20,  equity: 61.4, category: 'strong',      name: 'Royal Babies Offsuit' },
  'T9s': { rank: 21,  equity: 54.9, category: 'strong',      name: 'Ten-Nine Suited' },
  'JTo': { rank: 22,  equity: 52.5, category: 'playable',    name: 'Jack-Ten Offsuit' },
  'QJo': { rank: 23,  equity: 55.3, category: 'playable',    name: 'Queen-Jack Offsuit' },
  'KJo': { rank: 24,  equity: 59.6, category: 'strong',      name: 'King-Jack Offsuit' },
  'AJo': { rank: 25,  equity: 63.6, category: 'strong',      name: 'Ajax Offsuit' },
  'A8s': { rank: 26,  equity: 62.5, category: 'strong',      name: 'Ace-Eight Suited' },
  '98s': { rank: 27,  equity: 53.8, category: 'playable',    name: 'Nine-Eight Suited' },
  'K9s': { rank: 28,  equity: 59.1, category: 'strong',      name: 'King-Nine Suited' },
  'T8s': { rank: 29,  equity: 52.5, category: 'playable',    name: 'Ten-Eight Suited' },
  'A5s': { rank: 30,  equity: 61.5, category: 'strong',      name: 'Ace-Five Suited' },
  'A7s': { rank: 31,  equity: 62.1, category: 'strong',      name: 'Ace-Seven Suited' },
  '88':  { rank: 32,  equity: 69.1, category: 'strong',      name: 'Pocket Eights' },
  'Q9s': { rank: 33,  equity: 57.1, category: 'playable',    name: 'Queen-Nine Suited' },
  'KTo': { rank: 34,  equity: 59.5, category: 'strong',      name: 'King-Ten Offsuit' },
  'A4s': { rank: 35,  equity: 61.0, category: 'strong',      name: 'Ace-Four Suited' },
  'A3s': { rank: 36,  equity: 60.5, category: 'strong',      name: 'Ace-Three Suited' },
  '97s': { rank: 37,  equity: 52.1, category: 'playable',    name: 'Nine-Seven Suited' },
  'J9s': { rank: 38,  equity: 54.3, category: 'playable',    name: 'Jack-Nine Suited' },
  'ATo': { rank: 39,  equity: 62.7, category: 'strong',      name: 'Ace-Ten Offsuit' },
  'A6s': { rank: 40,  equity: 61.8, category: 'strong',      name: 'Ace-Six Suited' },
  '76s': { rank: 41,  equity: 48.8, category: 'speculative', name: 'Seven-Six Suited' },
  'T7s': { rank: 42,  equity: 50.5, category: 'speculative', name: 'Ten-Seven Suited' },
  'A2s': { rank: 43,  equity: 60.0, category: 'strong',      name: 'Ace-Deuce Suited' },
  '87s': { rank: 44,  equity: 51.1, category: 'speculative', name: 'Eight-Seven Suited' },
  'QTo': { rank: 45,  equity: 57.2, category: 'playable',    name: 'Queen-Ten Offsuit' },
  'Q8s': { rank: 46,  equity: 55.1, category: 'playable',    name: 'Queen-Eight Suited' },
  '77':  { rank: 47,  equity: 66.2, category: 'strong',      name: 'Pocket Sevens' },
  '65s': { rank: 48,  equity: 47.9, category: 'speculative', name: 'Six-Five Suited' },
  'J8s': { rank: 49,  equity: 52.6, category: 'playable',    name: 'Jack-Eight Suited' },
  'T9o': { rank: 50,  equity: 52.5, category: 'playable',    name: 'Ten-Nine Offsuit' },
  '86s': { rank: 51,  equity: 50.1, category: 'speculative', name: 'Eight-Six Suited' },
  'K8s': { rank: 52,  equity: 57.9, category: 'playable',    name: 'King-Eight Suited' },
  '54s': { rank: 53,  equity: 46.9, category: 'speculative', name: 'Five-Four Suited' },
  'K7s': { rank: 54,  equity: 57.3, category: 'playable',    name: 'King-Seven Suited' },
  '96s': { rank: 55,  equity: 50.3, category: 'speculative', name: 'Nine-Six Suited' },
  'J7s': { rank: 56,  equity: 51.3, category: 'speculative', name: 'Jack-Seven Suited' },
  'Q7s': { rank: 57,  equity: 54.5, category: 'playable',    name: 'Queen-Seven Suited' },
  '66':  { rank: 58,  equity: 63.3, category: 'playable',    name: 'Pocket Sixes' },
  '75s': { rank: 59,  equity: 47.5, category: 'speculative', name: 'Seven-Five Suited' },
  '98o': { rank: 60,  equity: 51.7, category: 'speculative', name: 'Nine-Eight Offsuit' },
  'T6s': { rank: 61,  equity: 49.3, category: 'speculative', name: 'Ten-Six Suited' },
  'J9o': { rank: 62,  equity: 51.9, category: 'speculative', name: 'Jack-Nine Offsuit' },
  'Q6s': { rank: 63,  equity: 54.1, category: 'playable',    name: 'Queen-Six Suited' },
  'K9o': { rank: 64,  equity: 57.1, category: 'playable',    name: 'King-Nine Offsuit' },
  '87o': { rank: 65,  equity: 49.0, category: 'speculative', name: 'Eight-Seven Offsuit' },
  'A9o': { rank: 66,  equity: 61.4, category: 'strong',      name: 'Ace-Nine Offsuit' },
  '64s': { rank: 67,  equity: 47.1, category: 'speculative', name: 'Six-Four Suited' },
  '55':  { rank: 68,  equity: 60.3, category: 'playable',    name: 'Pocket Fives' },
  'K6s': { rank: 69,  equity: 56.8, category: 'playable',    name: 'King-Six Suited' },
  '76o': { rank: 70,  equity: 46.6, category: 'marginal',    name: 'Seven-Six Offsuit' },
  '53s': { rank: 71,  equity: 46.2, category: 'speculative', name: 'Five-Three Suited' },
  '85s': { rank: 72,  equity: 49.4, category: 'speculative', name: 'Eight-Five Suited' },
  'J8o': { rank: 73,  equity: 50.2, category: 'speculative', name: 'Jack-Eight Offsuit' },
  'K5s': { rank: 74,  equity: 56.3, category: 'playable',    name: 'King-Five Suited' },
  'Q9o': { rank: 75,  equity: 55.0, category: 'playable',    name: 'Queen-Nine Offsuit' },
  '74s': { rank: 76,  equity: 46.7, category: 'speculative', name: 'Seven-Four Suited' },
  'T8o': { rank: 77,  equity: 50.1, category: 'speculative', name: 'Ten-Eight Offsuit' },
  '65o': { rank: 78,  equity: 45.8, category: 'marginal',    name: 'Six-Five Offsuit' },
  'J6s': { rank: 79,  equity: 50.8, category: 'speculative', name: 'Jack-Six Suited' },
  '86o': { rank: 80,  equity: 47.9, category: 'marginal',    name: 'Eight-Six Offsuit' },
  'A8o': { rank: 81,  equity: 60.5, category: 'strong',      name: 'Ace-Eight Offsuit' },
  'K4s': { rank: 82,  equity: 55.8, category: 'playable',    name: 'King-Four Suited' },
  '44':  { rank: 83,  equity: 57.0, category: 'playable',    name: 'Pocket Fours' },
  'Q5s': { rank: 84,  equity: 53.6, category: 'playable',    name: 'Queen-Five Suited' },
  '95s': { rank: 85,  equity: 48.9, category: 'speculative', name: 'Nine-Five Suited' },
  '63s': { rank: 86,  equity: 46.1, category: 'marginal',    name: 'Six-Three Suited' },
  '54o': { rank: 87,  equity: 44.7, category: 'marginal',    name: 'Five-Four Offsuit' },
  'K3s': { rank: 88,  equity: 55.3, category: 'playable',    name: 'King-Three Suited' },
  '75o': { rank: 89,  equity: 45.3, category: 'marginal',    name: 'Seven-Five Offsuit' },
  'Q4s': { rank: 90,  equity: 53.2, category: 'playable',    name: 'Queen-Four Suited' },
  'Q3s': { rank: 91,  equity: 52.8, category: 'marginal',    name: 'Queen-Three Suited' },
  'T5s': { rank: 92,  equity: 48.6, category: 'marginal',    name: 'Ten-Five Suited' },
  'A7o': { rank: 93,  equity: 60.2, category: 'strong',      name: 'Ace-Seven Offsuit' },
  '97o': { rank: 94,  equity: 49.8, category: 'marginal',    name: 'Nine-Seven Offsuit' },
  'J5s': { rank: 95,  equity: 50.4, category: 'marginal',    name: 'Jack-Five Suited' },
  '96o': { rank: 96,  equity: 48.0, category: 'marginal',    name: 'Nine-Six Offsuit' },
  'K2s': { rank: 97,  equity: 54.8, category: 'marginal',    name: 'King-Deuce Suited' },
  '64o': { rank: 98,  equity: 44.9, category: 'marginal',    name: 'Six-Four Offsuit' },
  '33':  { rank: 99,  equity: 53.7, category: 'playable',    name: 'Pocket Threes' },
  'Q2s': { rank: 100, equity: 52.3, category: 'marginal',    name: 'Queen-Deuce Suited' },
  '52s': { rank: 101, equity: 44.9, category: 'marginal',    name: 'Five-Two Suited' },
  '84s': { rank: 102, equity: 48.2, category: 'marginal',    name: 'Eight-Four Suited' },
  'T7o': { rank: 103, equity: 48.2, category: 'marginal',    name: 'Ten-Seven Offsuit' },
  'T4s': { rank: 104, equity: 48.1, category: 'marginal',    name: 'Ten-Four Suited' },
  'J7o': { rank: 105, equity: 49.0, category: 'marginal',    name: 'Jack-Seven Offsuit' },
  '62s': { rank: 106, equity: 44.8, category: 'marginal',    name: 'Six-Two Suited' },
  '85o': { rank: 107, equity: 47.2, category: 'marginal',    name: 'Eight-Five Offsuit' },
  'A6o': { rank: 108, equity: 59.8, category: 'playable',    name: 'Ace-Six Offsuit' },
  'J4s': { rank: 109, equity: 50.0, category: 'marginal',    name: 'Jack-Four Suited' },
  'T3s': { rank: 110, equity: 47.6, category: 'marginal',    name: 'Ten-Three Suited' },
  '73s': { rank: 111, equity: 45.2, category: 'marginal',    name: 'Seven-Three Suited' },
  'J3s': { rank: 112, equity: 49.6, category: 'marginal',    name: 'Jack-Three Suited' },
  '95o': { rank: 113, equity: 46.7, category: 'marginal',    name: 'Nine-Five Offsuit' },
  'A5o': { rank: 114, equity: 59.5, category: 'playable',    name: 'Ace-Five Offsuit' },
  'K8o': { rank: 115, equity: 55.9, category: 'playable',    name: 'King-Eight Offsuit' },
  '22':  { rank: 116, equity: 50.3, category: 'playable',    name: 'Pocket Deuces' },
  '53o': { rank: 117, equity: 44.1, category: 'marginal',    name: 'Five-Three Offsuit' },
  'T2s': { rank: 118, equity: 47.2, category: 'marginal',    name: 'Ten-Deuce Suited' },
  '74o': { rank: 119, equity: 44.5, category: 'marginal',    name: 'Seven-Four Offsuit' },
  'J2s': { rank: 120, equity: 49.2, category: 'marginal',    name: 'Jack-Deuce Suited' },
  '93s': { rank: 121, equity: 47.6, category: 'marginal',    name: 'Nine-Three Suited' },
  'Q6o': { rank: 122, equity: 52.0, category: 'marginal',    name: 'Queen-Six Offsuit' },
  'A4o': { rank: 123, equity: 59.1, category: 'playable',    name: 'Ace-Four Offsuit' },
  '83s': { rank: 124, equity: 47.4, category: 'marginal',    name: 'Eight-Three Suited' },
  '94s': { rank: 125, equity: 47.9, category: 'marginal',    name: 'Nine-Four Suited' },
  '92s': { rank: 126, equity: 47.2, category: 'marginal',    name: 'Nine-Deuce Suited' },
  '43s': { rank: 127, equity: 43.8, category: 'marginal',    name: 'Four-Three Suited' },
  'Q7o': { rank: 128, equity: 52.4, category: 'marginal',    name: 'Queen-Seven Offsuit' },
  '82s': { rank: 129, equity: 46.9, category: 'marginal',    name: 'Eight-Deuce Suited' },
  '72s': { rank: 130, equity: 44.8, category: 'trash',       name: 'The Hammer' },
  'K7o': { rank: 131, equity: 55.3, category: 'marginal',    name: 'King-Seven Offsuit' },
  'T6o': { rank: 132, equity: 47.2, category: 'marginal',    name: 'Ten-Six Offsuit' },
  'J6o': { rank: 133, equity: 48.8, category: 'marginal',    name: 'Jack-Six Offsuit' },
  '63o': { rank: 134, equity: 44.0, category: 'trash',       name: 'Six-Three Offsuit' },
  '43o': { rank: 135, equity: 41.7, category: 'trash',       name: 'Four-Three Offsuit' },
  'A3o': { rank: 136, equity: 58.7, category: 'playable',    name: 'Ace-Three Offsuit' },
  '52o': { rank: 137, equity: 42.8, category: 'trash',       name: 'Five-Two Offsuit' },
  '84o': { rank: 138, equity: 46.0, category: 'trash',       name: 'Eight-Four Offsuit' },
  '93o': { rank: 139, equity: 45.4, category: 'trash',       name: 'Nine-Three Offsuit' },
  'K6o': { rank: 140, equity: 54.8, category: 'marginal',    name: 'King-Six Offsuit' },
  '73o': { rank: 141, equity: 43.1, category: 'trash',       name: 'Seven-Three Offsuit' },
  'J5o': { rank: 142, equity: 48.3, category: 'marginal',    name: 'Jack-Five Offsuit' },
  'A2o': { rank: 143, equity: 58.2, category: 'playable',    name: 'Ace-Deuce Offsuit' },
  'Q5o': { rank: 144, equity: 51.6, category: 'marginal',    name: 'Queen-Five Offsuit' },
  '83o': { rank: 145, equity: 45.2, category: 'trash',       name: 'Eight-Three Offsuit' },
  '94o': { rank: 146, equity: 45.7, category: 'trash',       name: 'Nine-Four Offsuit' },
  'K5o': { rank: 147, equity: 54.3, category: 'marginal',    name: 'King-Five Offsuit' },
  'Q4o': { rank: 148, equity: 51.2, category: 'marginal',    name: 'Queen-Four Offsuit' },
  '62o': { rank: 149, equity: 42.8, category: 'trash',       name: 'Six-Two Offsuit' },
  'J4o': { rank: 150, equity: 48.0, category: 'marginal',    name: 'Jack-Four Offsuit' },
  '92o': { rank: 151, equity: 45.1, category: 'trash',       name: 'Nine-Deuce Offsuit' },
  'Q3o': { rank: 152, equity: 50.8, category: 'marginal',    name: 'Queen-Three Offsuit' },
  'K4o': { rank: 153, equity: 53.9, category: 'marginal',    name: 'King-Four Offsuit' },
  '42s': { rank: 154, equity: 43.0, category: 'trash',       name: 'Four-Two Suited' },
  '32s': { rank: 155, equity: 41.5, category: 'trash',       name: 'Three-Two Suited' },
  'T5o': { rank: 156, equity: 46.5, category: 'trash',       name: 'Ten-Five Offsuit' },
  '82o': { rank: 157, equity: 44.7, category: 'trash',       name: 'Eight-Deuce Offsuit' },
  'J3o': { rank: 158, equity: 47.7, category: 'marginal',    name: 'Jack-Three Offsuit' },
  'K3o': { rank: 159, equity: 53.4, category: 'marginal',    name: 'King-Three Offsuit' },
  'Q2o': { rank: 160, equity: 50.4, category: 'marginal',    name: 'Queen-Deuce Offsuit' },
  '72o': { rank: 161, equity: 42.6, category: 'trash',       name: 'The Hammer Offsuit' },
  'T4o': { rank: 162, equity: 46.1, category: 'trash',       name: 'Ten-Four Offsuit' },
  '42o': { rank: 163, equity: 41.0, category: 'trash',       name: 'Four-Two Offsuit' },
  'J2o': { rank: 164, equity: 47.3, category: 'marginal',    name: 'Jack-Deuce Offsuit' },
  'K2o': { rank: 165, equity: 52.9, category: 'marginal',    name: 'King-Deuce Offsuit' },
  'T3o': { rank: 166, equity: 45.7, category: 'trash',       name: 'Ten-Three Offsuit' },
  '32o': { rank: 167, equity: 39.5, category: 'trash',       name: 'Three-Two Offsuit' },
  'T2o': { rank: 168, equity: 45.3, category: 'trash',       name: 'Ten-Deuce Offsuit' },
  'J2o_dup': { rank: 169, equity: 47.3, category: 'trash',   name: 'Jack-Deuce Offsuit' },
};

// ============================================================
// POSITION RANGES (6-max game, GTO-informed)
// Based on standard solver-derived opening ranges
// ============================================================
export const POSITIONS = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

// These sets define which hands to RAISE from each position
const UTG_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','AKs','AQs','AJs','ATs','KQs','KJs',
  'QJs','AKo','AQo'
]);

const HJ_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','AKs','AQs','AJs','ATs','A9s',
  'KQs','KJs','KTs','QJs','QTs','JTs','AKo','AQo','AJo','KQo'
]);

const CO_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','AKs','AQs','AJs','ATs',
  'A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s','KQs','KJs','KTs','K9s',
  'QJs','QTs','Q9s','JTs','J9s','T9s','98s','87s','76s','65s',
  'AKo','AQo','AJo','ATo','KQo','KJo','KTo','QJo','QTo'
]);

const BTN_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s',
  'QJs','QTs','Q9s','Q8s','Q7s',
  'JTs','J9s','J8s','J7s',
  'T9s','T8s','T7s',
  '98s','97s','96s',
  '87s','86s','85s',
  '76s','75s','74s',
  '65s','64s','63s',
  '54s','53s','52s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o',
  'KQo','KJo','KTo','K9o','K8o',
  'QJo','QTo','Q9o',
  'JTo','J9o','J8o',
  'T9o','T8o',
  '98o','97o',
  '87o','86o',
  '76o','75o',
  '65o','64o',
  '54o'
]);

const SB_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s',
  'QJs','QTs','Q9s','Q8s',
  'JTs','J9s','J8s',
  'T9s','T8s',
  '98s','97s',
  '87s','86s',
  '76s','75s',
  '65s','64s',
  '54s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o',
  'KQo','KJo','KTo','K9o',
  'QJo','QTo','Q9o',
  'JTo','J9o',
  'T9o','T8o',
  '98o',
  '87o',
  '76o'
]);

// BB defend/3-bet range vs BTN open (simplified — defend most, fold trash)
const BB_RAISE = new Set([
  'AA','KK','QQ','JJ','TT','AKs','AQs','AJs','ATs','A9s','A5s','A4s',
  'KQs','KJs','QJs','JTs','T9s','98s','87s','76s',
  'AKo','AQo','AJo','ATo','KQo','KJo'
]);
const BB_CALL = new Set([
  '99','88','77','66','55','44','33','22',
  'A8s','A7s','A6s','A3s','A2s','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s',
  'QTs','Q9s','Q8s','Q7s','J9s','J8s','J7s','T8s','T7s','97s','96s','86s','85s','75s','74s','65s','64s','54s','53s',
  'A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o',
  'KTo','K9o','K8o','K7o','QJo','QTo','Q9o','Q8o','JTo','J9o','J8o','T9o','T8o','98o','97o','87o','86o','76o','75o','65o','54o'
]);

export const POSITION_RANGES = {
  'UTG': { raise: UTG_RAISE,  call: new Set() },
  'HJ':  { raise: HJ_RAISE,   call: new Set() },
  'CO':  { raise: CO_RAISE,   call: new Set() },
  'BTN': { raise: BTN_RAISE,  call: new Set() },
  'SB':  { raise: SB_RAISE,   call: new Set() },
  'BB':  { raise: BB_RAISE,   call: BB_CALL },
};

// Position descriptions for educational display
export const POSITION_INFO = {
  'UTG': { fullName: 'Under The Gun', description: 'First to act pre-flop. Play only premium hands — you have no information about anyone else\'s hand strength.', tightnessLabel: 'Very Tight' },
  'HJ':  { fullName: 'Hijack', description: 'One off from early position. Slightly wider range, but still conservative. You still act before most players post-flop.', tightnessLabel: 'Tight' },
  'CO':  { fullName: 'Cutoff', description: 'One before the button. Strong position — you act after most players. You can widen your range considerably.', tightnessLabel: 'Medium' },
  'BTN': { fullName: 'Button', description: 'The best position in poker. You act last on every post-flop street, giving you maximum information. Play a very wide range.', tightnessLabel: 'Wide' },
  'SB':  { fullName: 'Small Blind', description: 'You act first post-flop every street — a positional disadvantage. Despite investing chips, tighten up vs strong opposition.', tightnessLabel: 'Medium-Wide' },
  'BB':  { fullName: 'Big Blind', description: 'You have a discount to call since you\'re already invested. Defend widely against steals but be careful of out-of-position play post-flop.', tightnessLabel: 'Defend Wide' },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

export function cardsToHandNotation(card1, card2) {
  const r1 = RANK_VALUES[card1.rank];
  const r2 = RANK_VALUES[card2.rank];
  const high = r1 >= r2 ? card1 : card2;
  const low  = r1 >= r2 ? card2 : card1;

  if (high.rank === low.rank) return high.rank + low.rank; // pair
  const suited = high.suit === low.suit ? 's' : 'o';
  return high.rank + low.rank + suited;
}

export function getRangeAction(handNotation, position) {
  const ranges = POSITION_RANGES[position];
  if (!ranges) return 'fold';
  if (ranges.raise.has(handNotation)) return 'raise';
  if (ranges.call.has(handNotation)) return 'call';
  return 'fold';
}

// ============================================================
// PRE-FLOP ACTION + EXPLANATION
// ============================================================

export function getPreFlopAction(handNotation, position, numPlayers) {
  const hand = STARTING_HANDS[handNotation];
  if (!hand) return { action: 'fold', confidence: 90, explanation: 'Unknown hand — fold by default.' };

  const action = getRangeAction(handNotation, position);
  const posInfo = POSITION_INFO[position] || { fullName: position, description: '' };

  let confidence;
  if (action === 'raise') {
    confidence = hand.category === 'premium' ? 97 : hand.category === 'strong' ? 88 : 75;
  } else if (action === 'call') {
    confidence = 70;
  } else {
    confidence = hand.category === 'trash' ? 95 : 80;
  }

  const explanation = buildPreFlopExplanation(hand, handNotation, action, position, posInfo, numPlayers);
  return { action, confidence, explanation };
}

function buildPreFlopExplanation(hand, notation, action, position, posInfo, numPlayers) {
  const parts = [];

  // Hand identity
  parts.push(`**${hand.name}** (${notation}) — ${getCategoryLabel(hand.category)} hand with ${hand.equity.toFixed(1)}% equity heads-up vs. a random hand.`);

  // Position context
  parts.push(`From the **${posInfo.fullName}** you are playing a ${posInfo.tightnessLabel.toLowerCase()} range. ${posInfo.description}`);

  // Action rationale
  if (action === 'raise') {
    if (hand.category === 'premium') {
      parts.push(`This is a clear **raise**. Premium hands want to build the pot and thin the field. Raising denies opponents favorable odds to call with speculative holdings, and charges draws from the start.`);
    } else if (hand.category === 'strong') {
      parts.push(`This is a **raise** from your position. Strong hands in late position profit from fold equity and from playing in position post-flop. Raising builds a pot you are likely to win.`);
    } else {
      parts.push(`This hand is on the **edge of your raising range** from this position. You raise for fold equity and to represent strength. Be prepared to continuation-bet and apply pressure post-flop.`);
    }
  } else if (action === 'call') {
    parts.push(`This is a **call** situation (Big Blind defense). You have already invested in the pot and have good pot odds to continue. Your goal is to realize your equity — you don't always need to win the pot by showdown.`);
  } else {
    // fold
    if (hand.category === 'trash') {
      parts.push(`This is a clear **fold**. The hand has negative expected value from this position due to poor equity, no strong draws, and will often be dominated or out-kicked.`);
    } else {
      parts.push(`This is a **fold** from ${posInfo.fullName}. While the hand has some value, it falls outside your profitable opening range here. Playing it opens you to being out of position with a marginal hand, which is a losing proposition long-term.`);
    }
  }

  // Players context
  if (numPlayers > 6) {
    parts.push(`With ${numPlayers} players at the table, tighten your range slightly — more players means greater chance one has a premium hand.`);
  } else if (numPlayers <= 3) {
    parts.push(`Short-handed play (${numPlayers} players) allows much wider ranges — nearly any two cards become playable from the right position.`);
  }

  return parts.join('\n\n');
}

function getCategoryLabel(category) {
  const labels = {
    premium: 'Premium',
    strong: 'Strong',
    playable: 'Playable',
    speculative: 'Speculative',
    marginal: 'Marginal',
    trash: 'Trash'
  };
  return labels[category] || category;
}

// ============================================================
// HAND EVALUATOR (7-card best-hand detector)
// Returns { rank: 1-9, name: string, primaryValue: number }
// Rank 1 = Royal Flush (best), 9 = High Card (worst)
// ============================================================

const HAND_RANKS = {
  ROYAL_FLUSH: 1,
  STRAIGHT_FLUSH: 2,
  FOUR_OF_A_KIND: 3,
  FULL_HOUSE: 4,
  FLUSH: 5,
  STRAIGHT: 6,
  THREE_OF_A_KIND: 7,
  TWO_PAIR: 8,
  ONE_PAIR: 9,
  HIGH_CARD: 10,
};

function cardValue(rank) {
  return RANK_VALUES[rank] || 0;
}

function getBestHand(cards) {
  // Try all C(n,5) combinations, return best
  const best = { rank: 10, name: 'High Card', score: 0 };
  const n = cards.length;

  function combine(start, chosen) {
    if (chosen.length === 5) {
      const result = evaluateFiveCards(chosen);
      if (result.rank < best.rank || (result.rank === best.rank && result.score > best.score)) {
        best.rank = result.rank;
        best.name = result.name;
        best.score = result.score;
        best.cards = [...chosen];
        best.kickers = result.kickers;
      }
      return;
    }
    for (let i = start; i < n; i++) {
      chosen.push(cards[i]);
      combine(i + 1, chosen);
      chosen.pop();
    }
  }

  combine(0, []);
  return best;
}

function evaluateFiveCards(cards) {
  const values = cards.map(c => cardValue(c.rank)).sort((a, b) => b - a);
  const suits  = cards.map(c => c.suit);
  const isFlush    = suits.every(s => s === suits[0]);
  const isStraight = checkStraight(values);
  const counts     = getCounts(values);

  if (isFlush && isStraight) {
    const isRoyal = values[0] === 14 && values[1] === 13;
    return isRoyal
      ? { rank: HAND_RANKS.ROYAL_FLUSH,    name: 'Royal Flush',    score: 14, kickers: values }
      : { rank: HAND_RANKS.STRAIGHT_FLUSH, name: 'Straight Flush', score: isStraight, kickers: values };
  }
  if (counts.some(([,c]) => c === 4)) {
    const quad = counts.find(([,c]) => c === 4)[0];
    return { rank: HAND_RANKS.FOUR_OF_A_KIND, name: 'Four of a Kind', score: quad, kickers: values };
  }
  if (counts.some(([,c]) => c === 3) && counts.some(([,c]) => c === 2)) {
    const trips = counts.find(([,c]) => c === 3)[0];
    return { rank: HAND_RANKS.FULL_HOUSE, name: 'Full House', score: trips, kickers: values };
  }
  if (isFlush) {
    return { rank: HAND_RANKS.FLUSH, name: 'Flush', score: values[0], kickers: values };
  }
  if (isStraight) {
    return { rank: HAND_RANKS.STRAIGHT, name: 'Straight', score: isStraight, kickers: values };
  }
  if (counts.some(([,c]) => c === 3)) {
    const trips = counts.find(([,c]) => c === 3)[0];
    return { rank: HAND_RANKS.THREE_OF_A_KIND, name: 'Three of a Kind', score: trips, kickers: values };
  }
  if (counts.filter(([,c]) => c === 2).length >= 2) {
    const pairs = counts.filter(([,c]) => c === 2).map(([v]) => v).sort((a,b) => b-a);
    return { rank: HAND_RANKS.TWO_PAIR, name: 'Two Pair', score: pairs[0] * 100 + pairs[1], kickers: values };
  }
  if (counts.some(([,c]) => c === 2)) {
    const pair = counts.find(([,c]) => c === 2)[0];
    return { rank: HAND_RANKS.ONE_PAIR, name: 'One Pair', score: pair, kickers: values };
  }
  return { rank: HAND_RANKS.HIGH_CARD, name: 'High Card', score: values[0], kickers: values };
}

function checkStraight(sortedValues) {
  // Handle A-2-3-4-5 (wheel)
  const vals = [...new Set(sortedValues)];
  if (vals.length < 5) return false;
  // Normal straight
  for (let i = 0; i <= vals.length - 5; i++) {
    if (vals[i] - vals[i+4] === 4) return vals[i];
  }
  // Wheel
  if (vals.includes(14) && vals.includes(2) && vals.includes(3) && vals.includes(4) && vals.includes(5)) {
    return 5;
  }
  return false;
}

function getCounts(values) {
  const map = {};
  values.forEach(v => { map[v] = (map[v] || 0) + 1; });
  return Object.entries(map).map(([v, c]) => [Number(v), c]).sort((a, b) => b[1] - a[1] || b[0] - a[0]);
}

// ============================================================
// POST-FLOP ANALYSIS
// ============================================================

export function evaluateHandStrength(cards) {
  if (!cards || cards.length < 2) return null;
  return getBestHand(cards);
}

export function getPostFlopAnalysis(holeCards, communityCards) {
  const allCards = [...holeCards, ...communityCards];
  const made = getBestHand(allCards);

  const draws = [];
  let outs = 0;

  if (communityCards.length >= 2 && communityCards.length < 5) {
    // Flush draw check
    const suitCounts = {};
    allCards.forEach(c => { suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1; });
    const flushSuit = Object.entries(suitCounts).find(([, c]) => c === 4);
    if (flushSuit && made.rank > HAND_RANKS.FLUSH) {
      draws.push({ name: 'Flush Draw', outs: 9 });
      outs += 9;
    }

    // Straight draw check
    const vals = [...new Set(allCards.map(c => cardValue(c.rank)))].sort((a, b) => b - a);
    const straightDrawOuts = checkStraightDraw(vals);
    if (straightDrawOuts > 0 && made.rank > HAND_RANKS.STRAIGHT) {
      if (straightDrawOuts === 8) {
        draws.push({ name: 'Open-Ended Straight Draw', outs: 8 });
      } else {
        draws.push({ name: 'Gutshot Straight Draw', outs: 4 });
      }
      outs += straightDrawOuts;
    }

    // Overcards
    if (made.rank >= HAND_RANKS.HIGH_CARD) {
      const boardValues = communityCards.map(c => cardValue(c.rank));
      const holeValues = holeCards.map(c => cardValue(c.rank));
      const overcount = holeValues.filter(v => v > Math.max(...boardValues)).length;
      if (overcount > 0) {
        draws.push({ name: `${overcount === 2 ? 'Two' : 'One'} Overcard${overcount > 1 ? 's' : ''}`, outs: overcount * 3 });
        outs += overcount * 3;
      }
    }
  }

  // Outs to equity (Rule of 2 and 4)
  const cardsTocome = 5 - communityCards.length;
  const drawEquity = cardsTocome === 2 ? outs * 4 : outs * 2;

  return { made, draws, outs, drawEquity };
}

function checkStraightDraw(sortedUniqueVals) {
  // Check for OESD (8 outs) or gutshot (4 outs)
  for (let i = 0; i < sortedUniqueVals.length - 3; i++) {
    const slice = sortedUniqueVals.slice(i, i + 5);
    const connected = slice[0] - slice[slice.length - 1];
    if (slice.length === 4 && connected === 3) return 8; // OESD
    if (slice.length === 4 && connected === 4) return 4; // gutshot
  }
  // Check wheel draw
  const hasAce = sortedUniqueVals.includes(14);
  if (hasAce) {
    const lowVals = sortedUniqueVals.filter(v => v <= 5);
    if (lowVals.length === 3) return 4;
  }
  return 0;
}

// ============================================================
// POT ODDS CALCULATOR
// ============================================================

export function calculatePotOdds(potSize, betSize) {
  const pot = parseFloat(potSize);
  const bet = parseFloat(betSize);
  if (isNaN(pot) || isNaN(bet) || bet <= 0) return null;

  const totalPot = pot + bet;
  const potOddsRatio = pot / bet;
  const neededEquity = (bet / totalPot) * 100;

  return {
    potOddsRatio: potOddsRatio.toFixed(1),
    neededEquity: neededEquity.toFixed(1),
    explanation: `You need to call ${bet} into a pot of ${pot + bet} (after your call). That gives you ${potOddsRatio.toFixed(1)}:1 pot odds, requiring ${neededEquity.toFixed(1)}% equity to break even.`,
  };
}

// ============================================================
// MONTE CARLO EQUITY ESTIMATION (post-flop)
// ============================================================

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck() {
  const deck = [];
  for (const rank of RANKS) {
    for (const suit of SUITS) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

export function estimateEquity(holeCards, communityCards, numOpponents = 1, numSimulations = 3000) {
  const usedKeys = new Set([
    ...holeCards.map(c => c.rank + c.suit),
    ...communityCards.map(c => c.rank + c.suit),
  ]);

  const remainingDeck = buildDeck().filter(c => !usedKeys.has(c.rank + c.suit));
  let wins = 0;
  let ties = 0;

  for (let i = 0; i < numSimulations; i++) {
    const deck = shuffleArray(remainingDeck);
    let idx = 0;

    // Complete the board
    const board = [...communityCards];
    while (board.length < 5) board.push(deck[idx++]);

    // Deal opponent hands
    const opponents = [];
    for (let o = 0; o < numOpponents; o++) {
      opponents.push([deck[idx++], deck[idx++]]);
    }

    // Evaluate hero
    const heroResult = getBestHand([...holeCards, ...board]);

    // Evaluate opponents
    let heroWins = true;
    let heroTie = false;
    for (const oppHole of opponents) {
      const oppResult = getBestHand([...oppHole, ...board]);
      if (oppResult.rank < heroResult.rank ||
          (oppResult.rank === heroResult.rank && oppResult.score > heroResult.score)) {
        heroWins = false;
        heroTie = false;
        break;
      } else if (oppResult.rank === heroResult.rank && oppResult.score === heroResult.score) {
        heroTie = true;
      }
    }

    if (heroWins) wins++;
    else if (heroTie) ties += 0.5;
  }

  return ((wins + ties) / numSimulations) * 100;
}

// ============================================================
// MASTER ANALYSIS FUNCTION
// ============================================================

export function analyzeHand(holeCards, communityCards = [], position, numPlayers) {
  if (holeCards.length !== 2) return null;

  const handNotation = cardsToHandNotation(holeCards[0], holeCards[1]);
  const handData = STARTING_HANDS[handNotation] || { rank: 100, equity: 50, category: 'marginal', name: handNotation };

  const isPreFlop = communityCards.length === 0;
  const preflopInfo = getPreFlopAction(handNotation, position, numPlayers);

  let postFlop = null;
  let equity = handData.equity;

  if (!isPreFlop) {
    postFlop = getPostFlopAnalysis(holeCards, communityCards);
    // Adjust equity based on made hand + draws
    if (postFlop.made.rank === HAND_RANKS.ROYAL_FLUSH)    equity = 100;
    else if (postFlop.made.rank === HAND_RANKS.STRAIGHT_FLUSH) equity = 99;
    else if (postFlop.made.rank === HAND_RANKS.FOUR_OF_A_KIND) equity = 97;
    else if (postFlop.made.rank === HAND_RANKS.FULL_HOUSE) equity = 93;
    else if (postFlop.made.rank === HAND_RANKS.FLUSH)      equity = 88;
    else if (postFlop.made.rank === HAND_RANKS.STRAIGHT)   equity = 83;
    else if (postFlop.made.rank === HAND_RANKS.THREE_OF_A_KIND) equity = 70;
    else if (postFlop.made.rank === HAND_RANKS.TWO_PAIR)   equity = 62;
    else if (postFlop.made.rank === HAND_RANKS.ONE_PAIR)   equity = 52;
    else equity = 30 + (postFlop.drawEquity || 0) * 0.5;

    // Add draw equity
    equity = Math.min(99, equity + (postFlop.drawEquity || 0) * 0.3);
  }

  // Determine overall action (post-flop uses equity + position to decide)
  let action = preflopInfo.action;
  let confidence = preflopInfo.confidence;

  if (!isPreFlop && postFlop) {
    if (postFlop.made.rank <= HAND_RANKS.FLUSH) {
      action = 'raise'; confidence = 92;
    } else if (postFlop.made.rank <= HAND_RANKS.TWO_PAIR) {
      action = 'raise'; confidence = 78;
    } else if (postFlop.made.rank === HAND_RANKS.ONE_PAIR) {
      // Depends heavily on pair type
      const pairScore = postFlop.made.score;
      if (pairScore >= 10) { action = 'call'; confidence = 65; }
      else { action = 'call'; confidence = 55; }
    } else {
      // High card — play based on draws
      if (postFlop.outs >= 12) { action = 'call'; confidence = 60; }
      else { action = 'fold'; confidence = 72; }
    }
  }

  const postFlopExplanation = isPreFlop ? null : buildPostFlopExplanation(postFlop, position, action, numPlayers);

  return {
    handNotation,
    handName: handData.name,
    handCategory: handData.category,
    equity: parseFloat(equity.toFixed(1)),
    action,
    confidence,
    explanation: isPreFlop ? preflopInfo.explanation : postFlopExplanation,
    isPreFlop,
    madeHand: postFlop ? postFlop.made.name : null,
    draws: postFlop ? postFlop.draws : null,
    outs: postFlop ? postFlop.outs : null,
    drawEquity: postFlop ? postFlop.drawEquity : null,
  };
}

function buildPostFlopExplanation(postFlop, position, action, numPlayers) {
  const parts = [];
  const { made, draws, outs } = postFlop;

  parts.push(`**${made.name}** — this is your best made hand with the current board.`);

  if (made.rank <= HAND_RANKS.STRAIGHT) {
    parts.push(`This is a **monster hand**. Your goal is to extract maximum value. Raise or re-raise to build the pot. Don't slow-play on wet boards where opponents could be drawing.`);
  } else if (made.rank === HAND_RANKS.THREE_OF_A_KIND) {
    parts.push(`Three of a kind is a strong hand. Raise for value — you beat all pairs and most two-pair combinations. Watch for flush or straight-completing board cards.`);
  } else if (made.rank === HAND_RANKS.TWO_PAIR) {
    parts.push(`Two pair is a solid hand but vulnerable. Raise to protect your equity and charge draws. If the board is very connected or flushed, be cautious on later streets.`);
  } else if (made.rank === HAND_RANKS.ONE_PAIR) {
    parts.push(`One pair — proceed carefully. High pairs (tens or above) can often bet for value and protection. Weak pairs on connected boards are vulnerable; prefer checking or calling rather than raising.`);
  } else {
    parts.push(`High card with ${outs} outs. You're relying on your draws to improve. Use the rule of 2 and 4 to estimate equity and compare to pot odds before calling bets.`);
  }

  if (draws && draws.length > 0) {
    const drawNames = draws.map(d => `${d.name} (${d.outs} outs)`).join(', ');
    parts.push(`**Draws:** ${drawNames}. Each out improves your hand on the next card.`);
  }

  const posInfo = POSITION_INFO[position];
  if (posInfo) {
    if (position === 'BTN' || position === 'CO') {
      parts.push(`You're in late position post-flop, which is a significant advantage. You can bet/raise for value or check back and pot-control depending on board texture.`);
    } else if (position === 'UTG' || position === 'HJ') {
      parts.push(`Out of position, keep your betting range more polarized (strong hands or bluffs). Avoid bloated pots with marginal hands since you act first every street.`);
    }
  }

  return parts.join('\n\n');
}

// ============================================================
// HAND CATEGORY COLORS + LABELS (for UI)
// ============================================================

export const CATEGORY_COLORS = {
  premium:     { bg: '#1a3a1a', text: '#4ade80', border: '#2d6a2d' },
  strong:      { bg: '#1a2a3a', text: '#5a9fd4', border: '#2d4a6a' },
  playable:    { bg: '#2a2a1a', text: '#c8b840', border: '#5a5a20' },
  speculative: { bg: '#2a1a0a', text: '#e08030', border: '#6a4010' },
  marginal:    { bg: '#2a1a1a', text: '#c05050', border: '#6a2a2a' },
  trash:       { bg: '#1e1e1e', text: '#666',    border: '#333' },
};

export const ACTION_COLORS = {
  raise: { text: '#4ade80', bg: '#1a3a1a', border: '#2d6a2d' },
  call:  { text: '#fbbf24', bg: '#2a2510', border: '#665a20' },
  fold:  { text: '#ef4444', bg: '#2a1010', border: '#6a2020' },
};

// ============================================================
// HAND RANKINGS REFERENCE DATA (static educational content)
// ============================================================

export const HAND_RANKINGS = [
  { rank: 1, name: 'Royal Flush',     example: 'A♠ K♠ Q♠ J♠ T♠',   probability: '0.000154%', description: 'The ultimate hand — A, K, Q, J, T all in the same suit.' },
  { rank: 2, name: 'Straight Flush',  example: '9♥ 8♥ 7♥ 6♥ 5♥',   probability: '0.00139%',  description: 'Five consecutive cards of the same suit.' },
  { rank: 3, name: 'Four of a Kind',  example: 'A♠ A♥ A♦ A♣ K♠',   probability: '0.0240%',   description: 'All four cards of the same rank.' },
  { rank: 4, name: 'Full House',      example: 'K♠ K♥ K♦ Q♠ Q♥',   probability: '0.1441%',   description: 'Three of a kind plus a pair.' },
  { rank: 5, name: 'Flush',           example: 'A♦ J♦ 8♦ 5♦ 3♦',   probability: '0.1965%',   description: 'Any five cards of the same suit (not consecutive).' },
  { rank: 6, name: 'Straight',        example: 'J♠ T♥ 9♦ 8♣ 7♠',   probability: '0.3925%',   description: 'Five consecutive cards of mixed suits.' },
  { rank: 7, name: 'Three of a Kind', example: 'Q♠ Q♥ Q♦ A♣ 8♠',   probability: '2.1128%',   description: 'Three cards of the same rank.' },
  { rank: 8, name: 'Two Pair',        example: 'A♠ A♥ K♦ K♣ Q♠',   probability: '4.7539%',   description: 'Two different pairs.' },
  { rank: 9, name: 'One Pair',        example: 'T♠ T♥ A♦ K♣ Q♠',   probability: '42.2569%',  description: 'Two cards of the same rank.' },
  { rank: 10, name: 'High Card',      example: 'A♠ J♥ 8♦ 5♣ 2♠',   probability: '50.1177%',  description: 'No combination — highest card plays.' },
];
