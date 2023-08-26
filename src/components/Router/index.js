import React, { Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { STORE_KEYS } from '../../stores';

const { ROUTER } = STORE_KEYS;

export const Link = inject(ROUTER)(({ [ROUTER]: router, children, to, className }) => {
  return (
    <span onClick={() => router.push(to)} className={className} role="button" tabIndex={0}>
      {children}
    </span>
  );
});

export const Route = ({ path, component }) => {
  return <Fragment path={path} component={component} />;
};

export const Router = inject(ROUTER)(
  observer(({ [ROUTER]: router, children, defaultComponent }) => {
    const Component = children.reduce((accum, child) => {
      const { props } = child;

      return props.path === router.path ? props.component : accum;
    }, defaultComponent);

    return (
      <div>
        <Component />
      </div>
    );
  })
);
