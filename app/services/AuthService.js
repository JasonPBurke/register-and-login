import { axiosPublic, axiosPrivate } from "./APIService";

class AuthService {
  // Check if the current user is logged in
  async isLoggedIn() {
    const accessToken = this.getAccessToken();
    accessToken && now.isBefore(accessToken.expires);
  }

  // Refresh the access token if the refresh token is still valid
  refreshLogin() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }
    const refreshTokenKey = refreshToken.token;
    return axiosPublic
      .post("auth/refresh-tokens", { refreshTokenKey })
      .then((response) => {
        if (response.data.tokens) {
          this.setAccessToken(response.data.tokens.access);
          this.setRefreshToken(response.data.tokens.refresh);
        }

        return this.isLoggedIn();
      });
  }

  // Return the JWT access token for the logged in user
  getAccessToken() {
    return JSON.parse(localStorage.getItem("auth/accessToken"));
  }

  // Set the JWT access token for the logged in user
  setAccessToken(token) {
    if (token) {
      localStorage.setItem("accessToken", JSON.stringify(token));
    } else {
      localStorage.removeItem("accessToken");
    }
  }

  // Return the JWT refresh token for the logged in user
  getRefreshToken() {
    return JSON.parse(localStorage.getItem("refreshToken"));
  }

  // Set the JWT refresh token for the logged in user
  setRefreshToken(token) {
    if (token) {
      localStorage.setItem("refreshToken", JSON.stringify(token));
    } else {
      localStorage.removeItem("refreshToken");
    }
  }
}

const authService = new AuthService();
export default authService;
