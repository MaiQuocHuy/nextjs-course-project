import { AppDispatch } from '@/store/store';
import {
  startLoading,
  stopLoading,
} from '@/store/slices/instructor/loadingAnimaSlice';
export const loadingAnimation = (
  isStartLoading: boolean,
  dispatch: AppDispatch,
  message?: string
) => {  
  if (isStartLoading) {
    dispatch(startLoading(message));
  } else {
    dispatch(stopLoading());
  }
};
