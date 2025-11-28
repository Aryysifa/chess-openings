import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen dark-app">
      <Header title="Chess Learning Hub" />
      <div className="dashboard-content">
        <div className="max-w-6xl mx-auto p-8">
          <div className="text-center mb-12">
            <p className="text-gray-400 text-lg">
              Your comprehensive platform for mastering chess openings and strategy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Openings Explorer Card */}
            <div 
              className="dashboard-card group"
              onClick={() => navigate('/openings-explorer')}
            >
              <div className="card-icon">
                <span className="text-3xl">♔</span>
              </div>
              <h3 className="card-title">Openings Explorer</h3>
              <p className="card-description">
                Explore chess openings with real game data from Lichess. Learn popular moves and their win rates.
              </p>
              <div className="card-stats">
                <span className="stat-item">Live Data</span>
                <span className="stat-item">Real Games</span>
                <span className="stat-item">Interactive</span>
              </div>
            </div>

            {/* Coming Soon Cards */}
            <div className="dashboard-card coming-soon">
              <div className="card-icon">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="card-title">Tactics Trainer</h3>
              <p className="card-description">
                Practice chess tactics and puzzles to improve your tactical vision and calculation skills.
              </p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>

            <div className="dashboard-card coming-soon">
              <div className="card-icon">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="card-title">Study Plans</h3>
              <p className="card-description">
                Structured learning paths for different skill levels and chess concepts.
              </p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>

            <div className="dashboard-card coming-soon">
              <div className="card-icon">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="card-title">Game Analysis</h3>
              <p className="card-description">
                Analyze your games with computer assistance and identify areas for improvement.
              </p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>

            <div className="dashboard-card coming-soon">
              <div className="card-icon">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="card-title">Tournament Mode</h3>
              <p className="card-description">
                Practice tournament-style games and time management strategies.
              </p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>

            <div className="dashboard-card coming-soon">
              <div className="card-icon">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="card-title">Community</h3>
              <p className="card-description">
                Connect with other chess enthusiasts and share your learning journey.
              </p>
              <div className="coming-soon-badge">Coming Soon</div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-block bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Quick Start</h3>
              <p className="text-gray-400 mb-4">Ready to improve your chess game?</p>
              <div className="text-sm text-gray-500">
                Use the menu in the top-left to navigate to the Openings Explorer and start learning!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;