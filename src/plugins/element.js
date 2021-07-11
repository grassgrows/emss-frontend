/**
 *
 * @author ：WarmthDawn
 * @date ：2021/7/5
 *
 */
import ElementPlus from 'element-plus'
import '../element-variables.scss'
import locale from 'element-plus/lib/locale/lang/zh-cn'

export default (app) => {
    app.use(ElementPlus, { locale })
}
