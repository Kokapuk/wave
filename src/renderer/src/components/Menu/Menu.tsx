import cn from 'classnames';
import { cloneElement, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MenuItem, MenuProps } from '.';
import Transition from '../Transition';
import styles from './Menu.module.scss';

const Menu = ({ children: trigger, menu }: MenuProps) => {
  const [isOpen, setOpen] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [horizontalPlacement, setHorizontalPlacement] = useState<'left' | 'right'>('left');
  const [verticalPlacement, setVerticalPlacement] = useState<'top' | 'bottom'>('top');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) {
      return;
    }

    const menuRect = menuRef.current.getBoundingClientRect();

    const xOffset = horizontalPlacement === 'right' ? -menuRect.width : 0;
    setHorizontalPlacement(menuRect.left + menuRect.width - xOffset > window.innerWidth ? 'right' : 'left');

    const yOffset = verticalPlacement === 'bottom' ? -menuRect.height : 0;
    setVerticalPlacement(menuRect.top + menuRect.height - yOffset > window.innerHeight ? 'bottom' : 'top');
  }, [isOpen, position]);

  useEffect(() => {
    const closeMenu = () => setOpen(false);

    const handleMouseDown = (event: MouseEvent) => {
      if (!event.target || !menuRef.current || !isOpen) {
        return;
      }

      if (event.target === menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }

      closeMenu();
    };

    window.addEventListener('wheel', closeMenu);
    window.addEventListener('resize', closeMenu);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('wheel', closeMenu);
      window.removeEventListener('resize', closeMenu);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen]);

  const handleMenuItemClick = (onClick: MenuItem['onClick']) => {
    onClick();
    setOpen(false);
  };

  return (
    <>
      {createPortal(
        <Transition display={isOpen} classes={{ enter: styles.enter, exit: styles.exit }}>
          <div
            ref={menuRef}
            style={{ top: position.y, left: position.x }}
            className={cn(styles.menu, styles[horizontalPlacement], styles[verticalPlacement])}
          >
            <ul className={styles.items}>
              {menu.map((i) => (
                <li key={i.label}>
                  <button onClick={() => handleMenuItemClick(i.onClick)} disabled={i.disabled} className={styles.item}>
                    <div className={styles.iconContainer}>{i.icon}</div>
                    {i.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Transition>,
        document.getElementById('menuRoot') as Element
      )}
      {cloneElement(trigger, {
        onClick: (e) => {
          trigger.props.onClick?.(e);
          setPosition({ x: e.clientX, y: e.clientY });
          setOpen(true);
        },
      })}
    </>
  );
};

export default Menu;
