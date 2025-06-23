import { memo, forwardRef } from 'react'

import Box from '@mui/material/Box'

import { StyledScrollbar, StyledRootScrollbar } from './styles'
StyledScrollbar
// ----------------------------------------------------------------------

const Scrollbar = forwardRef(({ children, sx, ...other }, ref) => {
    const userAgent = typeof navigator === "undefined" ? "SSR" : navigator.userAgent;
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
    if (mobile) {
      return (
        <Box
          ref={ref}
          sx={{
            overflow: "auto",
            height: "100vh", 
            ...sx,
          }}
          {...other}
        >
          {children}
        </Box>
      );
    }
  
    return (
      <StyledRootScrollbar sx={{ height: "100vh" }}>
        <StyledScrollbar
          scrollableNodeProps={{ ref }}
          clickOnTrack={false}
          sx={{ height: "100%" }} // 🟢 luôn fill chiều cao
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    );
});
  

export default memo(Scrollbar)
