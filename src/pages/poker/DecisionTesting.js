import React, { useState, useCallback } from 'react';
import {
  RANKS, SUITS, SUIT_SYMBOLS, SUIT_COLORS,
  analyzeHand, cardsToHandNotation,
  STARTING_HANDS, ACTION_COLORS, POSITION_INFO, POSITIONS,
} from './pokerLogic';

// ─── Helpers ────────────────────────────────────────────────

function buildShuffledDeck() {
  const deck = [];
  for (const rank of RANKS) for (const suit of SUITS) deck.push({ rank, suit });
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function villainAction(phase, pot) {
  const r = Math.random();
  if (phase === 'preflop') {
    const bb = Math.round(pot / 3);
    const raiseSize = Math.round(bb * (2.5 + Math.random()));
    return { action: 'raise', amount: raiseSize, label: `Raises to ${raiseSize}` };
  }
  if (r < 0.38) return { action: 'check', amount: 0, label: 'Checks' };
  const frac = 0.33 + Math.random() * 0.67;
  const amount = Math.max(1, Math.round(pot * frac));
  return { action: 'bet', amount, label: `Bets ${amount}` };
}

function correctAction(holeCards, communityCards, position, numPlayers, villain, pot) {
  const analysis = analyzeHand(holeCards, communityCards, position, numPlayers);
  if (!analysis) return { action: 'fold', explanation: 'No read available — fold by default.' };
  const { action, equity, explanation } = analysis;
  const isFacingBet = villain.action === 'bet' || villain.action === 'raise';
  if (!isFacingBet) {
    return { action: action === 'raise' ? 'bet' : 'check', isFacingBet: false, equity, explanation };
  }
  const totalPot = pot + villain.amount;
  const potOddsRequired = (villain.amount / totalPot) * 100;
  if (equity < potOddsRequired - 5 || action === 'fold') {
    return { action: 'fold', isFacingBet: true, equity, potOddsRequired, explanation };
  }
  if (action === 'raise' && equity > potOddsRequired + 15) {
    return { action: 'raise', isFacingBet: true, equity, potOddsRequired, explanation };
  }
  return { action: 'call', isFacingBet: true, equity, potOddsRequired, explanation };
}

function acceptableActions(correct, isFacingBet) {
  if (!isFacingBet) {
    if (correct === 'check') return ['check'];
    if (correct === 'bet') return ['bet', 'check'];
  }
  if (correct === 'fold') return ['fold'];
  if (correct === 'call') return ['call', 'raise'];
  if (correct === 'raise') return ['raise', 'call'];
  return [correct];
}

// ─── Card ────────────────────────────────────────────────────

const Card = ({ card, size = 'md' }) => {
  const dims = { sm: [44, 62], md: [60, 84], lg: [76, 106] };
  const fonts = { sm: ['0.82rem', '0.85rem'], md: ['1.1rem', '1.15rem'], lg: ['1.4rem', '1.45rem'] };
  const [w, h] = dims[size];
  const [rankFs, suitFs] = fonts[size];

  if (!card) {
    return (
      <div style={{
        width: w, height: h, borderRadius: 8,
        border: '2px dashed #2a2a2a', background: 'transparent', flexShrink: 0,
      }} />
    );
  }
  return (
    <div style={{
      width: w, height: h, borderRadius: 8,
      background: '#f5f0e8', border: '1.5px solid #ddd',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, gap: 2,
    }}>
      <span style={{ color: SUIT_COLORS[card.suit], fontWeight: 800, fontSize: rankFs, lineHeight: 1 }}>{card.rank}</span>
      <span style={{ color: SUIT_COLORS[card.suit], fontSize: suitFs, lineHeight: 1 }}>{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  );
};

// ─── Poker Table SVG — minimalist ────────────────────────────

const PokerTable = ({ numPlayers, position, pot, villain }) => {
  const W = 380, H = 220;
  const cx = W / 2, cy = H / 2;
  const tableRx = 140, tableRy = 78;
  const seatR   = 7;
  const seatRx  = 168, seatRy  = 100;
  const userAngleDeg = 90;
  const step = 360 / numPlayers;

  const seats = Array.from({ length: numPlayers }, (_, i) => {
    const rad = ((userAngleDeg + i * step) * Math.PI) / 180;
    return {
      x: cx + seatRx * Math.cos(rad),
      y: cy + seatRy * Math.sin(rad),
      isUser:    i === 0,
      isDealer:  i === (numPlayers > 2 ? numPlayers - 2 : 1),
      isVillain: i === 1,
      index: i,
    };
  });

  const dealerAngleRad = ((userAngleDeg + (numPlayers > 2 ? numPlayers - 2 : 1) * step) * Math.PI) / 180;
  const dx = cx + (seatRx - 24) * Math.cos(dealerAngleRad);
  const dy = cy + (seatRy - 14) * Math.sin(dealerAngleRad);
  const isVillainAggressive = villain && (villain.action === 'bet' || villain.action === 'raise');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }}>
      {/* Table outline only — no fill, no gradients */}
      <ellipse cx={cx} cy={cy} rx={tableRx} ry={tableRy} fill="none" stroke="#252525" strokeWidth="1.5" />

      {/* Pot amount */}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="9" fill="#3a3a3a" fontWeight="600" letterSpacing="2">POT</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="20" fill="#c8c0a8" fontWeight="700" fontFamily="-apple-system,sans-serif">{pot}</text>

      {/* Seats */}
      {seats.map(seat => {
        if (seat.isUser) return (
          <g key={seat.index}>
            <circle cx={seat.x} cy={seat.y} r={seatR + 4} fill="none" stroke="#5a9fd4" strokeWidth="1" opacity="0.3" />
            <circle cx={seat.x} cy={seat.y} r={seatR} fill="#5a9fd4" />
          </g>
        );
        if (seat.isVillain) return (
          <g key={seat.index}>
            <circle cx={seat.x} cy={seat.y} r={seatR} fill="none" stroke={isVillainAggressive ? '#e05555' : '#333'} strokeWidth="1.5" />
            {isVillainAggressive && <circle cx={seat.x} cy={seat.y} r={3} fill="#e05555" />}
          </g>
        );
        return (
          <circle key={seat.index} cx={seat.x} cy={seat.y} r={seatR} fill="#222" stroke="#333" strokeWidth="1" />
        );
      })}

      {/* Dealer dot */}
      <circle cx={dx} cy={dy} r={5} fill="#c8c0a8" />
      <text x={dx} y={dy + 3.5} textAnchor="middle" fontSize="5.5" fill="#1a1a1a" fontWeight="800">D</text>

      {/* Position label — bottom centre */}
      <text x={cx} y={H - 4} textAnchor="middle" fontSize="9" fill="#3a3a3a" fontWeight="700" letterSpacing="1">{position}</text>
    </svg>
  );
};

