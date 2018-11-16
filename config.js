//  exports.FDFS_HOST = "127.0.0.1";
//  exports.FDFS_PORT = "9900";
// exports.IMG_HOST_DIR = "./images";
// exports.HOST_DIR = { "html": './files', "htmlimg": './htmlimgs' };
// exports.IMG_URL = 'http://' + this.IMG_HOST + ':' + this.IMG_HOST_PORT + '/';
// exports.IMG_HOST_FDFS = false;
exports.MEDIA_HOST = {
    ADDR: "127.0.0.1",
    PORT: "9900",
    URL: 'http://127.0.0.1:9900/',
    FDFS_ENABLED: false,
    FDFS: "127.0.0.1",
    FDFS_PORT: "9900",
    DIRS: {
        "image/jpg": {
            PATH: "images/jpg/",
            PREFIX: "a"
        },
        "image/png": {
            PATH: "images/png/",
            PREFIX: "b"
        },
        "image/jpeg": {
            PATH: "images/jpeg/",
            PREFIX: "c"
        },
        "image/gif": {
            PATH: "images/gif/",
            PREFIX: "d"
        },
        "image/svg": {
            PATH: "images/svg/",
            PREFIX: "e"
        },
        "text/html": {
            PATH: "text/html/",
            PREFIX: "f"
        },
        "html": {
            PATH: "text/html/",
            PREFIX: "f"
        },
        "share": {
            PATH: '',
            PREFIX: "g"
        }
    }
}
exports.ANONYMOUS_AVATAR = "data:image/svg+xml;utf8,<svg viewBox='-27 24 100 100' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'><g><g><defs><circle cx='23' cy='74' id='circle' r='50'/></defs><use fill='#F5EEE5' overflow='visible' xlink:href='#circle'/><clipPath id='circle_1_'><use overflow='visible' xlink:href='#circle'/></clipPath><g clip-path='url(#circle_1_)'><defs><path d='M36,95.9c0,4,4.7,5.2,7.1,5.8c7.6,2,22.8,5.9,22.8,5.9c3.2,1.1,5.7,3.5,7.1,6.6v9.8H-27v-9.8,c1.3-3.1,3.9-5.5,7.1-6.6c0,0,15.2-3.9,22.8-5.9c2.4-0.6,7.1-1.8,7.1-5.8c0-4,0-10.9,0-10.9h26C36,85,36,91.9,36,95.9z' id='shoulders'/></defs><use fill='#E6C19C' overflow='visible' xlink:href='#shoulders'/><clipPath id='shoulders_1_'><use overflow='visible' xlink:href='#shoulders'/></clipPath><path clip-path='url(#shoulders_1_)' d='M23.2,35c0.1,0,0.1,0,0.2,0c0,0,0,0,0,0      c3.3,0,8.2,0.2,11.4,2c3.3,1.9,7.3,5.6,8.5,12.1c2.4,13.7-2.1,35.4-6.3,42.4c-4,6.7-9.8,9.2-13.5,9.4c0,0-0.1,0-0.1,0,c-0.1,0-0.1,0-0.2,0c-0.1,0-0.1,0-0.2,0c0,0-0.1,0-0.1,0c-3.7-0.2-9.5-2.7-13.5-9.4c-4.2-7-8.7-28.7-6.3-42.4,c1.2-6.5,5.2-10.2,8.5-12.1c3.2-1.8,8.1-2,11.4-2c0,0,0,0,0,0C23.1,35,23.1,35,23.2,35L23.2,35z' fill='#D4B08C' id='head-shadow'/></g></g><path d='M22.6,40c19.1,0,20.7,13.8,20.8,15.1c1.1,11.9-3,28.1-6.8,33.7c-4,5.9-9.8,8.1-13.5,8.3,c-0.2,0-0.2,0-0.3,0c-0.1,0-0.1,0-0.2,0C18.8,96.8,13,94.6,9,88.7c-3.8-5.6-7.9-21.8-6.8-33.8C2.3,53.7,3.5,40,22.6,40z' fill='#F2CEA5' id='head'/></g></svg>";




exports.LOCAL_HOST = "192.168.1.214"; //"http://101.37.21.172:80";
exports.DATA_HOST = "127.0.0.1"; //"114.55.139.196";
exports.DBUSER = "root";
exports.DBPWD = "123$%^";
exports.ORDERDB1 = "orders";
exports.ORDERDB2 = "orders_";
exports.USERDB1 = "users";
exports.USERDB2 = "users_";
exports.PRODCUTDB1 = "product";
exports.PRODCUTDB2 = "product_";
exports.HOST = "localhost";
exports.PORT = 8999;

exports.GDB = "ws://localhost:8182/gremlin";

exports.DOMAIN = "http://localhost:8999/";

exports.APP_HOST = {
	ADDR: "127.0.0.1",
    PORT: "4200",
    URL: 'http://127.0.0.1:4200/',
};
exports.APP_DOMAIN = "http://localhost:4200/";

