import { useCallback, useState } from 'react';

type UseModalProps = {
  showModalPassword?: () => void;
  hideModalPassword?: () => void;
};

const useModalPassword = (props?: UseModalProps): [boolean, () => void, () => void] => {
  const [isActivePassword, setActivePassword] = useState(false);

  const showModalPassword = useCallback(() => {
    if (typeof props !== 'undefined' && typeof props.showModalPassword === 'function') {
      props.showModalPassword();
    }
    setActivePassword(true);
  }, [props]);

  const hideModalPassword = useCallback(() => {
    if (typeof props !== 'undefined' && typeof props.hideModalPassword === 'function') {
      props.hideModalPassword();
    }
    setActivePassword(false);
  }, [props]);

  return [isActivePassword, showModalPassword, hideModalPassword];
};

export default useModalPassword;