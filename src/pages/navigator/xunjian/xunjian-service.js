import api from '../../../utils/api';

export default {
    persons() {
        return api.getData('/api/MobileMethod/MGetPollingUserList');
    }
}