exports.ALIPAY = { host: "https://openapi.alipay.com/gateway.do", app_id: 2018090561306495, notify_url: "http://51tui.co/order/callback", pub_key: "-----BEGIN PUBLIC KEY-----\r\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvFKjd9uiKlWECHmwT78BnS9YleSCiU8CGDaSFisaKrd1zOHz7A2Bdj87Wnsd4Rv8fdiGHQtRu49jj+7GGRVjvmV/LHe9a2LgTm0OGoK/0cac9Ay1kp1VCN9ANXbauzQu/nxQ5UoJyvGNK8tIK8qKHkDJ2WMMxD9npPySEvCTAht8dkVY4KwMhysevQxSyIrfNnMSySFyJ5SkV2ZaNjmsisk/28uLDRh8u24M+xAC5e6rt9bu28fQvPhbwr86ImfK2esEBU4cMdBpfhNpWvfhG/u2bj0aH2IG/pRpxFVh+++PAbau+vjN3/yMbzVnWJRoelVOHTLmBCx+6v8j7E15mwIDAQAB-----END PUBLIC KEY-----\r\n", key: "-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpQIBAAKCAQEArJCaP3Jmh97FiZ4nDMTJHf7YUn4q4dS5z2Rk/07F9TCD4z9XwMzTEsmpq40h97zTCoXHMWQdO0/pcj83CG218UD7yRWdPEPrdKTPTjklnpCaxVcEcojf2U5M10OIyDpR3CZX/mEytxKDuWuaWH92fGef+Ww7Gc6OSuTnSnoOsezoEs29Zd04lYlDHZlSBx6H0yos/rrL/ckA7ixpdBB6OfYyInHB5MEgwr1ZZhcCKrVIicDhIMqXO4BCQfpJ8alyKZA6PiGEc7h3rWyLiy8OXObqqN3t9zZLTnA3DzWKagJm/fl3D3H8czLGp83wCii4RsViVw+KUNURyXNDGF+6VwIDAQABAoIBAQCWQ+TNUuUNc2M4DsuaRtGKmRvt2Yel1wNmINoBp6qhc3mlLMdRUAqM1aY1iFQH0hlDlHJ8A92ghFmX7owRftdsGVYnJ/cfP1WM4ObUCtdDWFAtfzSUN7QVGiW3XUuCb6ZQueLt093BpRGnKJficDvQ4LthCmn8cu1dMi5loBujumXX1QjYSJF2kUKGX94KKxsC5JHG1zBTBXoPa3iJG84SevIaqMwITRSterv69gu4Ujd73vBtICchHS/OEVyitljXEqig8a0QWnI73UEaRLkQ6IIo9xEi6CQ7zessYTdI+zEO9f/cdXeqzsa9LL8I+DR2Ncr8kVHyeJb6QAh+jLHhAoGBANTeE0yiA+t5woFGsMXa3nsZ0ABvunJuiZu9hrYWSfHiCyVjkjhAZp+LGZIAWCOywtU5uXpUFu2oAR8UNxiMS28qgtX5UCFYRlWD9NEI3eSrlne4u6FWgK8eZ4QRnJsqzsM4+4slIrhJ4kJ4unqnuxtYSNLUEAfaTbK770d/4c1lAoGBAM+H7/aCkGOPSNMjf5ywj3r1wIC79qVqL6wCT22wZ2HBMCphjc+Us6lhoVT//y84vcmA/GIGvxdd5eC4J87Zku3aPAc3MD7Vk3X70ltbVecmmpiBTzPWxHiftGe5qVq39+WKbbJpytMdtkjz3WA4rVLwjtJbzt8Wm//1GVB09VsLAoGBAJNWi2E1myT4CEtW1LB+SBRIz5Idw53FKPZlfsK2NsR3w2NDwkexO9cefrpyBo/fAcB4zgr//UbOTMhoQ6J4KRZvBFR61p3d7gDu7xto2b2XjvSbJzQLHdMYZmohjpZQUQELhgDP2XJZoYSE7/5J7taEixNyuQ3WaoVWU87Xk0GJAoGAItbVR/LfPnd9aESbVbimPaQn7vSfEWHkIuI4Z1en41dFOLgr0F9MUfEb3mMjec/yvHM061fqmIeg4brIpAcOjXOHhEaViNbd7H6b785De4yVg2ih3Tf+v6k/5fHbJmmf6h71D3CHJi3kvhaCYXbiUfwkXdgfwH/RLIT+/OzFi8UCgYEArDUhqwO+jamijRlQvsMvI9rumFkPQFd+jOnLSbEY+3jIlCoXBnRPgenNqVXWKkaNl/VyhVXUDtCUUBcbStShrzQnyPY2IjROxDRp5YIweFxWQuym4WRuKGvfOAuekNOJb9tLMwkCuQ7CgMlptUmDn8RkvQi4PA0f1U8C41nPgig=\r\n-----END RSA PRIVATE KEY-----" };