import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Basic selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Memoized selectors using createSelector
export const selectIsAuthenticated = createSelector(
  [selectAccessToken, selectUser],
  (accessToken, user) => !!(accessToken && user)
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || null
);

export const selectUserFullName = createSelector(
  [selectUser],
  (user) => user?.fullName || ""
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email || ""
);
export const selectUserId = createSelector(
  [selectUser],
  (user) => user?.id || null
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

export const selectIsMember = createSelector(
  [selectUserRole],
  (role) => role === "member"
);

// Combined selectors
export const selectAuthStatus = createSelector(
  [selectIsAuthenticated, selectAuthLoading, selectAuthError],
  (isAuthenticated, isLoading, error) => ({
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
  })
);