// ─── Phase progress bar ──────────────────────────────────────

const PhaseBar = ({ phase, handOver }) => {
  const phases = ['preflop', 'flop', 'turn', 'river'];
  const currentIdx = phases.indexOf(phase === 'showdown' ? 'river' : phase);
  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {phases.map((p, i) => {
        const done   = i < currentIdx || (handOver && i <= currentIdx);
        const active = p === phase && !handOver;
        return (
          <div key={p} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{
              height: 3, borderRadius: 2,
              background: active ? '#5a9fd4' : done ? '#2d6a2d' : '#1e1e1e',
              transition: 'background 0.3s',
            }} />
            <span style={{ fontSize: '0.62rem', fontWeight: 700, color: active ? '#5a9fd4' : done ? '#2d6a2d' : '#333', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {p}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Constants ───────────────────────────────────────────────

const INITIAL_STATE = {
  phase: 'idle',
  awaitingDecision: false,
  deck: [],
  holeCards: [],
  communityCards: [],
  position: 'BTN',
  numPlayers: 6,
  pot: 0,
  villain: null,
  decisions: [],
  pendingDecision: null,
  handOver: false,
};

// ─── Main Component ──────────────────────────────────────────

const DecisionTesting = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const dealNewHand = useCallback(() => {
    const deck = buildShuffledDeck();
    const holeCards = [deck.shift(), deck.shift()];
    const position = pickRandom(POSITIONS);
    const numPlayers = 4 + Math.floor(Math.random() * 4);
    const pot = 15;
    const villain = villainAction('preflop', pot);
    setState({ ...INITIAL_STATE, phase: 'preflop', awaitingDecision: true, deck, holeCards, communityCards: [], position, numPlayers, pot, villain, decisions: [], pendingDecision: null, handOver: false });
  }, []);

  const handleAction = useCallback((userAction) => {
    setState(prev => {
      const { holeCards, communityCards, position, numPlayers, pot, villain, phase } = prev;
      const ci = correctAction(holeCards, communityCards, position, numPlayers, villain, pot);
      const accepted = acceptableActions(ci.action, ci.isFacingBet);
      const isCorrect = accepted.includes(userAction);
      const decision = { phase, userAction, correctInfo: ci, accepted, isCorrect, pot, villain };
      return { ...prev, awaitingDecision: false, pendingDecision: decision, decisions: [...prev.decisions, decision] };
    });
  }, []);

  const handleContinue = useCallback(() => {
    setState(prev => {
      const { pendingDecision, deck, communityCards, pot, villain, phase } = prev;
      if (!pendingDecision) return prev;
      const { userAction, isCorrect } = pendingDecision;
      setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
      setStreak(s => isCorrect ? s + 1 : 0);
      if (userAction === 'fold') return { ...prev, pendingDecision: null, handOver: true };
      const nextPhases = { preflop: 'flop', flop: 'turn', turn: 'river', river: 'showdown' };
      const nextPhase = nextPhases[phase];
      if (nextPhase === 'showdown') return { ...prev, pendingDecision: null, handOver: true, phase: 'showdown' };
      const newDeck = [...deck];
      const newCommunity = nextPhase === 'flop'
        ? [newDeck.shift(), newDeck.shift(), newDeck.shift()]
        : [...communityCards, newDeck.shift()];
      let newPot = pot;
      if (villain?.amount > 0 && (userAction === 'call' || userAction === 'raise'))
        newPot = pot + villain.amount + (userAction === 'raise' ? villain.amount : 0);
      if (userAction === 'bet') newPot = pot + Math.round(pot * 0.6);
      return { ...prev, phase: nextPhase, awaitingDecision: true, deck: newDeck, communityCards: newCommunity, pot: newPot, villain: villainAction(nextPhase, newPot), pendingDecision: null };
    });
  }, []);

  const { phase, holeCards, communityCards, position, numPlayers, pot, villain,
          awaitingDecision, pendingDecision, handOver, decisions } = state;

  const handNotation = holeCards.length === 2 ? cardsToHandNotation(holeCards[0], holeCards[1]) : null;
  const handInfo     = handNotation ? STARTING_HANDS[handNotation] : null;
  const posInfo      = POSITION_INFO[position];
  const isFacingBet  = villain && (villain.action === 'bet' || villain.action === 'raise');

  // ── IDLE ──────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', padding: '3rem 1rem' }}>
        {score.total > 0 && (
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#888' }}>
            <span><strong style={{ color: '#e0e0e0', fontSize: '1.1rem' }}>{score.correct}/{score.total}</strong> correct</span>
            <span style={{ color: score.correct / score.total >= 0.7 ? '#4ade80' : '#fbbf24', fontWeight: 700, fontSize: '1.1rem' }}>
              {Math.round((score.correct / score.total) * 100)}%
            </span>
            {streak >= 3 && <span style={{ color: '#fbbf24' }}>{streak} in a row</span>}
          </div>
        )}
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '0.75rem' }}>Test Your Poker Decisions</div>
          <div style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.7 }}>
            You'll be dealt a random hand and taken through each street. Choose your action, then see if you were right and why.
          </div>
        </div>
        <button className="control-btn" onClick={dealNewHand} style={{ fontSize: '1rem', padding: '0.75rem 2.5rem' }}>
          Deal New Hand
        </button>
      </div>
    );
  }

  // ── ACTIVE HAND ───────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Top bar: score + new hand */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: '#555' }}>
          {score.total > 0 && (
            <>
              <span><strong style={{ color: '#e0e0e0' }}>{score.correct}/{score.total}</strong></span>
              <span style={{ color: score.correct / score.total >= 0.7 ? '#4ade80' : '#fbbf24', fontWeight: 700 }}>
                {Math.round((score.correct / score.total) * 100)}%
              </span>
              {streak >= 3 && <span style={{ color: '#fbbf24' }}>{streak}x</span>}
            </>
          )}
        </div>
        {!handOver && (
          <button onClick={dealNewHand} style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 9999, color: '#555', fontSize: '0.75rem', padding: '0.3rem 0.85rem', cursor: 'pointer' }}>
            New Hand
          </button>
        )}
      </div>

      {/* Phase progress */}
      <PhaseBar phase={phase} handOver={handOver} />

      {/* Main board — table + cards in one clean block */}
      <div style={{ borderRadius: 12, border: '1px solid #1e1e1e', overflow: 'hidden' }}>

        {/* Table diagram */}
        <div style={{ padding: '1.5rem 1rem 0.75rem', background: '#111' }}>
          <PokerTable numPlayers={numPlayers} position={position} pot={pot} villain={villain} phase={phase} />
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#333', letterSpacing: '0.06em' }}>
            {posInfo?.fullName}&ensp;·&ensp;{numPlayers} players
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#1a1a1a' }} />

        {/* Cards */}
        <div style={{ padding: '1.5rem', background: '#0e0e0e', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Your hand */}
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Hand</div>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              {holeCards.map((c, i) => <Card key={i} card={c} size="lg" />)}
              {handInfo && (
                <div style={{ marginLeft: '0.85rem' }}>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#d0d0d0' }}>{handInfo.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#3a3a3a', marginTop: 4 }}>{handInfo.equity}% equity</div>
                  {communityCards.length > 0 && (() => {
                    const a = analyzeHand(holeCards, communityCards, position, numPlayers);
                    return a?.madeHand
                      ? <div style={{ fontSize: '0.82rem', color: '#5a9fd4', marginTop: 4 }}>{a.madeHand}</div>
                      : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Board */}
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#333', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Board</div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {Array.from({ length: 5 }).map((_, i) => <Card key={i} card={communityCards[i] || null} size="lg" />)}
            </div>
          </div>

        </div>
      </div>

      {/* Villain action banner */}
      {villain && awaitingDecision && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.1rem', background: '#161616', borderRadius: 10, border: `1px solid ${isFacingBet ? '#3a1a1a' : '#1e2a1e'}` }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: isFacingBet ? '#e05555' : '#3a7a3a', flexShrink: 0 }} />
          <span style={{ fontSize: '0.95rem', color: '#bbb' }}>
            <strong style={{ color: '#e0e0e0' }}>Villain</strong> {villain.label}
          </span>
          {villain.amount > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#555' }}>
              need {((villain.amount / (pot + villain.amount)) * 100).toFixed(0)}% equity to call
            </span>
          )}
        </div>
      )}

      {/* Decision buttons */}
      {awaitingDecision && !pendingDecision && (
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Your Decision</div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isFacingBet ? (
              <>
                <BigActionBtn label="Fold" sub="Give up the hand" color="#ef4444" onClick={() => handleAction('fold')} />
                <BigActionBtn label="Call" sub={`${villain.amount} chips`} color="#fbbf24" onClick={() => handleAction('call')} />
                <BigActionBtn label="Raise" sub={`~${(villain.amount * 2.5) | 0} chips`} color="#4ade80" onClick={() => handleAction('raise')} />
              </>
            ) : (
              <>
                <BigActionBtn label="Check" sub="Pass the action" color="#888" onClick={() => handleAction('check')} />
                <BigActionBtn label="Bet" sub={`~${Math.round(pot * 0.6)} chips`} color="#4ade80" onClick={() => handleAction('bet')} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {pendingDecision && (
        <DecisionResult decision={pendingDecision} onContinue={handleContinue} isLastStreet={phase === 'river'} />
      )}

      {/* Summary */}
      {handOver && !pendingDecision && (
        <HandSummary decisions={decisions} onNewHand={dealNewHand} />
      )}

    </div>
  );
};

// ─── Big action button ───────────────────────────────────────

const BigActionBtn = ({ label, sub, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: '#f0d9b5', color: '#7c4c3e',
      border: 'none', borderRadius: 9999,
      padding: '0.75rem 2rem',
      fontSize: '1rem', fontWeight: 700,
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      transition: 'opacity 0.15s',
      minWidth: 110,
    }}
    onMouseEnter={e => { e.currentTarget.style.opacity = '0.8'; }}
    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
  >
    <span>{label}</span>
    {sub && <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 500 }}>{sub}</span>}
  </button>
);

// ─── Decision Result ─────────────────────────────────────────

const DecisionResult = ({ decision, onContinue, isLastStreet }) => {
  const { userAction, correctInfo, isCorrect } = decision;
  const actColors = ACTION_COLORS[correctInfo.action] || ACTION_COLORS.fold;
  const userFolded = userAction === 'fold';

  return (
    <div style={{ borderRadius: 12, border: `1px solid ${isCorrect ? '#1e4a1e' : '#4a1e1e'}`, background: isCorrect ? 'rgba(26,58,26,0.4)' : 'rgba(58,26,26,0.4)', padding: '1.5rem' }}>

      {/* Verdict */}
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: isCorrect ? '#4ade80' : '#ef4444', marginBottom: '0.35rem' }}>
        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1.1rem' }}>
        You chose <strong style={{ color: '#e0e0e0' }}>{userAction.toUpperCase()}</strong>
        {!isCorrect && <> · Best play was <strong style={{ color: actColors.text }}>{correctInfo.action.toUpperCase()}</strong></>}
      </div>

      {/* Stats row */}
      {correctInfo.equity !== undefined && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Hand Equity</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: correctInfo.equity >= 50 ? '#4ade80' : '#fbbf24' }}>{correctInfo.equity}%</div>
          </div>
          {correctInfo.isFacingBet && correctInfo.potOddsRequired !== undefined && (
            <div>
              <div style={{ fontSize: '0.65rem', color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Needed to Call</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e0e0e0' }}>{correctInfo.potOddsRequired.toFixed(1)}%</div>
            </div>
          )}
          {correctInfo.isFacingBet && correctInfo.potOddsRequired !== undefined && (
            <div style={{ alignSelf: 'flex-end', fontSize: '0.85rem', fontWeight: 700, color: correctInfo.equity >= correctInfo.potOddsRequired ? '#4ade80' : '#ef4444', paddingBottom: 3 }}>
              {correctInfo.equity >= correctInfo.potOddsRequired ? 'Profitable call' : 'Unprofitable call'}
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {correctInfo.explanation && (
        <div style={{ fontSize: '0.88rem', color: '#999', lineHeight: 1.7, marginBottom: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
          {correctInfo.explanation.split('\n\n').slice(0, 2).map((para, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '0.6rem 0 0' }}>
              {para.split(/\*\*(.*?)\*\*/g).map((p, j) =>
                j % 2 === 1 ? <strong key={j} style={{ color: '#d0d0d0' }}>{p}</strong> : p
              )}
            </p>
          ))}
        </div>
      )}

      <button className="control-btn" onClick={onContinue} style={{ fontSize: '0.95rem', padding: '0.65rem 1.75rem' }}>
        {userFolded || isLastStreet ? 'See Summary' : 'Next Street →'}
      </button>
    </div>
  );
};

// ─── Hand Summary ─────────────────────────────────────────────

const PHASE_LABELS = { preflop: 'Pre-Flop', flop: 'Flop', turn: 'Turn', river: 'River' };

const HandSummary = ({ decisions, onNewHand }) => {
  const total = decisions.length;
  const correct = decisions.filter(d => d.isCorrect).length;

  return (
    <div style={{ borderRadius: 12, border: '1px solid #1e1e1e', background: '#141414', padding: '1.5rem' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Hand Summary</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: correct === total ? '#4ade80' : correct / total >= 0.6 ? '#fbbf24' : '#ef4444', marginBottom: '1.25rem' }}>
        {correct}/{total}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {decisions.map((d, i) => {
          const actColors = ACTION_COLORS[d.correctInfo.action] || ACTION_COLORS.fold;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', background: d.isCorrect ? 'rgba(26,58,26,0.3)' : 'rgba(58,26,26,0.3)', borderRadius: 8, border: `1px solid ${d.isCorrect ? '#1e3a1e' : '#3a1e1e'}` }}>
              <span style={{ fontSize: '0.75rem', color: '#555', minWidth: 60, fontWeight: 700 }}>{PHASE_LABELS[d.phase]}</span>
              <span style={{ fontSize: '0.88rem', color: d.isCorrect ? '#4ade80' : '#ef4444', fontWeight: 800 }}>
                {d.isCorrect ? '✓' : '✗'} {d.userAction.toUpperCase()}
              </span>
              {!d.isCorrect && (
                <span style={{ fontSize: '0.78rem', color: '#666' }}>
                  → <strong style={{ color: actColors.text }}>{d.correctInfo.action.toUpperCase()}</strong>
                </span>
              )}
              <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#444' }}>
                {d.correctInfo.equity}% eq
              </span>
            </div>
          );
        })}
      </div>

      <button className="control-btn" onClick={onNewHand} style={{ fontSize: '0.95rem', padding: '0.65rem 1.75rem' }}>
        Deal Another Hand
      </button>
    </div>
  );
};

export default DecisionTesting;
