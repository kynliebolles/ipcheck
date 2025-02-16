'use client';

interface AdPlaceholderProps {
  width: string;
  height: string;
}

export function AdPlaceholder({ width, height }: AdPlaceholderProps) {
  // 只在开发环境中显示占位符
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{ 
        width, 
        height,
        background: '#f0f0f0',
        border: '1px dashed #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
        color: '#666',
        fontSize: '14px'
      }}
    >
      Ad Placeholder ({width} x {height})
    </div>
  );
}
