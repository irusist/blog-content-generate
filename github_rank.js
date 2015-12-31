var https = require("https");
var fs = require("fs");
var moment = require("moment");

var file = "2100-01-01-Github语言排行.md";

fs.writeFileSync(file, hexoHeader(), "utf8");
fs.appendFileSync(file, description(), "utf8");

fs.appendFileSync(file, "<!-- more -->\n");

function rank(language) {
    var options = {
        host: "api.github.com",
        path: "/search/repositories?q=language:" + language + "&sort=stars&order=desc",
        method: "GET",
        headers: {"User-Agent": "irusist/blog-content-generate"}
    };


    var repos = [];
    var body = "";
    var req = https.request(options, function(response) {
        response.on('data', function(d) {
            body += d.toString('utf8');
        });
        response.on('end', function() {
            var contents = JSON.parse(body);
            contents.items.forEach(
                function(content) {
                    repos.push({
                        name:  content.name,
                        url:   content.html_url,
                        stars: content.stargazers_count,
                        description: content.description,
                    });
                }
            );

            var data = "## " + language + "语言排行\n\n";

            repos.forEach(function(repo){
                data +=  "   * " + repo.name + ": " + "[" + repo.description + "](" + repo.url + "), stars: " + repo.stars + "\n";
            });

            data += "\n";

            fs.appendFileSync(file, data, "utf8");
        });
    });
    req.end();

    req.on('error', function(e) {
        console.error(e);
    });
}


/**
 * 生成hexo博客的头部
 * 日期设定为将来, 以用来置顶显示
 * @returns {string}
 */
function hexoHeader() {
    var result = "---\n";
    result += "title: Github语言排行[人工置顶]\n";
    result += "date: 2100-01-01 00:00:01\n";
    result += "tags: [github, 语言]\n";
    result += "categories: github\n";
    result += "description: Github语言排行\n";
    result += "---\n\n";

    return result;
}

/**
 * 增加博客描述
 * @returns {string}
 */
function description() {
    var time = moment(new Date()).format('YYYY年MM月DD日HH时mm分ss秒');
    return "以下内容是通过github api动态生成的, 生成时间: " + time + "\n\n";
}

// java
rank("Java");
// Scala
rank("Scala");
// Go
rank("Go");
// G
rank("C");




