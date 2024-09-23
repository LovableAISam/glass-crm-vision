import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stack, Typography, Card } from '@mui/material';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import Token from '../Token';
import { TimeConvert, usePersistedState } from '../../../core';

type useTimerProps = {
  storageKey?: string;
  timer?: number;
  notifications?: number[];
  onComplete?: () => void;
  onNotify?: (countdown: number) => void;
  persisted?: boolean;
}

const serialize = (pair: number) => JSON.stringify(pair);
const deserialize = (pairStr: string) => JSON.parse(pairStr) as number;

export function useTimer(props: useTimerProps) {
  const { storageKey = 'TIMER', timer = 0, notifications, onComplete, onNotify, persisted = false } = props;
  const intervalId = useRef<number>();
  const completed = useRef<boolean>(false);
  const [countdown, setCountdown] = persisted 
    ? usePersistedState(timer, storageKey, serialize, deserialize) 
    : useState<number>(timer);

  const startTimer = () => {
    initiateInterval();

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }

  const resetTimer = (_timer?: number) => {
    stopTimer();
    setCountdown(_timer || timer);
    startTimer();
  }

  const stopTimer = () => {
    clearInterval(intervalId.current);
  }

  const countingDown = useCallback(() => {
    if (countdown === 0) {
      clearInterval(intervalId.current);
      completed.current = true;
      if (typeof onComplete === 'function') {
        onComplete();
      }
    } else {
      completed.current = false;
    }
    if ((notifications || [])?.some(notification => notification === countdown)) {
      if (typeof onNotify === 'function') {
        onNotify(countdown);
      }
    }
  }, [countdown, notifications])

  useEffect(() => {
    countingDown();
  }, [countingDown])

  function initiateInterval() {
    intervalId.current = window.setInterval(() => {
      if (!completed.current) {
        setCountdown(oldData => oldData - 1)
      }
    }, 1000);
  }
  
  const displayCountdown = useMemo(() => {
    return TimeConvert.displayTimeStr(countdown);
  }, [countdown])

  return {
    countdown,
    resetTimer,
    startTimer,
    stopTimer,
    displayCountdown,
  }
}

type TimerItemProps = {
  displayCountdown: string
};

export default function TimerItem({ displayCountdown }: TimerItemProps) {
  return (
    <Card variant="outlined" sx={{ borderColor: Token.color.greyscaleGreyLighter, p: 1, borderRadius: 2 }}>
      <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center">
        <HourglassTopIcon sx={{ color: Token.color.greyscaleGreyDarkest }} />
        <Typography variant="h4" color={Token.color.greyscaleGreyDarkest}>
          {displayCountdown}
        </Typography>
      </Stack>
    </Card>
  );
}
