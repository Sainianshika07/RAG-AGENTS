"use client";

import { PipelineStep } from "@/lib/rag/graph";

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  stepKey: PipelineStep;
  currentStep: PipelineStep;
  isComplete: boolean;
}

const stepOrder: PipelineStep[] = ["idle", "ingestion", "retrieval", "generation", "complete"];

export function StepCard({
  stepNumber,
  title,
  description,
  icon,
  stepKey,
  currentStep,
  isComplete,
}: StepCardProps) {
  const currentIndex = stepOrder.indexOf(currentStep);
  const stepIndex = stepOrder.indexOf(stepKey);
  const isActive = currentStep === stepKey;
  const isPast = isComplete || currentIndex > stepIndex;

  return (
    <div
      className={`glass-card step-card-item ${isActive ? "step-active" : ""} ${isPast ? "step-past" : ""}`}
      style={{
        padding: "1.25rem",
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        borderColor: isActive
          ? "var(--border-accent)"
          : isPast
          ? "rgba(16, 185, 129, 0.3)"
          : "var(--border-subtle)",
        boxShadow: isActive
          ? "var(--shadow-card), var(--shadow-glow-purple)"
          : isPast
          ? "var(--shadow-card), 0 0 20px rgba(16, 185, 129, 0.15)"
          : "var(--shadow-card)",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          flexShrink: 0,
          background: isActive
            ? "rgba(124, 58, 237, 0.2)"
            : isPast
            ? "rgba(16, 185, 129, 0.2)"
            : "var(--bg-glass)",
          border: `1px solid ${
            isActive
              ? "rgba(124, 58, 237, 0.4)"
              : isPast
              ? "rgba(16, 185, 129, 0.3)"
              : "var(--border-subtle)"
          }`,
          transition: "all 0.4s ease",
        }}
      >
        {isPast && !isActive ? "✓" : icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Step {stepNumber}
          </span>
          {isActive && (
            <span className="badge badge-purple" style={{ fontSize: "0.65rem" }}>
              Active
            </span>
          )}
          {isPast && !isActive && (
            <span className="badge badge-green" style={{ fontSize: "0.65rem" }}>
              Done
            </span>
          )}
        </div>
        <h4
          style={{
            fontSize: "0.95rem",
            fontWeight: 700,
            color: isActive
              ? "var(--brand-purple-light)"
              : isPast
              ? "var(--brand-green-light)"
              : "var(--text-primary)",
            marginBottom: "0.2rem",
          }}
        >
          {title}
        </h4>
        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
          {description}
        </p>
      </div>
    </div>
  );
}
