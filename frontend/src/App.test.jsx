import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App layout', () => {
  it('renders the auth page title', () => {
    render(<App />);
    expect(screen.getByText(/Gestion de mots de passe/i)).toBeTruthy();
  });
});