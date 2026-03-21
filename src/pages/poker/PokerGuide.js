import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import CardPicker from './CardPicker';
import PositionSelector from './PositionSelector';
import HandAnalysis from './HandAnalysis';
import HandRangeChart from './HandRangeChart';
import DecisionTesting from './DecisionTesting';
import { analyzeHand, HAND_RANKINGS, POSITION_INFO, POSITIONS } from './pokerLogic';

// ─── Static: Hand Rankings Reference ───────────────────────
const HandRankingsTable = () => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
      <thead>
        <tr>
          {['Rank', 'Hand', 'Example', 'Probability', 'Description'].map(h => (
            <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: '#666', fontWeight: 700, fontSize: '0.68rem', letterSpacing: '0.07em', textTransform: 'uppercase', borderBottom: '1px solid #2a2a2a' }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {HAND_RANKINGS.map((row, i) => (
          <tr key={row.rank} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
            <td style={{ padding: '0.5rem 0.75rem', color: '#555', fontWeight: 700 }}>{row.rank}</td>
            <td style={{ padding: '0.5rem 0.75rem', color: '#e0e0e0', fontWeight: 700 }}>{row.name}</td>
            <td style={{ padding: '0.5rem 0.75rem', color: '#888', fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.example}</td>
            <td style={{ padding: '0.5rem 0.75rem', color: '#666' }}>{row.probability}</td>
            <td style={{ padding: '0.5rem 0.75rem', color: '#999', lineHeight: 1.4 }}>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ─── Static: Position Strategy Guide ───────────────────────
const PositionGuide = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
    {POSITIONS.map(pos => {
      const info = POSITION_INFO[pos];
      return (
        <div key={pos} style={{ background: '#181818', borderRadius: 8, padding: '0.9rem 1rem', border: '1px solid #262626' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#e0e0e0' }}>{pos}</span>
            <span style={{ fontSize: '0.68rem', color: '#5a9fd4', fontWeight: 600 }}>{info.tightnessLabel}</span>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', marginBottom: '0.35rem' }}>{info.fullName}</div>
          <div style={{ fontSize: '0.78rem', color: '#999', lineHeight: 1.5 }}>{info.description}</div>
        </div>
      );
    })}
  </div>
);

// ─── Main Page ──────────────────────────────────────────────
const PokerGuide = () => {
  const [holeCards, setHoleCards]         = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [position, setPosition]           = useState('BTN');
  const [numPlayers, setNumPlayers]       = useState(6);
  const [analysis, setAnalysis]           = useState(null);
  const [potSize, setPotSize]             = useState('');
  const [betSize, setBetSize]             = useState('');
  const [activeTab, setActiveTab]         = useState('decision'); // 'decision' | 'simulator' | 'rankings' | 'positions'

  useEffect(() => {
    if (holeCards.length === 2) {
      const result = analyzeHand(holeCards, communityCards, position, numPlayers);
      setAnalysis(result);
    } else {
      setAnalysis(null);
    }
  }, [holeCards, communityCards, position, numPlayers]);

  const toggleHoleCard = (card) => {
    setHoleCards(prev => {
      const exists = prev.some(c => c.rank === card.rank && c.suit === card.suit);
      if (exists) return prev.filter(c => !(c.rank === card.rank && c.suit === card.suit));
      if (prev.length >= 2) return prev;
      return [...prev, card];
    });
  };

  const toggleCommunityCard = (card) => {
    setCommunityCards(prev => {
      const exists = prev.some(c => c.rank === card.rank && c.suit === card.suit);
      if (exists) return prev.filter(c => !(c.rank === card.rank && c.suit === card.suit));
      if (prev.length >= 5) return prev;
      return [...prev, card];
    });
  };

  const resetAll = () => {
    setHoleCards([]);
    setCommunityCards([]);
    setPotSize('');
    setBetSize('');
    setAnalysis(null);
  };

  const tabs = [
    { key: 'decision',  label: 'Decision Testing' },
    { key: 'simulator', label: 'Hand Simulator' },
    { key: 'rankings',  label: 'Hand Rankings' },
    { key: 'positions', label: 'Positions Guide' },
  ];

  return (
    <div className="dark-app" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header title="Poker Hand Analyzer" />

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1rem 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Subtitle */}
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.25rem', marginTop: 0 }}>
            Test your decisions in live hand simulations, analyze any hand, or study position theory and hand rankings.
          </p>

          {/* Tab navigation */}
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.25rem', borderBottom: '1px solid #2a2a2a', paddingBottom: 0 }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.8rem', fontWeight: 700,
                  color: activeTab === tab.key ? '#e0e0e0' : '#555',
                  borderBottom: activeTab === tab.key ? '2px solid #5a9fd4' : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'color 0.15s',
                  letterSpacing: '0.02em',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── DECISION TESTING TAB ── */}
          {activeTab === 'decision' && (
            <div className="poker-section">
              <DecisionTesting />
            </div>
          )}

          {/* ── SIMULATOR TAB ── */}
          {activeTab === 'simulator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Top row: inputs side by side on wide screens */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>

                {/* Hole cards */}
                <div className="poker-section">
                  <div className="poker-section-title">Your Hole Cards</div>
                  <CardPicker
                    selectedCards={holeCards}
                    onCardSelect={toggleHoleCard}
                    maxCards={2}
                    label="Hole Cards"
                    disabledCards={communityCards}
                  />
                </div>

                {/* Community cards */}
                <div className="poker-section">
                  <div className="poker-section-title">Community Cards (optional)</div>
                  <CardPicker
                    selectedCards={communityCards}
                    onCardSelect={toggleCommunityCard}
                    maxCards={5}
                    label="Community Cards"
                    disabledCards={holeCards}
                  />
                </div>
              </div>

              {/* Position selector */}
              <div className="poker-section">
                <div className="poker-section-title">Table Position</div>
                <PositionSelector
                  selectedPosition={position}
                  onPositionSelect={setPosition}
                  numPlayers={numPlayers}
                  onNumPlayersChange={setNumPlayers}
                />
              </div>

              {/* Reset button */}
              {(holeCards.length > 0 || communityCards.length > 0) && (
                <div>
                  <button
                    onClick={resetAll}
                    className="control-btn"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Reset All Cards
                  </button>
                </div>
              )}

              {/* Analysis (only when 2 hole cards selected) */}
              {analysis ? (
                <>
                  {/* Hand Analysis */}
                  <div className="poker-section" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #2a2a2a' }}>
                      <div className="poker-section-title" style={{ marginBottom: 0 }}>Analysis</div>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <HandAnalysis
                        analysis={analysis}
                        isPreFlop={communityCards.length === 0}
                        potSize={potSize}
                        betSize={betSize}
                        onPotSizeChange={setPotSize}
                        onBetSizeChange={setBetSize}
                      />
                    </div>
                  </div>

                  {/* Hand Range Chart */}
                  <div className="poker-section" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="poker-section-title" style={{ marginBottom: 0 }}>Pre-Flop Ranges from {position}</div>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <HandRangeChart
                        position={position}
                        currentHand={analysis.handNotation}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Placeholder when no cards selected */
                <div style={{
                  padding: '2.5rem 1rem', textAlign: 'center',
                  border: '1px dashed #2a2a2a', borderRadius: 10, color: '#444',
                  fontSize: '0.85rem', lineHeight: 1.7,
                }}>
                  Select your 2 hole cards above to see<br />strategy recommendations, win probability, and range analysis.
                </div>
              )}
            </div>
          )}

          {/* ── HAND RANKINGS TAB ── */}
          {activeTab === 'rankings' && (
            <div className="poker-section">
              <div className="poker-section-title">Poker Hand Rankings (Best to Worst)</div>
              <HandRankingsTable />
            </div>
          )}

          {/* ── POSITIONS GUIDE TAB ── */}
          {activeTab === 'positions' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#888', fontSize: '0.82rem', margin: 0, lineHeight: 1.6 }}>
                  Position is one of the most important factors in poker. Acting last gives you maximum information about your opponents' actions before you have to make a decision.
                </p>
              </div>
              <div className="poker-section">
                <div className="poker-section-title">Position Breakdown</div>
                <PositionGuide />
              </div>

              {/* Key concepts */}
              <div className="poker-section" style={{ marginTop: '1rem' }}>
                <div className="poker-section-title">Key Concepts</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { title: 'Position Advantage', text: 'Acting last means you see what your opponents do before deciding. This information advantage lets you bluff more effectively, value bet accurately, and control the pot size.' },
                    { title: 'Opening Ranges', text: 'From UTG you should only open the top ~15% of hands. From the Button you can profitably open up to ~45% of hands. The further left your position, the tighter you play.' },
                    { title: 'Stealing Blinds', text: 'From the Cutoff and Button, raising to "steal" the blinds is highly profitable. The blinds act out of position post-flop and must defend or fold. Consistent stealing adds significant profit over time.' },
                    { title: '3-Betting in Position', text: 'Re-raising (3-betting) a player who will be out of position against you builds a bigger pot where your positional advantage compounds. Premium hands should 3-bet for value; some bluffs fill out the 3-bet range.' },
                    { title: 'Big Blind Defense', text: 'Since you\'ve already invested in the pot, you get a price to call raises. Defend your BB liberally against late position steals — roughly 40-50% of hands depending on the position raising.' },
                  ].map(({ title, text }) => (
                    <div key={title} style={{ borderLeft: '3px solid #2a4a2a', paddingLeft: '0.85rem' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e0e0', marginBottom: '0.25rem' }}>{title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#999', lineHeight: 1.55 }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PokerGuide;
