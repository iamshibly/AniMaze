// src/lib/utils/crypto.ts - Crypto utilities for localStorage auth
import { createHash, randomBytes } from 'crypto';

// Simple hash function for passwords (client-side)
export const hashPassword = (password: string): string => {
  try {
    // In a real app, use proper password hashing like bcrypt
    // This is a simple implementation for localStorage demo
    const salt = 'anime_quiz_salt_2024';
    const combined = password + salt;
    
    // Simple hash implementation
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(16);
  } catch (error) {
    // Fallback if crypto is not available
    console.warn('Crypto not available, using fallback hash');
    return btoa(password + 'fallback_salt').replace(/[^a-zA-Z0-9]/g, '');
  }
};

// Verify password against hash
export const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Generate unique ID
export const generateId = (): string => {
  try {
    // Try to use crypto.randomUUID if available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback to timestamp + random
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  } catch (error) {
    // Ultimate fallback
    return Date.now().toString() + Math.random().toString().substring(2);
  }
};

// Generate access token
export const generateToken = (): string => {
  try {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback
    return generateId() + generateId();
  } catch (error) {
    // Ultimate fallback
    return btoa(Date.now() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '');
  }
};