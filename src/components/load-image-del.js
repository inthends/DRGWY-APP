import React, { Component } from 'react';
import { Image } from 'react-native';
import { Icon } from '@ant-design/react-native';
import Macro from '../utils/macro';

//可删除图片
export default class LoadImageDelete extends Component {
    constructor(props) {
        super(props);
        this.state = this._handleImg(this.props);
    }

    _loadError = () => {
        this.setState({
            img: this.state.defaultImg
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.img !== this.state.img) {
            const state = this._handleImg(nextProps);
            this.setState({ ...state });
        }
    }

    _handleImg = (props) => {
        let { img, defaultImg, style } = props;

        if (img) {
            if (typeof (img) === 'string') {
                return {
                    img: { uri: img },
                    defaultImg,
                    style
                };
            } else {
                return {
                    img, defaultImg, style
                };
            }

        } else {
            let img = defaultImg ? defaultImg : require('../static/images/home/default.png');
            return {
                img,
                defaultImg,
                style
            };
        }
    };

    render() {
        const { img, defaultImg, style } = this.state;
        return (
            <>
                {img == defaultImg ?
                    <Image
                        style={style}
                        source={img}
                        onError={this._loadError} />
                    :
                    <>
                        <Image
                            style={{ height: style.height, width: style.width }}
                            source={img}
                            onError={this._loadError} />
                        <Icon name='delete'
                            color={Macro.work_blue}
                            onPress={this.props.delete}
                            style={{ width: 20, height: 20, marginLeft: style.width / 2 - 10, marginTop: 19 - style.height / 2 }} />
                    </>
                }
            </>
        );
    }
}
