import React from 'react';
import { RANKS, SUITS, SUIT_SYMBOLS, SUIT_COLORS } from './pokerLogic';

const CardPicker = ({ selectedCards = [], onCardSelect, maxCards, label, disabledCards = [] }) => {
  const isSelected = (card) =>
    selectedCards.some(c => c.rank === card.rank && c.suit === card.suit);

  const isDisabled = (card) =>
    disabledCards.some(c => c.rank === card.rank && c.suit === card.suit);

  const canSelect = (card) => !isDisabled(card) && (isSelected(card) || selectedCards.length < maxCards);

  const handleClick = (card) => {
    if (isDisabled(card)) return;
    if (!isSelected(card) && selectedCards.length >= maxCards) return;
    onCardSelect(card);
  };

  return (
    <div>
      {/* Selected cards display */}
      <div style={{ marginBottom: '0.9rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666', marginBottom: '0.5rem' }}>
          {label} ({selectedCards.length}/{maxCards})
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', minHeight: '82px' }}>
          {selectedCards.map((card, i) => (
            <div
              key={i}
              className="poker-card poker-card-large poker-card-selected"
              onClick={() => onCardSelect(card)}
              title="Click to deselect"
            >
              <span style={{ color: SUIT_COLORS[card.suit], display: 'block', lineHeight: 1 }}>{card.rank}</span>
              <span style={{ color: SUIT_COLORS[card.suit], fontSize: '1rem' }}>{SUIT_SYMBOLS[card.suit]}</span>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: maxCards - selectedCards.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              style={{
                width: 56, height: 78,
                borderRadius: 7,
                border: '2px dashed #444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#444',
                fontSize: '1.4rem',
                flexShrink: 0,
              }}
            >
              ?
            </div>
          ))}
        </div>
      </div>

      {/* Card grid — 4 rows (suits) × 13 columns (ranks) */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
          {/* Rank headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `20px repeat(13, 36px)`, gap: 2, marginBottom: 2 }}>
            <div />
            {RANKS.map(r => (
              <div key={r} style={{ fontSize: '0.6rem', fontWeight: 700, color: '#555', textAlign: 'center', paddingBottom: 2 }}>{r}</div>
            ))}
          </div>

          {SUITS.map(suit => (
            <div key={suit} style={{ display: 'grid', gridTemplateColumns: `20px repeat(13, 36px)`, gap: 2, marginBottom: 2 }}>
              {/* Suit label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: SUIT_COLORS[suit] }}>
                {SUIT_SYMBOLS[suit]}
              </div>

              {RANKS.map(rank => {
                const card = { rank, suit };
                const selected = isSelected(card);
                const disabled = isDisabled(card);
                const inactive = !canSelect(card) && !selected;

                return (
                  <div
                    key={rank}
                    className={`poker-card${selected ? ' poker-card-selected' : ''}${disabled ? ' poker-card-disabled' : ''}`}
                    style={inactive && !disabled ? { opacity: 0.45, cursor: 'default' } : {}}
                    onClick={() => handleClick(card)}
                    title={`${rank}${SUIT_SYMBOLS[suit]}`}
                  >
                    <span style={{ color: SUIT_COLORS[suit], display: 'block', lineHeight: 1, fontSize: '0.68rem' }}>{rank}</span>
                    <span style={{ color: SUIT_COLORS[suit], fontSize: '0.72rem' }}>{SUIT_SYMBOLS[suit]}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardPicker;
