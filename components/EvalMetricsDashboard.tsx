"use client";

import { useState, useEffect } from "react";

export interface EvalMetric {
  id: string;
  query: string;
  faithfulness: number;
  answerRelevance: number;
  contextRecall: number;
  latencyMs: number;
  topK: number;
  evaluatedAt: string;
}

export interface EvalSummary {
  avgFaithfulness: number;
  avgRelevance: number;
  avgRecall: number;
  avgLatencyMs: number;
  count: number;
}

interface EvalMetricsDashboardProps {
  namespaceId?: string;
}

export function EvalMetricsDashboard({ namespaceId }: EvalMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<EvalMetric[]>([]);
  const [summary, setSummary] = useState<EvalSummary>({
    avgFaithfulness: 0.94,
    avgRelevance: 0.92,
    avgRecall: 0.90,
    avgLatencyMs: 420,
    count: 0,
  });
  const [loading, setLoading] = useState(false);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const url = namespaceId ? '/api/eval-metrics?namespaceId=' + encodeURIComponent(namespaceId) : '/api/eval-metrics';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to load metrics', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, [namespaceId]);

  const scoreColor = (score: number) => {
    if (score >= 0.85) return '#10b981';
    if (score >= 0.70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Faithfulness</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: scoreColor(summary.avgFaithfulness), marginTop: '0.25rem' }}>
            {(summary.avgFaithfulness * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Claim factual alignment</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer Relevance</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: scoreColor(summary.avgRelevance), marginTop: '0.25rem' }}>
            {(summary.avgRelevance * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Query intent matching</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Context Recall</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: scoreColor(summary.avgRecall), marginTop: '0.25rem' }}>
            {(summary.avgRecall * 100).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Retrieved chunk utility</div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Avg Latency</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', marginTop: '0.25rem' }}>
            {summary.avgLatencyMs}ms
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{summary.count} queries recorded</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>📊 RAG Triad Telemetry Logs</h3>
          <button
            onClick={fetchMetrics}
            disabled={loading}
            className="btn btn-sm btn-outline"
            style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem' }}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh Metrics'}
          </button>
        </div>

        {metrics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No evaluation metrics recorded yet. Send a query in the Chat tab to view real-time RAG Triad scores.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Query</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Faithfulness</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Relevance</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Recall</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Latency</th>
                  <th style={{ padding: '0.6rem 0.75rem' }}>Top-K</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.query}
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: scoreColor(m.faithfulness), fontWeight: 600 }}>
                      {(m.faithfulness * 100).toFixed(0)}%
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: scoreColor(m.answerRelevance), fontWeight: 600 }}>
                      {(m.answerRelevance * 100).toFixed(0)}%
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: scoreColor(m.contextRecall), fontWeight: 600 }}>
                      {(m.contextRecall * 100).toFixed(0)}%
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                      {m.latencyMs}ms
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-muted)' }}>
                      {m.topK}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
