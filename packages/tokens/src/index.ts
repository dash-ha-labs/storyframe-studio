export const tokens = {
  colors: {
    bg: {
      app: '#ffffff',
      sidebar: '#f8f9fc',
      surface: '#ffffff',
      surfaceHover: '#f4f5fb',
      surfaceElevated: '#ffffff',
      canvas: '#f7f8fa',
      input: '#ffffff',
    },
    text: {
      primary: '#182b4e',
      secondary: '#354561',
      muted: '#626d80',
      subtle: '#6e7889',
    },
    accent: {
      primary: '#2142e7',
      hover: '#1935c4',
    },
    action: { primary: '#2142e7', hover: '#1935c4', onAction: '#ffffff' },
    creative: { peach: '#f8e7dc', lilac: '#ece9fb', mint: '#e5f0e8' },
    status: {
      success: '#26704c',
      warning: '#8b570e',
      danger: '#b33243',
    },
    border: {
      subtle: '#e5e8ef',
      default: '#d6dbe6',
      strong: '#a8b3c8',
    },
  },
  card: { background: '#ffffff', border: '#e5e8ef', hoverShadow: '0 4px 14px #182b4e08' },
  editor: { barHeight: '50px', controlHeight: '32px' },
  typography: {
    fontSans: '"Inter Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontDisplay: '"Inter Variable", system-ui, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
  },
} as const;

export type DesignTokens = typeof tokens;
