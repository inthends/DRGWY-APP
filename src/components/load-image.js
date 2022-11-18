import React, {Component} from 'react';
import { Image} from 'react-native';

export default class LoadImage extends Component {
    constructor(props) {
        super(props);
        this.state = this._handleImg(this.props);
    }

    _loadError = () => {
        this.setState({
            img: this.state.defaultImg,
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log('nextProps', nextProps);
        if (nextProps.img !== this.state.img) {
            const state = this._handleImg(nextProps);
            this.setState({...state});
        }
    }

    _handleImg = (props) => {
        let {img, defaultImg, style} = props; 

        if (img) {
            console.log('img', img);
            if (typeof (img) === 'string') {
                return {
                    img: {uri: img},
                    defaultImg,
                    style,
                };
            } else {
                return {
                    img, defaultImg, style,
                };
            }

        } else {
            let img = defaultImg ? defaultImg : require('../static/images/home/default.png');
            return {
                img,
                defaultImg,
                style,
            };
        }
    };

    render() {
        const {img, style} = this.state; 
        return (
            <Image style={style} source={img} onError={this._loadError}/>
        );
    }

}
