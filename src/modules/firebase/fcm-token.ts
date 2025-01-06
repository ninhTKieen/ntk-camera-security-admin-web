import 'firebase/messaging';
import { getToken } from 'firebase/messaging';

import { VAPID_KEY } from '@/configs/constants';

import { messaging } from './fcm-config';

export const getMessagingToken = async () => {
  let currentToken = '';
  if (!messaging) return;
  try {
    currentToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
    });
    localStorage.setItem('fcmToken', currentToken);
  } catch (error) {
    console.log('An error occurred while retrieving token. ', error);
  }
  return currentToken;
};
