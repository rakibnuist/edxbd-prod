'use client';

// import { usePathname } from 'next/navigation';

interface ConditionalMainProps {
  children: React.ReactNode;
}

const ConditionalMain = ({ children }: ConditionalMainProps) => {
  // const pathname = usePathname();

  // Don't add padding for admin and dashboard routes
  // The variable `shouldAddPadding` was removed as it was unused.

  return (
    <main>
      {children}
    </main>
  );
};

export default ConditionalMain;
