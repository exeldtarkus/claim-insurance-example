const validLoginHelper = async (params: {
  nextBaseUrl: string;
  accessToken: string;
  refreshToken: string;
  rememberMe: string;
  logTemplate?: string;
}): Promise<{ isValid: boolean; newAccessToken?: string }> => {
  const {
    nextBaseUrl: baseUrl,
    accessToken,
    refreshToken,
    rememberMe,
  } = params;

  const logTemplate = params.logTemplate ? `${params.logTemplate} - [validLoginHelper]` : " - [validLoginHelper]";
  try {
    console.info(`${logTemplate} - Verifying accessToken...`);

    if (refreshToken && rememberMe === "true") {
      const refreshRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          Origin: baseUrl,
        },
      });

      const refreshData = await refreshRes.json();
      console.info(`${logTemplate} - Refresh token status: ${refreshData.status}`);

      if (refreshData.status === 200 && refreshData.data?.token) {
        console.info(`${logTemplate} - Token refreshed successfully! Valid = true`);
        return { isValid: true, newAccessToken: refreshData.data.token };
      }

      console.error(`${logTemplate} - Refresh Token Expired or Status != 200`);

      return { isValid: false };
    }

    const verifyRes = await fetch(`${process.env.SERVICES_HOST}/api/auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: baseUrl,
      },
    });

    const verifyData = await verifyRes.json();
    console.info(`${logTemplate} - Token verify status: ${verifyData.status}`);

    if (verifyData.status === 200) {
      console.info(`${logTemplate} - Token granted. Valid = true`);
      return { isValid: true };
    }

    console.error(`${logTemplate} - Token Expired or Status != 200`);
    return { isValid: false };

  } catch (err) {
    console.error(`${logTemplate} - Exception during token validation:`, err);
    return { isValid: false };
  }
};

export default validLoginHelper;
