import React, { useRef } from 'react';
import { Stack, Typography, Fab } from '@mui/material' 
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRouter } from 'next/router';
import { MenuType } from '@src/shared/constants/menu';
import { ChipTab, Scroll } from '@woi/web-component';
import { useLastOpenedSpec, useLastOpenedSpecDispatch } from '@src/shared/context/LastOpenedContext';
import useRouteRedirection from '@src/shared/hooks/useRouteRedirection';
import { useTranslation } from 'react-i18next';

const LastOpenedTab = () => {
  const { lastOpenedTabs } = useLastOpenedSpec();
  const dispatch = useLastOpenedSpecDispatch();
  const scrollRef = useRef(null!);
  const router = useRouter();
  const { onNavigate } = useRouteRedirection();
  const { t: tCommon } = useTranslation('common');

  const handleRemove = (menu: MenuType) => {
    dispatch({
      type: 'set-last-opened-tab',
      payload: {
        lastOpenedTabs: lastOpenedTabs.filter(tab => tab.menuName !== menu.menuName)
      }
    })
  }

  const handleClick = (selectedMenu: MenuType) => {
    if (selectedMenu.menuLink) {
      if (lastOpenedTabs.find(tab => tab.menuLink === selectedMenu.menuLink)) {
        dispatch({
          type: 'set-last-opened-tab',
          payload: {
            lastOpenedTabs: [
              ...lastOpenedTabs.filter(tab => tab.menuLink !== selectedMenu.menuLink),
              selectedMenu
            ]
          }
        })
      } else {
        dispatch({
          type: 'set-last-opened-tab',
          payload: {
            lastOpenedTabs: [
              ...lastOpenedTabs,
              selectedMenu
            ]
          }
        })
      }
      
      onNavigate(selectedMenu.menuLink);
    }
  }

  return (
    <Stack direction="column" spacing={2} sx={{ px: 4, pb: 4 }}>
      <Typography variant="subtitle2">{tCommon('lastOpenedTabsTitle')}</Typography>
      <Stack direction="row" alignItems="center">
        <Fab 
          size="small" 
          color="inherit" 
          onClick={() => {
            // @ts-ignore
            scrollRef.current.scrollLeft -= (scrollRef.current.offsetWidth * 0.5)
          }}
          style={{ position: 'absolute', zIndex: 2, width: 35, height: 35 }}
        >
          <ChevronLeftIcon sx={{ fontSize: 20 }} />
        </Fab>
        <Scroll ref={scrollRef} style={{ flex: 1, position: 'relative' }}>
          <Stack direction="row" spacing={1} sx={{ px: 5 }}>
            {lastOpenedTabs.map((tab, index) => {
              const active = tab.menuLink ? router.pathname === tab.menuLink : false
              return (
                <ChipTab
                  key={index}
                  label={tab.menuName}
                  active={active}
                  onDelete={() => handleRemove(tab)}
                  onClick={() => handleClick(tab)}
                />
              )
            })}
          </Stack>
        </Scroll>
        <Fab 
          size="small" 
          color="inherit" 
          onClick={() => {
            // @ts-ignore
            scrollRef.current.scrollLeft += (scrollRef.current.offsetWidth * 0.5)
          }}
          style={{ position: 'absolute', zIndex: 2, right: 20, width: 35, height: 35 }}
        >
          <ChevronRightIcon sx={{ fontSize: 20 }} />
        </Fab>
      </Stack>
    </Stack>
  )
}

export default LastOpenedTab;