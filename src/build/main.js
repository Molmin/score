const fs=require('fs');
const path=require('path');
const ejs=require('ejs');
const Template=require('./template.js');
const MarkdownIt=require('markdown-it')({
    html: true,
    linkify: true
});

const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
Config.student=YAML.load(`./data/${Config.configure.students}`).student;
const getStudentData=require('./student.js').getStudentData;

var deleteDir=(url)=>{
    if(fs.existsSync(url)){
        var files=[];
        files=fs.readdirSync(url);
        files.forEach((file,index)=>{
            var curPath=path.join(url,file);
            if(fs.statSync(curPath).isDirectory())
                deleteDir(curPath);
            else fs.unlinkSync(curPath);
        });
        fs.rmdirSync(url);
    }
}

deleteDir("dist");
fs.mkdirSync("dist");
fs.mkdirSync("dist/student");
fs.mkdirSync("dist/test");

ejs.renderFile("./src/templates/home.html",{
    README: MarkdownIt.render(fs.readFileSync(`./data/${Config.readme}`,{encoding:'utf8',flag:'r'}))
},(err,HTML)=>{
    fs.writeFileSync("./dist/index.html",
        Template({title: `Home`,
                  header: ``
                 },HTML));
});

Config.student.forEach(student=>{
    student.count=0;
});

Config.configure.tests.forEach(test=>{
    test.detail=YAML.load(`./data/${test.file}`);
    console.log(`#${test.id}. ${test.detail.title}`);
    test.detail.date.start=require('dayjs')(test.detail.date.start).format("M / D / YYYY");
    test.detail.date.end=require('dayjs')(test.detail.date.end).format("M / D / YYYY");
    test.description=MarkdownIt.render(test.detail.description);
    test.fullscore=test.Sumscore=0;
    test.detail.subject.forEach(subject=>{
        subject.sum=subject.maxscore=subject.jointotal=0;
        test.fullscore+=subject.fullscore;
    });
    test.detail.message.forEach(message=>{
        message.stu=getStudentData(message.name);
        Config.student[message.stu.i].count++;
        message.sum=0, message.addclass=new Array();
        message.score.forEach((score,scoreIndex)=>{
            message.sum+=score;
            test.detail.subject[scoreIndex].sum+=score;
            test.detail.subject[scoreIndex].maxscore
                =Math.max(test.detail.subject[scoreIndex].maxscore,score);
            if(score!=null)test.detail.subject[scoreIndex].jointotal++;
        });
        test.Sumscore+=message.sum;
    });
    test.detail.subject.forEach(subject=>{
        subject.sum/=subject.jointotal;
        console.log(subject.name,subject.sum,subject.maxscore);
    });
    test.Sumscore/=test.detail.message.length;
    test.detail.message.forEach(message=>{
        message.score.forEach((score,scoreIndex)=>{
            message.addclass.push(
                score==test.detail.subject[scoreIndex].maxscore?
                ` class="score-best"`:``
            );
        });
    });
    ejs.renderFile("./src/templates/test_detail.html",{
        data: Config,
        test
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/test/${test.id}.html`,
            Template({title: test.detail.title,
                      header: ``,
                      ontest: true
                     },HTML));
    });
});

ejs.renderFile("./src/templates/test_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/test/index.html",
        Template({title: `Tests List`,
                  header: ``,
                  ontest: true
                 },HTML));
});

Config.student.forEach(student=>{
    ejs.renderFile("./src/templates/student_detail.html",{
        data: Config,
        student
    },(err,HTML)=>{
        fs.writeFileSync(`./dist/student/${student.id}.html`,
            Template({title: `${student.name}`,
                      header: ``,
                      onstudent: true
                     },HTML));
    });
});

ejs.renderFile("./src/templates/student_list.html",{
    data: Config
},(err,HTML)=>{
    fs.writeFileSync("./dist/student/index.html",
        Template({title: `Students List`,
                  header: ``,
                  onstudent: true
                 },HTML));
});

// console.log(JSON.stringify(Config,null,"  "));

if(process.argv.slice(2).includes("-github")){
    const ghpages=require('gh-pages');
    ghpages.publish('dist',function(err){});
}