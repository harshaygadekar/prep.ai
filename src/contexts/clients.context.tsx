"use client";

import React, { useState, useContext, ReactNode, useEffect } from "react";
import { User } from "@/types/user";
import { useClerk, useOrganization } from "@clerk/nextjs";

interface ClientContextProps {
  client?: User;
}

export const ClientContext = React.createContext<ClientContextProps>({
  client: undefined,
});

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const [client, setClient] = useState<User>();
  const { user } = useClerk();
  const { organization } = useOrganization();

  const [clientLoading, setClientLoading] = useState(true);

  const fetchClient = async () => {
    try {
      setClientLoading(true);
      // Mock client data based on Clerk user
      const mockClient: User = {
        id: user?.id || '',
        email: user?.emailAddresses[0]?.emailAddress || '',
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        organization_id: organization?.id || '',
        plan: 'free',
        created_at: new Date().toISOString()
      };
      setClient(mockClient);
    } catch (error) {
      console.error(error);
    }
    setClientLoading(false);
  };

  const fetchOrganization = async () => {
    try {
      setClientLoading(true);
      // Mock organization fetch - no action needed for demo
      console.log('Mock: Organization fetched', organization?.id);
    } catch (error) {
      console.error(error);
    }
    setClientLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    if (organization?.id) {
      fetchOrganization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization?.id]);

  return (
    <ClientContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export const useClient = () => {
  const value = useContext(ClientContext);

  return value;
};
