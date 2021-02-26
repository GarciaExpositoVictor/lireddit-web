import React from 'react';
import { Navbar } from './navbar';
import { Wrapper } from './wrapper';

interface LayoutProps {
  variant?: 'small' | 'regular';
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <Navbar></Navbar>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
