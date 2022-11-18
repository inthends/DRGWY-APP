export default class UDTool {
    static log(object) {
        let str = this.convertObjToStr(object);
        alert(str);
    }

    static convertObjToStr(object) {
        let str = object;
        if (object === '') {
            alert('空字符串');
            return;
        }
        if (object === null) {
            alert('null');
        }
        if (object === undefined) {
            alert('undefined');
        }

        if (Object.prototype.toString.call(object) === '[object Object]') {
            str = JSON.stringify(object);
        }
        console.log(object);
        return object;
    }
}
