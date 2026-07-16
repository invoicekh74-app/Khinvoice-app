import type { LucideIcon } from 'lucide-react';

type IconSize = 20 | 24 | 28;
type IconTint = 'gold' | 'navy' | 'success' | 'danger' | 'white' | 'light' | 'stock' | 'invoice' | 'account';
type IconShape = 'circle' | 'rounded';

interface IconBadgeProps {
  icon: LucideIcon;
  size?: IconSize;
  tint?: IconTint;
  shape?: IconShape;
  strokeWidth?: number;
  className?: string;
}

const SIZE_MAP: Record<IconSize, { container: number; icon: number; radius: number }> = {
  20: { container: 36, icon: 20, radius: 10 },
  24: { container: 44, icon: 24, radius: 12 },
  28: { container: 52, icon: 28, radius: 14 },
};

const TINT_MAP: Record<IconTint, { bg: string; color: string }> = {
  gold: { bg: '#FBF0EB', color: '#D97B4F' },
  navy: { bg: '#E8F0F2', color: '#12303A' },
  success: { bg: '#E8F6F0', color: '#1F9D6B' },
  danger: { bg: '#FDEDE9', color: '#E5533D' },
  white: { bg: '#FFFFFF', color: '#12303A' },
  light: { bg: 'rgba(255,255,255,0.18)', color: '#FFFFFF' },
  stock: { bg: '#E3EEF7', color: '#2E86C1' },
  invoice: { bg: '#EDE8F7', color: '#7C5CBF' },
  account: { bg: '#FBF1E0', color: '#E0A93E' },
};

export function IconBadge({
  icon: Icon,
  size = 20,
  tint = 'navy',
  shape = 'rounded',
  strokeWidth = 2,
  className,
}: IconBadgeProps) {
  const { container, icon: iconSize, radius } = SIZE_MAP[size];
  const { bg, color } = TINT_MAP[tint];

  return (
    <div
      className={className}
      style={{
        width: container,
        height: container,
        borderRadius: shape === 'circle' ? '50%' : radius,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon size={iconSize} color={color} strokeWidth={strokeWidth} />
    </div>
  );
}
