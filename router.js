import React, {Component, Fragment} from 'react';
import AppContainer from './src/pages/tabbar/tabbar';
import {connect} from 'react-redux';
import LoginPage from './src/pages/login/login';
import {saveSelectBuilding, saveToken} from './src/utils/store/actions/actions';


type Props = {};

class AppRouter extends Component<Props> {

    constructor(props) {
        super(props);
        // this.props.saveToken(null);
        this.props.saveBuilding(null);
    }

    render() {
        const {token} = this.props;
        let component;
        if (!token) {
            component = <LoginPage/>;
        } else {
            component = <AppContainer/>;
        }
        return (
            <Fragment>
                {component}
            </Fragment>
        );
    }
}

const mapStateToProps = ({memberReducer}) => {
    return {
        token: memberReducer.token,
    };

};
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveToken: (token) => {
            dispatch(saveToken(token));
        },
        saveBuilding: (item) => {
            dispatch(saveSelectBuilding(item));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);


// polyfillGlobal('XMLHttpRequest', () => require('../Network/XMLHttpRequest'));
