export const verifyToken = (): boolean => {
  const token = localStorage.getItem("token");
  return (token !== null);
};
