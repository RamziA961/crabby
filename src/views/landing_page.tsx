import React from "react";

import { TGlobalAction, TGlobalState } from "models/global";

export type LandingPageProps = {
    globalState: TGlobalState,
    globalDispatch: React.Dispatch<TGlobalAction>,
};


export function LandingPage(): React.ReactElement {
  return (
    <div>
      <h1>Landing Page</h1>
    </div>
  );
}
