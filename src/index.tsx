import ReactDOM from 'react-dom';

import './index.scss';

import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';
import { compose, combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

import ErrorProvider from './context/errorContext/errorProvider';

import appReducer from './store/reducers/app';
import userReducer from './store/reducers/user';
import boardReducer from './store/reducers/board';
import invitationReducer from './store/reducers/invitation';
import columnReducer from './store/reducers/column';
import taskReducer from './store/reducers/task';
import commentReducer from './store/reducers/comment';

const rootRecuder = combineReducers({
    app: appReducer,
    user: userReducer,
    board: boardReducer,
    invitation: invitationReducer,
    column: columnReducer,
    task: taskReducer,
    comment: commentReducer
});

const store = createStore(rootRecuder, compose(applyMiddleware(thunk)))

/*ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);*/

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#376fd0"
        }
    },
    overrides: {
        MuiCard: {
            root: {
                borderRadius: 7,
                boxShadow: "rgba(50, 50, 93, 0.025) 0px 2px 5px -1px, rgba(0, 0, 0, 0.05) 0px 1px 3px -1px"
            }
        },
        MuiListItemIcon: {
            root: {
                minWidth: 45,
                width: 45
            }
        },
        MuiListItemText: {
            primary: {
                fontSize: 13
            }
        },
        MuiButton: {
            root: {
                textTransform: 'none'
            },
            label: {
                fontSize: 13
            }
        },
        MuiFormLabel: {
            root: {
                fontSize: 13
            }
        },
        MuiInputBase: {
            root: {
                fontSize: 13
            }
        }
    }
});

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <ErrorProvider>
                    <App />
                </ErrorProvider>
            </ThemeProvider>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
