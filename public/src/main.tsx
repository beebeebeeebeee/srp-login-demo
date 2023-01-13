import React from 'react'
import ReactDOM from 'react-dom/client'
import {Layout} from "./pages";

import {Buffer} from "buffer";
import {SnackbarProvider} from "notistack";
import {SnackbarUtilProvider} from "./providers";

window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <SnackbarProvider>
        <SnackbarUtilProvider/>
        <Layout/>
    </SnackbarProvider>
)
