import { useCallback, useState } from 'react';

type UseModalProps = {
  showModal?: () => void;
  hideModal?: () => void;
}

const useModal = (props?: UseModalProps): [boolean, () => void, () => void] => {
  const [isActive, setActive] = useState(false);

  const showModal = useCallback(() => {
    if (typeof props !== 'undefined' && typeof props.showModal === 'function') {
      props.showModal();
    }
    setActive(true);
  }, [props]);

  const hideModal = useCallback(() => {
    if (typeof props !== 'undefined' && typeof props.hideModal === 'function') {
      props.hideModal();
    }
    setActive(false);
  }, [props]);

  return [ isActive, showModal, hideModal ];
};

export default useModal;