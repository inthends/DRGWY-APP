import React  from 'react';
import BasePage from '../../base/base';
import { Flex , Icon } from '@ant-design/react-native';
//import Macro from '../../../utils/macro';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
// import ScreenUtil from '../../../utils/screen-util';
// import LoadImage from '../../../components/load-image';
import CommonView from '../../../components/CommonView';
// import ScrollTitle from '../../../components/scroll-title'; 
import XunJianViewComponent from './xunjian-componentview';
import ListImages from '../../../components/list-images';
import common from '../../../utils/common';
import XunJianService from './xunjian-service';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class XunJianDetailPage extends BasePage {
    static navigationOptions = ({ navigation }) => {

        return {
            tabBarVisible: false,
            title: '任务单详情',
            headerLeft: (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='left' style={{ width: 30, marginLeft: 15 }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {},
            images: [],
            visible: false,
        };
    }

    componentDidMount() {
        let id = common.getValueFromProps(this.props).id;
        XunJianService.xunjianDetail(id).then(data => {
            XunJianService.xunjianDetailExtraData(id).then(images => {
                this.setState({ images, data });
            });
        });
    }

    lookImage = (lookImageIndex) => {
        this.setState({
            lookImageIndex,
            visible: true,
        });
    };
    cancel = () => {
        this.setState({
            visible: false,
        });
    };


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        const { data, images } = this.state;
        return (
            <CommonView>
                <ScrollView>
                    <Flex direction={'column'} align={'start'} style={styles.content}>
                        <Text style={styles.title}>{data.pointName}</Text>
                        <XunJianViewComponent data={data} />
                    </Flex>
                    <ListImages images={images} lookImage={this.lookImage} />
                    <Modal visible={this.state.visible} onRequestClose={this.cancel} transparent={true}>
                        <ImageViewer index={this.state.lookImageIndex} onCancel={this.cancel} onClick={this.cancel}
                            imageUrls={this.state.images} />
                    </Modal>
                </ScrollView>
            </CommonView>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    title: {
        color: '#333',
        fontSize: 18,
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 10,

    }
});
