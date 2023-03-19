const YAML=require('yamljs');
var Config=YAML.load('./data/config.yaml');
Config.student=YAML.load(`./data/${Config.configure.students}`).student;

var getStudentData=str=>{
    var id=0;
    if(str.substr(0,1)=="="){
        var correctId=str.substr(1);
        while(id<Config.student.length&&Config.student[id].id!=correctId)id++;
        if(id==Config.student.length)return {id: correctId, name: String(undefined)};
    }
    else{
        while(id<Config.student.length&&Config.student[id].name!=str)id++;
        if(id==Config.student.length)return {id: -1, name: str};
    }
    var res=Config.student[id];
    res.i=id;
    return res;
}

module.exports={getStudentData};