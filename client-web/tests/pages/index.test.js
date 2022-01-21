import { render, screen } from '@testing-library/react';
import HomePage from '@/pages/index';

describe('Home', () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  it('renders a heading', () => {
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('renders a login link', () => {
    const link = screen.getByRole('login-link');
    expect(link).toBeInTheDocument();
  });

  it('renders a register link', () => {
    const link = screen.getByRole('register-link');
    expect(link).toBeInTheDocument();
  });
});
