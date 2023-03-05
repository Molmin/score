const YAML=require('yamljs');
var testdata=YAML.load('./data/tests/2.yaml').message;
var a1=0,a2=0,a3=0,a4=0;
testdata.forEach(data=>{
    console.log(data.score[0]+data.score[1]+data.score[2]+data.score[3]);
    a1+=data.score[0]
    a2+=data.score[1]
    a3+=data.score[2]
    a4+=data.score[3]
});
console.log(a1,a2,a3,a4,testdata.length);
console.log(a1/testdata.length,a2/testdata.length,a3/testdata.length,a4/testdata.length)