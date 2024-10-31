import Add from '@renderer/icons/Add';
import Home from '@renderer/icons/Home';
import cn from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { Route } from '.';
import styles from './Tabs.module.scss';

const routes: Route[] = [
  {
    icon: <Home />,
    href: '/',
  },
  {
    icon: <Add />,
    href: '/add',
  },
];

const Tabs = () => {
  const location = useLocation();

  return (
    <nav className={styles.container}>
      <ul className={styles.tabs}>
        {routes.map((i) => (
          <li key={i.href}>
            <Link className={cn(styles.tab, i.href === location.pathname && styles.active)} to={i.href}>
              {i.icon}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Tabs;
