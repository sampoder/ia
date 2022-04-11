import React, { ReactChildren, ReactChild } from 'react';

export default function AdminWrapper(props: {children: ReactChild | ReactChildren}){
  return(
    <div>
      {props.children}
    </div>
  )
}