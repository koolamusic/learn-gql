import React, { Fragment } from 'react';
import { RouteComponentProps } from '@reach/router';

interface LaunchesProps extends RouteComponentProps { }

const Launches: React.FC<LaunchesProps> = () => {
  return <div />;
}

export const LAUNCH_TILE_DATA = 'data'
export default Launches;

