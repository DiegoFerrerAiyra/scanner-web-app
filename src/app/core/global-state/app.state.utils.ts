import { GlobalState } from "src/app/core/global-state/app.state";


export async function globalStateDefault() {
    const defaultState: GlobalState = {
        responsive: {
            sizeDevice: null,
        },
        loader: {
            isLoading: false,
        },
        authentication: {
            user:{
                name:'',
                lastName: '',
                email:'',
                accessToken:'',
                refreshToken:''
            },
        }
    };
    return defaultState;
  }