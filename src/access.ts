// src/access.ts
export default function access(initialState: { currentUser?: API.Userinfo | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.phone === 'admin',
  };
}
