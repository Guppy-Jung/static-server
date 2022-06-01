var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) { queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)


    response.statusCode = 200
    
    const filePath = path === '/'? '/index.html':path  //三元运算符： a===b?yes:no。也是实现“默认首页”功能的代码。filePath是不包含端口号的，即从url的端口号往后的部分
    const index = filePath.lastIndexOf('.')//判断filePath中的.的索引值
    // suffix是后缀
    const suffix = filePath.substring(index)//从.的索引开始获取其子字符串(即从.以后的字符，包含.)
    const fileTypes = {//这个数组表示：如果suffix是.html，那么fileTypes的值就是text/html,然后用${}将其使用到response.setHeader里面动态获取
        '.html':'text/html',
        '.css':'text/css',
        '.js':'text/javascript',
        '.json':'text/json',
        '.png':'image/png',
        '.jpg':'image/jpeg'
    }
    response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)
    console.log(suffix)
    let content 
    try{//使用try{}catch(error){}可以做到判断try中的句子是否有误，如果有误，就catch这个error
        content = fs.readFileSync(`./public${filePath}`)
    }catch(error){
        content = '文件不存在'
        response.statusCode = 404
    }
    response.write(content)
    response.end()


    /******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)