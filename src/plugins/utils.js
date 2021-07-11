/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/6
 *
 */
// eslint-disable-next-line no-extend-native
String.prototype.gblen = function () {
    let len = 0
    for (let i = 0; i < this.length; i += 1) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) === 94) {
            len += 2
        } else {
            len += 1
        }
    }
    return len
}

// eslint-disable-next-line no-extend-native
String.prototype.gbSubstr = function (start, gblen) {
    let len = 0
    let i
    for (i = start; ; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) === 94) {
            len += 2
        } else {
            len += 1
        }

        if (len === gblen) {
            return (this.substring(start, start + i + 1))
        }
        if (len > gblen) {
            return this.substring(start, start + i)
        }
    }
}

// eslint-disable-next-line no-extend-native
String.prototype.resizeTo = function (len, endStr) {
    let end
    if (typeof endStr !== 'string') {
        end = ''
    } else {
        end = endStr
    }
    if (typeof len !== 'number') {
        return this
    }
    if (len <= end.length || len <= 0) {
        return ''
    }
    return this.gblen() > len ? this.gbSubstr(0, len - end.length) + end : this
}

export default {}
