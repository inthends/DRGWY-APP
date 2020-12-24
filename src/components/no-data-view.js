import React, {Component} from 'react';
import {  Text} from 'react-native';
import {Flex} from '@ant-design/react-native';
import LoadImage from './load-image';

export default class NoDataView extends Component {


    render() {

        return (
            <Flex direction={'column'} justify={'center'} style={{marginTop:'50%'}}>
                <LoadImage style={{width:160,height:92}} img={require('../static/images/img-kong.png')}/>
                <Text style={{fontSize:16,color:'#666',paddingTop:24,paddingBottom:15}}>暂无数据</Text>
            </Flex>
        );
    }

}
