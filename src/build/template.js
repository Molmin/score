const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
Config.student=YAML.load(`./data/${Config.configure.students}`).student;

module.exports=(config,HTML)=>{
    var _=config._;
    return`
<!DOCTYPE html>
<html lang="zh-CN">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title id="title">${config.title} - ${Config.title}</title>
        <link rel="shortcut icon" type="image/x-icon" href="https://topan-dev.github.io/TopanUI/favicon.ico">
        <script src="https://topan-dev.github.io/TopanUI/src/jquery.js"></script>
        <link rel="stylesheet" href="https://topan-dev.github.io/TopanUI/topan.css">
        <script src="https://topan-dev.github.io/TopanUI/topan.js"></script>
        ${config.header}
    </head>
    <body>
        <div class="topan-header">
            <div class="topan-header-home">
                <a href="/${Config.on}">
                    <button class="topan-button-ordinary topan-button-commonly topan-button-header-round-left">
                        <i class="fa fa-home"></i>
                    </button>
                </a>
            </div>
            <div class="topan-header-left">
                <span class="topan-header-text">${Config.title}&nbsp;</span>
                <a href="/${Config.on}/test">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.ontest?"-showed":""}">
                        <i class="fa fa-solid fa-fire"></i>
                        <span>&nbsp;Tests</span>
                    </span>
                </a>
                <a href="/${Config.on}/student">
                    <span class="topan-button-ordinary topan-button-commonly topan-button-header-block${config.onstudent?"-showed":""}">
                        <i class="fa fa-solid fa-user"></i>
                        <span>&nbsp;Students</span>
                    </span>
                </a>
            </div>
            <div class="topan-header-right">
            </div>
        </div>
        <div class="topan-outer">
            <div class="topan-page">
                <div class="topan-mainpage-auto">
                    <br>
                    ${HTML}
                    <br>
                </div>
                <footer class="topan-footer">
                    <p></p>
                    <p style="text-align: center; color: #555; font-size: 12px;">
                        Powered by <a href="https://github.com/Molmin/score.git">Molmin/score</a>&nbsp;&nbsp;&nbsp;
                        © 2023 <a href="https://github.com/Molmin/">Milmon</a>
                    </p>
                </footer>
            </div>
        </div>
    </body>
</html>
    `;
};