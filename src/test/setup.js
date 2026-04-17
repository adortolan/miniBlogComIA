import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

vi.mock('../config/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));
