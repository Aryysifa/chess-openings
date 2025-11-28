import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';

const BlackjackBeginnersGuide = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on initial load
    window.scrollTo(0, 0);

    // Check if we need to scroll to a specific section
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        // Small delay to ensure page is fully rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
      position: 'relative',
      overflowX: 'hidden',
      margin: 0,
      padding: 0
    }}>
      {/* Subtle geometric pattern overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(139, 69, 69, 0.03) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(139, 69, 69, 0.03) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <Header title="Blackjack Beginners Guide" />

      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        boxSizing: 'border-box'
      }}>
        {/* Blackjack Rules Section */}
        <section id="rules" style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em'
          }}>
            Blackjack Rules
          </h1>

          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            lineHeight: '1.8',
            color: '#e0e0e0'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              Content for Blackjack Rules will go here...
            </p>
          </div>
        </section>

        {/* Strategy Table Section */}
        <section id="strategy-table" style={{ marginBottom: '4rem', scrollMarginTop: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#f0f0f0',
            marginBottom: '1.5rem',
            letterSpacing: '-0.025em'
          }}>
            Basic Strategy Chart
          </h1>

          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '2rem',
            lineHeight: '1.8',
            color: '#e0e0e0'
          }}>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#b0b0b0' }}>
              This strategy is optimal for standard blackjack with 4-8 decks where the dealer stands on soft 17.
              The chart shows the mathematically correct play for every possible hand combination.
            </p>

            {/* Legend */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#2e7d32', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.9rem' }}>H = Hit</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#c62828', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.9rem' }}>S = Stand</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#1565c0', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.9rem' }}>D = Double (or Hit)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#f57c00', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.9rem' }}>P = Split</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '30px', height: '30px', backgroundColor: '#6a1b9a', borderRadius: '4px' }}></div>
                <span style={{ fontSize: '0.9rem' }}>R = Surrender (or Hit)</span>
              </div>
            </div>

            {/* Hard Totals Table */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              Hard Totals
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2a2a2a' }}>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>Your Hand</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>2</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>3</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>4</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>5</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>6</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>7</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>8</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>9</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>10</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>A</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['17+', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    ['16', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'R', 'R', 'R'],
                    ['15', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'R', 'H'],
                    ['14', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
                    ['13', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
                    ['12', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
                    ['11', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H'],
                    ['10', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
                    ['9', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
                    ['8 or less', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H']
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.75rem', border: '1px solid #444', fontWeight: '600', backgroundColor: '#252525' }}>{row[0]}</td>
                      {row.slice(1).map((cell, cellIdx) => (
                        <td key={cellIdx} style={{
                          padding: '0.75rem',
                          border: '1px solid #444',
                          textAlign: 'center',
                          fontWeight: '600',
                          backgroundColor: cell === 'H' ? '#2e7d32' : cell === 'S' ? '#c62828' : cell === 'D' ? '#1565c0' : cell === 'R' ? '#6a1b9a' : '#2e7d32',
                          color: '#fff'
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Soft Totals Table */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              Soft Totals (Hands with an Ace counted as 11)
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2a2a2a' }}>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>Your Hand</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>2</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>3</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>4</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>5</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>6</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>7</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>8</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>9</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>10</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>A</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['A,9 (20)', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    ['A,8 (19)', 'S', 'S', 'S', 'S', 'D', 'S', 'S', 'S', 'S', 'S'],
                    ['A,7 (18)', 'D', 'D', 'D', 'D', 'D', 'S', 'S', 'H', 'H', 'H'],
                    ['A,6 (17)', 'H', 'D', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
                    ['A,5 (16)', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
                    ['A,4 (15)', 'H', 'H', 'D', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
                    ['A,3 (14)', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H'],
                    ['A,2 (13)', 'H', 'H', 'H', 'D', 'D', 'H', 'H', 'H', 'H', 'H']
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.75rem', border: '1px solid #444', fontWeight: '600', backgroundColor: '#252525' }}>{row[0]}</td>
                      {row.slice(1).map((cell, cellIdx) => (
                        <td key={cellIdx} style={{
                          padding: '0.75rem',
                          border: '1px solid #444',
                          textAlign: 'center',
                          fontWeight: '600',
                          backgroundColor: cell === 'H' ? '#2e7d32' : cell === 'S' ? '#c62828' : cell === 'D' ? '#1565c0' : '#2e7d32',
                          color: '#fff'
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pairs Table */}
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem', marginTop: '2rem' }}>
              Pairs (When to Split)
            </h2>
            <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#2a2a2a' }}>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>Your Hand</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>2</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>3</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>4</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>5</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>6</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>7</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>8</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>9</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>10</th>
                    <th style={{ padding: '0.75rem', border: '1px solid #444', color: '#f0f0f0' }}>A</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['A,A', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                    ['10,10', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
                    ['9,9', 'P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
                    ['8,8', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                    ['7,7', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
                    ['6,6', 'H', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
                    ['5,5', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'D', 'H', 'H'],
                    ['4,4', 'H', 'H', 'H', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
                    ['3,3', 'H', 'H', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
                    ['2,2', 'H', 'H', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H']
                  ].map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.75rem', border: '1px solid #444', fontWeight: '600', backgroundColor: '#252525' }}>{row[0]}</td>
                      {row.slice(1).map((cell, cellIdx) => (
                        <td key={cellIdx} style={{
                          padding: '0.75rem',
                          border: '1px solid #444',
                          textAlign: 'center',
                          fontWeight: '600',
                          backgroundColor: cell === 'P' ? '#f57c00' : cell === 'S' ? '#c62828' : cell === 'H' ? '#2e7d32' : cell === 'D' ? '#1565c0' : '#2e7d32',
                          color: '#fff'
                        }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Strategy Tips */}
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              backgroundColor: '#252525',
              borderRadius: '8px',
              border: '1px solid #444'
            }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#f0f0f0', marginBottom: '1rem' }}>
                Key Strategy Tips
              </h3>
              <ul style={{ paddingLeft: '1.5rem', lineHeight: '2' }}>
                <li><strong>Always split Aces and 8s</strong> - This is one of the most important rules in blackjack</li>
                <li><strong>Never split 10s or 5s</strong> - A pair of 10s is already 20 (excellent hand), and 5s should be doubled instead</li>
                <li><strong>Surrender hard 15 vs dealer 10</strong> and <strong>hard 16 vs dealer 9, 10, or Ace</strong> when surrender is available</li>
                <li><strong>Double down aggressively on 10 and 11</strong> when the dealer shows a weak card (2-9)</li>
                <li><strong>Soft hands are flexible</strong> - You can't bust by hitting, so be more aggressive with soft hands</li>
                <li><strong>Stand on 12-16 when dealer shows 2-6</strong> - The dealer is likely to bust with these cards</li>
                <li><strong>Hit on 12-16 when dealer shows 7-Ace</strong> - The dealer likely has a strong hand</li>
                <li><strong>Memorize the chart</strong> - This basic strategy reduces the house edge to around 0.5%</li>
              </ul>
            </div>

            {/* Important Notes */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#2d1f1f',
              borderRadius: '8px',
              borderLeft: '4px solid #8B4545'
            }}>
              <p style={{ fontSize: '0.9rem', color: '#d0d0d0', margin: 0 }}>
                <strong>Note:</strong> This strategy assumes the dealer stands on soft 17 (S17), double after split is allowed,
                and surrender is available. Always check the specific rules of your table as slight variations may require strategy adjustments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlackjackBeginnersGuide;
