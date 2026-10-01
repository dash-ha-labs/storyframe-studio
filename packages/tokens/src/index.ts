export const tokens = {
  colors: {
    bg: {
      app: '#181a1f',
      sidebar: '#1c1e24',
      surface: '#20242d',
      surfaceHover: '#283141',
      surfaceElevated: '#222833',
      input: '#171d27',
    },
    text: {
      primary: '#e6e8ee',
      secondary: '#c0cce2',
      muted: '#96a3bc',
      subtle: '#77839a',
    },
    accent: {
      primary: '#a6b5ff',
      hover: '#beccec',
    },
    status: {
      success: '#85a893',
      warning: '#dfbc97',
      danger: '#f87171',
    },
    border: {
      subtle: '#30343e',
      default: '#3a4354',
      strong: '#43516a',
    },
  },
  typography: {
    fontSans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
