import React from "react";
import { GlobalInitialState, GlobalReducer } from "../models/global";

function App(): React.ReactElement {
    const [globalState, globalDispatch] = React.useReducer(GlobalReducer, GlobalInitialState);
    
    return (
        <div>
        </div>
    );
}

export default App;
