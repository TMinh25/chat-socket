class ITokenService {
  getLocalRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  updateLocalRefreshToken(token: string | null) {
    localStorage.setItem("refreshToken", token || "");
  }

  getLocalAccessToken() {
    return localStorage.getItem("accessToken");
  }

  updateLocalAccessToken(token: string | null) {
    localStorage.setItem("accessToken", token || "");
  }
}

const TokenService = new ITokenService();
export default TokenService;
