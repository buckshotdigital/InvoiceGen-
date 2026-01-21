import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation - Apple Touch Icon (shows on iOS home screen)
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '32px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        I
      </div>
    ),
    {
      ...size,
    }
  );
}
