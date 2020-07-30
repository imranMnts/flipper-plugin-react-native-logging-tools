import React, { memo } from 'react';
import { Text, Panel, DataDescription, ManagedDataInspector } from 'flipper';

export default memo((props: any) => {
  const { service } = props;

  return (
    <>
      <Text style={{ fontSize: 20, padding: 10, fontWeight: 'bold' }}>{`${service}`.toUpperCase()}</Text>
      <Panel floating={false} heading="Event">
        {typeof props !== 'object' ? (
          <DataDescription type={typeof props} value={props} setValue={() => null} />
        ) : (
          <ManagedDataInspector data={props} expandRoot />
        )}
      </Panel>
    </>
  );
});
