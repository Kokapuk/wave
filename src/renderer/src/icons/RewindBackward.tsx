import { SVGAttributes } from 'react';
import RewindForward from './RewindForward';

const RewindBackward = (props: SVGAttributes<SVGElement>) => {
  return <RewindForward {...props} style={{ ...props.style, transform: 'scaleX(-1)' }} />;
};

export default RewindBackward;
