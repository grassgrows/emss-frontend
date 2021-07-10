import server from '@/api/server'

// eslint-disable-next-line no-undef
const production = process.env.NODE_ENV === 'production';


export default {
    server, production
}
