// src/services/user.ts
import { v4 as uuidv4 } from 'uuid';

export const generateUserId = (): string => {
  // Generate a unique user ID or get from storage if exists
  const storedUserId = localStorage.getItem('echo_user_id');
  if (storedUserId) return storedUserId;

  const newUserId = uuidv4();
  localStorage.setItem('echo_user_id', newUserId);
  return newUserId;
};