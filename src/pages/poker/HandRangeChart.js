import React, { useState } from 'react';
import { RANKS, STARTING_HANDS, getRangeAction, ACTION_COLORS } from './pokerLogic';

const RANGE_CELL_COLORS = {
  raise: { bg: '#1f3d1f', text: '#4ade80' },
  call:  { bg: '#3d3510', text: '#fbbf24' },
  fold:  { bg: '#1a1a1a', text: '#444' },
};

function getHandNotation(r1, r2) {
  const i1 = RANKS.indexOf(r1);
  const i2 = RANKS.indexOf(r2);
  if (i1 === i2) return r1 + r2; // pocket pair
  if (i1 < i2) return r1 + r2 + 's'; // suited (high rank first, r1 is higher = smaller index)
  return r2 + r1 + 'o'; // offsuit (high rank first)
}

const HandRangeChart = ({ position, currentHand, onHandHover }) => {
  const [tooltip, setTooltip] = useState(null); // { hand, x, y }

  const handleMouseEnter = (e, hand) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ hand, x: rect.left + rect.width / 2, y: rect.top - 8 });
    if (onHandHover) onHandHover(hand);
  };

  const handleMouseLeave = () => {
    setTooltip(null);
    if (onHandHover) onHandHover(null);
  };

  // Count range hands for stats
  let raiseCount = 0, callCount = 0;
  RANKS.forEach(r1 => RANKS.forEach(r2 => {
    const hand = getHandNotation(r1, r2);
    const action = getRangeAction(hand, position);
    if (action === 'raise') raiseCount++;
    else if (action === 'call') callCount++;
  }));
  const totalHands = 169;

  return (
    <div>
      {/* Range stats */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '0.75rem', color: '#4ade80' }}>
          <strong>{raiseCount}</strong> <span style={{ color: '#666' }}>raise ({((raiseCount/totalHands)*100).toFixed(0)}%)</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
          <strong>{callCount}</strong> <span style={{ color: '#666' }}>call/defend ({((callCount/totalHands)*100).toFixed(0)}%)</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#555' }}>
          <strong>{totalHands - raiseCount - callCount}</strong> <span style={{ color: '#444' }}>fold ({(((totalHands - raiseCount - callCount)/totalHands)*100).toFixed(0)}%)</span>
        </div>
      </div>

      {/* Grid container */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `22px repeat(13, 1fr)`, gap: 1, marginBottom: 1 }}>
            <div />
            {RANKS.map(r => (
              <div key={r} style={{ fontSize: '0.6rem', fontWeight: 700, color: '#555', textAlign: 'center', paddingBottom: 2, minWidth: 28 }}>{r}</div>
            ))}
          </div>

          {/* Rows */}
          {RANKS.map((r1, i1) => (
            <div key={r1} style={{ display: 'grid', gridTemplateColumns: `22px repeat(13, 1fr)`, gap: 1, marginBottom: 1 }}>
              {/* Row header */}
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r1}</div>

              {RANKS.map((r2, i2) => {
                // i1 < i2 → above diagonal → suited
                // i1 > i2 → below diagonal → offsuit
                // i1 === i2 → pair
                const hand = getHandNotation(r1, r2);
                const action = getRangeAction(hand, position);
                const colors = RANGE_CELL_COLORS[action];
                const isCurrent = currentHand === hand;

                // Labels: pairs have just rank, suited gets 's', offsuit gets 'o'
                let cellLabel;
                if (i1 === i2) cellLabel = r1 + r2;
                else if (i1 < i2) cellLabel = r1 + r2 + 's';
                else cellLabel = r2 + r1 + 'o';

                return (
                  <div
                    key={r2}
                    className={`poker-range-cell${isCurrent ? ' poker-range-cell-current' : ''}`}
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      minWidth: 28, minHeight: 28,
                    }}
                    onMouseEnter={e => handleMouseEnter(e, hand)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {cellLabel}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { action: 'raise', label: 'Raise' },
          { action: 'call',  label: 'Call / Defend' },
          { action: 'fold',  label: 'Fold' },
        ].map(({ action, label }) => (
          <div key={action} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: RANGE_CELL_COLORS[action].bg, border: `1px solid ${RANGE_CELL_COLORS[action].text}` }} />
            <span style={{ fontSize: '0.7rem', color: RANGE_CELL_COLORS[action].text }}>{label}</span>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, border: '2px solid #5a9fd4' }} />
          <span style={{ fontSize: '0.7rem', color: '#5a9fd4' }}>Your hand</span>
        </div>
      </div>

      {/* Tooltip (portal-less, fixed position) */}
      {tooltip && (
        <div
          className="poker-range-tooltip"
          style={{ position: 'fixed', left: tooltip.x, top: tooltip.y - 48, transform: 'translateX(-50%)' }}
        >
          {(() => {
            const info = STARTING_HANDS[tooltip.hand];
            const act = getRangeAction(tooltip.hand, position);
            const actColor = ACTION_COLORS[act];
            if (!info) return <span>{tooltip.hand}</span>;
            return (
              <>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{info.name}</div>
                <div style={{ color: '#888', marginBottom: 2 }}>{info.equity}% equity · {info.category}</div>
                <div style={{ color: actColor?.text || '#e0e0e0', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {act} from {position}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default HandRangeChart;
