import React from "react";
import { GlobalInitialState, GlobalReducer } from "@models/global";
import { LandingPage } from "./landing_page/landing_page";

function App(): React.ReactElement {
    const [globalState, globalDispatch] = React.useReducer(GlobalReducer, GlobalInitialState);

    return (
         <LandingPage
             globalState={globalState}
             globalDispatch={globalDispatch}
         />
    );
}

export default App;
