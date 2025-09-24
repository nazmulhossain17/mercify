import { createAuthDispatch } from "@/store/dispatch/authDispatch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthLoading } from "@/store/selectors/authSelectors";
import { useEffect } from "react";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const authDispatch = createAuthDispatch(dispatch);
  const isLoading = useAppSelector(selectAuthLoading);
  console.log(isLoading);

  useEffect(() => {
    console.log("🚀 AuthInitializer: Initializing authentication...");
    authDispatch.initializeAuth();
  }, [authDispatch]);

  return <>{children}</>;
}
