import { Box, Typography } from '@mui/material';
import HikingIcon from '@mui/icons-material/Hiking';
import { useNavigate } from 'react-router-dom';

const footerSections = [
  {
    title: '探索',
    links: [
      { label: '搜尋步道', path: '/search' },
      { label: '附近步道', path: '/nearby' },
      { label: '精選集', path: '/' },
    ],
  },
  {
    title: '帳號',
    links: [
      { label: '登入 / 註冊', path: '/login' },
      { label: '口袋名單', path: '/favorites' },
      { label: '個人資料', path: '/profile' },
    ],
  },
];

// Mountain ridge SVG — the brand-defining visual memory of the footer
function MountainRidge() {
  return (
    <Box sx={{ lineHeight: 0, display: 'block' }}>
      <svg
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 56 }}
        aria-hidden="true"
      >
        <path
          d="M0,56 L0,38 L60,26 L120,34 L200,12 L280,28 L360,8 L440,22 L520,14 L600,30 L680,4 L760,18 L840,10 L920,26 L1000,6 L1080,20 L1160,32 L1240,14 L1320,24 L1380,16 L1440,28 L1440,56 Z"
          fill="#0D2818"
        />
      </svg>
    </Box>
  );
}

export function Footer() {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ display: { xs: 'none', md: 'block' } }}>
      {/* Mountain ridge transition */}
      <MountainRidge />

      {/* Main footer body */}
      <Box sx={{ bgcolor: '#0D2818', position: 'relative', overflow: 'hidden' }}>
        {/* Grain overlay for texture */}
        <Box sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
        }} />

        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { md: 4, lg: 6 }, pt: 5, pb: 4, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', gap: { md: 6, lg: 10 }, mb: 5 }}>

            {/* Brand */}
            <Box sx={{ flex: '0 0 auto', minWidth: 210 }}>
              <Box
                onClick={() => navigate('/')}
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, cursor: 'pointer', width: 'fit-content' }}
              >
                <HikingIcon sx={{ color: '#74C69E', fontSize: 22 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', letterSpacing: '-0.01em' }}>
                  Trail Guide
                </Typography>
              </Box>
              <Typography sx={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.4)',
                lineHeight: 1.9,
                maxWidth: 185,
                fontStyle: 'italic',
                fontFamily: '"Noto Serif TC", serif',
              }}>
                台灣步道資訊平台<br />
                探索山林之美，記錄每一段旅程。
              </Typography>
            </Box>

            {/* Nav sections */}
            <Box sx={{ display: 'flex', gap: { md: 6, lg: 10 }, flex: 1 }}>
              {footerSections.map((section) => (
                <Box key={section.title}>
                  <Typography sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#74C69E',
                    mb: 2.5,
                    display: 'block',
                  }}>
                    {section.title}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {section.links.map((link) => (
                      <Typography
                        key={link.label}
                        onClick={() => navigate(link.path)}
                        sx={{
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          color: 'rgba(255,255,255,0.55)',
                          transition: 'color 0.15s',
                          '&:hover': { color: 'rgba(255,255,255,0.9)' },
                        }}
                      >
                        {link.label}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom bar */}
          <Box sx={{
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
              © {year} Trail Guide · 台灣步道資訊平台
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
              資料來源：健行筆記・林務局步道資訊系統
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
