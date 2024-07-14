import { HTMLProps, ReactElement, ReactNode } from 'react';

export { default } from './Menu';

export interface MenuItem {
  icon?: ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
}

export type Menu = MenuItem[]

export interface MenuProps {
  children: ReactElement<HTMLProps<HTMLElement>>;
  menu: Menu;
}