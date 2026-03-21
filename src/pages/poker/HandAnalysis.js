import React from 'react';
import { CATEGORY_COLORS, ACTION_COLORS, calculatePotOdds } from './pokerLogic';

// Renders markdown-like bold (**text**) in explanation strings
const ExplainText = ({ text }) => {
  if (!text) return null;
  const paragraphs = text.split('\n\n').filter(Boolean);
  return (
    <div className="poker-explanation">
      {paragraphs.map((para, i) => {
        const parts = para.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j} style={{ color: '#e0e0e0' }}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
};

const HandAnalysis = ({ analysis, isPreFlop, potSize, betSize, onPotSizeChange, onBetSizeChange }) => {
  if (!analysis) return null;

  const catColors  = CATEGORY_COLORS[analysis.handCategory] || CATEGORY_COLORS.marginal;
  const actColors  = ACTION_COLORS[analysis.action]          || ACTION_COLORS.fold;

  const equityFillColor = analysis.equity >= 65 ? '#4ade80' : analysis.equity >= 50 ? '#fbbf24' : '#ef4444';

  const potOdds = potSize && betSize ? calculatePotOdds(potSize, betSize) : null;
  const callProfitable = potOdds ? parseFloat(potOdds.neededEquity) <= analysis.equity : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

      {/* Hand name + category */}
      <div className="poker-section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#e0e0e0', lineHeight: 1.1 }}>
            {analysis.handName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
            {analysis.handNotation}
            {analysis.madeHand && ` · ${analysis.madeHand}`}
          </div>
        </div>
        <div style={{
          padding: '0.3rem 0.8rem', borderRadius: 9999,
          background: catColors.bg, color: catColors.text, border: `1px solid ${catColors.border}`,
          fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {analysis.handCategory}
        </div>
      </div>

      {/* Equity bar */}
      <div className="poker-section">
        <div className="poker-section-title">Win Probability</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="poker-equity-bar" style={{ flex: 1 }}>
            <div
              className="poker-equity-fill"
              style={{ width: `${analysis.equity}%`, background: equityFillColor }}
            />
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: equityFillColor, minWidth: 52, textAlign: 'right' }}>
            {analysis.equity}%
          </div>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.4rem' }}>
          Equity vs. {isPreFlop ? 'random hand' : 'average opponent range'}
        </div>
      </div>

      {/* Action recommendation */}
      <div className="poker-section" style={{ borderLeft: `4px solid ${actColors.text}` }}>
        <div className="poker-section-title">Recommended Action</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: actColors.text, letterSpacing: '0.05em' }}>
            {analysis.action.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#666' }}>
            {analysis.confidence}% confidence
          </div>
        </div>
      </div>

      {/* Strategy explanation */}
      <div className="poker-section">
        <div className="poker-section-title">Why this action?</div>
        <ExplainText text={analysis.explanation} />
      </div>

      {/* Post-flop draws */}
      {!isPreFlop && analysis.draws && analysis.draws.length > 0 && (
        <div className="poker-section">
          <div className="poker-section-title">Drawing Outs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {analysis.draws.map((draw, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#c0c0c0' }}>{draw.name}</span>
                <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>
                  {draw.outs} outs → ~{draw.outs * 2}% next card
                </span>
              </div>
            ))}
            <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: '#666', borderTop: '1px solid #2a2a2a', paddingTop: '0.4rem' }}>
              Rule of 2 &amp; 4: multiply outs × 4 for two cards to come, × 2 for one card.
            </div>
          </div>
        </div>
      )}

      {/* Pot odds calculator */}
      <div className="poker-section">
        <div className="poker-section-title">Pot Odds Calculator</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: 110 }}>
            <label style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pot Size</label>
            <input
              type="number"
              placeholder="e.g. 100"
              value={potSize}
              onChange={e => onPotSizeChange(e.target.value)}
              style={{
                background: '#141414', border: '1px solid #333', borderRadius: 6,
                color: '#e0e0e0', padding: '0.4rem 0.6rem', fontSize: '0.9rem', outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1, minWidth: 110 }}>
            <label style={{ fontSize: '0.68rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bet to Call</label>
            <input
              type="number"
              placeholder="e.g. 30"
              value={betSize}
              onChange={e => onBetSizeChange(e.target.value)}
              style={{
                background: '#141414', border: '1px solid #333', borderRadius: 6,
                color: '#e0e0e0', padding: '0.4rem 0.6rem', fontSize: '0.9rem', outline: 'none',
                width: '100%',
              }}
            />
          </div>
        </div>

        {potOdds && (
          <div style={{ marginTop: '0.75rem', padding: '0.65rem 0.85rem', background: '#141414', borderRadius: 7, border: `1px solid ${callProfitable ? '#2d6a2d' : '#6a2020'}` }}>
            <div style={{ fontSize: '0.82rem', color: '#c0c0c0', lineHeight: 1.5 }}>
              Pot odds: <strong style={{ color: '#e0e0e0' }}>{potOdds.potOddsRatio}:1</strong>
              {' '}· Need <strong style={{ color: '#e0e0e0' }}>{potOdds.neededEquity}%</strong> equity to call
              {' '}· You have <strong style={{ color: equityFillColor }}>{analysis.equity}%</strong>
            </div>
            <div style={{ marginTop: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: callProfitable ? '#4ade80' : '#ef4444' }}>
              {callProfitable ? '✓ Profitable call — your equity beats the required threshold.' : '✗ Calling is unprofitable — fold unless you have additional equity in position or fold equity.'}
            </div>
          </div>
        )}

        {!potOdds && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#555' }}>
            Enter pot size and bet size to calculate whether calling is mathematically profitable.
          </div>
        )}
      </div>
    </div>
  );
};

export default HandAnalysis;
