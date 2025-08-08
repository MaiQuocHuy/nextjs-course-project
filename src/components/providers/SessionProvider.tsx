import { FC, ReactNode, useEffect } from "react";
import { SessionProvider as NextAuthSessionProvider, useSession } from "next-auth/react";
import { useAppDispatch } from "@/store/hook";
import { setAuthState, setUser, setHydrated, setLoading } from "@/store/slices/auth/authSlice";

interface AuthSyncComponentProps {
  children: ReactNode;
}

const AuthSyncComponent: FC<AuthSyncComponentProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status !== "loading") {
      dispatch(setHydrated());
      dispatch(setLoading(false));
    } else {
      dispatch(setLoading(true));
    }

    // Update Globalstate based on session

    if (status === "authenticated" && session?.user) {
      dispatch(setAuthState(true));
      dispatch(
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          accessToken: session.user.accessToken,
          // refreshToken: session.user.refreshToken,
          accessTokenExpires: session.user.accessTokenExpires,
          // refreshTokenExpires: session.user.refreshTokenExpires,
        })
      );
    } else if (status === "unauthenticated") {
      dispatch(setAuthState(false));
      dispatch(setUser(null));
    }
  }, [session, status, dispatch]);

  return <>{children}</>;
};

interface SessionProviderProps {
  children: ReactNode;
}

// Enhanced session provider that integrates with Redux
export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  return (
    <NextAuthSessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes
      refetchOnWindowFocus={true}
      refetchWhenOffline={false}
    >
      <AuthSyncComponent>{children}</AuthSyncComponent>
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
