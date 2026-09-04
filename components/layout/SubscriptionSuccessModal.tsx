'use client';

import Link from 'next/link';
import { CheckCircle2, Leaf, ArrowRight, Heart, X, Sparkles } from 'lucide-react';

interface SubscriptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export default function SubscriptionSuccessModal({
  isOpen,
  onClose,
  email,
}: SubscriptionSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(6, 26, 20, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.25s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#0c261e',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '20px',
          padding: '36px 30px 30px',
          color: '#ffffff',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.2)',
          position: 'relative',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#a7b8b2',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
        >
          <X size={16} />
        </button>

        {/* Animated Celebration Icon */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06281e',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
              }}
            >
              <CheckCircle2 size={32} strokeWidth={2.8} />
            </div>
          </div>
          <Sparkles
            size={22}
            color="#34d399"
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-6px',
            }}
          />
        </div>

        {/* Headline */}
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 800,
            margin: '0 0 8px',
            color: '#ffffff',
            letterSpacing: '-0.3px',
          }}
        >
          Welcome to the Movement! 🌱
        </h3>

        <p style={{ fontSize: '14px', color: '#a7f3d0', margin: '0 0 20px', lineHeight: 1.6 }}>
          Thank you for joining EARPI! We have reserved your spot in our global grassroots community.
          {email && (
            <span style={{ display: 'block', color: '#6ee7b7', fontWeight: 600, marginTop: '4px' }}>
              Confirmation sent to: {email}
            </span>
          )}
        </p>

        {/* What You Receive Box */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '14px 16px',
            textAlign: 'left',
            marginBottom: '24px',
            fontSize: '13px',
            color: '#c6d8d0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Leaf size={15} color="#10b981" />
            <span>Quarterly blue carbon & field impact briefings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Leaf size={15} color="#10b981" />
            <span>Direct reports on community mangrove nurseries</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={15} color="#10b981" />
            <span>Invitations to youth climate action webinars</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link
            href="/projects"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '13px 20px',
              backgroundColor: '#10b981',
              color: '#06281e',
              borderRadius: '10px',
              fontWeight: 'bold',
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            <span>Explore Field Projects in Sierra Leone</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/donation"
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '11px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#d1fae5',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '13.5px',
              textDecoration: 'none',
            }}
          >
            <Heart size={15} color="#f43f5e" />
            <span>Support an Initiative with a Donation</span>
          </Link>
        </div>

        {/* Dismiss Text */}
        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: '#6b8a7d',
            fontSize: '12.5px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Continue exploring earpi.org
        </button>
      </div>
    </div>
  );
}
