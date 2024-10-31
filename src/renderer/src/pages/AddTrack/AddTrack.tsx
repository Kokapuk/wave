import Button from '@renderer/components/Button';
import { useState } from 'react';

const AddTrack = () => {
  const [isLoading, setLoading] = useState(false);

  return (
    <>
      <h1>Coming soon...</h1>
      <Button loading={isLoading} onClick={() => setLoading((prev) => !prev)}>
        Load
      </Button>
    </>
  );
};

export default AddTrack;
