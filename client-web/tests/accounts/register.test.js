import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import RegisterPage from '@/pages/accounts/register';

import FETCHQL from '../../util/graphql.util';
import WINDOW from '../../util/window.util';

jest.mock('../../util/graphql.util');
jest.mock('../../util/window.util');

describe('Register', () => {
  beforeEach(() => {
    render(<RegisterPage />);
  });

  it('renders necessary form inputs', () => {
    const emailInput = screen.getByRole('email-input');
    const usernameInput = screen.getByRole('username-input');
    const passwordInput = screen.getByRole('password-input');
    const passwordConfirmationInput = screen.getByRole('passwordConfirmation-input');
    const registerAction = screen.getByRole('register-action');

    expect(emailInput).toBeInTheDocument();
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(passwordConfirmationInput).toBeInTheDocument();
    expect(registerAction).toBeInTheDocument();
  });

  it('renders validation errors to the correct fields when appropriate', async () => {
    FETCHQL.mutate = jest.fn().mockReturnValue(  {
      data: null,
      validations: [
        { property: 'email', value: 'VALIDATION ERROR #1' },
        { property: 'email', value: 'VALIDATION ERROR #2' },
      ]
    });

    userEvent.type(screen.getByRole('email-input'), 'invalidemail');

    await act(async () => {
      const registerAction = await screen.getByRole('register-action');
      await userEvent.click(registerAction);
    });

    expect(screen.getByRole('email-input')).toHaveValue('invalidemail');
    expect(screen.queryAllByRole('email-input-validation').length).toBe(2);
  });

  it('allows successful registrations', async () => {
    FETCHQL.mutate = jest.fn().mockReturnValue(  {
      data: { registerUser: { user: { id: 'abc123' } }},
      validations: []
    });
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    const setLocationSpy = jest.spyOn(WINDOW, 'setLocation');
    setLocationSpy.mockImplementation(() => {});

    userEvent.type(screen.getByRole('email-input'), 'test@user.com');

    await act(async () => {
      const registerAction = await screen.getByRole('register-action');
      await userEvent.click(registerAction);
    });

    expect(screen.getByRole('email-input')).toHaveValue('');
    expect(screen.queryAllByRole('email-input-validation').length).toBe(0);
    expect(setLocationSpy).toBeCalled();
  });
});
