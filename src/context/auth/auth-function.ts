export const verifyToken = useCallback(async () => {
  try {
    const res = await axios.get(`${baseUrl}/user`, headers());
    if (!!res.data.data.id || res.status === 200) {
      const data = res.data.data;
      setUser({
        email: data.email,
        id: data.id,
        name: data.name,
        role: data.role[0]
      });
      setIsToken(cookies?.token);
      setIsLoggedIn(!!cookies?.token);
      showToast(SuccessToastTitle, "You're successfully logged in");
      return;
    }
    return;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      showToast(
        FailedToastTitle,
        error.response?.data.message || 'An error occurred'
      );
      return;
    }

    showToast(
      FailedToastTitle,
      error.message || 'An error occurred',
      'destructive'
    );
    return;
  }
}, [headers, cookies?.token]);
