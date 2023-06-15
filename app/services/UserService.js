import { axiosPublic, axiosPrivate } from './APIService';
import AuthService from './AuthService';

class UserService {
  // Log in a user
  // @param email - Email associated with this user
  // @param password - Password for this user
  async login(email, password) {
    const response = await axiosPublic.post('auth/login', {
      email: email,
      password: password,
    });
    AuthService.setCurrentUser(response.data.user);
    if (response.data.tokens) {
      AuthService.setAccessToken(response.data.tokens.access);
      AuthService.setRefreshToken(response.data.tokens.refresh);
    }
    return response.data.user;
  }

  // Log out the current logged in user
  async logout() {
    const refreshToken = AuthService.getRefreshToken();
    if (refreshToken) {
      await axiosPublic.post('auth/logout', {
        refreshToken: refreshToken.token,
      });
    }

    this.#setCurrentUser(null);
    AuthService.setAccessToken(null);
    AuthService.setRefreshToken(null);
  }

  // Register a new User
  // @param email - Email associated with this user
  // @param password - Password for this user
  // @param firstName - First name of the user to use as a filter
  // @param lastName - Last name of the user to use as a filter
  // @param company - Company name of the user to use as a filter
  register(email, password, firstName, lastName, company = null) {
    return axiosPublic.post('auth/register', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      company: company ? company : undefined,
    });
  }

  // Send a password reset email to the given address
  // @param email - Email address to send reset link to
  forgotPassword(email) {
    return axiosPublic.post('auth/forgot-password', {
      email: email,
    });
  }

  // Reset a users password using token from reset email
  // @param token - Token send to user via email
  // @param newPassword - New password to set for the user
  resetPassword(token, newPassword) {
    return axiosPublic.post('auth/reset-password?' + token, {
      password: newPassword,
    });
  }

  // Resend the email verification email to the logged in user
  resendEmailVerification() {
    return axiosPrivate.post('auth/send-verification-email');
  }

  // Set email address to verified for the given token
  // @param token - Email verification token send to user via email
  verifyEmail(token) {
    return axiosPublic.post('auth/verify-email?' + token);
  }

  // Return the current logged in user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Set the current logged in user
  // @param User data returned from login endpoint
  #setCurrentUser(user) {
    if (token) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Get list of users
  // @param company - Company name of the user to use as a filter
  // @param firstName - First name of the user to use as a filter
  // @param lastName - Last name of the user to use as a filter
  // @param role - User role to use as a filter
  // @param sortField - Field to sort results by
  // @param sortOrder - Order of sorting (only if sortField supplied)
  // @limit - Maximum number of results per page
  // @page - Page of results to return
  getUsers(
    company = null,
    firstName = null,
    lastName = null,
    role = null,
    sortField = null,
    sortOrder = 'asc',
    limit = null,
    page = null
  ) {
    return axiosPrivate.get('users', {
      params: {
        company: company ? company : undefined,
        firstName: firstName ? firstName : undefined,
        lastName: lastName ? lastName : undefined,
        role: role ? role : undefined,
        sortBy: sortField ? sortField + ':' + sortOrder : undefined,
        limit: limit ? limit : undefined,
        page: page ? page : undefined,
      },
    });
  }

  // Create a new User with the given details
  // @param email - Email associated with this user
  // @param password - Password for this user
  // @param firstName - First name of the user to use as a filter
  // @param lastName - Last name of the user to use as a filter
  // @param company - Company name of the user to use as a filter
  // @param role - Role for this user
  createUser(email, password, firstName, lastName, company = null, role) {
    return axiosPrivate.post('users', {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      company: company ? company : undefined,
      role: role,
    });
  }

  // Get a specific user
  // @param id - ID of user to retrieve
  getUser(id) {
    return axiosPrivate.get(`users/${id}`);
  }

  // Update the given data on the specified user.
  // @param id - ID of the user to update. NOTE: id must be logged in user unless admin
  // @param email - Email associated with this user
  // @param password - Password for this user
  // @param firstName - First name of the user to use as a filter
  // @param lastName - Last name of the user to use as a filter
  // @param company - Company name of the user to use as a filter
  updateUser(id, email, password, firstName, lastName, company = null) {
    return axiosPrivate.patch(`users/${id}`, {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      company: company ? company : undefined,
    });
  }

  // Delete the specified user
  // @param id - ID of user to delete
  deleteUser(id) {
    return axiosPrivate.delete(`users/${id}`);
  }
}

const userService = new UserService();
export default userService;
